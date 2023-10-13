import { UserData } from '../store/users/types';

export const getIndex = (users: UserData[], id: number) => {
  return users.findIndex((user) => user.id === id);
};

