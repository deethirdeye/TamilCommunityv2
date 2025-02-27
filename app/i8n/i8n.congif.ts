import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./translation/en.json";
import ta from "./translation/ta.json";

const resources = {
  en: {
    translation: en,
  },
  ta: {
    translation: ta,
  },
};

i18next.use(initReactI18next).init({
  debug: true,
  lng: 'en',
  compatibilityJSON: 'v3',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  resources: resources,
});

export default i18next;
