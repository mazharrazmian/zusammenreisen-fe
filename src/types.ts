// Define filter state type


export interface Country{

    'id' : number,
    'name' : string,
}

export interface City{
    'id' : number,
    'name' : string,
}

export interface FilterState {
  country : string;
  city : string,
  gender: number | "";
  date_from : string,
  date_to : string,
}
