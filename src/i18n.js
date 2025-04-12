import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend from "i18next-http-backend";

i18n
  .use(HttpBackend) // <- load translations via HTTP
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    ns: [
      'homepage', 'filters', 'triplist', 'tripdetails', 'accountpage', 'activateaccount', 'bloglist', 'chatpage', 'login', 'page404', 'passwordreset', 'receivedRequests',
       'register', 'requestmanagement', 'sentRequests', 'tourForm', 'translation', 'tripPlannerDetail' , 'tourForm'
    ], // declare all namespaces here
    interpolation: {
      escapeValue: false,
    },
    backend: {
        loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

export default i18n;
