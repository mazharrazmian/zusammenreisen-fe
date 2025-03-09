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
  
  interface Trip {
    id: number;
    posted_by: Profile;
    travel_to_country: string;
    travel_to_city: string;
    travel_from_country: string;
    travel_from_city: string;
    image: string | null;
    date_from: string;
    date_to: string;
    dates_flexible: boolean;
    age_group: string;
    group_size: number;
    current_travellers: number;
    tour_type: string;
    activities: string[];
    title: string;
    accommodation_type: string;
    estimated_cost: number | null;
    cost_includes: string;
    requirements: string;
    itinerary: string;
    description: string;
    posted_on: string;
    travel_to_postal_code: string | null;
  }
  
  interface TripRequest {
    id: number;
    from_profile: Profile;
    status: number;
    trip: Trip;
    message: string;
    post: number;
    to_profile: number;
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
  
  // Example usage with more specific types:
  interface EnhancedTripRequest extends Omit<TripRequest, 'status'> {
    status: RequestStatus;
  }
  
  interface EnhancedProfile extends Omit<Profile, 'gender'> {
    gender: Gender;
  }