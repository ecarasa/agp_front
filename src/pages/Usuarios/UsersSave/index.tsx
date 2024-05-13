import { Box, Grid } from '@mui/material';
import { useIsMobile } from '../../../hooks/useIsMobile';
import { useTranslation } from 'react-i18next';
import AutocompleteComponent from '../../../components/layout/Autocomplete';
import AutocompleteConChips from '../../../components/layout/SelectConChips';
import ButtonActions from '../../../components/ButtonActions';
import DatePickerComponent from '../../../components/layout/DatePicker';
import Input from '../../../components/Input/Input';
import SectionFormAccordion from '../../../components/SectionFormAccordion/SectionFormAccordion';
import SectionHeader from '../../../components/SectionHeader';
import useUserSave from './hooks/useUserSave';

function UsersSave() {
    const {
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
        handleChange,
        handleSubmit,
        setValuesForm
    } = useUserSave();

    const { isMobile } = useIsMobile();
    const { t } = useTranslation('userForm');

    return (
        <>
            <SectionHeader renderBack>
                <SectionHeader.Title>{t('title')}</SectionHeader.Title>
            </SectionHeader>

            <Box component="div" sx={{ padding: { sm: 0, md: '0 65px' } }} justifyContent="center">
                <SectionFormAccordion title={t('subtitulo1')}>
                    <Grid item xs={12} sm={6}>
                        <Input
                            value={valuesForm?.usuario || ''}
                            name="usuario"
                            onChange={handleChange}
                            label={`${t('user')}`}
                            required
                        />
                    </Grid>
                    {!isMobile && (
                        <Grid item xs={12} sm={6}>
                            <div></div>
                        </Grid>
                    )}
                    <Grid item xs={12} sm={6}>
                        <Input
                            value={valuesForm?.nombre || ''}
                            name="nombre"
                            onChange={handleChange}
                            label={`${t('name')}`}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Input
                            value={valuesForm?.apellido || ''}
                            name="apellido"
                            onChange={handleChange}
                            label={`${t('lname')}`}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Input
                            value={valuesForm?.nroIdUsuario || ''}
                            name="nroIdUsuario"
                            onChange={handleChange}
                            label={`${t('idUser')}`}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <DatePickerComponent
                            name="fecha_nac"
                            label={t('nacimiento')}
                            value={fechaNac || null}
                            setValue={(value: any) => setFechaNac(value)}
                            width="100%"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Input
                            value={valuesForm?.mail || ''}
                            name="mail"
                            onChange={handleChange}
                            label={`${t('mail')}`}
                            required
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Input
                            value={valuesForm?.telefono || ''}
                            name="telefono"
                            onChange={handleChange}
                            label={`${t('phone')}`}
                            required
                        />
                    </Grid>
                </SectionFormAccordion>
                <SectionFormAccordion title={t('subtitulo2')}>
                    <Grid item xs={12} sm={6}>
                        <AutocompleteComponent
                            value={empresa}
                            onChange={setEmpresa}
                            label={t('company')}
                            options={companyOptions || []}
                            name="nombre_empresa"
                            required
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <AutocompleteConChips
                            value={userRol || ''}
                            setValue={setUserRol}
                            label={t('userRol')}
                            width="100%"
                            placeholder={t('')}
                            options={
                                rolOptions?.filter((i: any) =>
                                    empresa?.perfiles?.find((p: any) => p.id === i.perfil.id)
                                ) || []
                            }
                            name="rol_usuario"
                            disabled={!empresa}
                            required
                        />
                    </Grid>
                </SectionFormAccordion>

                <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    sx={{ marginTop: '1rem' }}
                >
                    <Box sx={{ '& > :not(style)': { m: 6 } }}>
                        <ButtonActions
                            id="submit_new_user"
                            confirmText={t('userButton')}
                            loading={creatingUser}
                            flexDirection="column-reverse"
                            onClick={handleSubmit}
                        />
                    </Box>
                </Grid>
            </Box>
        </>
    );
}

export default UsersSave;
