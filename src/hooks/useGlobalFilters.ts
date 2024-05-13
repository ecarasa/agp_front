import _ from 'lodash';
import { useEffect, useState } from 'react';

function useGlobalFilters(props?: any) {
    const defaultFilters = props || { skip: 0, take: 10 };
    const [filters, setFilters] = useState<any>(defaultFilters || null);
    const [extraFilters, setExtraFilters] = useState<any>(null);

    const clearFilters = () => {
        setExtraFilters(null);
        setFilters(defaultFilters);
    };

    const handleChangeFilter = (e: any) => {
        if (!e?.target) return;
        const { name, value }: any = e?.target;

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
        const { name, value, type, checked }: any = e?.target;
        if (!value) {
            let newObject = { ...extraFilters };
            delete newObject[name];
            let newFilterObject = { ...filters };
            if (name === 'userState') {
                if (newFilterObject.hasOwnProperty('activo')) delete newFilterObject.activo;
                if (newFilterObject.hasOwnProperty('bloqueado')) delete newFilterObject.bloqueado;
            } else {
                delete newFilterObject[name];
            }
            setFilters(newFilterObject);
            setExtraFilters(newObject);
        } else {
            if (type && type === 'checkbox') {
                setExtraFilters({
                    ...extraFilters,
                    [name]: checked
                });
            } else if (typeof value === 'object' && type && type !== 'autocomplete') {
                setExtraFilters({
                    ...extraFilters,
                    [name]: value?.value || value?.nombre
                });
            } else {
                setExtraFilters({
                    ...extraFilters,
                    [name]: value
                });
            }
        }
    };

    const handleSubmitSearch = () => {
        let newFilters: { [key: string]: any } = {};
        let controlledFilters = { ...filters };
        _.entries(extraFilters).forEach((key: any, value: any) => {
            if (typeof key[1] === 'object') {
                let value = key[1]?.nombre;
                if (['activo', 'ingreso'].includes(key[0])) value = key[1].value;
                if (key[0].includes('id')) value = key[1].id;
                if (key[0].includes('perfiles')) value = key[1].id;
                if (key[0].includes('fecha')) value = key[1];
                if (key[0].includes('userState')) {
                    let name = '';
                    if (['Activo', 'Inactivo'].includes(key[1].nombre)) {
                        name = 'activo';
                        if (controlledFilters.hasOwnProperty('bloqueado'))
                            delete controlledFilters?.bloqueado;
                    } else {
                        name = 'bloqueado';
                        if (controlledFilters.hasOwnProperty('activo'))
                            delete controlledFilters?.activo;
                    }
                    newFilters[name] = key[1].value;
                } else {
                    newFilters[key[0]] = value;
                }
            } else {
                newFilters[key[0]] = key[1];
            }
        });

        setFilters({
            ...controlledFilters,
            ...defaultFilters,
            ...newFilters
        });
    };

    const debounceSearch = _.debounce(handleChangeFilter, 700);

    useEffect(() => {
        return () => debounceSearch.cancel();
        // eslint-disable-next-line
    }, []);

    return {
        filters,
        extraFilters,
        debounceSearch,
        setFilters,
        clearFilters,
        setExtraFilters,
        handleSubmitSearch,
        handleChangeExtraFilters
    };
}

export default useGlobalFilters;
