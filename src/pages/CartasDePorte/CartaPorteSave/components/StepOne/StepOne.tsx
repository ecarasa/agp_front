import ClientDataForm from './ClientDataForm';
import ConsigneeDataForm from './ConsigneeDataForm';
import ItineraryDataForm from './ItineraryDataForm';
import LoaderDataForm from './LoaderDataForm';
import Loading from '../../../../../components/Loading';
import SectionFormAccordion from '../../../../../components/SectionFormAccordion/SectionFormAccordion';

function StepOne(props: any) {
    return props?.loadingCities ? (
        <Loading size="small" />
    ) : (
        <>
            <SectionFormAccordion title="Itinerario Solicitud por el Cliente">
                <ItineraryDataForm {...props} />
            </SectionFormAccordion>
            <SectionFormAccordion title="Cliente">
                <ClientDataForm {...props} />
            </SectionFormAccordion>
            <SectionFormAccordion title="Cargador">
                <LoaderDataForm {...props} />
            </SectionFormAccordion>
            <SectionFormAccordion title="Consignatario">
                <ConsigneeDataForm {...props} />
            </SectionFormAccordion>
        </>
    );
}

export default StepOne;
