import _ from 'lodash';
import {
    Card,
    CardActions,
    CardContent,
    Collapse,
    IconButton,
    IconButtonProps
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

const CardComponent = styled(Card)`
    cursor: pointer;
    box-shadow: none;
    margin: 12px 0px;
    background-color: transparent;
    font-weight: 700;
    border:0;
    color: var(--black);
    font-size: 18px;
    button {
        margin-left: inherit;
        svg {
            color: black;
        }
    }
    & .MuiCardActions-root {
        height: 42px;
        justify-content: space-between;
        div {
            display: flex;
            align-items: center;
            border-bottom: 1px solid #E0E0E0;
            width: 100%;
        }
        svg {
            font-size: 36px;
        }
    }
    & .MuiCollapse-root {
        & .MuiTypography-root {
            color: var(--black);
            text-transform: capitalize;
            margin: 10px 0;
        }
        & .MuiCardContent-root:last-child {
            padding-bottom: 12px;
        }
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

const CollapseItem = ({ children, title }: any) => {
    const [expanded, setExpanded] = useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    return (
        <CardComponent>
            <CardActions onClick={handleExpandClick}>
                <div>
                    <span style={{ marginLeft: '15px' }}>{title}</span>
                </div>
                <ExpandMore expand={expanded} aria-expanded={expanded} aria-label="show more">
                    {expanded ? (
                        <ArrowDropUpIcon sx={{ color: '#000' }} />
                    ) : (
                        <ArrowLeftIcon sx={{ color: '#000' }} />
                    )}
                </ExpandMore>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>{children}</CardContent>
            </Collapse>
        </CardComponent>
    );
};

export default CollapseItem;
