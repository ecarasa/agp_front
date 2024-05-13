import _ from 'lodash';
import { Box, CircularProgress } from '@mui/material';

import Button from '../../../components/button/Button';
import DeleteIcon from '@mui/icons-material/Delete';

type DeleteBoxProps = {
    captionOff: string;
    captionOn: string;
    removingContent: boolean;
    deleteContent: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const DeleteBtn: React.FC<DeleteBoxProps> = ({
    removingContent,
    deleteContent,
    captionOn,
    captionOff
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
                    background: '#B81414',
                    color: '#FFF',
                    border: 'none'
                }}
                onClick={deleteContent}
                disabled={false}
                startIcon={<DeleteIcon style={{ color: 'white' }} />}
                endIcon={
                    removingContent ? (
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
                {!removingContent ? captionOn : captionOff}
            </Button>
        </Box>
    );
};

export default DeleteBtn;
