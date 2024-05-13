import { DrawerTitle } from './DrawerTitle';
import { IconHeader } from './IconHeader';
import { memo } from 'react';
import { Title } from './Title';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Button from '../button/Button';
import styles from './styles.module.css';

function SectionHeader({ children, renderBack }: any) {
    const navigate = useNavigate();
    return (
        <>
            {renderBack && (
                <div className={styles['header-back-btn']}>
                    <Button
                        startIcon={<ArrowBackIcon />}
                        type="outlined"
                        style={{ backgroundColor: 'var(--white)' }}
                        onClick={() => navigate(-1)}
                    >
                        Volver
                    </Button>
                </div>
            )}
            <div className={styles['header-container']}>{children}</div>
        </>
    );
}

SectionHeader.Title = memo(Title);
SectionHeader.DrawerTitle = memo(DrawerTitle);
SectionHeader.IconHeader = memo(IconHeader);

export default SectionHeader;
