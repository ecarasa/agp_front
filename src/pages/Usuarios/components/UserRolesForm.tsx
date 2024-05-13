import { handleErrors } from '../../../utils/common';
import { selectCurrentUser, setUserData } from '../../../features/auth/authSlice';
import { showAlert } from '../../../features/slices/applicationSlice';
import { useAppDispatch, useAppSelector } from '../../../hooks/reduxHooks';
import { useEditUserMutation, useLazyGetUserDataQuery } from '../../../services/usersApi';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import AutocompleteComponent from '../../../components/layout/Autocomplete';
import AutocompleteConChips from '../../../components/layout/SelectConChips';
import Box from '@mui/material/Box';
import ButtonActions from '../../../components/ButtonActions';
import SectionHeader from '../../../components/SectionHeader';

function UserRolesForm({ setOpen, userData, parametricData }: any) {
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useAppDispatch();
    const rolOptions = parametricData && parametricData.data.roles;
    const companyOptions = parametricData && parametricData.data.empresas;
    const user = useAppSelector(selectCurrentUser);
    const [editEstado, { isLoading: edittingUser }] = useEditUserMutation();
    const [roles, setRoles] = useState(userData.roles);
    const [empresa, setEmpresa] = useState(userData?.empresa);
    const [getUserData, { isLoading: loadingUserData }] = useLazyGetUserDataQuery();

    function tieneElementosRepetidos(arr: any[]): boolean {
        const elementosUnicos = new Set();
        for (const elemento of arr) {
            if (elementosUnicos.has(elemento.id)) {
                return true;
            }
            elementosUnicos.add(elemento.id);
        }
        return false;
    }

    const editarRoles = async () => {
        const repeat = tieneElementosRepetidos(roles);
        if (repeat === true) {
            enqueueSnackbar('Hay Roles repetidos', {
                variant: 'error'
            });
        } else {
            const idsRoles = roles.map((objeto: any) => objeto.id);

            const body = {
                usuario: userData.usuario,
                idEmpresa: empresa?.id,
                idsRol: idsRoles
            };

            const response: any = await editEstado(body);
            if (response?.error) {
                handleErrors(response?.error);
            } else {
                setOpen('');
                dispatch(
                    showAlert({
                        title: 'Información de usuario modificada correctamente',
                        confirmText: 'Aceptar',
                        keepMounted: true
                    })
                );
                if (userData.usuario === user?.usuario) {
                    const userData = await getUserData();
                    if (userData) {
                        dispatch(setUserData(userData?.data?.data));
                    }
                }
            }
        }
    };

    const rolOptionsFiltered = () => {
        const defaultCompany = companyOptions?.find((i: any) => i.id === empresa?.id);
        return (
            rolOptions?.filter((i: any) =>
                defaultCompany?.perfiles?.find((p: any) => p.id === i.perfil.id)
            ) || []
        );
    };

    return (
        <>
            <SectionHeader>
                <SectionHeader.DrawerTitle>Asignaciones</SectionHeader.DrawerTitle>
            </SectionHeader>
            <Box component="div" sx={{ padding: '0 10px', textAlign: 'left' }}>
                <p>Empresa</p>
                <AutocompleteComponent
                    name="edituser_company"
                    value={empresa}
                    onChange={(e: any) => {
                        setRoles([]);
                        setEmpresa(e);
                    }}
                    label="Empresa"
                    required
                    options={companyOptions || []}
                />

                <p>Roles</p>
                <AutocompleteConChips
                    options={rolOptionsFiltered()}
                    width="100%"
                    value={roles}
                    disabled={!empresa}
                    setValue={setRoles}
                    fixedOptions={userData.roles}
                    name="roles_edit_autocomplete"
                />

                <Box sx={{ margin: '40px 0' }}>
                    <ButtonActions
                        renderBackAction
                        returnText="Cerrar"
                        handleClose={() => setOpen(false)}
                        flexDirection="column-reverse"
                        loading={loadingUserData || edittingUser}
                        disabled={!roles?.length || !empresa}
                        onClick={editarRoles}
                    />
                </Box>
            </Box>
        </>
    );
}

export default UserRolesForm;
