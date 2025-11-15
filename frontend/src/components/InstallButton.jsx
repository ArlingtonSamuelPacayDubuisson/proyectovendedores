import { useState, useEffect } from 'react';
import { showInstallPrompt, isAppInstalled } from '../utils/pwa';

export const InstallButton = () => {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Verificar si ya está instalada
    setIsInstalled(isAppInstalled());

    // Escuchar evento de instalación disponible
    const handleInstallable = () => {
      setIsInstallable(true);
    };

    window.addEventListener('app-installable', handleInstallable);

    return () => {
      window.removeEventListener('app-installable', handleInstallable);
    };
  }, []);

  const handleInstall = async () => {
    const accepted = await showInstallPrompt();
    
    if (accepted) {
      setIsInstallable(false);
      setIsInstalled(true);
    }
  };

  // No mostrar si ya está instalada
  if (isInstalled) {
    return null;
  }

  // No mostrar si no es instalable
  if (!isInstallable) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-2xl p-4 max-w-sm border-2 border-primary-500">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🛒</span>
            </div>
          </div>
          
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 mb-1">
              Instalar App
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              Accede más rápido a vendedores cerca de ti
            </p>
            
            <div className="flex space-x-2">
              <button
                onClick={handleInstall}
                className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded-lg text-sm transition-colors"
              >
                Instalar
              </button>
              <button
                onClick={() => setIsInstallable(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg text-sm transition-colors"
              >
                Ahora no
              </button>
            </div>
          </div>
          
          <button
            onClick={() => setIsInstallable(false)}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
