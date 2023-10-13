import { create } from 'zustand';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';

import api from '../adapter';
import { UserData } from '../users/types';
import { getIndex } from '../../utils/getIndex';
import { useUserStore } from '../users/usersStore';

import { PostData } from './types';

export type PostsState = {
  activePage: number,
  userPosts: PostData[],
  userPostsByCmd: number[],
  userPostsError: string,
  error: string,
  setActivePage: (numberPage: number) => void;
  getIntervalUsers: (ids: string[], users: UserData[]) => Promise<PostData[]>;
  getUserPosts: (ids: string, selectedByShift: boolean) => Promise<void>,
  setUsersPostsByCmd: (id: number) => void
}

export const usePostsStore = create<PostsState>((set, get) => ({
  activePage: 1,
  userPosts: [],
  userPostsByCmd: [],
  userPostsError: '',
  error: '',
  countsUsersPosts: [],
  setActivePage: (numberPage: number) => {
    set({ activePage: numberPage });
  },
  getIntervalUsers: async (ids: string[], users: UserData[]) => {
    const startIndex = getIndex(users, Number(ids[0]));
    const endIndex = getIndex(users, Number(ids[1]));

    const usersPosts = await Promise.all(users.slice(startIndex, endIndex + 1).map((user) => {
      return api.get(`posts/user/${user.id}`).then(res => res.data.posts);
    }));

    return usersPosts.flat();
  },
  getUserPosts: async(ids: string, selectedByShift: boolean) => {
    const users = useUserStore.getState().users;

    try {
      set({ userPosts: [] });
      if (ids.length === 1) {
        const { data } = await api.get(`posts/user/${ids[0]}`);
        set({ userPosts: data.posts });
        return;
      }

      if (selectedByShift) {
        const usersPosts = await get().getIntervalUsers(ids.split('-'), users);

        set({
          userPosts: usersPosts,
          userPostsError: '',
          error: ''
        });
        return;
      }

      const separatedIdsByComma = ids.split(',');
      const sliceSeparatedIds = separatedIdsByComma.filter((elem) => elem.includes('-'));

      let intervalOfUsersPosts: PostData[][] = [],
        isStartOnInterval = false,
        sliceIds: string[] = separatedIdsByComma;

      if (sliceSeparatedIds.length > 0) {
        intervalOfUsersPosts = await Promise.all(sliceSeparatedIds.map((elem) => {
          return get().getIntervalUsers(elem.split('-'), users);
        }));

        isStartOnInterval = separatedIdsByComma[0].includes('-');

        sliceIds = separatedIdsByComma.filter((id) => !id.includes('-'));
      }

      const usersPosts = await Promise.all(sliceIds.map((id) => {
        const user = users.find((user) => user.id === Number(id));
        return api.get(`posts/user/${user!.id}`).then(res => res.data.posts);
      }));

      set({
        userPosts: isStartOnInterval ?
          [...intervalOfUsersPosts.flat(), ...usersPosts.flat()] :
          [...usersPosts.flat(), ...intervalOfUsersPosts.flat()],
        userPostsError: '',
        error: ''
      });
    } catch(e) {
      if (e instanceof AxiosError) {
        set({ userPostsError: e.message });
        toast.error(e.message);
        return;
      }
      set({ error: 'Failed to get posts' });
    }
  },
  setUsersPostsByCmd: (id: number) => {
    if (Number(id) === -1) {
      set({ userPostsByCmd: [] });
      return;
    }
    set({ userPostsByCmd: [...get().userPostsByCmd, Number(id)] });
  }
}));

