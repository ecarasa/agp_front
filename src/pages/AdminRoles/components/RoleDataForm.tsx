import _ from 'lodash';
import { Box, Checkbox, Grid, Typography, Skeleton } from '@mui/material';
import { useIsMobile } from '../../../hooks/useIsMobile';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import AutocompleteComponent from '../../../components/layout/Autocomplete';
import ButtonActions from '../../../components/ButtonActions';
import Input from '../../../components/Input/Input';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Loading from '../../../components/Loading';
import SearchInput from '../../../components/layout/SearchInput';
import SectionFormAccordion from '../../../components/SectionFormAccordion/SectionFormAccordion';
import SectionHeader from '../../../components/SectionHeader';
import useRolesHooks from '../RolesSave/hooks/useRolesSave';

interface IFuncionalities {
    id: number;
    nombre: string;
}

interface ListProps {
    data: { data: { funcionalidades: IFuncionalities[] } };
    checked: number[];
    isLoading: boolean;
    setModifiedValues: any;
    setChecked: React.Dispatch<React.SetStateAction<number[]>>;
}

const CheckboxList: React.FC<ListProps> = ({
    data,
    checked,
    setChecked,
    setModifiedValues,
    isLoading = true
}) => {
    const handleToggle = (value: number) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }
        setChecked(newChecked);
        setModifiedValues(newChecked);
    };

    return (
        <>
            <List
                dense
                sx={{
                    width: '100%',
                    bgcolor: 'background.paper',
                    position: 'relative',
                    overflow: 'auto',
                    maxHeight: 500,
                    borderRadius: 3,
                    border: '1px solid black',
                    paddingX: 2
                }}
            >
                {(data?.data?.funcionalidades || [])?.map((item) => {
                    const labelId = `checkbox-list-secondary-label-${item.id}`;
                    return (
                        <ListItem
                            key={item.id}
                            secondaryAction={
                                <Checkbox
                                    edge="end"
                                    onChange={handleToggle(item.id)}
                                    checked={checked.indexOf(item.id) !== -1}
                                    inputProps={{ 'aria-labelledby': labelId }}
                                />
                            }
                            disablePadding
                        >
                            <ListItemButton
                                sx={{ borderBottom: '1px solid', borderColor: '#BCBCBC' }}
                            >
                                <ListItemText
                                    id={labelId}
                                    primary={
                                        isLoading ? (
                                            <Box sx={{ width: '100%', height: 20 }}>
                                                <Skeleton animation="wave" />
                                            </Box>
                                        ) : (
                                            <>{item.nombre}</>
                                        )
                                    }
                                />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
        </>
    );
};

const UpdateRole = () => {
    const {
        mainData,
        dataPerfiles,
        valuesForm,
        updatingRole,
        checked,
        profileToSave,
        isLoading,
        isFetching,
        loadingRol,
        rolData,
        setModifiedValues,
        setChecked,
        handleChange,
        handleSubmit,
        onChangeSearch,
        setValuesForm,
        setProfileToSave,
        loadData
    } = useRolesHooks();

    const { isMobile } = useIsMobile();
    const { t } = useTranslation('roles');
    const { id } = useParams();

    const [selectAll, setSelectAll] = useState<boolean>(false);

    const setAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        const allChecked = mainData?.data?.funcionalidades?.map((item: { id: number }) => item.id);
        setSelectAll(!selectAll);
        setChecked(event.target.value === 'true' ? [] : allChecked);
    };

    useEffect(() => {
        if (id) loadData(id);
        // eslint-disable-next-line
    }, [id]);

    useEffect(() => {
        if (rolData) {
            const { nombre, funcionalidades, perfil } = rolData;
            const idP = funcionalidades?.map((f: any) => f.id);
            setChecked(idP);
            setValuesForm({ nombre, idPerfil: null, idFuncionalidades: funcionalidades });
            setProfileToSave(!_.isEmpty(perfil) ? perfil : '');
        }
        // eslint-disable-next-line
    }, [rolData]);

    return (
        <>
            <SectionHeader renderBack>
                <SectionHeader.Title>{t('update-rol')}</SectionHeader.Title>
            </SectionHeader>
            {loadingRol ? (
                <Loading />
            ) : (
                <Box
                    component="form"
                    sx={{ padding: { sm: 0, md: '0 65px' } }}
                    justifyContent="center"
                    autoComplete="off"
                    onSubmit={(e: any) => {
                        e.preventDefault();
                        handleSubmit(id!);
                    }}
                >
                    <SectionFormAccordion title={t('new-title')}>
                        <Grid item xs={12} sm={6}>
                            <Input
                                label="Nombre de Rol"
                                name="nombre"
                                value={valuesForm?.nombre || ''}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <AutocompleteComponent
                                value={profileToSave || ''}
                                onChange={setProfileToSave}
                                name="idPerfiles"
                                label={t('profile')}
                                options={dataPerfiles?.data?.perfiles || []}
                                loading={isLoading}
                                disabled={!!id}
                                required
                            />
                        </Grid>
                    </SectionFormAccordion>
                    <SectionFormAccordion title={t('new-subtitle')}>
                        <Grid item xs={12} sm={6}>
                            <SearchInput
                                background="#FFFFFF"
                                handleSearch={onChangeSearch}
                                name="funcionalidad"
                                placeHolder={t('funcionalities')}
                                label={t('funcionalities')}
                                width="70%"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'end',
                                    gap: 1
                                }}
                            >
                                <Typography>{t('new-all')}</Typography>
                                <Checkbox checked={selectAll} value={selectAll} onChange={setAll} />
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <CheckboxList
                                data={mainData}
                                checked={checked}
                                isLoading={isLoading || isFetching}
                                setChecked={setChecked}
                                setModifiedValues={setModifiedValues}
                            />
                        </Grid>
                        {!isMobile && (
                            <Grid item xs={12} sm={6}>
                                <div></div>
                            </Grid>
                        )}
                    </SectionFormAccordion>

                    <Grid
                        container
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                        mt={6}
                    >
                        <Box>
                            <ButtonActions
                                id="submit_update_role"
                                confirmText={t('update-rol')}
                                loading={updatingRole}
                                flexDirection="column-reverse"
                            />
                        </Box>
                    </Grid>
                </Box>
            )}
        </>
    );
};

export default UpdateRole;
