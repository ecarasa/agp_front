import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetWaybillsByFormacionIdQuery } from '../../../../services/railwaysApi';

function useCartasPorteFormacion({ filters }: any) {
    const { id } = useParams();
    const [data, setData] = useState<any>(null);
    const {
        data: cartasDePorte,
        isLoading,
        isFetching
    } = useGetWaybillsByFormacionIdQuery({ id, filters });

    useEffect(() => {
        if (cartasDePorte) {
            setData({
                data: {
                    ...cartasDePorte?.data,
                    data: cartasDePorte?.data?.data?.map((i: any) => ({
                        ...i,
                        initialId: i.id,
                        id: Math.ceil(Math.random() * 100000)
                    }))
                }
            });
        }
    }, [cartasDePorte]);

    return { data, isLoading, isFetching };
}

export default useCartasPorteFormacion;
