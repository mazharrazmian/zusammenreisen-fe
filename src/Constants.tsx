import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import TransgenderIcon from '@mui/icons-material/Transgender';


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


// Map gender values to icons
const genderIconMap = {
    1: MaleIcon,
    2: FemaleIcon,
    3: TransgenderIcon,
  };
  

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

export default GenderIcon;