import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useGetTerminalsQuery } from '../../../../services/girosApi';

const useMovementRequest = ({ data }: any) => {
    const [movement, setMovement] = useState<any>(null);
    const [errors, setErrors] = useState<any>(null);
    const { data: terminals, isLoading } = useGetTerminalsQuery();

    useEffect(() => {
        if (movement?.fechaInicio) {
            handleValidation(movement?.fechaInicio, 'fechaInicio');
        }
        // eslint-disable-next-line
    }, [data?.fechaIngresoRada]);

    const overlappingMovement = (newMovement: any) => {
        let overlapped = null;

        const newMovInitialDate = new Date(newMovement.fechaInicio);
        const newMovFinalDate = new Date(newMovement.fechaFin);

        const initialTS = newMovInitialDate.getTime();
        const finalTS = newMovFinalDate.getTime();

        const auxDifference = (finalTS - initialTS) / 2;
        const mediumValue = finalTS - auxDifference;

        if (!!data?.movimientos?.length) {
            overlapped = data?.movimientos.find((mov: any) => {
                const inicio = new Date(mov?.fechaInicio);
                const fin = new Date(mov?.fechaFin);

                return (
                    (mediumValue >= inicio.getTime() && mediumValue <= fin.getTime()) ||
                    (newMovInitialDate >= inicio && newMovInitialDate < fin) ||
                    (newMovFinalDate > inicio && newMovFinalDate <= fin)
                );
            });
        }
        return !!overlapped;
    };

    const isBefore = (date: string) => {
        let value = false;
        const dateNow = new Date();
        dateNow.setHours(0, 0, 0, 0);
        const dateToCompare = new Date(date);

        if (dateToCompare < dateNow) {
            setErrors({
                ...errors,
                fechaIngresoRada: 'La fecha debe ser posterior a la actual.'
            });
            value = true;
        } else {
            if (errors?.fechaIngresoRada) {
                const newErrors = { ...errors };
                delete newErrors?.fechaIngresoRada;
                setErrors(newErrors);
            }
        }
        return value;
    };

    const handleValidation = (date: any, name: string) => {
        const dateToCompare = new Date(date);
        if (name === 'fechaInicio') {
            const rada = new Date(data?.fechaIngresoRada);
            const currentDate = new Date();

            if (dateToCompare < currentDate) {
                setErrors({
                    ...errors,
                    fechaInicio: 'Fecha de inicio debe ser posterior a fecha actual'
                });
            } else if (rada > dateToCompare) {
                setErrors({
                    ...errors,
                    fechaInicio: 'Fecha de inicio debe ser posterior a fecha de ingreso a Rada.'
                });
            } else {
                if (movement?.fechaFin) {
                    const fin = new Date(movement?.fechaFin);
                    if (dateToCompare >= fin) {
                        setErrors({
                            ...errors,
                            fechaFin: 'Fecha de fin debe ser posterior a fecha de inicio.'
                        });
                    } else {
                        if (errors?.fechaFin) delete errors?.fechaFin;
                    }
                }
                if (errors?.fechaInicio) {
                    const newErrors = { ...errors };
                    delete newErrors?.fechaInicio;
                    setErrors(newErrors);
                }
            }
        }
        if (name === 'fechaFin') {
            const inicio = new Date(movement?.fechaInicio);
            if (inicio >= dateToCompare) {
                setErrors({
                    ...errors,
                    fechaFin: 'Fecha de fin debe ser posterior a fecha de inicio.'
                });
            } else {
                if (errors?.fechaFin) {
                    const newErrors = { ...errors };
                    delete newErrors?.fechaFin;
                    setErrors(newErrors);
                }
            }
        }
        setMovement({
            ...movement,
            [name]: date
        });
    };
    return {
        errors,
        movement,
        terminals,
        isLoading,
        setErrors,
        setMovement,
        isBefore,
        overlappingMovement,
        handleValidation
    };
};

export default useMovementRequest;
