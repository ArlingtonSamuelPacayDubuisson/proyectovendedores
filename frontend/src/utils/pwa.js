// Registro del Service Worker
export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((registration) => {
          console.log('✅ Service Worker registrado:', registration.scope);

          // Verificar actualizaciones cada hora
          setInterval(() => {
            registration.update();
          }, 60 * 60 * 1000);

          // Escuchar actualizaciones
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            console.log('🔄 Nueva versión del Service Worker disponible');

            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // Nueva versión disponible, notificar al usuario
                if (confirm('Nueva versión disponible. ¿Deseas actualizar?')) {
                  window.location.reload();
                }
              }
            });
          });
        })
        .catch((error) => {
          console.error('❌ Error al registrar Service Worker:', error);
        });
    });
  }
}

// Desregistrar Service Worker (útil para desarrollo)
export function unregisterServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
        console.log('Service Worker desregistrado');
      })
      .catch((error) => {
        console.error('Error al desregistrar:', error);
      });
  }
}

// Verificar si la app está instalada
export function isAppInstalled() {
  return window.matchMedia('(display-mode: standalone)').matches ||
         window.navigator.standalone === true;
}

// Evento para mostrar el banner de instalación
let deferredPrompt;

export function initInstallPrompt() {
  window.addEventListener('beforeinstallprompt', (e) => {
    console.log('💡 Prompt de instalación disponible');
    // Prevenir el prompt automático
    e.preventDefault();
    // Guardar el evento para usarlo después
    deferredPrompt = e;
    
    // Disparar evento personalizado
    window.dispatchEvent(new CustomEvent('app-installable'));
  });

  window.addEventListener('appinstalled', () => {
    console.log('✅ App instalada');
    deferredPrompt = null;
  });
}

// Mostrar el prompt de instalación
export async function showInstallPrompt() {
  if (!deferredPrompt) {
    console.log('❌ Prompt de instalación no disponible');
    return false;
  }

  // Mostrar el prompt
  deferredPrompt.prompt();

  // Esperar la respuesta del usuario
  const { outcome } = await deferredPrompt.userChoice;
  console.log(`Usuario ${outcome === 'accepted' ? 'aceptó' : 'rechazó'} la instalación`);

  // Limpiar el prompt
  deferredPrompt = null;

  return outcome === 'accepted';
}

// Verificar soporte de notificaciones
export function notificationSupported() {
  return 'Notification' in window;
}

// Solicitar permiso para notificaciones
export async function requestNotificationPermission() {
  if (!notificationSupported()) {
    return false;
  }

  const permission = await Notification.requestPermission();
  return permission === 'granted';
}

// Enviar notificación local
export function sendLocalNotification(title, options = {}) {
  if (!notificationSupported() || Notification.permission !== 'granted') {
    return;
  }

  const defaultOptions = {
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [200, 100, 200],
    ...options
  };

  new Notification(title, defaultOptions);
}

// Verificar si está online
export function isOnline() {
  return navigator.onLine;
}

// Escuchar cambios de conectividad
export function initConnectivityListener(onOnline, onOffline) {
  window.addEventListener('online', () => {
    console.log('✅ Conexión restaurada');
    if (onOnline) onOnline();
  });

  window.addEventListener('offline', () => {
    console.log('❌ Sin conexión');
    if (onOffline) onOffline();
  });
}
