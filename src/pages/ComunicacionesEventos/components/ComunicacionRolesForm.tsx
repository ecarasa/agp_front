import { useAppDispatch } from '../../../hooks/reduxHooks';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import AutocompleteConChips from '../../../components/layout/SelectConChips';
import Box from '@mui/material/Box';
import ButtonActions from '../../../components/ButtonActions';
import FormControl from '@mui/material/FormControl';
import { setStorageLoading } from '../../../features/slices/applicationSlice';
import { useEditEmpresaMutation } from '../../../services/companyApi';
import { handleErrors } from '../../../utils/common';

function EmpresaPerfilesForm({ setOpen, setAbrirCard, companyData, parametricData }: any) {
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useAppDispatch();
    const perfilOptions = parametricData && parametricData?.perfiles;

    const [perfiles, setPerfiles] = useState(companyData?.perfiles);
    const [editEmpresaData, { isLoading: edditingUser }] = useEditEmpresaMutation();

    const editarPerfiles = async (e: any) => {
        e.preventDefault();
        const body = { idPerfiles: perfiles.map((p: any) => p.id) };
        try {
            dispatch(setStorageLoading(true));
            const response: any = await editEmpresaData({ body, idEmpresa: companyData?.id });
            if (response?.error) {
                handleErrors(response.error);
            } else {
                setOpen('');
                setAbrirCard(false);
                enqueueSnackbar('Empresa editada exitosamente!', { variant: 'success' });
            }
        } catch (error) {
            console.log(error);
        } finally {
            dispatch(setStorageLoading(false));
        }
    };

    return (
        <>
            <p style={{ textAlign: 'left' }}>Edición de Empresa</p>
            <Box component="div" sx={{ padding: '0 10px' }}>
                <FormControl sx={{ width: '100%' }}>
                    <AutocompleteConChips
                        options={perfilOptions}
                        width={'100%'}
                        size={'small'}
                        value={perfiles}
                        setValue={setPerfiles}
                        name="perfil_empresa"
                    />
                </FormControl>
                <Box sx={{ margin: '40px 0' }}>
                    <ButtonActions
                        renderBackAction
                        returnText="Cerrar"
                        handleClose={() => setOpen(false)}
                        flexDirection="column-reverse"
                        onClick={editarPerfiles}
                    />
                </Box>
            </Box>
        </>
    );
}

export default EmpresaPerfilesForm;
