import { useLocation } from 'react-router-dom';

function useValidations() {
    const location = useLocation();
    const isNavi = location?.pathname?.includes('navi');
    const isRenewal = location?.pathname?.includes('renovacion');

    const naviValidations = isNavi;
    const dockingValidations = !isNavi;

    return { naviValidations, dockingValidations };
}

export default useValidations;
