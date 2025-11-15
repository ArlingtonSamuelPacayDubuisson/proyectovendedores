import { useState, useEffect } from 'react';
import { isOnline, initConnectivityListener } from '../utils/pwa';

export const ConnectionStatus = () => {
  const [online, setOnline] = useState(isOnline());
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Inicializar listener de conectividad
    initConnectivityListener(
      () => {
        setOnline(true);
        setShowBanner(true);
        // Ocultar banner después de 3 segundos
        setTimeout(() => setShowBanner(false), 3000);
      },
      () => {
        setOnline(false);
        setShowBanner(true);
      }
    );

    // Verificar estado inicial
    setOnline(isOnline());
  }, []);

  // No mostrar nada si está online y no hay banner
  if (online && !showBanner) {
    return null;
  }

  return (
    <div
      className={`fixed top-16 left-0 right-0 z-40 transition-all duration-300 ${
        showBanner ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div
        className={`mx-4 mt-4 rounded-lg shadow-lg p-4 ${
          online
            ? 'bg-green-600 text-white'
            : 'bg-yellow-600 text-white'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              {online ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              )}
            </div>
            <div>
              <p className="font-semibold">
                {online ? '¡Conexión restaurada!' : 'Sin conexión a internet'}
              </p>
              <p className="text-sm opacity-90">
                {online
                  ? 'Ahora puedes ver contenido actualizado'
                  : 'Trabajando en modo offline. Algunas funciones pueden no estar disponibles.'}
              </p>
            </div>
          </div>
          
          {online && (
            <button
              onClick={() => setShowBanner(false)}
              className="flex-shrink-0 text-white hover:text-gray-200 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
