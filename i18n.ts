// i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

import en from './locales/en.json';
import vi from './locales/vi.json';

const resources = {
  en: { translation: en },
  vi: { translation: vi },
};
const languageCode = Localization.locale?.split('-')[0] || 'en';
i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v4', 
    resources,
    lng: Localization.locale?.split('-')[0] || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
