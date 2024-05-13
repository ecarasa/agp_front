import { rest, RestRequest, RestContext } from 'msw';

const loginResolver = (req: RestRequest, res: any, ctx: RestContext) => {
    const authorized = true;

    if (!authorized)
        return res(
            ctx.status(403),
            ctx.json({
                message: 'Not authorized'
            })
        );

    //httpOnly: true,
    return res(
        ctx.status(200),
        ctx.delay(600),
        ctx.cookie('refreshToken', '__my_refresh_token__cookie_1', {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 604800000
        }),
        ctx.json({
            user: {
                nombre: 'nombre_de_usuario',
                roles: ['viewer', 'admin']
            },
            accessToken: '__my_access_token__'
        })
    );
};

const refreshTokenResolver = (req: RestRequest, res: any, ctx: RestContext) => {
    const { refreshToken } = req.cookies;

    //debe validarse el refreshToken
    if (refreshToken === '__my_refresh_token__cookie_1') {
        return res(
            ctx.status(200),
            ctx.cookie('refreshToken', '__my_refresh_token__cookie_2', {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: 604800000
            }),
            ctx.json({
                accessToken: '__refreshed_access_token__'
            })
        );
    }

    return res(ctx.status(403), ctx.json({ message: 'Failed to authenticate!' }));
};

export const authHandlers = [
    rest.post('fakeApi/auth/login', loginResolver),
    rest.get('fakeApi/auth/refresh-token', refreshTokenResolver)
];
