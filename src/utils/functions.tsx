import { Tooltip } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import RepeatIcon from '@mui/icons-material/Repeat';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';

export const getDateFilterValidation = (filterProps: any) => {
    return (
        (!!filterProps?.extraFilters?.fechaDesde && !filterProps?.extraFilters?.fechaHasta) ||
        (!filterProps?.extraFilters?.fechaDesde && !!filterProps?.extraFilters?.fechaHasta)
    );
};
export const getDockingIconState = (state: string) => {
    const dockingState: any = {
        aprobado: (
            <Tooltip title="Nuevo">
                <InfoOutlinedIcon
                    sx={{
                        color: '#000BAD'
                    }}
                />
            </Tooltip>
        ),
        operando: (
            <Tooltip title="Operando">
                <InfoIcon
                    sx={{
                        color: '#2C56D2'
                    }}
                />
            </Tooltip>
        ),
        pendiente_liquidar: (
            <Tooltip title="Pendiente liquidar">
                <InfoIcon
                    sx={{
                        color: '#2C56D2'
                    }}
                />
            </Tooltip>
        ),
        liquidado: (
            <Tooltip title="Liquidado">
                <CheckCircleIcon sx={{ color: '#6EBE64' }} />
            </Tooltip>
        )
    };
    return dockingState[state];
};

export const getDockingObservedIcons = (state: string) => {
    const dockingState: any = {
        revision: (
            <Tooltip title="Enviado a revisión" placement="left-start">
                <WarningAmberRoundedIcon
                    sx={{
                        color: '#029646'
                    }}
                />
            </Tooltip>
        ),
        modificando: (
            <Tooltip title="Modificando" placement="left-start">
                <WarningAmberRoundedIcon
                    sx={{
                        color: '#6837ED'
                    }}
                />
            </Tooltip>
        )
    };
    return dockingState[state];
};

export const getDockingRenewalIcon = (id: string) => {
    return (
        <Tooltip title="Renovación" placement="left-start">
            <RepeatIcon
                sx={{
                    color: '#6837ED'
                }}
            />
        </Tooltip>
    );
};

export const requestServiceState = (item: any) => {
    const requestIconState: { [key: string]: any } = {
        PENDIENTE: <InfoOutlinedIcon sx={{ color: 'var(--primary)' }} />,
        APROVISIONADO: <InfoIcon sx={{ color: '#3761ED' }} />,
        APROBADO: <CheckCircleIcon sx={{ color: '#6EBE64' }} />,
        LIQUIDADO: <CheckCircleIcon sx={{ color: '#6EBE64' }} />,
        CANCELADO: <CancelIcon sx={{ color: '#D40000' }} />
    };

    return (
        <div className="flex-align-center-gap">
            {requestIconState[item?.estado] || requestIconState['Pendiente']}
            <b>
                <span>{item?.estado}</span>
            </b>
        </div>
    );
};

export const getCertificatesStates = (state: string) => {
    const states: any = {
        PE: (
            <>
                Pendiente
                <CheckCircleIcon sx={{ marginLeft: '5px', color: '#898383' }} fontSize="small" />
            </>
        ),
        AP: (
            <>
                Aprobado
                <CheckCircleIcon sx={{ marginLeft: '5px', color: '#6EBE64' }} fontSize="small" />
            </>
        ),
        RE: (
            <>
                Rechazado
                <CancelIcon sx={{ marginLeft: '5px', color: '#D40000' }} fontSize="small" />
            </>
        ),
        VE: (
            <>
                Vencido
                <CancelIcon sx={{ marginLeft: '5px', color: '#ff4000' }} fontSize="small" />
            </>
        )
    };
    return states[state] || states['PE'];
};

export const getPatentIconState = (state: string) => {
    const iconByState: any = {
        operando: (
            <Tooltip title="Operando">
                <InfoIcon
                    sx={{
                        color: '#2C56D2'
                    }}
                />
            </Tooltip>
        ),
        pendiente_liquidar: (
            <Tooltip title="Pendiente liquidar">
                <InfoOutlinedIcon
                    sx={{
                        color: '#2C56D2'
                    }}
                />
            </Tooltip>
        ),
        liquidado: (
            <Tooltip title="Liquidado">
                <CheckCircleIcon sx={{ color: '#6EBE64' }} />
            </Tooltip>
        ),
        aprobado: (
            <Tooltip title="Aprobado">
                <InfoIcon sx={{ color: '#2C56D2' }} />
            </Tooltip>
        ),
        default: (
            <Tooltip title="Pendiente de liquidación">
                <CheckCircleIcon sx={{ color: '#6EBE64' }} />
            </Tooltip>
        )
    };
    return iconByState[state] || iconByState['default'];
};
