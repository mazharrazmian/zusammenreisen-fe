// Define filter state type


export interface Country{

    'id' : string,
    'name' : string,
}

export interface City{
    'id' : string,
    'name' : string,
}

export interface FilterState {
  country_to : string;
  city_to : string,
  country_from : string,
  city_from : string,
  gender: number | "";
  date_from : string,
  date_to : string,
  page : number,
  group_size : number | "",
  age_group : string,
}


export interface Profile {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    profile : {
        id : number,
        picture : URL,
        gender : number,
        phone : string,
        age : number,
        languages : []
    }
  }
  

  export interface Participant {
    chat_room: number;
    profile: Profile;
  }
  
  export interface Message {
    chat_room: number;
    sender: Profile;
    content: string;
    timestamp: string;
  }
  
  export interface ChatRoom {
    id: number;
    created_at: string;
    participants: Participant[];
    messages: Message[];
  }
  
  export interface UserChats {
    loading: string;
    data: ChatRoom[];
  }
  


  export interface Notification {
    title : string,
    id : number,
    message : string,
    unread : boolean,
    created_at : string,
    chat_room : null | number
  }






  interface User {
    name: string;
    email: string;
  }
  
  interface Language {
    name: string;
  }

  
export interface TourDataInterface {
    title: string,
    description: string,
    itinerary: string,
    fromCountry: any | null,
    fromCity: any | null,
    toCountry: any | null,
    toCity: any | null,
    departureDate: string,
    returnDate: string,
    groupSize: number,
    currentTravellers: number,
    tourType: string,
    activities: string[],
    accommodationType: string,
    estimatedCost: number,
    ageGroup: string,
    costIncludes: string,
    requirements: string,
    images: [],
    dates_flexible: boolean,
    posted_on : string,
}

  
export interface tripRequest {
    from_profile : Profile,
    id : number,
    message : string,
    post : number,
    status : RequestStatus,
    to_profile : number,
    trip : TourDataInterface
}

  
  // Optional enums for better type safety:
  enum Gender {
    Male = 1,
    Female = 2,
    Other = 3
  }
  
  enum RequestStatus {
    Pending = 1,
    Approved = 2,
    Rejected = 3
  }
  