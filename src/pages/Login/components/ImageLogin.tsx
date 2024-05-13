import { Box } from '@mui/material';

type ImgProp = {
    src: string;
};

const ImageLogin = ({ src }: ImgProp) => {
    return (
        <Box sx={{ maxWidth: '50%' }}>
            <img
                src={src}
                alt="portada-puerto-desktop"
                style={{
                    maxHeight: '90vh',
                    maxWidth: '100%'
                }}
            />
        </Box>
    );
};

export default ImageLogin;
