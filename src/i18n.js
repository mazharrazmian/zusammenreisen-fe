import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend from "i18next-http-backend";


// Custom initial language logic
const domain = window.location.hostname;
const storedLanguage = localStorage.getItem("i18nextLng");

let initialLang = "en";
if (storedLanguage) {
  initialLang = storedLanguage;
} else if (domain.includes("zusammenreisen")) {
  initialLang = "de";
}


i18n
  .use(HttpBackend) // <- load translations via HTTP
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: initialLang, // <- set determined language
    fallbackLng: "en",
    ns: [
      'homepage', 'filters', 'triplist', 'tripdetails', 'accountpage', 'activateaccount', 'bloglist', 'chatpage', 'login', 'page404', 'passwordreset', 'receivedRequests',
       'register', 'requestmanagement', 'sentRequests', 'tourForm', 'translation', 'tripPlannerDetail' , 'tourForm', 'common', "footer"
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
