interface Listing {
  isFavorite: boolean
  id: number
  thumbnail_name: string
  image_names?: string
  price: number | null
  contract: string
  description: string
  streetname: string
  number: number
  bus?: string
  zip: string
  city: string
}

export interface Property extends Listing {
  type: string
  living_area: number
  building_area: number
  garden_area: number
  bedrooms: number
  bathrooms: number
  building_year: number
  epc: string
  garagesize: number
}
export interface Land extends Listing {
  type: string
  area: number
}

export interface DecodedToken {
  immo_id: object
  username: string
  roles: string
  exp: number
}

export interface JWTResponse {
  accessToken: string
}

export interface immo {
  id: number
  name: string
  address_id: number
  link: string
  logo: string
  streetname: string
  number: number
  bus?: string
  zip: string
  city: string
}

export type Role = "admin" | "user" | "employee" | "immo"
