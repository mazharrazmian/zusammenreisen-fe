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
