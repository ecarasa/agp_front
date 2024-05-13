import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

var firebaseConfig = {
    apiKey: 'AIzaSyB1Uv22yQQejrC99w8m4O0x5x8tMaH4UvkdlA8',
    authDomain: 'agp-web-ac851.firebaseapp.com',
    projectId: 'agp-web-ac851',
    storageBucket: 'agp-web-ac851.appspot.com',
    messagingSenderId: '442742577975',
    appId: '1:442742577975:web:67973b1b212a91e30998b2',
    measurementId: 'G-7S373C2RX0'
};

const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

export const fetchToken = (setTokenFound: any) => {
    return getToken(messaging, {
        vapidKey:
            'BG6R_wdvU0WLzp5JTDA5MLm0gtLhVeKcgbJDUOCH5FfwJx7njv4_yyjqIXPnllTwhM4lG1f3GS2DWnW_d07GFNc'
    })
        .then((currentToken) => {
            if (currentToken) {
                // console.log('current token for client: ', currentToken);
                setTokenFound(currentToken);
                // Track the token -> client mapping, by sending to backend server
                // show on the UI that permission is secured
            } else {
                console.error(
                    'No registration token available. Request permission to generate one.'
                );
                setTokenFound(false);
                // shows on the UI that permission is required
            }
        })
        .catch((err) => {
            console.error('An error occurred while retrieving token. ', err);
            // catch error while creating client token
        });
};

export const onMessageListener = () =>
    new Promise((resolve) => {
        onMessage(messaging, (payload) => {
            resolve(payload);
        });
    });
