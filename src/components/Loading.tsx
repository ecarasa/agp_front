import Box from '@mui/material/Box';
import Lottie from 'lottie-react';
import Spinner from '../../src/assets/animations/spinner.json';

type Size = 'extrasmall' | 'small' | 'medium' | 'large';

interface SizeProp {
    size?: Size | undefined;
    position?: 'flex-start' | 'center' | 'flex-end';
}

const getSize: (size?: Size | undefined) => number | undefined = (size?: Size | undefined) => {
    const sizeValue = {
        extrasmall: 30,
        small: 55,
        medium: 80,
        large: 100
    };
    return size && sizeValue[size];
};
export default function Loading({ size, position }: SizeProp) {
    return (
        <Box sx={{ justifyContent: position || 'center', display: 'flex', margin: '5px 0' }}>
            <Lottie style={{ height: getSize(size) || 100 }} animationData={Spinner} />
        </Box>
    );
}
