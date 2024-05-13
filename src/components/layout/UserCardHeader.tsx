import { Avatar, Card, CardHeader, IconButton } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

function UserCardHeader({ isMobile, handleOpenNavMenu, user, role }: any) {
    const getInitials = () => {
        const values = user?.nombre?.split(' ');
        let initials: string = '';
        values?.forEach((i: any) => {
            if (i) {
                initials += i.charAt(0).toUpperCase();
            }
        });
        return initials;
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
                '& .MuiCardHeader-subheader': {
                    textTransform: 'capitalize',
                    maxWidth: '200px',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden'
                },
                '& .MuiCardHeader-avatar': {
                    marginRight: isMobile ? 0 : '16px'
                }
            }}
        >
            <CardHeader
                avatar={
                    <Avatar
                        sx={{
                            bgcolor: 'var(--primary)',
                            fontSize: getInitials()?.length > 2 ? '17px' : '20px'
                        }}
                        aria-label="recipe"
                        onClick={isMobile ? handleOpenNavMenu : undefined}
                    >
                        {getInitials()?.substring(0, 3)}
                    </Avatar>
                }
                action={
                    !isMobile ? (
                        <IconButton aria-label="settings" onClick={handleOpenNavMenu}>
                            <KeyboardArrowDownIcon />
                        </IconButton>
                    ) : null
                }
                title={isMobile ? null : user?.nombre}
                subheader={isMobile ? null : role + ` - (${user?.empresa?.nombre})`}
            />
        </Card>
    );
}

export default UserCardHeader;
