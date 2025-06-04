export interface Address {
    addressId: string;
    userId?: string;
    classId?: string;
    requestId?: string;
    province: string;
    district: string;
    ward?: string;
    street?: string;
    fullAddres: string;
    latitude: number;
    longitude: number;
}
export interface AddressCreateRequest {
    userId?: string;
    classId?: string;
    requestId?: string;
    province?: string;
    district?: string;
    ward?: string;
    street?: string;
    fullAddress: string;
    latitude?: number;
    longitude?: number;
}

export interface AddressAutoComplete {
  place_id: number;
  licence: string;
  osm_type: 'node' | 'way' | 'relation';
  osm_id: number;
  boundingbox: [string, string, string, string];
  lat: string;
  lon: string;
  display_name: string;
  class: string;
  type: string;
  importance: number;
  addresstype?: string;
  name?: string;
  address: {
    country?: string;
    country_code?: string;
    city?: string;
    suburb?: string;
    quarter?: string;
    road?: string;
    postcode?: string;
    [key: string]: any; 
  };
}
