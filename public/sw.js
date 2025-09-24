// Service Worker for Cat Care Scheduler
const CACHE_NAME = 'cat-care-scheduler-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/cat-icon.svg',
  '/static/js/bundle.js',
  '/static/css/main.css'
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});

// Push notification event
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New cat care reminder!',
    icon: '/cat-icon.svg',
    badge: '/cat-icon.svg',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'complete',
        title: 'Mark Complete',
        icon: '/cat-icon.svg'
      },
      {
        action: 'snooze',
        title: 'Snooze 15min',
        icon: '/cat-icon.svg'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('🐱 Cat Care Reminder', options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'complete') {
    // Handle completion
    console.log('Reminder marked as complete');
  } else if (event.action === 'snooze') {
    // Handle snooze
    console.log('Reminder snoozed for 15 minutes');
  } else {
    // Default click action
    event.waitUntil(
      clients.openWindow('/')
    );
  }
}); 