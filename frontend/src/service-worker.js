/* eslint-disable no-restricted-globals */

import { clientsClaim } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate, CacheFirst } from 'workbox-strategies';

clientsClaim();

precacheAndRoute(self.__WB_MANIFEST);

const fileExtensionRegexp = new RegExp('/[^/?]+\\.[^/]+$');
registerRoute(
  ({ request, url }) => {
    if (request.mode !== 'navigate') {
      return false;
    }
    if (url.pathname.startsWith('/_')) {
      return false;
    }
    if (url.pathname.match(fileExtensionRegexp)) {
      return false;
    }
    return true;
  },
  createHandlerBoundToURL(process.env.PUBLIC_URL + '/index.html')
);

// Cache de imagens com estratégia Cache First
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 dias
      }),
    ],
  })
);

// Cache de fontes com estratégia Cache First
registerRoute(
  ({ url }) => url.origin === self.location.origin && url.pathname.endsWith('.woff2'),
  new CacheFirst({
    cacheName: 'fonts',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 10,
        maxAgeSeconds: 60 * 60 * 24 * 365, // 1 ano
      }),
    ],
  })
);

// Cache de API com estratégia Stale While Revalidate
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new StaleWhileRevalidate({
    cacheName: 'api-responses',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 60 * 60 * 24, // 1 dia
      }),
    ],
  })
);

// Cache de recursos estáticos com estratégia Stale While Revalidate
registerRoute(
  ({ request }) =>
    request.destination === 'script' ||
    request.destination === 'style',
  new StaleWhileRevalidate({
    cacheName: 'static-resources',
  })
);

// Evento de instalação
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// Evento de sincronização em background
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-diaper-usage') {
    event.waitUntil(syncDiaperUsage());
  }
  if (event.tag === 'sync-measurements') {
    event.waitUntil(syncMeasurements());
  }
});

// Função para sincronizar uso de fraldas
async function syncDiaperUsage() {
  const db = await openDB();
  const pendingRecords = await db.getAll('pendingDiaperUsage');
  
  for (const record of pendingRecords) {
    try {
      const response = await fetch('/api/diaper-usages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(record),
      });
      
      if (response.ok) {
        await db.delete('pendingDiaperUsage', record.id);
      }
    } catch (error) {
      console.error('Erro ao sincronizar uso de fraldas:', error);
    }
  }
}

// Função para sincronizar medidas
async function syncMeasurements() {
  const db = await openDB();
  const pendingRecords = await db.getAll('pendingMeasurements');
  
  for (const record of pendingRecords) {
    try {
      const response = await fetch('/api/measurements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(record),
      });
      
      if (response.ok) {
        await db.delete('pendingMeasurements', record.id);
      }
    } catch (error) {
      console.error('Erro ao sincronizar medidas:', error);
    }
  }
}

// Função para abrir o banco de dados IndexedDB
async function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('babyDiaperTracker', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      if (!db.objectStoreNames.contains('pendingDiaperUsage')) {
        db.createObjectStore('pendingDiaperUsage', { keyPath: 'id', autoIncrement: true });
      }
      
      if (!db.objectStoreNames.contains('pendingMeasurements')) {
        db.createObjectStore('pendingMeasurements', { keyPath: 'id', autoIncrement: true });
      }
    };
  });
} 