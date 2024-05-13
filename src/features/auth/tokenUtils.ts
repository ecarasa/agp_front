type UserToken = {
    accessToken: string;
    refreshToken: string;
}

const ACCESS_TOKEN = 'access_token';
const REFRESH_TOKEN = 'refresh_token';

export const getAccessToken = () => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN);
    return accessToken;
};

export const getRefreshToken = () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    return refreshToken;
};

export const saveTokenAndRefreshToken = (userToken: UserToken) => {
    localStorage.setItem(ACCESS_TOKEN, userToken.accessToken);
    localStorage.setItem(REFRESH_TOKEN, userToken.refreshToken);
};

export const deleteTokenAndRefreshToken = () => {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
};