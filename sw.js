'use strict';

/* Service worker « interrupteur » : Cruzzle a déménagé sur Vercel.
   Ce fichier remplace l'ancien service worker (contenu différent -> le
   navigateur détecte la mise à jour même pour les PWA déjà installées).
   Son seul rôle est de se désinstaller lui-même et de vider les caches
   de l'ancienne version hors ligne, puis de recharger les fenêtres
   ouvertes vers la page de redirection. */

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map(k => caches.delete(k)));
    await self.registration.unregister();
    const clientsList = await self.clients.matchAll({ type: 'window' });
    clientsList.forEach(client => client.navigate(client.url));
  })());
});
