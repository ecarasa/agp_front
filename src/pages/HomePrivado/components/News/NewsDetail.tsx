import { Box, Paper } from '@mui/material';
import { getDateTime } from '../../../../utils/common';
import { useIsMobile } from '../../../../hooks/useIsMobile';
import Button from '../../../../components/button/Button';
import styles from './styles-news.module.css';
import EditIcon from '@mui/icons-material/Edit';

function NewsDetail({ selectedItem, canEdit = false, onBackButton, onEditButton }: any) {
    const { isMobile } = useIsMobile();

    return (
        <>
            <Box component="div" className={styles['news-detail-container']}>
                <Paper
                    sx={{
                        minHeight: '50vh',
                        minWidth: 320,
                        display: 'block',
                        height: 'auto',
                        marginTop: '10%',
                        padding: '4% 6%',
                        borderRadius: '10px',
                        width: isMobile ? '100%' : '75%',
                        '& div:nth-child(3)': {
                            display: 'flex',
                            justifyContent: 'flex-end',
                            margin: '40px 0'
                        }
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}
                    >
                        <h2>{selectedItem?.titulo}</h2>
                        {canEdit && (
                            <span
                                onClick={onEditButton}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    gap: 5,
                                    color: 'blue',
                                    cursor: 'pointer'
                                }}
                            >
                                {!isMobile ? 'Editar' : null}
                                <EditIcon sx={{ color: 'black' }} />
                            </span>
                        )}
                    </Box>
                    <Box>{selectedItem?.copete}</Box>
                    <Box>{getDateTime(selectedItem?.fecha)}</Box>
                    <Box>{selectedItem?.contenido}</Box>
                </Paper>
            </Box>
            <Box className="flex-center" mt={4}>
                <Button
                    style={{ background: '#fff', minWidth: '120px' }}
                    type="outlined"
                    onClick={onBackButton}
                >
                    Volver
                </Button>
            </Box>
        </>
    );
}

export default NewsDetail;
