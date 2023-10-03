interface GeoData {
  lat: string,
  lng: string,
}

interface CompanyData {
  name: string,
  bs: string,
  catchPhrase: string,
}

interface AddressData {
  street: string,
  city: string,
  suite: string,
  zipcode: string,
  geo: GeoData,
}

export interface UserData {
  id: number,
  name: string,
  username: string,
  phone: string,
  email: string,
  website: string,
  company: CompanyData,
  address: AddressData,
}

export interface PostData {
  id: number,
  body: string,
  title: string,
  userId: number,
}

export interface StoreState {
  users: UserData[],
  usersError: string,
  countsUsersPosts: number[],
  allPosts: PostData[],
  startUserNumber: number;
  currentUsers: number[],
  userPosts: PostData[],
  postsError: string,
  getUsers: () => Promise<void>,
  setCountsUsersPosts: () => void
  getAllPosts: () => Promise<void>,
  setStartUserNumber: (userNumber: number) => void,
  setCurrentUsers: (userNumber: number) => void,
  getUserPosts: (userId: number) => Promise<void>,
}

