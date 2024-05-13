import { useEffect, useState } from 'react';
import { useAppDispatch } from '../../../../hooks/reduxHooks';
import { showAlert } from '../../../../features/slices/applicationSlice';
import { enqueueSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import {
    useCreateRoleMutation,
    useEditRoleByIdMutation,
    useGetRolesFucionalidadesQuery,
    useGetRolesPerfilesQuery,
    useLazyGetRoleByIdQuery
} from '../../../../services/rolesApi';
import { useTranslation } from 'react-i18next';
import { handleErrors } from '../../../../utils/common';

type IRolesBody = {
    nombre?: string;
    idPerfil: number | null;
    idFuncionalidades: number[];
};

function useRolesSave() {
    const { t } = useTranslation('roles');
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [errors, setErrors] = useState<any>(null);
    const [checked, setChecked] = useState<number[]>([]);
    const [profileToSave, setProfileToSave] = useState<any>(null);
    const [mainData, setMainData] = useState<any>();
    const [rolData, setRolData] = useState<any>(null);
    const [modifiedValues, setModifiedValues] = useState<number[]>([]);

    const { data: dataPerfiles } = useGetRolesPerfilesQuery({});
    const {
        data: funcionalidades,
        refetch: refetchFuncionalidades,
        isLoading,
        isFetching
    } = useGetRolesFucionalidadesQuery({}, { refetchOnMountOrArgChange: true });

    const [updateRole, { isLoading: updatingRole }] = useEditRoleByIdMutation();
    const [createNewRole, { isLoading: creatingRole }] = useCreateRoleMutation();
    const [getRolById, { isLoading: loadingRol }] = useLazyGetRoleByIdQuery();

    const [valuesForm, setValuesForm] = useState<IRolesBody>({
        nombre: '',
        idPerfil: null,
        idFuncionalidades: []
    });

    const loadData = async (id: string) => {
        try {
            const response = await getRolById(id);
            if (!response?.error) setRolData(response?.data);
            else handleErrors(response?.error);
        } catch (e) {}
    };

    const handleChange = (event: any) => {
        event.preventDefault();
        setValuesForm({
            ...valuesForm,
            [event.target.name || event.target.id]: event.target.value
        });
    };

    const getValue = ({ options, id }: any) => {
        if (!options || !id) return [];
        return options.filter((opt: any) => opt.id === id);
    };

    /**Searchbar */
    const onChangeSearch = (e: any) => checkData(e?.target?.value?.toLowerCase());

    const filterData = (input: any) => {
        const filtered = funcionalidades?.data?.funcionalidades?.filter((el: any) => {
            return el?.nombre.toLowerCase().includes(input);
        });
        return { data: { funcionalidades: filtered || [] } };
    };

    const checkData = (text: any) => {
        setMainData(!text ? funcionalidades : filterData(text));
    };

    const showWarningModal = (idRol: string | null) => {
        dispatch(
            showAlert({
                icon: 'info',
                itemData: true,
                cancelText: t('cancel'),
                confirmText: t('accept'),
                title: !idRol ? t('create-role-msg') : t('update-role-msg'),
                confirmAction: async () => {
                    try {
                        if (!idRol) {
                            const body: IRolesBody = {
                                nombre: valuesForm.nombre,
                                idPerfil: profileToSave?.id,
                                idFuncionalidades: checked
                            };
                            const response: any = await createNewRole({ body });
                            handleError(response);
                        } else {
                            let body: any = {
                                idFuncionalidades: checked,
                                nombre:
                                    valuesForm.nombre !== rolData.nombre
                                        ? rolData.nombre
                                        : undefined
                            };
                            if (profileToSave) body['idPerfil'] = profileToSave?.id;
                            const response: any = await updateRole({ body, idRol });
                            handleError(response, t('edited') as string);
                        }
                    } catch (error) {
                        return false;
                    }
                }
            })
        );
    };

    const handleError = (response: any, caption = t('created'), redirect = '/agp/roles') => {
        if (response?.statusCode > 400 || response?.error) {
            if (Array.isArray(response?.error.data?.message)) {
                return response?.error.data.message.forEach((msg: any) => {
                    enqueueSnackbar(msg, { variant: 'error' });
                });
            } else {
                return enqueueSnackbar(response?.error?.data?.message || 'Ocurrió un error', {
                    variant: 'error'
                });
            }
        } else {
            dispatch(
                showAlert({
                    title: `Rol ${caption} correctamente`,
                    confirmText: 'Cerrar',
                    confirmAction: () => navigate(redirect)
                })
            );
        }
    };

    const handleSubmit = (id: string | null = null) => {
        if (checked.length === 0) {
            enqueueSnackbar('Debes seleccionar al menos una funcionalidad', { variant: 'error' });
            return false;
        }
        showWarningModal(id);
    };

    useEffect(() => {
        checkData(null);
        // eslint-disable-next-line
    }, [funcionalidades]);

    return {
        funcionalidades,
        mainData,
        isLoading,
        isFetching,
        refetchFuncionalidades,
        dataPerfiles,
        valuesForm,
        loadingRol,
        creatingRole,
        updatingRole,
        errors,
        checked,
        profileToSave,
        rolData,
        modifiedValues,
        setModifiedValues,
        setProfileToSave,
        setErrors,
        handleChange,
        handleSubmit,
        onChangeSearch,
        setValuesForm,
        getValue,
        setChecked,
        loadData
    };
}

export default useRolesSave;
