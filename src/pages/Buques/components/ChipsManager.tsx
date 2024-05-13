import { Box, Chip, Tooltip } from '@mui/material';
import { memo } from 'react';

const CHIP_LETTER_COLOR: any = {
    PE: '#3761ED', //azul,
    VE: '#ff4000', //naranja
    RE: '#fff', //blanco
    AP: '#fff'
};

const CHIP_BG_COLOR: any = {
    RE: '#D40000',
    AP: '#3761ED'
};

const ChipsManager = memo(({ items, parametricData }: any) => {
    const normalizeText = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    return parametricData?.tiposCertificado?.map((item: any, index: any) => {
        const pItem = normalizeText(item.nombre).toLowerCase();
        const loaded = items.find(
            (i: any) => normalizeText(i?.tipoCertificado?.nombre).toLowerCase() === pItem
        );
        return (
            <Box
                sx={{
                    p: 0.05,
                    '& .MuiChip-root': {
                        fontSize: '0.7rem',
                        height: '28px',
                        width: '45px'
                    },
                    '& .MuiChip-label': {
                        padding: 0
                    }
                }}
                key={index}
            >
                <Tooltip title={item.nombre} arrow>
                    {loaded ? (
                        <Chip
                            label={loaded?.tipoCertificado?.tipo}
                            sx={{
                                background: loaded?.vigente
                                    ? CHIP_BG_COLOR[loaded.estado]
                                    : 'transparent',
                                color: loaded?.vigente
                                    ? CHIP_LETTER_COLOR[loaded.estado]
                                    : '#D40000',
                                // width: '2.9rem',
                                border: `0.2em solid ${
                                    !loaded?.vigente
                                        ? '#D40000'
                                        : loaded.estado === 'PE'
                                        ? '#3761ED'
                                        : ''
                                }`
                            }}
                            variant="outlined"
                        />
                    ) : (
                        <Chip //Certificado no cargado
                            label={item.tipo}
                            sx={{
                                background: 'var(--white)',
                                color: '#545454'
                                // width: '2.9rem'
                            }}
                            variant="outlined"
                        />
                    )}
                </Tooltip>
            </Box>
        );
    });
});

export default ChipsManager;
