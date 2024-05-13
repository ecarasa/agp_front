import { Box, Tooltip } from '@mui/material';
import { getDateTime } from '../../../../utils/common';
import { useNavigate } from 'react-router-dom';
import Button from '../../../../components/button/Button';
import DataTable from '../../../../components/DataTable/DataTable';
import Loading from '../../../../components/Loading';
import NotificationDrawer from './NotificationDrawer';
import NotificationIcons from './NotificationIcons';
import NotificationImportantIcon from '@mui/icons-material/NotificationImportant';
import useNotifications from '../../hooks/useNotifications';

function NotificationsIndex() {
    const navigate = useNavigate();
    const {
        notifications,
        fetchingNotifications,
        loadingNotifications,
        handleOpenDrawer,
        setFilters,
        filters,
        ...props
    } = useNotifications();
    return (
        <>
            <Box
                sx={{
                    // minWidth: 1200,
                    maxWidth: 1200,
                    display: 'block',
                    margin: '2% auto',
                    '& table thead tr': {
                        height: '0px !important'
                    },
                    '& table thead tr th': {
                        background: 'transparent !important'
                    },
                    '& table tbody': {
                        fontSize: '17px'
                    }
                }}
            >
                <Box display="inline-flex">
                    <h2>Notificaciones</h2>
                    {fetchingNotifications && <Loading size="small" />}
                </Box>
                <DataTable
                    headers={[
                        {
                            type: 'element',
                            width: 10,
                            align: 'center',
                            template: (item: any) => {
                                return (
                                    <Box sx={{ '& svg': { fontSize: '35px' } }}>
                                        <NotificationIcons group={item?.agrupador?.id} />
                                    </Box>
                                );
                            }
                        },
                        {
                            upperLabel: (item: any) => item.agrupador?.nombre,
                            lowerLabel: (item: any) => item.titulo
                        },
                        {
                            width: 15,
                            upperLabel: (item: any) => getDateTime(item.fechaAlta)
                        },
                        {
                            type: 'element',
                            width: 5,
                            template: (item: any) => {
                                return !item?.fechaLectura ? (
                                    <Tooltip title="No leída">
                                        <NotificationImportantIcon style={{ color: 'blue' }} />
                                    </Tooltip>
                                ) : (
                                    <></>
                                );
                            }
                        }
                    ]}
                    items={notifications || []}
                    filters={filters}
                    onSelectRow={(item: any) => handleOpenDrawer(item)}
                    setFilters={setFilters}
                    isLoading={loadingNotifications}
                />
                <NotificationDrawer {...props} />
                <Box className="flex-center">
                    <Button
                        style={{ background: '#fff', minWidth: '120px' }}
                        type="outlined"
                        onClick={() => navigate(-1)}
                    >
                        Volver
                    </Button>
                </Box>
            </Box>
        </>
    );
}

export default NotificationsIndex;
