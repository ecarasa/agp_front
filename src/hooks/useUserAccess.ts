import { useAppSelector } from './reduxHooks';

export function useUserAccess() {
    const userFunctions: object[] | undefined = useAppSelector(
        (state: any) => state.auth.user?.funcionalidadesAgrupadas
    );

    let access: { [key: string]: { [key: number]: string } } = {};

    if (userFunctions) {
        userFunctions.forEach((i: any) => {
            let functionalities: any = {};

            i.funcionalidades.forEach((f: any) => {
                functionalities[f.id] = f.nombre;
            });

            access[i.id] = functionalities;
        });
    }

    return access || null;
}

export default useUserAccess;
