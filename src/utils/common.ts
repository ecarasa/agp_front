import dayjs from 'dayjs';
import { enqueueSnackbar } from 'notistack';

export const filterOptions = (options: Array<{}>, inputText: string, idPais: number) => {
    const normalizeText = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const filteredOptionsByIdPais = options?.filter((i: any) => i.idPais === idPais);
    const array = filteredOptionsByIdPais?.filter((i: any) =>
        normalizeText(i.nombre).toLowerCase().includes(normalizeText(inputText).toLowerCase())
    );
    return array || [{ nombre: 'No options', id: 0 }];
};

export const downloadFile = ({ blob, name }: any) => {
    const href = URL.createObjectURL(blob);
    const file = document.createElement('a');
    file.href = href;
    file.download = name;
    file.click();
    file.remove();
    URL.revokeObjectURL(href);
};

export const validateAccess = (functions: any, id: number) => {
    let accesible = false;

    if (functions?.funcionalidades.find((i: any) => i.id === id)) accesible = true;

    return accesible;
};

export const getDate = (date: any) => {
    if (!date) return '';
    const newDate = new Date(date);
    return dayjs(newDate.toISOString()).format('DD/MM/YYYY');
};

export const getDateTime = (date: any) => {
    if (!date) return '';
    const newDate = new Date(date);
    return dayjs(newDate.toISOString()).format('DD/MM/YYYY HH:mm');
};

export const downloadBase64File = (data: string, id: number, name?: string) => {
    const linkSource = `data:application/pdf;base64,${data}`;
    const downloadLink = document.createElement('a');
    const fileName = name ? `${name + '-' + id}.pdf` : `solicitud-de-giro-${id}.pdf`;
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
};

export const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export const handleErrors = (errors: any) => {
    if (Array.isArray(errors?.data?.message)) {
        return errors.data.message.forEach((msg: any) => {
            enqueueSnackbar(msg, {
                variant: 'error'
            });
        });
    } else {
        return enqueueSnackbar(errors?.data?.message || 'Ocurrió un error', {
            variant: 'error'
        });
    }
};

export function filterByKey<T extends Record<string, any>>(data: T[], query: string, key: string) {
    return data.filter((item: T) => item[key] === query);
}

export function urlPatternValidation(url: string): boolean {
    return new RegExp('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?').test(url);
}
