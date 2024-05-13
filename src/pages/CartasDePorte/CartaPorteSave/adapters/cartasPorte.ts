export const waybillDetailFromApi = (response: any, cities: any) => {
    const getCountryAndCity = (id: number) => {
        return cities.find((i: any) => i.id === id);
    };

    const formattedResponse: any = {
        ...response,
        idFerrocarril: response?.ferrocarril?.id,
        idOrigen: response?.empresaOrigen,
        idDestino: response?.empresaDestino,
        idLugarCarga: getCountryAndCity(response?.lugarCarga?.id),
        idLugarDescarga: getCountryAndCity(response?.lugarDescarga?.id),
        idCliente: {
            ...response?.cliente,
            ciudad: getCountryAndCity(response?.cliente?.ciudad?.id)
        },
        idConsignatario: {
            ...response?.consignatario,
            ciudad: getCountryAndCity(response?.consignatario?.ciudad?.id)
        },
        idCargador: {
            ...response?.cargador,
            ciudad: getCountryAndCity(response?.cargador?.ciudad?.id)
        },
        detalle: response?.vagones
    };

    delete formattedResponse.totalVagonesPendientes;
    delete formattedResponse.totalVagones;
    delete formattedResponse.lugarCarga;
    delete formattedResponse.lugarDescarga;
    delete formattedResponse.empresaOrigen;
    delete formattedResponse.empresaDestino;
    delete formattedResponse.ferrocarril;
    delete formattedResponse.cliente;
    delete formattedResponse.consignatario;
    delete formattedResponse.cargador;
    delete formattedResponse.idEstado;
    delete formattedResponse.estado;
    delete formattedResponse.fecha;
    delete formattedResponse.agenciaFerroviaria;
    delete formattedResponse.vagones;
    delete formattedResponse.ingreso;

    return formattedResponse;
};
