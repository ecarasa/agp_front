import _ from 'lodash';
import { Box, CircularProgress } from '@mui/material';

import Button from '../../../components/button/Button';
import EditIcon from '@mui/icons-material/Edit';

type UpdateBoxProps = {
    captionOff: string;
    captionOn: string;
    updatingContent: boolean;
    updateContent: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const UpdateBtn: React.FC<UpdateBoxProps> = ({
    captionOn,
    captionOff,
    updatingContent,
    updateContent
}) => {
    return (
        <Box
            sx={{
                textAlign: 'right'
            }}
        >
            <Button
                style={{
                    minWidth: '100px',
                    background: '#1976D2',
                    color: '#FFF',
                    border: 'none'
                }}
                onClick={updateContent}
                disabled={false}
                startIcon={<EditIcon style={{ color: 'white' }} />}
                endIcon={
                    updatingContent ? (
                        <CircularProgress
                            sx={{
                                '& .MuiCircularProgress-svg': {
                                    color: 'white'
                                }
                            }}
                            style={{
                                margin: '0 10px',
                                color: 'white'
                            }}
                            size="1.2em"
                        />
                    ) : null
                }
                type="outlined"
            >
                {!updatingContent ? captionOn : captionOff}
            </Button>
        </Box>
    );
};

export default UpdateBtn;
