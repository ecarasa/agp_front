import { Box, Menu } from '@mui/material';
import NotificationList from './NotificationList';

function NotificationsMenuBar({ openMenu, anchorEl, handleClose, isMenu, ...props }: any) {
    return (
        <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            sx={{
                '& .MuiPaper-root': {
                    width: 'auto',
                    borderRadius: '15px',
                    border: '2px solid #87ceeb',
                    position: 'absolute',
                    top: '66px !important',
                    minWidth: '300px',
                    '& .MuiList-root': {
                        padding: 0,
                        '& .MuiListItem-root': {
                            padding: '8px 12px 8px 12px',
                            color: 'var(--black)',
                            '& .MuiListItemIcon-root': {
                                color: 'var(--primary)'
                            }
                        },
                        '& hr': {
                            background: '#87ceeb'
                        }
                    }
                }
            }}
        >
            <Box sx={{ width: 'auto', minWidth: '300px' }}>
                <NotificationList isMenu={isMenu} closeMenu={handleClose} {...props} />
            </Box>
        </Menu>
    );
}

export default NotificationsMenuBar;
