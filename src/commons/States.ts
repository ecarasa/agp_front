export const SHIP_STATES: any = {
    BO: 'Borrador',
    PE: 'Pendiente',
    AP: 'Aprobado',
    RE: 'Rechazado',
    SB: 'Stand-By'
};

export const CERTIFICATE_STATES: any = {
    BO: 'Borrador',
    PE: 'Pendiente',
    AP: 'Aprobado',
    RE: 'Rechazado',
    VE: 'Vencido'
};

export const CERTIFICATE_ABREVIATE_STATE: any = {
    Borrador: 'BO',
    Pendiente: 'PE',
    Aprobado: 'AP',
    Rechazado: 'RE',
    Vencido: 'VE'
};

export const STEPS_VALIDATIONS: any = {
    1: 'firstStepValidated',
    2: 'secondStepValidated',
    3: 'thirdStepValidated',
    4: 'fourthStepValidated'
};

export const GIROS_STATES: any = {
    PENDIENTE: 'pendiente',
    ACEPTADO: 'aceptado', // por AGP
    APROBADO: 'aprobado', // por AGP
    CANCELADO: 'cancelado', // por AM
    RECHAZADO: 'rechazado', // por PNA
    DENEGADO: 'denegado', // solicitud denegada por AGP
    OPERANDO: 'operando',
    FINALIZADO: 'finalizado',
    MODIFICANDO: 'modificando',
    REVISION: 'revision',
    LIQUIDADO: 'liquidado'
};

export const PATENT_STATES: any = {
    PENDIENTE: 'pendiente',
    APROBADO: 'aprobado', // por AGP
    CANCELADO: 'cancelado', // por AM
    RECHAZADO: 'rechazado', // por PNA
    DENEGADO: 'denegado' // solicitud denegada por AGP
};

export const CERTIFICATES_NAMES: any = {
    1: 'Arqueo',
    2: 'Matrícula',
    3: 'Seguro P&I',
    4: 'Seguro Casco & Máquina',
    5: 'Navegación',
    6: 'Certificado 1010/94',
    7: 'Seguro de Caución',
    8: 'Green Award',
    9: 'Environmental Ship Index ESI',
    11: 'Bandera'
};

export const QUARTER_PERIOD: any = {
    1: 'ENE - MAR',
    2: 'ABR - JUN',
    3: 'JUL - SEP',
    4: 'OCT - DIC'
};

export const QUARTER_PERIOD_FULL: any = {
    1: '1 (ENE - MAR)',
    2: '2 (ABR - JUN)',
    3: '3 (JUL - SEP)',
    4: '4 (OCT - DIC)'
};

export const PASAVANTE_STATES: any = [
    { id: 1, nombre: 'Liquidados', value: 'liquidado' },
    { id: 2, nombre: 'Por liquidar', value: 'pendiente_liquidar' }
];

export const INSPECTION_STATES: any = [
    { id: 1, nombre: 'Pendiente', value: 'pendiente' },
    { id: 2, nombre: 'Control OK', value: 'control oK' },
    { id: 3, nombre: 'Resuelto', value: 'resuelto' },
    { id: 4, nombre: 'Observado', value: 'observado' }
];

export const STATE_OPTIONS_FOR_FILTERS: any = [
    { id: 1, nombre: 'Activo', value: true },
    { id: 2, nombre: 'Inactivo', value: false }
];

export const RAILWAY_STATE_OPTIONS: any = [
    { id: 1, nombre: 'Ingreso Cargado' },
    { id: 2, nombre: 'Egreso Cargado' },
    { id: 3, nombre: 'Ingreso Vacío' },
    { id: 4, nombre: 'Egreso Vacío' }
];

export const SERVICIOS_NAVE_STATES: any = [
    { id: 1, nombre: 'PENDIENTE', value: 'Pendiente' },
    { id: 2, nombre: 'APROBADO', value: 'Aprobado' },
    { id: 3, nombre: 'APROVISIONADO', value: 'Aprovisionado' },
    { id: 4, nombre: 'LIQUIDADO', value: 'Liquidado' },
    { id: 5, nombre: 'CANCELADO', value: 'Cancelado' }
];
