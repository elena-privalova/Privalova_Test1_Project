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

interface UserData {
  id: number,
  name: string,
  username: string,
  phone: string,
  email: string,
  website: string,
  company: CompanyData,
  address: AddressData,
}

interface PostData {
  id: number,
  body: string,
  title: string,
  userId: number,
}

interface StoreState {
  users: UserData[],
  usersError: string,
  countsUsersPosts: number[],
  allPosts: PostData[],
  userPosts: PostData[],
  postsError: string,
  getUsers: () => Promise<void>,
  setCountsUsersPosts: () => void
  getAllPosts: () => Promise<void>,
  getUserPosts: (userId: number) => Promise<void>,
}

