const API = '/api';
const AMBIENT = process.env.REACT_APP_AMBIENT;
const APP_HOST = process.env.REACT_APP_HOST;
const LOGIN_API_HOST = process.env.REACT_APP_LOGIN_HOST;
const USERS_API_HOST = process.env.REACT_APP_USERS_HOST;
const SHIPS_API_HOST = process.env.REACT_APP_SHIPS_HOST;

export const settings = {
    ambient: AMBIENT,
    url: {
        host: APP_HOST,
        loginAPI: LOGIN_API_HOST,
        usersAPI: USERS_API_HOST,
        shipsAPI: SHIPS_API_HOST,
        api: API
    }
};
