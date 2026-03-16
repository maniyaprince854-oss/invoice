export type ID = string

export interface Address {
  line1: string
  line2: string
  city: string
  state: string
  pincode: string
  country: string
}

export interface Timestamps {
  createdAt: string
  updatedAt: string
}
