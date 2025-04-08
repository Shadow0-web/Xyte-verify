import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_PATH, 'verifiedUsers.json');
if (!fs.existsSync(DATA_PATH)) fs.mkdirSync(DATA_PATH);
if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, '[]');

const getUsers = () => JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
const saveUsers = (data) => fs.writeFileSync(USERS_FILE, JSON.stringify(data, null, 2));

export default async function handler(req, res) {
  const code = req.query.code;
  if (!code) return res.status(400).send('No code provided');

  try {
    const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        grant_type: 'authorization_code',
        code,
        redirect_uri: `${process.env.BASE_URL}/api/auth/discord/callback`,
      })
    });

    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) throw new Error('Token inválido');

    const userRes = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` }
    });
    const user = await userRes.json();

    const users = getUsers();
    const exists = users.find(u => u.discordId === user.id);
    const guilds = exists ? [...new Set([...exists.guilds, process.env.MAIN_GUILD_ID])] : [process.env.MAIN_GUILD_ID];

    const newUser = {
      discordId: user.id,
      username: user.username,
      accessToken: tokenData.access_token,
      verifiedAt: new Date().toISOString(),
      guilds
    };

    const updatedUsers = exists
      ? users.map(u => u.discordId === user.id ? newUser : u)
      : [...users, newUser];

    saveUsers(updatedUsers);

    return res.redirect(`${process.env.BASE_URL}/verificado.html`);
  } catch (err) {
    console.error('Error en callback:', err);
    return res.redirect(`${process.env.BASE_URL}/noverificado.html?error=${encodeURIComponent(err.message)}`);
  }
}
