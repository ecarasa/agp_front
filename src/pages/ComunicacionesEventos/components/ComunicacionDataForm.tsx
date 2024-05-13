import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { Box, Grid, Checkbox, Divider } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { handleErrors } from '../../../utils/common';
import {
    selectCurrentCommunication,
    setStorageLoading
} from '../../../features/slices/applicationSlice';
import { useAppDispatch, useAppSelector } from '../../../hooks/reduxHooks';
import { useEffect, useState } from 'react';
import ButtonActions from '../../../components/ButtonActions';
import Input from '../../../components/Input/Input';
import SectionHeader from '../../../components/SectionHeader';
import {
    useEditComunicacionEventosMutation,
    useEditComunicacionEventosUsersMutation,
    useEditComunicacionEventosPerfilMutation,
    companyApi
} from '../../../services/companyApi';
import { useGetCompanyRolesQuery } from '../../../services/CreateUser';
import { useGetUsersQuery } from '../../../services/usersApi';
import { useIsMobile } from '../../../hooks/useIsMobile';
import { useLazyGetRolesQuery } from '../../../services/rolesApi';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AutocompleteConChipsV2 from '../../../components/layout/SelectConChipsGral';
import CommunicationModal from './Modal';
import EmailIcon from '@mui/icons-material/Email';
import InfoIcon from '@mui/icons-material/Info';
import NotificationImportantIcon from '@mui/icons-material/NotificationImportant';
import SectionFormAccordion from '../../../components/SectionFormAccordion/SectionFormAccordion';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import VisibilityIcon from '@mui/icons-material/Visibility';

type IRoles = { id: number; nombre: string };

type ValueProps = {
    options: [];
    users?: any;
    roles?: IRoles[];
    data?: any;
    id?: number;
};

