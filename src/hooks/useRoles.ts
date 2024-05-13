import { selectCurrentUser } from '../features/auth/authSlice';
import { useAppSelector } from './reduxHooks';

export const useRoles = () => {
    const user = useAppSelector(selectCurrentUser);

    let auth = {
        isAdmin: false,
        role: ''
    };

    const admin = user?.roles?.find(
        (rol: any) =>
            rol.nombre === 'ADMINISTRADOR_MANAGER' || rol.nombre === 'ADMINISTRADOR_VIEWER'
    );

    if (admin) {
        auth.isAdmin = true;
        auth.role = 'admin';
    } else {
        user?.roles?.forEach((rol: any) => {
            if (rol.nombre === 'AGENCIA_MANAGER' || rol.nombre === 'AGENCIA_VIEWER') {
                auth.role = 'agencia';
            }
            if (
                rol.nombre === 'AGENCIA_FERROVIARIA_MANAGER' ||
                rol.nombre === 'AGENCIA_FERROVIARIA_VIEWER'
            ) {
                auth.role = 'agencia FFCC';
            }
            if (rol.nombre === 'TERMINAL_MANAGER' || rol.nombre === 'TERMINAL_VIEWER') {
                auth.role = 'terminal';
            }
            if (rol.nombre === 'BACKOFFICE_MANAGER') {
                auth.role = 'backoffice';
            }
            if (rol.nombre === 'PREFECTURA_MANAGER') {
                auth.role = 'prefectura';
            }
            if (rol.nombre === 'ADUANA_MANAGER') {
                auth.role = 'aduana';
            }
            if (rol.nombre === 'LIQUIDADOR_MANAGER') {
                auth.role = 'liquidador';
            }
        });
    }

    const { isAdmin, role } = auth;
    return { isAdmin, role };
};
