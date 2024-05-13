import { enqueueSnackbar } from 'notistack';
import { handleErrors } from '../../../../utils/common';
import { showAlert } from '../../../../features/slices/applicationSlice';
import { useAppDispatch } from '../../../../hooks/reduxHooks';
import { useCreateUserMutation, useGetCompanyRolesQuery } from '../../../../services/CreateUser';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

interface Empresa {
    id: string;
    nombre: string;
    perfiles: { id: number; nombre: string }[];
}

export interface Body {
    usuario: string;
    nombre: string;
    documento: string;
    fechaNacimiento: Date | null;
    email: string;
    telefono: string;
    idEmpresa: number;
    idsRol: number[];
}

interface Roles {
    id: string;
    nombre: string;
    perfil: { id: number; nombre: string };
}
function useUserSave() {
    const [userRol, setUserRol] = useState<Roles[]>([]);
    const [fechaNac, setFechaNac] = useState<Date | null>(null);
    const [empresa, setEmpresa] = useState<Empresa | null>(null);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { data } = useGetCompanyRolesQuery();
    const companyOptions = data?.data?.empresas;
    const rolOptions = data?.data?.roles;

    const [createUser, { isLoading: creatingUser }] = useCreateUserMutation();
    const [valuesForm, setValuesForm] = useState({
        usuario: '',
        nombre: '',
        apellido: '',
        nroIdUsuario: '',
        mail: '',
        telefono: ''
    });

    const handleChange = (event: any) => {
        const { name, value } = event?.target;
        setValuesForm({
            ...valuesForm,
            [name]: value
        });
    };

    const handleSubmit = async () => {
        const idRoles = userRol.map((objeto) => objeto.id);
        if (
            valuesForm.usuario === '' ||
            valuesForm.nombre === '' ||
            valuesForm.apellido === '' ||
            empresa === null ||
            idRoles.length === 0
        ) {
            enqueueSnackbar('Debes completar los campos obligatorios', {
                variant: 'error'
            });
            return;
        }

        const idEmpresa = parseInt(empresa?.id);

        const body: Body = {
            usuario: valuesForm.usuario,
            nombre: valuesForm.nombre + ' ' + valuesForm.apellido,
            documento: valuesForm.nroIdUsuario || '',
            fechaNacimiento: fechaNac || null,
            email: valuesForm.mail,
            telefono: valuesForm.telefono,
            idEmpresa: idEmpresa,
            idsRol: idRoles.map((id) => parseInt(id))
        };

        try {
            const response: any = await createUser(body);

            if (response?.statusCode > 400 || response?.error) {
                handleErrors(response?.error);
            } else {
                const redirect = () => navigate('/agp/usuarios');
                dispatch(
                    showAlert({
                        title: 'Usuario creado exitosamente',
                        message:
                            'Se enviará un email al correo registrado informando al usuario de su alta.',
                        confirmText: 'Salir',
                        confirmAction: redirect
                    })
                );
            }
        } catch (error) {
            console.error('Error');
        }
    };

    return {
        userRol,
        empresa,
        fechaNac,
        valuesForm,
        rolOptions,
        creatingUser,
        companyOptions,
        setUserRol,
        setEmpresa,
        setFechaNac,
        handleSubmit,
        handleChange,
        setValuesForm
    };
}

export default useUserSave;
