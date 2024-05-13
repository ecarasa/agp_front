import { settings } from '../settings';

interface ServiceProps {
    endpoint: string;
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    data?: { [key: string]: any };
    customHeaders?: { [key: string]: any };
    files?: boolean;
    blobResponse?: boolean;
    uncoded?: any;
}

export const AuthService = () => {
    const setSession = (accessToken: string) => {
        localStorage.setItem('accessToken', accessToken);

        return true;
    };

    const closeSession = async () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        sessionStorage.clear();
    };

    return {
        setSession,
        closeSession
    };
};
export const ServiceManager = ((value: any) => {
    const serialize = (obj: any, uncoded: any): any => {
        var str = [];
        for (var p in obj)
            if (obj.hasOwnProperty(p)) {
                if (uncoded) {
                    str.push(encodeURIComponent(p) + '=' + obj[p]);
                } else {
                    str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
                }
            }
        return str.join('&');
    };

    const callFunction = async ({
        endpoint,
        method = 'GET',
        data = {},
        customHeaders = {},
        files = false,
        blobResponse = false,
        uncoded
    }: ServiceProps) => {
        const accessToken =
            sessionStorage.getItem('accessToken') || localStorage.getItem('accessToken');
        if (accessToken) {
            customHeaders = {
                ...{ Authorization: `Bearer ${accessToken}` },
                ...customHeaders
            };
        }

        const url = value.url['host'] + endpoint;

        let params = '';
        let options: { [key: string]: any } = {};

        options.method = method ? method : 'GET';

        if (options.method.toUpperCase() !== 'GET') {
            if (!files) {
                options.body = JSON.stringify(data);
            } else {
                const formData = new FormData();
                Object.keys(data).forEach((key) => formData.append(key, data[key]));
                options.body = formData;
            }
        } else {
            params = Object.keys(data).length > 0 ? '?' + serialize(data, uncoded) : '';
        }

        let headers = files
            ? {}
            : {
                  'Content-Type': 'application/json'
              };

        headers = { ...headers, ...customHeaders };

        options.headers = headers;

        try {
            const response = await fetch(url + params, options);

            if (blobResponse) {
                const blob = await response.blob();

                return { blob, data: response };
            }

            if (response.ok) {
                return response.json();
            }
        } catch (error) {
            console.error(error);
        }
    };
    return {
        callFunction
    };
})(settings);
