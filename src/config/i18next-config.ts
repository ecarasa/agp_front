import i18n from 'i18next';
import layoputEn from '../translations/en/layoutT.json';
import layoputEs from '../translations/es/layoutT.json';
import userFormEn from '../translations/en/userForm.json';
import userFormEs from '../translations/es/userForm.json';
import userCommunicationEs from '../translations/es/communications.json';
import userCommunicationEn from '../translations/en/communications.json';
import contentEn from '../translations/en/content.json';
import contentEs from '../translations/es/content.json';
import roleEs from '../translations/es/role.json';
import roleEn from '../translations/en/role.json';

i18n.init({
    debug: false,
    interpolation: { escapeValue: false },
    lng: 'es',
    resources: {
        es: {
            layoutT: layoputEs,
            userForm: userFormEs,
            communications: userCommunicationEs,
            content: contentEs,
            roles: roleEs
        },
        en: {
            layoutT: layoputEn,
            userForm: userFormEn,
            communications: userCommunicationEn,
            content: contentEn,
            roles: roleEn
        }
    }
});

export default i18n;
