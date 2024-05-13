import _ from 'lodash';
import { styled } from '@mui/material/styles';
import {
    Card,
    CardActions,
    CardContent,
    Collapse,
    Grid,
    IconButton,
    IconButtonProps
} from '@mui/material';
import { CERTIFICATE_ABREVIATE_STATE } from '../../../commons/States';
import { Fragment, useState } from 'react';
import { stateIcons } from '../../../pages/Buques/BuquesIndex';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest
    })
}));

interface Props {
    text: string;
    icon: any;
    data?: { [key: string]: string | number };
    defaultExpanded?: boolean;
}

function CollapseCard({ text, icon, data, defaultExpanded }: Props) {
    const [expanded, setExpanded] = useState(defaultExpanded || false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    return (
        <Card sx={{ cursor: 'pointer', boxShadow: '0px 1px 2px 2px #00000040' }}>
            <CardActions
                disableSpacing
                sx={{ margin: '0 20px', height: '72px' }}
                onClick={handleExpandClick}
            >
                {icon} <span style={{ marginLeft: '15px' }}>{text}</span>
                <ExpandMore expand={expanded} aria-expanded={expanded} aria-label="show more">
                    <ExpandMoreIcon />
                </ExpandMore>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    <Grid container spacing={2}>
                        {_.entries(data).map(([key, value]) => (
                            <Fragment key={key}>
                                <Grid item xs={6}>
                                    {key}:
                                </Grid>
                                <Grid item xs={6} alignItems="center" display="flex" gap={1}>
                                    {text === 'Certificados' &&
                                        stateIcons(CERTIFICATE_ABREVIATE_STATE[value])}
                                    <b>{value}</b>
                                </Grid>
                            </Fragment>
                        )) || null}
                    </Grid>
                </CardContent>
            </Collapse>
        </Card>
    );
}

export default CollapseCard;
