import { useState } from 'react';

function useAssignment() {
    const [waybillData, setWaybillData] = useState<any>(null);

    const handleChangeWaybill = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e?.target;
        if (!value) {
            const auxData = { ...waybillData };
            delete auxData[name];
            setWaybillData(auxData);
        }
        setWaybillData({
            ...waybillData,
            [name]: value
        });
    };

    const clearDrawerInputs = () => {
        setWaybillData(null);
    };

    return { waybillData, handleChangeWaybill, clearDrawerInputs };
}

export default useAssignment;
