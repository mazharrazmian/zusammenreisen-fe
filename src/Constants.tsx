import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import TransgenderIcon from '@mui/icons-material/Transgender';
import { AttachMoney, Category, CreditCard, DirectionsWalk, LocalActivity, LocalOffer, LocationOn, Luggage } from '@mui/icons-material';
import i18n from './i18n'; // Import the i18n instance to detect the current language

export const GENDERS = [
    {
        'value' : 1,
        'display' : 'male',
    
    },
    {
        'value' : 2,
        'display' : 'female',
    },
    {
        'value' : 3,
        'display' : 'other',
    }
   
]

export const REQUESTSTATUS = {
    'Pending' : 1,
    'Rejected' : 2,
    'Accepted' : 3
}

export function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
  }

// Map gender values to icons
const genderIconMap = {
    1: MaleIcon,
    2: FemaleIcon,
    3: TransgenderIcon,
  };


  //Maps content_type in notification model
  // in django to apps in React.

  export const ContentTypeMap = {
    'postrequest' : 'requests',
    'chatroom' : 'chat', 
    'post' : 'tripplanner',
  }
  

  // GenderIcon component
const GenderIcon = ({ gender }: { gender: number }) => {
  // Get the corresponding icon component from the map
  const IconComponent = genderIconMap[gender];

  // If no valid icon is found, return null or a default icon
  if (!IconComponent) {
    return null; // or return <DefaultIcon />;
  }

  // Render the icon
  return  <IconComponent />;
  
  
};

// Add German translations for tourTypes and accommodationTypes
export const tourTypesTranslations = {
    en: [
        "adventure", "cultural", "beach", "mountain", "city", "wildlife", 
        "food", "photography", "backpacking", "luxury", "budget", "other"
    ],
    de: [
        "Abenteuer", "Kultur", "Strand", "Berg", "Stadt", "Wildtiere", 
        "Essen", "Fotografie", "Rucksacktour", "Luxus", "Budget", "Andere"
    ]
};

export const accommodationTypesTranslations = {
    en: [
        "hotel", "hostel", "apartment", "camping", "homestay", "resort", "other"
    ],
    de: [
        "Hotel", "Hostel", "Apartment", "Camping", "Gastfamilie", "Resort", "Andere"
    ]
};

// Helper function to get translated values
export const getTranslatedArray = (key) => {
    const language = i18n.language || 'en'; // Default to English if no language is set
    return key[language] || key['en'];
};

export const tourTypes = tourTypesTranslations.en; // Default export remains in English
export const accommodationTypes = accommodationTypesTranslations.en; // Default export remains in English

export const ageGroups = ["18-24", "25-34", "35-44", "45-54", "55-64", "65-over", "any"];

// Helper functions for icons
export const getTripTypeIcons = (type) => {
    switch (type) {
        case 'adventure':
            return <DirectionsWalk />;
        case 'cultural':
            return <LocalActivity />;
        case 'beach':
            return <Luggage />;
        case 'mountain':
            return <Luggage />;
        case 'city':
            return <LocationOn />;
        case 'wildlife':
            return <Luggage />;
        case 'food':
            return <LocalOffer />;
        case 'photography':
            return <Luggage />;
        case 'backpacking':
            return <Luggage />;
        case 'luxury':
            return <CreditCard />;
        case 'budget':
            return <AttachMoney />;
        default:
            return <Category />;
    }
};


export default GenderIcon;