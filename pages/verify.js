import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Verify() {
  const router = useRouter();
  const { token } = router.query;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [multiServerConsent, setMultiServerConsent] = useState(false);

  // Verificar que el token sea válido
  useEffect(() => {
    if (token) {
      // Verificar el token en el backend
      fetch(`${process.env.NEXT_PUBLIC_BOT_API_URL}/check-token?token=${token}`)
        .then(res => res.json())
        .then(data => {
          if (!data.valid) {
            setError('Token de verificación inválido o expirado.');
          }
        })
        .catch(() => {
          setError('Error al verificar el token.');
        });
    }
  }, [token]);

  const handleVerify = async () => {
    if (!token) {
      setError('No se encontró token de verificación.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BOT_API_URL}/complete-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          multiServerConsent,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          window.close();
        }, 3000);
      } else {
        setError(data.message || 'Error en la verificación');
      }
    } catch (err) {
      setError('Error al conectar con el servidor de verificación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-discord-dark min-h-screen flex items-center justify-center text-white">
      <Head>
        <title>Verificación de Discord</title>
        <meta name="description" content="Página de verificación para el bot de Discord" />
        <link rel="icon" href="/favicon.ico" />
        <style jsx global>{`
          :root {
            --discord-dark: #36393f;
            --discord-darker: #2f3136;
            --discord-primary: #7289da;
            --discord-primary-hover: #5b6eae;
          }
          body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            background-color: var(--discord-dark);
            color: white;
          }
          .bg-discord-dark {
            background-color: var(--discord-dark);
          }
          .bg-discord-darker {
            background-color: var(--discord-darker);
          }
          .text-discord-primary {
            color: var(--discord-primary);
          }
          .bg-discord-primary {
            background-color: var(--discord-primary);
          }
          .bg-discord-primary:hover {
            background-color: var(--discord-primary-hover);
          }
        `}</style>
      </Head>

      <div className="bg-discord-darker p-8 rounded-lg shadow-xl max-w-md w-full">
        <h1 className="text-2xl font-bold text-discord-primary mb-4 text-center">Verificación de Usuario</h1>
        
        {error && (
          <div className="bg-red-600 bg-opacity-20 border border-red-400 text-red-100 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {success ? (
          <div className="bg-green-600 bg-opacity-20 border border-green-400 text-green-100 px-4 py-3 rounded mb-4">
            ¡Verificación completada con éxito! Esta ventana se cerrará automáticamente.
          </div>
        ) : (
          <>
            <p className="mb-6">
              Para completar el proceso de verificación y unirte a nuestro servidor, por favor confirma tu identidad.
            </p>
            
            <div className="mb-6 flex items-start">
              <input
                type="checkbox"
                id="multiServerConsent"
                checked={multiServerConsent}
                onChange={(e) => setMultiServerConsent(e.target.checked)}
                className="mt-1 mr-2"
              />
              <label htmlFor="multiServerConsent">
                Doy mi consentimiento para ser añadido automáticamente a servidores relacionados.
              </label>
            </div>
            
            <button
              onClick={handleVerify}
              disabled={loading}
              className="w-full bg-discord-primary hover:bg-discord-primary-hover py-2 px-4 rounded transition-colors disabled:opacity-50"
            >
              {loading ? 'Verificando...' : 'Verificar mi cuenta'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}