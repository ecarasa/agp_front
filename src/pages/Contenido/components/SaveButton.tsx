import _ from 'lodash';
import { Box, CircularProgress } from '@mui/material';

import Button from '../../../components/button/Button';

type SaveBoxProps = {
    captionOff: string;
    captionOn: string;
    savingContent: boolean;
    saveContent: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const SaveBtn: React.FC<SaveBoxProps> = ({ captionOn, captionOff, savingContent, saveContent }) => {
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
                onClick={saveContent}
                disabled={savingContent}
                // startIcon={<RocketLaunchIcon style={{ color: 'white' }} />}
                endIcon={
                    savingContent ? (
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
                {!savingContent ? captionOn : captionOff}
            </Button>
        </Box>
    );
};

export default SaveBtn;
