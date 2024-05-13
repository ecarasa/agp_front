import { useState } from 'react';

function useWagonSave() {
    const [wagon, setWagon] = useState<any>(null);
    const [errors, setErrors] = useState<any>(null);
    const letras = 'abcdefghijklmnopqrstuvwxyz';

    const handleChangeWagon = (event: any) => {
        const { name, value, checked } = event?.target;
        if (!value) {
            let auxData = { ...wagon };
            delete auxData[name];
            setWagon(auxData);
        } else {
            setWagon({
                ...wagon,
                [name]: (checked && checked) || value
            });
        }
    };

    const resetForm = () => setWagon(null);

    const calcularDigitoVerificador = (event: any) => {
        const codigoContenedor = event?.target?.value;
        if (!codigoContenedor) return setErrors(null);

        const [codigo, codigoVerificador] = codigoContenedor.split('-');
        if (codigo.length !== 10 || /\s/.test(codigo))
            return setErrors({ nroContenedor: 'Número de contenedor inválido' });
        const sum = codigo.split('').reduce((acc: any, char: any, index: any) => {
            let temp = 0;
            if (index < 4) {
                temp = letras.indexOf(char.toLowerCase()) + 10;
                if (temp > 10 && temp < 22) temp += 1;
                else if (temp >= 22 && temp < 33) temp += 2;
                else if (temp >= 33) temp += 3;
            } else temp = char * 1;
            acc += temp * Math.pow(2, index);
            return acc;
        }, 0);
        const value = Math.floor(sum / 11) * 11;

        if ((sum - value) % 10 === codigoVerificador * 1) {
            setErrors(null);
            return true;
        }
        return setErrors({ nroContenedor: 'Número de contenedor inválido' });
    };

    return {
        wagon,
        errors,
        resetForm,
        handleChangeWagon,
        calcularDigitoVerificador
    };
}

export default useWagonSave;
