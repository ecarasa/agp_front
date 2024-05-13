import { useEffect, useState } from 'react';
import {
    useEditContenidoMutation,
    useDeleteContenidoMutation,
    useCreateContenidoMutation,
    useGetGestorContenidoQuery,
    useLazyGetGestorContenidoByIdPaginaQuery,
    usePublishContenidoMutation
} from '../../../services/newsApi';
import { handleErrors } from '../../../utils/common';
import useGlobalFilters from '../../../hooks/useGlobalFilters';
import { useAppDispatch } from '../../../hooks/reduxHooks';
import { setPublicContentData } from '../../../features/slices/applicationSlice';
import { useLocation } from 'react-router-dom';

function useService() {
    const location = useLocation();
    const newsPath =
        location?.pathname.includes('noticias') ||
        location?.pathname.includes('novedades') ||
        location?.pathname.includes('disposiciones');

    const { filters } = useGlobalFilters();
    const dispatch = useAppDispatch();

    const {
        data: publicData,
        isLoading: loadingContent,
        refetch: refetchContentData
    } = useGetGestorContenidoQuery({ filters }, { refetchOnMountOrArgChange: false });
    const [getByPagina] = useLazyGetGestorContenidoByIdPaginaQuery();
    const [editContenido, { isLoading: updatingContent }] = useEditContenidoMutation();
    const [createContenido, { isLoading: creatingContent }] = useCreateContenidoMutation();
    const [removeContenido, { isLoading: removingContent }] = useDeleteContenidoMutation();
    const [publishContenido, { isLoading: publishingContent }] = usePublishContenidoMutation();

    const [loadingContentByPage, setLoadinContentByPage] = useState<boolean>(true);

    const fetchByPagina = async (idPagina: number): Promise<any> => {
        setLoadinContentByPage(true);
        const { data } = await getByPagina({ idPagina });
        setLoadinContentByPage(false);
        dispatch(setPublicContentData(data));
    };

    const createContent = async (body: any, idSeccion: number) => {
        const contentResponse: any = await createContenido({ body, idSeccion });
        if (contentResponse?.error) {
            handleErrors(contentResponse.error);
            throw new Error(contentResponse.error);
        }
    };

    const updateContentById = async (body: any, idContenido: number) => {
        const contentResponse: any = await editContenido({ body, idContenido });
        if (contentResponse?.error) {
            handleErrors(contentResponse.error);
            throw new Error(contentResponse.error);
        }
    };

    const removeContentById = async (idContenido: number) => {
        const contentResponse: any = await removeContenido({ idContenido });
        if (contentResponse?.error) {
            handleErrors(contentResponse.error);
            throw new Error(contentResponse.error);
        }
    };

    const publishContent = async (idSeccion: number) => {
        const contentResponse: any = await publishContenido({ idSeccion });
        if (contentResponse?.error) {
            handleErrors(contentResponse.error);
            throw new Error(contentResponse.error);
        }
    };

    useEffect(() => {
        if (publicData) {
            const { data } = publicData;
            const found = data?.data?.find((n: any) => n.nombre === 'HOME PORTAL PUBLICO'); //FIXME: SHOULD BE BETTER!
            if (found && !newsPath) fetchByPagina(found.id);
        }
        // eslint-disable-next-line
    }, [publicData]);

    return {
        publicData,
        loadingContent,
        loadingContentByPage,
        updatingContent,
        removingContent,
        creatingContent,
        publishingContent,
        refetchContentData,
        fetchByPagina,
        createContent,
        updateContentById,
        removeContentById,
        publishContent
    };
}

export default useService;
