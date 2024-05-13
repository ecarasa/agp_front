// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/10.1.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.1.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
    apiKey: 'AIzaSyB1UvyQQejrCw8m4O0x5x8tMaH4UvkdlA8',
    authDomain: 'agp-web-ac851.firebaseapp.com',
    projectId: 'agp-web-ac851',
    storageBucket: 'agp-web-ac851.appspot.com',
    messagingSenderId: '442742577975',
    appId: '1:442742577975:web:67973b1b212a91e30998b2',
    measurementId: 'G-7S373C2RX0'
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
    // console.log('Received background message ', payload);

    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