const ComunicacionesEvtDataForm = () => {
    const { t } = useTranslation('communications');

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { isMobile } = useIsMobile();

    const commData: any = useAppSelector(selectCurrentCommunication);

    const [editComunicacionEvData] = useEditComunicacionEventosMutation();
    const [editComunicacionEvUser] = useEditComunicacionEventosUsersMutation();
    const [editComunicacionEvPerfil] = useEditComunicacionEventosPerfilMutation();
    const [getRolesByProfile] = useLazyGetRolesQuery();
    const { data: parametricData } = useGetCompanyRolesQuery();

    const [modifiedValues, setModifiedValues] = useState<any>(null);
    const [modifiedUserValues, setModifiedUserValues] = useState<any>(null);
    const [modalOpen, setModalOpen] = useState<boolean>(false);

    const [data, setData] = useState<any>({});
    const [type, setType] = useState<string>('short');

    const rolsOptions: any = parametricData && parametricData.data.roles;

    const [roles, setRoles] = useState<any>([]);
    const [users, setUsers] = useState<any>([]);
    const [chipClicked, setchipClicked] = useState(false);
    const [rolesToSave, setRolesToSave] = useState<any>([]);
    const [savingData, setSavingData] = useState(false);
    const [rolsOpt, setRolsOpt] = useState<any>();

    const { data: allUsers, isLoading } = useGetUsersQuery({ skip: 0, take: 100 }); //TODO: check pagination here!!!!

    const handleChange = (e: any) => {
        let { name, value } = e?.target;
        if (value === commData[name]) {
            let newObject = { ...modifiedValues };
            if (newObject[name]) delete newObject[name];
            setModifiedValues(newObject);
        } else {
            setModifiedValues({ ...modifiedValues, [name]: value });
        }
        setData({ ...data, [name]: value });
    };

    const switchHandler = (event: any) => {
        setModifiedValues({ ...modifiedValues, activo: event.target.checked });
        setData({ ...data, activo: event.target.checked });
    };

    const handleOpenModal = (typeData: string) => {
        setModalOpen(true);
        setType(typeData);
    };

    const saveUsers = async (): Promise<any> => {
        if ((modifiedUserValues?.length && users?.length) || chipClicked) {
            const body = { usuariosIds: users.map((u: any) => u.id) };
            const evtUser: any = await editComunicacionEvUser({ body, id: data.id });
            if (evtUser?.error) {
                handleErrors(evtUser.error);
                throw new Error(evtUser.error);
            }
        }
    };

    const saveRoles = async (): Promise<any> => {
        if (rolesToSave?.length) {
            return await Promise.all(
                rolesToSave.map(async (element: any) => {
                    try {
                        const body = {
                            notificacionesRolesIds: element.roles.map((u: any) => u.id)
                        };
                        const evtCompany: any = await editComunicacionEvPerfil({
                            body,
                            idParametroEventoPerfil: element.id
                        });
                        if (evtCompany?.error) {
                            handleErrors(evtCompany.error);
                            throw new Error(evtCompany.error);
                        }
                    } catch (error: any) {
                        throw error;
                    }
                })
            );
        }
    };

    const saveCommonData = async (): Promise<any> => {
        if (modifiedValues) {
            const body = {
                titulo: modifiedValues.titulo,
                mensaje: modifiedValues.mensaje,
                mensajeCorto: modifiedValues.mensajeCorto,
                urlRedireccion: modifiedValues?.urlRedireccion,
                email: modifiedValues?.mail,
                push: modifiedValues?.push,
                notificacion: modifiedValues?.notificacion,
                activo: modifiedValues.activo
            };

            const evtGralData: any = await editComunicacionEvData({ body, id: data.id });

            if (evtGralData?.error) {
                handleErrors(evtGralData.error);
                throw new Error(evtGralData.error);
            }
            return evtGralData;
        }
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        dispatch(setStorageLoading(true));
        setSavingData(true);
        try {
            await saveUsers();
            await saveRoles();
            await saveCommonData();

            setSavingData(false);
            enqueueSnackbar('Editado correctamente', { variant: 'success' });
            dispatch(setStorageLoading(false));
            dispatch(companyApi.util.resetApiState()); // puede no ser necesario
            navigate(-1);
        } catch (error) {
            setSavingData(false);
            dispatch(setStorageLoading(false));
        }
    };

    const getValue = ({ options, users }: ValueProps) => {
        if (!options || !users) return [];

        const res = users.filter((user: any) =>
            options.some((o: any) => o.usuario.includes(user.usuario))
        );

        return res?.map((u: any) => {
            const { usuario, nombre } = u;
            return {
                ...u,
                nombre: nombre.includes(`(${usuario})`) ? nombre : `${nombre} (${usuario})`
            };
        });
    };

    const formatOptions = (options: any) => {
        return options?.map((u: any) => {
            const { usuario, nombre } = u;
            return { ...u, nombre: `${nombre} (${usuario})` };
        });
    };

    const getValueForRoles = (options: any, data: any, id: number) => {
        if (!options || !data) return [];

        const filtered = data?.filter((d: any) => d?.id === id);
        return filtered && filtered.length > 0 ? filtered[0].roles : [];
    };

    const formatResponse = ({ options, data }: ValueProps): IRoles[] => {
        let arr: any = [];
        data.forEach((n: any) => {
            let roleArray: any = [];
            n?.notificacionesRoles.forEach((r: any) => {
                const found = options.filter((o: any) => o.id === r?.rol?.id);
                if (found) roleArray = [...roleArray, ...found];
            });
            arr = [...arr, { id: n.id, roles: roleArray }];
        });
        return arr;
    };

    const updateState = (id: number, newData: any) => {
        if (!rolesToSave.length) return [{ id, roles: newData }];
        return rolesToSave.map((obj: any) => {
            return obj.id === id ? { ...obj, roles: newData } : obj;
        });
    };

    const getRolesOptionByProfile = (id: string) => {
        const filtered = rolsOpt?.filter((op: any) => op.idPerfil === id);
        return filtered?.length > 0 ? filtered[0]?.info : [];
    };

    const fetchPerfiles = async (notificacionesEmpresas: any) => {
        const promiseResponse: any = await Promise.all(
            notificacionesEmpresas.map(async (n: any) => {
                try {
                    const resp = await getRolesByProfile({
                        idPerfil: n.prefil.id,
                        skip: 0,
                        take: 10
                    });
                    return { idPerfil: n.prefil.id, info: resp?.data?.data?.data };
                } catch (error) {
                    return [];
                }
            })
        );
        setRolsOpt(promiseResponse);
    };

    useEffect(() => {
        if (_.isEmpty(commData)) {
            navigate('/agp/comunicaciones-eventos');
        } else if (commData) {
            setData(commData);
            const { notificacionesUsuarios, notificacionesEmpresas } = commData;
            fetchPerfiles(notificacionesEmpresas);
            const format = formatResponse({
                options: rolsOptions || [],
                data: notificacionesEmpresas
            });
            setUsers(notificacionesUsuarios.map((u: any) => u.usuario));
            setRoles(format);
        }
        // eslint-disable-next-line
    }, [commData]);

    return (
        <>
            <SectionHeader renderBack>
                <SectionHeader.Title>{t('updateTitleEv')}</SectionHeader.Title>
            </SectionHeader>

            <Box
                component="form"
                sx={{ padding: { sm: 0, md: '0 65px' } }}
                justifyContent="center"
                autoComplete="off"
                onSubmit={handleSubmit}
            >
                <SectionFormAccordion title={t('messageText')}>
                    <Grid item xs={12}>
                        <Grid
                            container
                            spacing={3}
                            mb={2}
                            columnSpacing={{ xs: 12, sm: 6, lg: 24 }}
                        >
                            <Grid item xs={12} sm={6}>
                                <Typography sx={{ mt: 1 }}>
                                    {data?.tipoEvento?.evento || ''}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <>
                                    {t('status')}
                                    <Switch
                                        checked={data?.activo || false}
                                        onChange={switchHandler}
                                        inputProps={{ 'aria-label': 'controlled' }}
                                        color="primary"
                                    />
                                </>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Input
                            label="Título"
                            name="titulo"
                            value={data?.titulo || ''}
                            onChange={handleChange}
                            required
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'end' }}>
                            <div onClick={() => handleOpenModal('title')}>
                                <VisibilityIcon fontSize="small" />
                            </div>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Mensaje"
                            name="mensaje"
                            value={data?.mensaje || ''}
                            minRows={3}
                            maxRows={6}
                            variant="outlined"
                            required
                            multiline
                            fullWidth={true}
                            onChange={handleChange}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'end' }}>
                            <div onClick={() => handleOpenModal('long')}>
                                <VisibilityIcon fontSize="small" />
                            </div>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Mensaje Corto"
                            name="mensajeCorto"
                            value={data?.mensajeCorto || ''}
                            minRows={3}
                            maxRows={6}
                            variant="outlined"
                            required
                            multiline
                            fullWidth={true}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12}></Grid>
                </SectionFormAccordion>
                <SectionFormAccordion title={t('warning')}>
                    <Grid item xs={12}>
                        <Box
                            sx={{
                                borderRadius: 2,
                                border: '1px solid #9E9E9E',
                                paddingX: isMobile ? 1 : 4,
                                paddingY: 1,
                                display: 'flex',
                                flexDirection: isMobile ? 'column' : 'row',
                                justifyContent: 'center'
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    paddingLeft: isMobile ? 3 : 0,
                                    alignItems: isMobile ? 'start' : 'center',
                                    flexDirection: isMobile ? 'column' : 'row',
                                    gap: isMobile ? 1 : 10
                                }}
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1
                                    }}
                                >
                                    <Typography>Notificación</Typography>
                                    <NotificationImportantIcon
                                        sx={{
                                            color: `${data?.notificacion}?'#3761ED':'#B2B2B2`
                                        }}
                                        fontSize="small"
                                    />
                                    <Checkbox
                                        checked={data?.notificacion || false}
                                        value={data?.notificacion || false}
                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                            setModifiedValues({
                                                ...modifiedValues,
                                                notificacion: event.target.checked
                                            });

                                            setData({
                                                ...data,
                                                notificacion: event.target.checked
                                            });
                                        }}
                                    />
                                </Box>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1
                                    }}
                                >
                                    <Typography>Push</Typography>
                                    <InfoIcon
                                        sx={{
                                            color: `${data?.push}?'#3761ED':'#B2B2B2`
                                        }}
                                        fontSize="small"
                                    />
                                    <Checkbox
                                        name="push"
                                        checked={data?.push || false}
                                        value={data?.push || false}
                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                            setModifiedValues({
                                                ...modifiedValues,
                                                push: event.target.checked
                                            });
                                            setData({
                                                ...data,
                                                push: event.target.checked
                                            });
                                        }}
                                    />
                                </Box>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1
                                    }}
                                >
                                    <Typography>Mail</Typography>
                                    <EmailIcon
                                        sx={{
                                            color: `${data?.mail}?'#3761ED':'#B2B2B2`
                                        }}
                                        fontSize="small"
                                    />
                                    <Checkbox
                                        name="mail"
                                        checked={data?.mail || false}
                                        value={data?.mail || false}
                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                            setModifiedValues({
                                                ...modifiedValues,
                                                mail: event.target.checked
                                            });
                                            setData({
                                                ...data,
                                                mail: event.target.checked
                                            });
                                        }}
                                    />
                                </Box>
                            </Box>
                        </Box>
                    </Grid>
                </SectionFormAccordion>
                <SectionFormAccordion title={t('destinatary')}>
                    <Grid item xs={12}>
                        <Grid container spacing={3} columnSpacing={{ xs: 12, sm: 6, lg: 24 }}>
                            <Grid item xs={12} sm={6} display={{ xs: 'none', sm: 'block' }}>
                                <p style={{ textAlign: 'center', fontWeight: 600 }}>Perfil</p>
                            </Grid>
                            <Grid item xs={12} sm={6} display={{ xs: 'none', sm: 'block' }}>
                                <p style={{ textAlign: 'center', fontWeight: 600 }}>Roles</p>
                            </Grid>
                        </Grid>
                        {data &&
                            data.notificacionesEmpresas?.length > 0 &&
                            data.notificacionesEmpresas?.map((items: any) => (
                                <div key={uuidv4()}>
                                    <Grid
                                        container
                                        spacing={3}
                                        mb={2}
                                        mt={2}
                                        columnSpacing={{ xs: 12, sm: 6, lg: 24 }}
                                    >
                                        <Grid item xs={12} sm={6}>
                                            {items.prefil.nombre}
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <AutocompleteConChipsV2
                                                options={getRolesOptionByProfile(items.prefil.id)} //{rolsOptions}
                                                width={'100%'}
                                                size={'large'}
                                                onChange={(event: any, newValue: any) => {
                                                    const data = updateState(
                                                        items.id,
                                                        newValue.filter((f: any) => !f?.roles)
                                                    );
                                                    setRoles(data);
                                                    setRolesToSave(data);
                                                }}
                                                value={getValueForRoles(
                                                    // rolsOptions,
                                                    getRolesOptionByProfile(items.prefil.id),
                                                    roles,
                                                    items.id
                                                )}
                                                name={`roles_edit_autocomplete_${items.id}`}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Divider />
                                </div>
                            ))}
                    </Grid>
                    <Grid item xs={12}>
                        <Grid
                            container
                            spacing={3}
                            mb={2}
                            columnSpacing={{ xs: 12, sm: 6, lg: 24 }}
                        >
                            <Grid item xs={12} sm={6}>
                                <>
                                    <p style={{ textAlign: 'left', fontWeight: 600 }}>Usuarios</p>
                                </>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <AutocompleteConChipsV2
                                    options={formatOptions(allUsers?.data?.data)}
                                    loading={isLoading}
                                    width={'100%'}
                                    size={'large'}
                                    value={getValue({
                                        options: allUsers?.data?.data,
                                        users
                                    })}
                                    onChange={(event: any, newValue: any) => {
                                        setUsers([...newValue]);
                                        setModifiedUserValues([...newValue]);
                                        setchipClicked(true);
                                    }}
                                    name="users_edit_chips"
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </SectionFormAccordion>

                <Grid container direction="row" justifyContent="center" alignItems="center" mt={6}>
                    <Box>
                        <ButtonActions
                            id="update_communication_event"
                            disabled={
                                _.isEmpty(modifiedValues) &&
                                _.isEmpty(modifiedUserValues) &&
                                _.isEmpty(rolesToSave) &&
                                !chipClicked
                            }
                            confirmText={t('accept')}
                            loading={savingData}
                            renderBackAction={false}
                            returnText="Volver"
                            flexDirection="column-reverse"
                        />
                    </Box>
                </Grid>
            </Box>
            <CommunicationModal
                open={modalOpen}
                setOpen={setModalOpen}
                type={type}
                remplazoMensaje={commData?.remplazoMensaje}
                remplazoTitulo={commData?.remplazoTitulo}
            />
        </>
    );
};
export default ComunicacionesEvtDataForm;
