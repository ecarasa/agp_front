import _ from 'lodash';
import { handleErrors } from '../../../utils/common';
import { hideAlert, showAlert } from '../../../features/slices/applicationSlice';
import { useAppDispatch } from '../../../hooks/reduxHooks';
import { useCallback, useState } from 'react';
import { useEditEmpresaMutation } from '../../../services/companyApi';
import AutocompleteConChips from '../../../components/layout/SelectConChips';
import Box from '@mui/material/Box';
import ButtonActions from '../../../components/ButtonActions';
import SectionHeader from '../../../components/SectionHeader';

function EmpresaAssignmentsForm({ setOpen, companyById, parametricData }: any) {
    const dispatch = useAppDispatch();
    const perfilOptions = parametricData && parametricData?.perfiles;
    const organizationOptions = parametricData && parametricData?.organizaciones;
    const [warningIssued, setWarningIssued] = useState(false);
    const [perfiles, setPerfiles] = useState(companyById?.perfiles);
    const [organizaciones, setOrganizaciones] = useState(companyById?.organizaciones);
    const [editEmpresaData, { isLoading: edditingUser }] = useEditEmpresaMutation();

    const submitButtonValidation = useCallback(() => {
        const getFormattedData = (data: any = []) =>
            data?.map((i: any) => ({ id: i?.id, nombre: i?.nombre }));

        return (
            _.isEqual(getFormattedData(perfiles), companyById?.perfiles) &&
            _.isEqual(getFormattedData(organizaciones), companyById?.organizaciones)
        );
    }, [companyById, perfiles, organizaciones]);

    const editarPerfiles = async (e: any) => {
        e.preventDefault();

        const body = {
            idPerfiles: perfiles?.map((p: any) => p.id),
            idsOrganizacion: organizaciones?.map((i: any) => i.id)
        };

        const response: any = await editEmpresaData({ body, idEmpresa: companyById?.id });

        if (!response?.error) {
            setOpen('');
            dispatch(
                showAlert({
                    title: 'Empresa editada correctamente',
                    icon: 'success',
                    keepMounted: true,
                    confirmText: 'Aceptar'
                })
            );
        } else {
            handleErrors(response.error);
        }
    };

    const confirmSetProfile = (value: any) => {
        setWarningIssued(true);
        setPerfiles(value);
    };

    const issueWarning = (value: any) => {
        dispatch(
            showAlert({
                title: 'Tenga en cuenta que eliminar el perfil actual puede generar conflictos de acceso en algunos usuarios.',
                icon: 'info',
                keepMounted: true,
                confirmText: 'Aceptar',
                cancelText: 'Cancelar',
                cancelAction: () => {
                    setWarningIssued(true);
                    dispatch(hideAlert());
                },
                confirmAction: confirmSetProfile,
                itemData: value
            })
        );
    };

    const handleSetProfile = (value: any) => {
        const removed: any = companyById?.perfiles?.filter(
            (i: any) => !value.find((a: any) => a.id === i.id)
        );
        if (!!removed?.length && !warningIssued) {
            issueWarning(value);
        } else {
            setPerfiles(value);
        }
    };

    return (
        <>
            <SectionHeader>
                <SectionHeader.DrawerTitle>Asignaciones</SectionHeader.DrawerTitle>
            </SectionHeader>
            <Box component="div" sx={{ padding: '0 10px', textAlign: 'left' }}>
                <p>Perfiles</p>
                <AutocompleteConChips
                    width="100%"
                    value={perfiles}
                    setValue={(value: any) => handleSetProfile(value)}
                    name="perfil_empresa"
                    options={perfilOptions}
                    required
                />

                <p>Organizaciones</p>
                <AutocompleteConChips
                    value={organizaciones || []}
                    name="idsOrganizacion"
                    setValue={setOrganizaciones}
                    width="100%"
                    options={organizationOptions}
                    required
                />

                <Box sx={{ margin: '40px 0' }}>
                    <ButtonActions
                        renderBackAction
                        confirmText="Guardar"
                        returnText="Cerrar"
                        handleClose={() => setOpen(false)}
                        flexDirection="column-reverse"
                        onClick={editarPerfiles}
                        disabled={
                            !perfiles?.length || !organizaciones?.length || submitButtonValidation()
                        }
                        loading={edditingUser}
                    />
                </Box>
            </Box>
        </>
    );
}

export default EmpresaAssignmentsForm;
