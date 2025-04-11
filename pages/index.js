export default function Home() {
    return (
      <div className="bg-discord-dark min-h-screen flex items-center justify-center text-white">
        <Head>
          <title>Sistema de Verificación</title>
          <meta name="description" content="Sistema de verificación para Discord" />
          <link rel="icon" href="/favicon.ico" />
          <style jsx global>{`
            :root {
              --discord-dark: #36393f;
              --discord-darker: #2f3136;
              --discord-primary: #7289da;
            }
            body {
              margin: 0;
              padding: 0;
              font-family: Arial, sans-serif;
              background-color: var(--discord-dark);
              color: white;
            }
            .bg-discord-darker {
              background-color: var(--discord-darker);
            }
            .text-discord-primary {
              color: var(--discord-primary);
            }
          `}</style>
        </Head>
  
        <div className="bg-discord-darker p-8 rounded-lg shadow-xl max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-discord-primary mb-4">Sistema de Verificación</h1>
          <p>
            Bienvenido al sistema de verificación de usuarios. Para verificarte, usa el comando
            <code className="bg-gray-800 px-2 py-1 rounded mx-1">/verificar</code>
            en nuestro servidor de Discord.
          </p>
        </div>
      </div>
    );
  }