export interface City {
  id: number;
  name: string;
  latitude: string;
  longitude: string;
}

export interface State {
  id: number;
  name: string;
  state_code: string;
  latitude: string;
  longitude: string;
  cities: City[];
}

export interface Country {
  id: number;
  name: string;
  iso3: string;
  iso2: string;
  numeric_code: string;
  phone_code: string;
  capital: string;
  currency: string;
  currency_name: string;
  currency_symbol: string;
  tld: string;
  native: string;
  region: string;
  region_id: string;
  subregion: string;
  subregion_id: string;
  nationality: string;
  latitude: string;
  longitude: string;
  states: State[];
}

