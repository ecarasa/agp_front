import { useState } from 'react';
import {
    Card,
    CardActionArea,
    CardActions,
    CardContent,
    CardMedia,
    Menu,
    MenuItem
} from '@mui/material';
import { getDateTime } from '../../../../utils/common';
import styles from './styles-news.module.css';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useTranslation } from 'react-i18next';
import { useIsMobile } from '../../../../hooks/useIsMobile';

function NewsCard({ item, setSelectedItem, canEdit = false, onCardClicked, onEditClick }: any) {
    const { t } = useTranslation('content');
    const { isMobile } = useIsMobile();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [menuOpen, setMenuOpen] = useState(false);

    const handleCloseMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        setAnchorEl(null);
        setMenuOpen(false);
    };

    return (
        <>
            <Card
                className={styles['card-container']}
                onClick={(event: any) => {
                    event.preventDefault();
                    setSelectedItem(item);
                    if (canEdit) onCardClicked(item);
                }}
            >
                <CardActionArea>
                    <CardMedia
                        component="img"
                        height="180"
                        image={item?.urlImagen}
                        alt="green iguana"
                    />
                    <CardContent
                        sx={{
                            padding: canEdit ? 2 : '10px',
                            minHeight: 100,
                            maxHeight: 100,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}
                    >
                        <div>
                            <h3>{item?.titulo || 'Titulo'}</h3>
                        </div>
                        {canEdit && (
                            <div style={{ zIndex: 99999 }}>
                                <div
                                    onClick={(event: any) => {
                                        event.stopPropagation();
                                        setSelectedItem(item);
                                        setAnchorEl(event.currentTarget);
                                        setMenuOpen(true);
                                    }}
                                >
                                    <MoreVertIcon />
                                </div>

                                <Menu
                                    id="basic-menu"
                                    anchorEl={anchorEl}
                                    open={menuOpen}
                                    onClose={(event: any) => {
                                        handleCloseMenu(event);
                                    }}
                                >
                                    {['edit', 'delete'].map((option, index) => (
                                        <MenuItem
                                            key={index}
                                            onClick={(event: any) => {
                                                handleCloseMenu(event);
                                                onEditClick(item, option);
                                            }}
                                        >
                                            {t(option)}
                                        </MenuItem>
                                    ))}
                                </Menu>
                            </div>
                        )}
                    </CardContent>
                </CardActionArea>
                <CardActions>
                    <span className={styles['card-date-time']}>{getDateTime(item?.fecha)}</span>
                </CardActions>
            </Card>
        </>
    );
}

export default NewsCard;
