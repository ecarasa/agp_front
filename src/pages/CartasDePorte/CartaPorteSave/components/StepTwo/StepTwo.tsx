import SectionFormAccordion from '../../../../../components/SectionFormAccordion/SectionFormAccordion';
import WagonsDataForm from './WagonsDataForm';

function StepTwo(props: any) {
    return (
        <>
            <SectionFormAccordion title="Alta de vagones" staticDropDown>
                <WagonsDataForm {...props} />
            </SectionFormAccordion>
        </>
    );
}

export default StepTwo;
