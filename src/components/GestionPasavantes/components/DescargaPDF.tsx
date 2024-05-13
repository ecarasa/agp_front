import { Grid } from '@mui/material';
import Button from '../../button/Button';
import DownloadIcon from '@mui/icons-material/Download';

interface Props {
    handleDownload: () => void;
    loading: boolean;
}
function DescargaPDF({ handleDownload, loading }: Props) {
    return (
        <Grid
            item
            xs={12}
            display="flex"
            textAlign="right"
            justifyContent="flex-end"
            sx={{
                fontSize: '17px',
                '& button': {
                    background: 'var(--white)'
                }
            }}
        >
            <Button
                type="outlined"
                startIcon={<DownloadIcon />}
                onClick={handleDownload}
                loading={loading}
            >
                DESCARGAR PDF
            </Button>
        </Grid>
    );
}

export default DescargaPDF;
