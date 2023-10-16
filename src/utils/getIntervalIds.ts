import { UserData } from '../store/users/types';

export const getIntervalIds = (ids: number[], users: UserData[]) => {
  let isEnd = false, isBegin = false;

  const selectedIds: number[] = users.reduce((acc: number[], user, index, users) => {
    if (user.id === ids[0]) isBegin = true;
    if (index > 0 && users[index - 1].id === ids[1]) isEnd = true;
    if (isBegin && !isEnd) return [...acc, user.id];
    return acc;
  }, []);

  return selectedIds;
};

