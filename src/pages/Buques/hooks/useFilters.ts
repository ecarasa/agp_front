import _ from 'lodash';
import { useState } from 'react';

function useFilters() {
    const defaultFilters = { skip: 0, take: 10 };
    const [filters, setFilters] = useState<any>(defaultFilters);
    const [extraFilters, setExtraFilters] = useState<any>(null);

    const clearExtraFilters = () => {
        setExtraFilters(null);
        setFilters(defaultFilters);
    };

    const handleChangeFilter = (e: any) => {
        const { name, value }: any = e.target;

        if (name && !value) {
            const newFilters = { ...filters };
            delete newFilters[name];
            setFilters(newFilters);
        } else
            setFilters({
                ...filters,
                ...defaultFilters,
                [name]: value
            });
    };

    const handleChangeExtraFilters = (e: any) => {
        const { name, value }: any = e.target;

        if (!value) {
            let newObject = { ...extraFilters };
            delete newObject[name];
            let newFilterObject = { ...filters };
            delete newFilterObject[name];
            setFilters(newFilterObject);
            setExtraFilters(newObject);
        } else {
            setExtraFilters({
                ...extraFilters,
                [name]: value
            });
        }
    };

    const handleAdvancedSearch = () => {
        const newFilters = { ...extraFilters };
        setFilters({
            ...filters,
            ...defaultFilters,
            ...(!_.isEmpty(newFilters?.activo) && {
                activo: newFilters.activo.nombre === 'Activo'
            }),
            ...(newFilters?.imo && { imo: newFilters.imo }),
            ...(newFilters?.matricula && { matricula: newFilters.matricula }),
            ...(newFilters?.nombreEmpresa && { nombreEmpresa: newFilters.nombreEmpresa.nombre }),
            ...(newFilters?.pais && { pais: newFilters.pais.nombre }),
            ...(newFilters?.estado && { estado: newFilters.estado.estado })
        });
    };

    const debounceSearch = _.debounce(handleChangeFilter, 700);
    const debounceExtraFilters = _.debounce(handleChangeExtraFilters, 1000);

    return {
        filters,
        setFilters,
        handleChangeFilter,
        extraFilters,
        setExtraFilters,
        debounceExtraFilters,
        debounceSearch,
        clearExtraFilters,
        handleChangeExtraFilters,
        handleAdvancedSearch
    };
}

export default useFilters;
