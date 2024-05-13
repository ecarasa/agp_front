import { Box, Drawer } from '@mui/material';
import { getDateTime } from '../../../../utils/common';
import { useIsMobile } from '../../../../hooks/useIsMobile';
import { Link } from 'react-router-dom';
import Button from '../../../../components/button/Button';
import CloseButton from '../../../../components/CloseButton';
import NotificationIcons from './NotificationIcons';
import SectionHeader from '../../../../components/SectionHeader';

function NotificationDrawer({ openDrawer, handleCloseDrawer, selected }: any) {
    const { isMobile } = useIsMobile();

    return (
        <>
            <Drawer
                anchor="right"
                open={openDrawer}
                className="edition-drawer"
                onClose={handleCloseDrawer}
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
                    <CloseButton position="right" onClose={handleCloseDrawer} />
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
                                {getDateTime(selected?.fechaAlta)}
                            </SectionHeader.DrawerTitle>
                        </SectionHeader>
                        <Box sx={{ '& svg': { fontSize: '60px' }, marginTop: '15px' }}>
                            <NotificationIcons group={selected?.agrupador?.id} />
                        </Box>
                        <p style={{ marginBottom: 0 }}>
                            <b>{selected?.agrupador?.nombre}</b>
                        </p>
                        <p>{selected?.titulo}</p>
                        <p>
                            {selected?.urlRedireccion ? (
                                <>
                                    {selected?.texto?.replace('{{aqui}}.', '')}
                                    <Link
                                        to={selected?.urlRedireccion}
                                        onClick={() => {
                                            handleCloseDrawer();
                                        }}
                                    >
                                        aquí
                                    </Link>
                                </>
                            ) : (
                                selected?.texto
                            )}
                        </p>
                    </Box>
                    <Box className="flex-center">
                        <Button
                            style={{
                                textTransform: 'uppercase',
                                marginTop: '40px',
                                width: '150px',
                                fontWeight: 800
                            }}
                            type="outlined"
                            onClick={handleCloseDrawer}
                        >
                            Cerrar
                        </Button>
                    </Box>
                </Box>
            </Drawer>
        </>
    );
}

export default NotificationDrawer;
