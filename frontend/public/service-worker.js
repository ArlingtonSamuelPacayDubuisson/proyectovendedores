// Service Worker para Vendedores Ambulantes
const CACHE_NAME = 'vendedores-gt-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Instalación del Service Worker
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Instalando...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Cacheando archivos');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('[Service Worker] Error al cachear:', error);
      })
  );
  
  // Forzar activación inmediata
  self.skipWaiting();
});

// Activación del Service Worker
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activando...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Eliminando cache antigua:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  // Tomar control de todas las páginas
  return self.clients.claim();
});

// Interceptar peticiones de red
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Estrategia: Network First, Cache Fallback (para API)
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Clonar la respuesta porque solo se puede usar una vez
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
          
          return response;
        })
        .catch(() => {
          // Si falla la red, intentar con el cache
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // Si no hay cache, devolver respuesta offline personalizada
            return new Response(
              JSON.stringify({ 
                success: false, 
                message: 'Sin conexión. Datos no disponibles.' 
              }),
              {
                headers: { 'Content-Type': 'application/json' },
                status: 503
              }
            );
          });
        })
    );
    return;
  }

  // Estrategia: Cache First, Network Fallback (para assets estáticos)
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          // Si está en cache, devolverlo
          return cachedResponse;
        }

        // Si no está en cache, hacer fetch
        return fetch(request)
          .then((response) => {
            // No cachear respuestas con errores
            if (!response || response.status !== 200 || response.type === 'error') {
              return response;
            }

            // Cachear imágenes, CSS, JS
            if (
              request.destination === 'image' ||
              request.destination === 'style' ||
              request.destination === 'script'
            ) {
              const responseToCache = response.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, responseToCache);
              });
            }

            return response;
          })
          .catch(() => {
            // Si falla, mostrar página offline para navegación
            if (request.destination === 'document') {
              return caches.match('/index.html');
            }
          });
      })
  );
});

// Manejo de sincronización en segundo plano
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] Sincronización:', event.tag);
  
  if (event.tag === 'sync-data') {
    event.waitUntil(
      // Aquí podrías sincronizar datos pendientes cuando haya conexión
      console.log('[Service Worker] Sincronizando datos...')
    );
  }
});

// Manejo de notificaciones push (opcional)
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push recibido:', event);
  
  const options = {
    body: event.data ? event.data.text() : 'Nueva notificación',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Ver más',
        icon: '/icons/icon-192x192.png'
      },
      {
        action: 'close',
        title: 'Cerrar',
        icon: '/icons/icon-192x192.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Vendedores GT', options)
  );
});

// Manejo de clicks en notificaciones
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Click en notificación:', event);
  
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

console.log('[Service Worker] Registrado correctamente');
