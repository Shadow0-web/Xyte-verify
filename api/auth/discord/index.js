export default async function handler(req, res) {
  const redirect_uri = encodeURIComponent(`${process.env.BASE_URL}/api/auth/discord/callback`);
  const client_id = process.env.CLIENT_ID;
  const scope = 'identify%20guilds.join';
  
  res.redirect(`https://discord.com/oauth2/authorize?client_id=${client_id}&response_type=code&redirect_uri=${redirect_uri}&scope=${scope}`);
}
