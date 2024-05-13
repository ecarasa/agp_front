import _ from 'lodash';
import { styled } from '@mui/material/styles';
import {
    Card,
    CardActions,
    CardContent,
    Collapse,
    Divider,
    Grid,
    IconButton,
    IconButtonProps
} from '@mui/material';
import { Fragment, useState } from 'react';
import { getDateTime } from '../../../utils/common';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Input from '../../Input/Input';

const CardComponent = styled(Card)`
    cursor: pointer;
    box-shadow: none;
    button {
        margin-left: inherit;
    }
    & .MuiCardActions-root {
        margin: 0 20px;
        height: 42px;
        justify-content: flex-end;
    }
`;

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
    data?: any;
    item: any;
}

function MovementsDetailsDropDown({ text, icon, data, item }: Props) {
    const [expanded, setExpanded] = useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    return (
        <CardComponent>
            <CardActions
                onClick={() => {
                    return !!data?.length ? handleExpandClick() : null;
                }}
            >
                {icon} <span style={{ marginLeft: '15px' }}>{text}</span>
                <ExpandMore expand={expanded} aria-expanded={expanded} aria-label="show more">
                    <ExpandMoreIcon />
                </ExpandMore>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    <Grid container spacing={2}>
                        {_.orderBy(
                            data?.filter((i: any) => Number(i.id) === Number(item?.id)),
                            ['fechaETA'],
                            ['desc']
                        ).map((historyItem: any, index: number) => (
                            <Fragment key={index}>
                                <Grid item xs={12}>
                                    <Input
                                        size="small"
                                        label="Nota"
                                        readOnly
                                        value={historyItem.nota}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    Registrado por:
                                </Grid>
                                <Grid item xs={6}>
                                    {historyItem?.usuarioCarga?.empresa?.nombre}
                                </Grid>
                                <Grid item xs={6}>
                                    Fecha:
                                </Grid>
                                <Grid item xs={6}>
                                    {getDateTime(historyItem?.fechaETA)}
                                </Grid>
                                <Grid item xs={6}>
                                    Sitio:
                                </Grid>
                                <Grid item xs={6}>
                                    {historyItem.muelle.nombre}
                                </Grid>
                                <Grid item xs={6}>
                                    Andana:
                                </Grid>
                                <Grid item xs={6}>
                                    {historyItem.andana || ''}
                                </Grid>
                                <Grid item xs={12} mb={2}>
                                    <Divider component="div" />
                                </Grid>
                            </Fragment>
                        )) || null}
                    </Grid>
                </CardContent>
            </Collapse>
        </CardComponent>
    );
}

export default MovementsDetailsDropDown;
