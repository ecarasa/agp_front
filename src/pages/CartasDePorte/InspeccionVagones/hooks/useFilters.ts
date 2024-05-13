import { useState } from 'react';

function useFilters() {
    const [filters, setFilters] = useState<any>(null);

    const handleSeachWagon = (e: any) => {
        const { name, value } = e?.target;
        if (!value) {
            let auxFilters = { ...filters };
            delete auxFilters[name];
            return setFilters(auxFilters);
        }
        setFilters({
            ...filters,
            [name]: value
        });
    };

    return { filters, setFilters, handleSeachWagon };
}

export default useFilters;
