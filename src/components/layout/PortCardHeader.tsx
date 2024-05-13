import { Avatar, Card, CardHeader, IconButton } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

function PortCardHeader({ isMobile, isTablet, handleOpenPortsDrawer, user, portsLength }: any) {
    const getNamePort = () => {
        const name = user?.organizacion?.nombre?.replace('PUERTO', '');
        return name;
    };

    return (
        <Card
            sx={{
                maxWidth: 345,
                '& .MuiCardHeader-root': {
                    padding: '8px',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap'
                },
                '& .MuiCardHeader-content span': {
                    fontWeight: 'bold'
                },
                '& .MuiCardHeader-subheader': {
                    textTransform: 'capitalize',
                    maxWidth: '200px',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    color: '#1D75B7'
                },
                '& .MuiCardHeader-avatar': {
                    marginRight: isMobile || isTablet ? 0 : '16px'
                },
                '& .MuiAvatar-root': {
                    background: user?.organizacion?.color,
                    borderRadius: '14px !important',
                    minWidth: '40px',
                    width: 'auto',
                    padding: '0 4px'
                }
            }}
        >
            <CardHeader
                avatar={
                    <Avatar
                        sx={{ bgcolor: 'var(--primary)' }}
                        aria-label="recipe"
                        onClick={isMobile || isTablet ? handleOpenPortsDrawer : undefined}
                    >
                        {user?.organizacion?.abreviatura}
                    </Avatar>
                }
                action={
                    !isMobile && !isTablet ? (
                        <IconButton
                            aria-label="settings"
                            onClick={handleOpenPortsDrawer}
                            disabled={portsLength === 1}
                        >
                            <KeyboardArrowDownIcon />
                        </IconButton>
                    ) : null
                }
                title={isMobile || isTablet ? null : 'PUERTO'}
                subheader={isMobile || isTablet ? null : getNamePort()}
            />
        </Card>
    );
}

export default PortCardHeader;
