interface CoordinatesData {
  lat: string,
  lng: string,
}

interface CompanyData {
  address: AddressData,
  departament: string,
  name: string,
  title: string,
}

interface AddressData {
  address: string,
  city: string,
  street: string,
  coordinates: CoordinatesData,
  postalCode: string,
  state: string,
}

export interface UserData {
  id: number,
  firstName: string,
  lastName: string,
  age: number,
  gender: string,
  email: string,
  phone: string,
  username: string,
  address: AddressData,
  company: CompanyData
}

