import { Box, Checkbox, Grid } from '@mui/material';
import { useIsMobile } from '../../../hooks/useIsMobile';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as React from 'react';
import AutocompleteComponent from '../../../components/layout/Autocomplete';
import ButtonActions from '../../../components/ButtonActions';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Loading from '../../../components/Loading';
import SearchInput from '../../../components/layout/SearchInput';
import SectionFormAccordion from '../../../components/SectionFormAccordion/SectionFormAccordion';
import SectionHeader from '../../../components/SectionHeader';
import TextFileElement from '../../../components/layout/TextFile';
import useRolesSave from './hooks/useRolesSave';

interface IFuncionalities {
    id: number;
    nombre: string;
}

interface ListProps {
    data: { data: { funcionalidades: IFuncionalities[] } };
    checked: number[];
    isLoading: boolean;
    setChecked: React.Dispatch<React.SetStateAction<number[]>>;
}

const CheckboxList: React.FC<ListProps> = ({ data, checked, setChecked, isLoading = true }) => {
    const handleToggle = (value: number) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }
        setChecked(newChecked);
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
                {isLoading ? (
                    <Loading size="small" />
                ) : (
                    (data?.data?.funcionalidades || [])?.map((item) => {
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
                                    <ListItemText id={labelId} primary={<>{item.nombre}</>} />
                                </ListItemButton>
                            </ListItem>
                        );
                    })
                )}
            </List>
        </>
    );
};

const CreateRole = () => {
    const {
        mainData,
        funcionalidades,
        dataPerfiles,
        valuesForm,
        creatingRole,
        checked,
        profileToSave,
        isLoading,
        isFetching,
        setChecked,
        handleChange,
        handleSubmit,
        onChangeSearch,
        setValuesForm,
        setProfileToSave
    } = useRolesSave();

    const { isMobile } = useIsMobile();
    const { t } = useTranslation('roles');
    const [selectAll, setSelectAll] = useState<boolean>(false);

    const setAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        const allChecked = mainData?.data?.funcionalidades?.map((item: { id: number }) => item.id);
        setSelectAll(!selectAll);
        setChecked(event.target.value === 'true' ? [] : allChecked);
    };

    return (
        <>
            <SectionHeader renderBack>
                <SectionHeader.Title>{t('new-rol')}</SectionHeader.Title>
            </SectionHeader>

            <Box
                component="form"
                sx={{ padding: { sm: 0, md: '0 65px' } }}
                justifyContent="center"
                autoComplete="off"
                onSubmit={(e: any) => {
                    e.preventDefault();
                    handleSubmit(null);
                }}
            >
                <SectionFormAccordion title={t('new-title')}>
                    <Grid item xs={12} sm={6}>
                        <TextFileElement
                            name={valuesForm.nombre || ''}
                            setName={setValuesForm}
                            label={t('new-label-name')}
                            required={true}
                            fullWidth
                            onChange={handleChange}
                            id="nombre"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <AutocompleteComponent
                            value={profileToSave || null}
                            onChange={setProfileToSave}
                            name="idPerfiles"
                            label={t('profile')}
                            options={dataPerfiles?.data?.perfiles || []}
                            loading={isLoading}
                            required
                        />
                    </Grid>
                </SectionFormAccordion>
                <SectionFormAccordion title={t('new-subtitle')}>
                    <Grid item xs={12} sm={6}>
                        <SearchInput
                            background={'#FFFFFF'}
                            handleSearch={onChangeSearch}
                            name="funcionalidad"
                            placeHolder={t('funcionalities')}
                            label={t('funcionalities')}
                            width="70%"
                        />
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        sm={6}
                        justifyContent={`flex-${isMobile ? 'start' : 'end'}`}
                        display="inline-flex"
                        alignItems="center"
                    >
                        <span>{t('new-all')}</span>
                        <Checkbox checked={selectAll} value={selectAll} onChange={setAll} />
                    </Grid>
                    <Grid item xs={12}>
                        <CheckboxList
                            data={mainData}
                            checked={checked}
                            isLoading={isLoading || isFetching}
                            setChecked={setChecked}
                        />
                    </Grid>
                    {!isMobile && (
                        <Grid item xs={12} sm={6}>
                            <div></div>
                        </Grid>
                    )}
                </SectionFormAccordion>

                <Grid container direction="row" justifyContent="center" alignItems="center" mt={6}>
                    <Box>
                        <ButtonActions
                            id="submit_new_role"
                            confirmText={t('new-create-btn')}
                            loading={creatingRole}
                            renderBackAction={false}
                            returnText="Volver"
                            flexDirection="column-reverse"
                        />
                    </Box>
                </Grid>
            </Box>
        </>
    );
};

export default CreateRole;
