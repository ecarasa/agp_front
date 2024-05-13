import { Card, Box } from '@mui/material';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import ArticleIcon from '@mui/icons-material/Article';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PictureInPictureAltIcon from '@mui/icons-material/PictureInPictureAlt';

function CustomIcon(props: { id: string }) {
    const { id } = props;
    const icons: { [key: string]: any } = {
        graphics: <InsertPhotoIcon sx={{ fontSize: '84px' }} />,
        videos: <VideoLibraryIcon sx={{ fontSize: '84px' }} />,
        news: <ArticleIcon sx={{ fontSize: '84px' }} />,
        provisions: <AssignmentIcon sx={{ fontSize: '84px' }} />,
        about: <PictureInPictureAltIcon sx={{ fontSize: '84px' }} />
    };
    return icons[id];
}

function ContentCard({ item, title, setSelectedItem }: any) {
    const { titleKey } = item;
    return (
        <>
            <Card
                sx={{
                    maxWidth: '230px',
                    minHeight: '300px',
                    maxHeight: '300px',
                    borderRadius: '4px',
                    boxShadow: '0px 2px 2px 0px rgba(0, 0, 0, 0.20)',
                    borderTop: '5px solid #0072BB',
                    cursor: 'pointer'
                }}
                onClick={() => setSelectedItem(item)}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingTop: 10
                    }}
                >
                    <CustomIcon id={titleKey} />
                    <Box sx={{ padding: '8px' }}>
                        <h3>{title}</h3>
                    </Box>
                </Box>
            </Card>
        </>
    );
}

export default ContentCard;
