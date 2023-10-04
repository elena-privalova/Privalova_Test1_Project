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
  isUsersLoading: boolean,
  users: UserData[],
  usersError: string,
  countsUsersPosts: number[],
  allPosts: PostData[],
  userPosts: PostData[],
  postsError: string,
  getUsers: () => Promise<void>,
  setCountsUsersPosts: () => void
  getAllPosts: () => Promise<void>,
  getUserPosts: (startId: number, endId?: number) => Promise<void>,
}

