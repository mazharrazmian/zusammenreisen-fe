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
  country : string;
  city : string,
  gender: number | "";
  date_from : string,
  date_to : string,
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