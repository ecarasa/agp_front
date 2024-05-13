import _ from 'lodash';
import { handleErrors } from '../../../../../utils/common';
import { showAlert } from '../../../../../features/slices/applicationSlice';
import { useAppDispatch } from '../../../../../hooks/reduxHooks';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useFetch from './useFetch';

interface DataProps {
    nombre?: string;
    idsPrestadores?: number[];
    idGerencia?: GerenciaProps;
    activo?: boolean;
    atributos?: AttributesProps[];
}

type AttributesProps = {
    id: number;
    nombre: string;
    requiereAdjunto: boolean;
    obligatorio: boolean;
    activo: boolean;
    tipo: string;
    nota: string;
};

type GerenciaProps = {
    id: number;
    activo: boolean;
    nombre: string;
};

const defaultAttributes = {
    id: 0,
    nombre: '',
    requiereAdjunto: false,
    obligatorio: false,
    activo: false,
    tipo: '',
    nota: ''
};

function useServiciosSave() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const [data, setData] = useState<DataProps | null>(null);
    const [attributes, setAttributes] = useState<AttributesProps>(defaultAttributes);
    const [openCard, setOpenCard] = useState<any>(null);
    const [selected, setSelected] = useState<any>(null);

    const { addService, editService, serviceById, ...fetchProps } = useFetch(id);

    const loadData = () => {
        setData({
            nombre: serviceById?.nombre,
            activo: serviceById?.activo,
            idGerencia: serviceById?.gerencia,
            idsPrestadores: serviceById?.prestadores,
            atributos: serviceById?.atributos
        });
    };

    useEffect(() => {
        if (serviceById && !data) loadData();
        // eslint-disable-next-line
    }, [serviceById, data]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, dataType?: string) => {
        const { name, value, checked, type } = e.target;

        if (dataType === 'attributes') {
            setAttributes({
                ...attributes,
                [name]: type === 'checkbox' ? checked : value
            });
        } else {
            setData({
                ...data,
                [name]: type === 'checkbox' ? checked : value
            });
        }
    };

    const handleOpenCard = (item: any) => {
        setSelected(item);
        setOpenCard(true);
    };

    const handleCloseCard = () => {
        setSelected(null);
        setOpenCard(false);
    };

    const handleSubmit = () => {
        const submit = async () => {
            let auxAttributes: any = [];

            if (!!id) {
                auxAttributes = data?.atributos?.map((item: any) => {
                    let auxItem = { ...item };
                    if (!serviceById?.atributos?.find((i: any) => i.id === auxItem.id)) {
                        auxItem['id'] = null;
                        return auxItem;
                    }
                    return auxItem;
                });
            } else {
                auxAttributes = data?.atributos?.map((item: any) => {
                    let auxItem = { ...item };
                    delete auxItem['id'];
                    return auxItem;
                });
            }

            const body = {
                nombre: data?.nombre,
                idsPrestadores: data?.idsPrestadores?.map((item: any) => item?.id),
                idGerencia: data?.idGerencia?.id,
                activo: data?.activo || false,
                atributos: auxAttributes
            };

            const response: any = !id
                ? await addService(body)
                : await editService({ serviceId: id, body: body });

            if (!response?.error) {
                dispatch(
                    showAlert({
                        title: `¡Servicio ${!!id ? 'editado' : 'creado'} correctamente!`,
                        confirmText: 'Cerrar',
                        keepMounted: true,
                        confirmAction: () => navigate('/agp/servicios-nave/administracion')
                    })
                );
            } else {
                handleErrors(response?.error);
            }
        };

        dispatch(
            showAlert({
                title: `¿${!!id ? 'Editar servicio' : 'Crear nuevo servicio'}?`,
                confirmText: 'Confirmar',
                confirmAction: submit,
                cancelText: 'Cancelar',
                keepMounted: true,
                icon: 'info'
            })
        );
    };

    const confirmAction = () => {
        dispatch(
            showAlert({
                title: 'Activar'
            })
        );
    };

    const clearAttributeInputs = () => setAttributes(defaultAttributes);

    const handleAddAttribute = () => {
        setData({
            ...data,
            atributos: [
                ...(data?.atributos || []),
                ...[{ ...attributes, id: Math.ceil(Math.random() * 10000) }]
            ]
        });
    };

    const getDisabledSubmitButton = useCallback(() => {
        let auxData: any = {
            nombre: data?.nombre,
            activo: data?.activo,
            prestadores: data?.idsPrestadores,
            gerencia: data?.idGerencia,
            atributos: data?.atributos
        };

        delete auxData['id'];
        let auxServiceById = { ...serviceById };
        delete auxServiceById['id'];

        return (!id && !data?.atributos?.length) || (!!id && _.isEqual(auxData, auxServiceById));
        // eslint-disable-next-line
    }, [data, serviceById, id]);

    const handleActivateAttribute = () => {
        const activateDesactivate = () => {
            let auxItem: any = { ...selected };
            auxItem.activo = !selected.activo;

            if (data?.atributos) {
                const attributeIndex = data?.atributos?.findIndex(
                    (i: any) => i.id === selected?.id
                );
                let auxAttributes = [...data?.atributos];

                auxAttributes?.splice(attributeIndex, 1, auxItem);

                setData({
                    ...data,
                    atributos: auxAttributes
                });
                setSelected(auxItem);
            }
        };

        dispatch(
            showAlert({
                title: `¿Desea ${selected?.activo ? 'desactivar' : 'activar'} el atributo?`,
                keepMounted: true,
                icon: 'info',
                confirmText: 'Confirmar',
                cancelText: 'Cancelar',
                confirmAction: activateDesactivate
            })
        );
    };

    return {
        id,
        data,
        openCard,
        selected,
        attributes,
        serviceById,
        handleChange,
        handleAddAttribute,
        handleOpenCard,
        handleActivateAttribute,
        handleCloseCard,
        handleSubmit,
        getDisabledSubmitButton,
        clearAttributeInputs,
        confirmAction,
        ...fetchProps
    };
}

export default useServiciosSave;
