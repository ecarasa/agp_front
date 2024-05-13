import _ from 'lodash';
import { Box } from '@mui/material';
import { handleErrors } from '../../../utils/common';
import { INTEGERS_UNIT } from '../../../constants/regex';
import { selectCurrentUser, setUserData } from '../../../features/auth/authSlice';
import { showAlert } from '../../../features/slices/applicationSlice';
import { useAppDispatch, useAppSelector } from '../../../hooks/reduxHooks';
import { useEditUserMutation, useLazyGetUserDataQuery } from '../../../services/usersApi';
import { useState } from 'react';
import ButtonActions from '../../../components/ButtonActions';
import DatePickerComponent from '../../../components/layout/DatePicker';
import Input from '../../../components/Input/Input';
import SectionHeader from '../../../components/SectionHeader';

const UserDataForm = ({ setOpen, userData }: any) => {
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectCurrentUser);
    const [editEstado, { isLoading: edditingUser }] = useEditUserMutation();
    const [getUserData, { isLoading: loadingUserData }] = useLazyGetUserDataQuery();
    const [modifiedValues, setModifiedValues] = useState<any>(null);
    const [data, setData] = useState(userData);

    const handleChange = (e: any) => {
        const { name, value } = e?.target;
        if (value === userData[name]) {
            let newObject = { ...modifiedValues };
            if (newObject[name]) delete newObject[name];
            setModifiedValues(newObject);
        } else {
            setModifiedValues({
                ...modifiedValues,
                [name]: value
            });
        }
        setData({
            ...data,
            [name]: value
        });
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const idsRoles = userData?.roles.map((objeto: any) => objeto.id);
        const body = {
            usuario: data.usuario,
            nombre: modifiedValues.nombre,
            documento: data?.documento || '',
            fechaNacimiento: data?.fecha_nacimiento || null,
            idsRol: idsRoles
        };

        const response: any = await editEstado(body);
        if (response?.error) {
            handleErrors(response.error);
        } else {
            setOpen('');
            dispatch(
                showAlert({
                    title: 'Información de usuario modificada correctamente',
                    confirmText: 'Aceptar',
                    keepMounted: true
                })
            );
            if (data.usuario === user?.usuario && modifiedValues?.empresa) {
                const userData = await getUserData();
                if (userData) {
                    dispatch(setUserData(userData?.data?.data));
                }
            }
        }
    };

    return (
        <>
            <SectionHeader>
                <SectionHeader.DrawerTitle>Información de Usuario</SectionHeader.DrawerTitle>
            </SectionHeader>
            <Box component="form" sx={{ padding: '10px' }} onSubmit={handleSubmit}>
                <Input
                    label="Nombre"
                    name="nombre"
                    value={data?.nombre}
                    onChange={handleChange}
                    required
                />
                <Input readOnly label="Usuario" name="usuario" value={data?.usuario} />
                <Input
                    onChange={(e: any) => {
                        let value = e.target.value;
                        if ((INTEGERS_UNIT.test(value) || value === '') && value?.length < 20) {
                            handleChange({
                                target: {
                                    name: 'documento',
                                    value: value
                                }
                            });
                        }
                    }}
                    label="Documento"
                    name="documento"
                    value={data?.documento || ''}
                />
                <DatePickerComponent
                    value={data?.fecha_nacimiento || ''}
                    label="Fecha de nacimiento"
                    name="fecha_nacimiento"
                    setValue={(value: any) =>
                        handleChange({
                            target: {
                                name: 'fecha_nacimiento',
                                value: value
                            }
                        })
                    }
                    width="100%"
                />
                <Box sx={{ margin: '40px 0' }}>
                    <ButtonActions
                        renderBackAction
                        disabled={_.isEmpty(modifiedValues)}
                        returnText="Cerrar"
                        handleClose={() => setOpen(false)}
                        flexDirection="column-reverse"
                        loading={edditingUser}
                    />
                </Box>
            </Box>
        </>
    );
};
export default UserDataForm;
