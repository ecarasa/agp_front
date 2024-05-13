import { Box, Grid } from '@mui/material';
import { INTEGERS_UNIT } from '../../../constants/regex';
import { useIsMobile } from '../../../hooks/useIsMobile';
import { useTranslation } from 'react-i18next';
import AutocompleteComponent from '../../../components/layout/Autocomplete';
import AutocompleteConChips from '../../../components/layout/SelectConChips';
import ButtonActions from '../../../components/ButtonActions';
import Input from '../../../components/Input/Input';
import SectionFormAccordion from '../../../components/SectionFormAccordion/SectionFormAccordion';
import SectionHeader from '../../../components/SectionHeader';
import useEmpresaSave from './hooks/useEmpresaSave';

function EmpresaSave() {
    const {
        dataFiscal,
        dataPerfiles,
        valuesForm,
        creatingCompany,
        companyOptionsPerfiles,
        organizationOptions,
        companyOptionsFiscales,
        citiesByCountryId,
        loadingCities,
        fetchingCities,
        countries,
        errors,
        propertyData,
        setPropertyData,
        setDataFiscal,
        setDataPerfiles,
        handleChange,
        handleSubmit,
        setValuesForm,
        getValue
    } = useEmpresaSave();

    const { isMobile } = useIsMobile();
    const { t } = useTranslation('userForm');

    return (
        <>
            <SectionHeader renderBack>
                <SectionHeader.Title>{t('empresa.add.title')}</SectionHeader.Title>
            </SectionHeader>

            <Box
                component="form"
                sx={{ padding: { sm: 0, md: '0 65px' } }}
                justifyContent="center"
                autoComplete="off"
                onSubmit={handleSubmit}
            >
                <SectionFormAccordion title={t('empresa.add.subtitulo1')}>
                    <Grid item xs={12} sm={6}>
                        <Input
                            value={valuesForm?.nombre || ''}
                            name="nombre"
                            onChange={handleChange}
                            label={`${t('empresa.add.name')}`}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Input
                            value={valuesForm?.nombreComercial || ''}
                            name="nombreComercial"
                            onChange={handleChange}
                            label={`${t('empresa.add.nameComercial')}`}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <AutocompleteComponent
                            value={dataFiscal}
                            onChange={setDataFiscal}
                            label={t('empresa.add.categoriafiscal')} //categoria fiscal
                            options={companyOptionsFiscales || []}
                            name="idCategoriaFiscal"
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Input
                            value={valuesForm?.identificacionFiscal || ''}
                            name="identificacionFiscal"
                            onChange={handleChange}
                            label={`${t('empresa.add.idFiscal')}`}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <Input
                            value={valuesForm?.domicilio || ''}
                            name="domicilio"
                            onChange={handleChange}
                            label={`${t('empresa.add.domicilio')}`}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <AutocompleteComponent
                            value={getValue({
                                options: countries,
                                id: propertyData?.idPais
                            })}
                            onChange={(e: any) => {
                                setPropertyData({
                                    ...propertyData,
                                    idPais: e?.id,
                                    idCiudad: ''
                                });
                            }}
                            label={t('empresa.add.pais')}
                            name="idPais"
                            errors={errors}
                            templateLabel={(option: any) => option.nombre}
                            options={countries || []}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <AutocompleteComponent
                            value={propertyData?.idCiudad || ''}
                            onChange={(e: any) => {
                                setPropertyData({
                                    ...propertyData,
                                    idCiudad: e
                                });
                            }}
                            name="idCiudad"
                            label={t('empresa.add.ciudad')}
                            options={citiesByCountryId?.ciudades || []}
                            loading={loadingCities || fetchingCities}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Input
                            value={valuesForm?.email || ''}
                            name="email"
                            onChange={handleChange}
                            label={`${t('empresa.add.mail')}`}
                            required
                        />
                        <Box sx={{ marginLeft: 1, color: '#f00' }}>{errors?.email?.msg}</Box>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Input
                            value={valuesForm?.telefono || ''}
                            name="telefono"
                            label={`${t('empresa.add.phone')}`}
                            onChange={(e: any) => {
                                let value = e.target.value;
                                if (
                                    (INTEGERS_UNIT.test(value) || value === '') &&
                                    value?.length < 25
                                ) {
                                    handleChange(e);
                                }
                            }}
                            required
                        />
                        <Box sx={{ marginLeft: 1, color: '#f00' }}>{errors?.telefono?.msg}</Box>
                    </Grid>
                </SectionFormAccordion>
                <SectionFormAccordion title={t('subtitulo2')}>
                    <Grid item xs={12} sm={6}>
                        <AutocompleteConChips
                            value={dataPerfiles || []}
                            setValue={setDataPerfiles}
                            label={t('empresa.add.perfil')} //Perfil Empresa
                            width={'100%'}
                            options={companyOptionsPerfiles || []}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <AutocompleteConChips
                            value={valuesForm?.idsOrganizacion || []}
                            name="idsOrganizacion"
                            setValue={(value: any) =>
                                setValuesForm({
                                    ...valuesForm,
                                    idsOrganizacion: value
                                })
                            }
                            label="Organizaciones"
                            width="100%"
                            options={organizationOptions || []}
                            required
                        />
                    </Grid>
                </SectionFormAccordion>

                <Box mt={6} mb={2}>
                    <ButtonActions
                        id="submit_new_company"
                        confirmText={t('empresa.add.btnCaption')}
                        loading={creatingCompany}
                        renderBackAction={false}
                        returnText="Volver"
                        flexDirection="column-reverse"
                    />
                </Box>
            </Box>
        </>
    );
}

export default EmpresaSave;
