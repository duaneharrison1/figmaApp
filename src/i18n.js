import i18n from 'i18next';
import englishTranslation from './english.json';
import spanishTranslation from './spanish.json';
import germanTranslation from './german.json';
import { initReactI18next } from 'react-i18next';

const resources = {
    en: {
        translation: englishTranslation
    },
    es: {
        translation: spanishTranslation
    },
    de: {
        translation: germanTranslation
    }

};

i18n
    .use(initReactI18next) // Initializes i18next with react-i18next
    .init({
        resources,
        lng: 'en', // Set the default language
        fallbackLng: 'en', // Fallback language if translations are missing
        interpolation: {
            escapeValue: false, // Prevent escaping special characters in translations
        },
    });

export default i18n;