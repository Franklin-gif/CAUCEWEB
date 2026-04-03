// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.10.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.10.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBH3OMCamiI4s1EXQDJ4k5EdZEZNIIdS68",
  authDomain: "caucepanama-3f5ce.firebaseapp.com",
  projectId: "caucepanama-3f5ce",
  storageBucket: "caucepanama-3f5ce.firebasestorage.app",
  messagingSenderId: "399446980989",
  appId: "1:399446980989:web:af21612a59c89527bcf414",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
