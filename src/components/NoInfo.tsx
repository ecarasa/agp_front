import { useTranslation } from 'react-i18next';

type Prop = {
    text?: string;
};
function NoInfo({ text }: Prop) {
    const { t } = useTranslation('userForm');
    return (
        <div style={{ margin: '15px auto', display: 'flex', justifyContent: 'center' }}>
            <span>{t(text || 'noinfo')}</span>
        </div>
    );
}

export default NoInfo;
