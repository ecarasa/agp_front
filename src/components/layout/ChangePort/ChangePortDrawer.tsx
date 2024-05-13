import {
    Box,
    CircularProgress,
    Drawer,
    FormControl,
    Grid,
    InputAdornment,
    InputLabel,
    MenuItem,
    Select
} from '@mui/material';
import ButtonActions from '../../ButtonActions';
import CloseButton from '../../CloseButton';
import SectionHeader from '../../SectionHeader';
import BackdropComponent from '../../Backdrop/BackdropComponent';

function ChangePortDrawer(props: any) {
    const {
        ports,
        selected,
        handleChangePort,
        loadingUserPorts,
        fetchingUserPorts,
        openPortsDrawer,
        handleOpenPortsDrawer,
        isMobile,
        user,
        handleSubmit,
        changingPort,
        loadingUserData
    } = props;

    return (
        <>
            <Drawer
                anchor="right"
                open={openPortsDrawer}
                className="edition-drawer"
                onClose={handleOpenPortsDrawer}
            >
                <Box
                    sx={{
                        marginTop: '64px',
                        width: isMobile ? '100vw' : 420,
                        height: 'auto',
                        padding: '20px',
                        '& .MuiFormControl-root': { m: '8px 0', width: '100%' }
                    }}
                    role="presentation"
                >
                    <CloseButton position="right" onClose={handleOpenPortsDrawer} />
                    <Box
                        component="div"
                        sx={{
                            gap: '10px',
                            display: 'grid',
                            textAlign: 'center',
                            '& p': { fontSize: '18px', marginTop: 0 }
                        }}
                    >
                        <SectionHeader>
                            <SectionHeader.DrawerTitle>
                                Seleccione puerto a operar
                            </SectionHeader.DrawerTitle>
                        </SectionHeader>
                        <Grid container spacing={2} mt={2}>
                            <Grid item xs={12} textAlign="left">
                                <FormControl fullWidth variant="outlined" size="medium">
                                    <InputLabel htmlFor="puertos">Puertos</InputLabel>
                                    <Select
                                        labelId="puertos"
                                        label="Puertos"
                                        name="idOrganizacion"
                                        value={selected || ''}
                                        onChange={handleChangePort}
                                        endAdornment={
                                            loadingUserPorts || fetchingUserPorts ? (
                                                <InputAdornment
                                                    sx={{ marginRight: '20px' }}
                                                    position="end"
                                                >
                                                    <CircularProgress size={20} />
                                                </InputAdornment>
                                            ) : null
                                        }
                                    >
                                        <MenuItem key={-1} value={''}>
                                            Seleccionar
                                        </MenuItem>
                                        {ports?.map((item: any) => (
                                            <MenuItem
                                                key={item?.id}
                                                value={item?.id}
                                                disabled={user?.organizacion?.id === item?.id}
                                            >
                                                {item?.nombre}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Box>
                    <Box className="flex-center" flexDirection="column" display="flex" mt={8}>
                        <ButtonActions
                            confirmText="Aceptar"
                            renderBackAction
                            returnText="Cancelar"
                            onClick={handleSubmit}
                            handleClose={handleOpenPortsDrawer}
                            flexDirection="column-reverse"
                            disabled={!selected}
                            loading={changingPort}
                        />
                    </Box>
                </Box>
            </Drawer>
            <BackdropComponent loading={loadingUserData} />
        </>
    );
}

export default ChangePortDrawer;
