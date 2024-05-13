import { useState } from 'react';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Grid,
    Popover,
    Typography
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Input from '../../../../components/Input/Input';

function AttributesForm(props: any) {
    const {
        handleChange,
        liquidado,
        handleControlAccordion,
        provisiones,
        expandedAccordion,
        requestById
    } = props;
    const [openPopover, setOpenPopover] = useState<any>(null);
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>, reference: any) => {
        setOpenPopover(`idAtributo-${reference}`);
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setOpenPopover(null);
        setAnchorEl(null);
    };

    if (requestById?.estado === 'CANCELADO') return null;

    return (
        <Grid container spacing={2} p={2}>
            <Grid item xs={12} fontSize={20}>
                Atributos
            </Grid>
            <Grid
                item
                xs={12}
                sx={{
                    '& .MuiPaper-root': {
                        boxShadow: 'none'
                    }
                }}
            >
                {provisiones?.map((item: any) => (
                    <Accordion
                        key={item?.id}
                        disableGutters
                        expanded={expandedAccordion === `${item?.id}`}
                        sx={{
                            '& .MuiAccordionSummary-content': {
                                alignItems: 'center'
                            },
                            '& .MuiButtonBase-root': {
                                cursor: item?.nota ? 'pointer' : 'inherit',
                                padding: '0 4px',
                                backgroundColor: 'transparent !important'
                            },
                            '& .Mui-focusVisible': {
                                backgroundColor: 'transparent !important'
                            }
                        }}
                    >
                        <AccordionSummary
                            expandIcon={
                                <ExpandMoreIcon
                                    onClick={() => handleControlAccordion(`${item?.id}`)}
                                />
                            }
                            aria-controls="panel-content"
                            id="panel-header"
                        >
                            <>
                                <Input
                                    label={item?.nombre}
                                    required={item?.obligatorio}
                                    value={item?.provisto || ''}
                                    size="small"
                                    onChange={(event: any) => handleChange(event, item)}
                                    type={item?.tipo === 'N' ? 'number' : 'text'}
                                    readOnly={liquidado}
                                    endIcon={!liquidado ? <EditIcon /> : null}
                                />
                                <div>
                                    <Typography
                                        className="flex-align-center"
                                        aria-owns={
                                            openPopover === `idAtributo-${item?.id}`
                                                ? 'mouse-over-popover'
                                                : undefined
                                        }
                                        aria-haspopup="true"
                                        onMouseEnter={(e: any) => handlePopoverOpen(e, item?.id)}
                                        onMouseLeave={handlePopoverClose}
                                    >
                                        <InfoOutlinedIcon
                                            sx={{ color: 'var(--primary)', marginLeft: '5px' }}
                                        />
                                    </Typography>
                                    <Popover
                                        id="mouse-over-popover"
                                        sx={{
                                            pointerEvents: 'none',

                                            '& .MuiPopover-paper': {
                                                '& p': {
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                    maxWidth: '450px',
                                                    display: 'block',
                                                    margin: 0
                                                }
                                            }
                                        }}
                                        open={openPopover === `idAtributo-${item?.id}`}
                                        anchorEl={anchorEl}
                                        anchorOrigin={{
                                            vertical: 'top',
                                            horizontal: 'left'
                                        }}
                                        transformOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'right'
                                        }}
                                        onClose={handlePopoverClose}
                                        disableRestoreFocus
                                    >
                                        <Box sx={{ p: 1 }}>
                                            <>
                                                <p>
                                                    <b>Tipo de dato:</b>&nbsp;
                                                    {item?.tipo === 'N'
                                                        ? `Numérico`
                                                        : 'Alfanumérico'}
                                                </p>
                                                <p>
                                                    <b>Nota atributo:</b>&nbsp;
                                                    {item?.notaAtributo}
                                                </p>
                                            </>
                                        </Box>
                                    </Popover>
                                </div>
                            </>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Input
                                label="Nota de aprovisionamiento"
                                value={item?.nota || ''}
                                size="small"
                                readOnly={liquidado}
                                name="nota"
                                onChange={(event: any) => handleChange(event, item)}
                                endIcon={!liquidado ? <EditIcon /> : null}
                            />
                        </AccordionDetails>
                    </Accordion>
                ))}
            </Grid>
        </Grid>
    );
}

export default AttributesForm;
