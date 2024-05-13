import { useGetParametricDataQuery } from '../../../services/companyApi';

const useCompany = () => {
    const { data: parametricData } = useGetParametricDataQuery();
    return { parametricData };
};

export default useCompany;
