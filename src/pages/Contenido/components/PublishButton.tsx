import _ from 'lodash';
import { Box, CircularProgress } from '@mui/material';

import Button from '../../../components/button/Button';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

type UpdateBoxProps = {
    captionOff: string;
    captionOn: string;
    publishingContent: boolean;
    publishContent: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const PublishBtn: React.FC<UpdateBoxProps> = ({
    publishingContent,
    publishContent,
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
                    minWidth: '145px',
                    background: '#7B7B7B',
                    color: '#FFF',
                    border: 'none'
                }}
                onClick={publishContent}
                disabled={false}
                startIcon={<RocketLaunchIcon style={{ color: 'white' }} />}
                endIcon={
                    publishingContent ? (
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
                {!publishingContent ? captionOn : captionOff}
            </Button>
        </Box>
    );
};

export default PublishBtn;
