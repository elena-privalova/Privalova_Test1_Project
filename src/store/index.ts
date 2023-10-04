import { create } from 'zustand';
import { AxiosError } from 'axios';

import api from './adapter';
import { StoreState } from './types';

export const useStore = create<StoreState>((set, get) => ({
  isUsersLoading: false,
  users: [],
  usersError: '',
  countsUsersPosts: [],
  allPosts: [],
  userPosts: [],
  postsError: '',
  getUsers: async() => {
    set({ isUsersLoading: true });
    try {
      const { data } = await api.get('users');
      set({ isUsersLoading: false });
      set({ users: data });
      set({ usersError: '' });
      get().setCountsUsersPosts();

    } catch (e) {
      if (e instanceof AxiosError) {
        set({ usersError: e.message });
      }
    }
  },
  setCountsUsersPosts: async() => {
    await get().getAllPosts();
    let currentCount = 0;
    get().allPosts.forEach((post, index, posts) => {
      if ((index + 1) < posts.length && post.userId === posts[index+1].userId) {
        currentCount++;
      }
      else{
        set({ countsUsersPosts: [...get().countsUsersPosts, currentCount + 1] });
        currentCount = 0;
      }
    });
  },
  getAllPosts: async() => {
    try {
      const { data } = await api.get('posts');
      set({ allPosts: data });
    } catch (e) {
      if (e instanceof AxiosError) {
        set({ postsError: e.message });
      }
    }
  },
  getUserPosts: async(startId: number, endId?: number) => {
    try {
      if (endId == undefined) {
        const { data } = await api.get(`posts?userId=${startId}`);
        set({ userPosts: data });
      }
      else {
        if (get().userPosts.length > 0) set({ userPosts: [] });
        console.log(get().userPosts);
        const startIndex = get().users.findIndex((user) => user.id === startId);
        const endIndex = get().users.findIndex((user) => user.id === endId);
        const sliceUsers = get().users;
        sliceUsers.slice(startIndex, endIndex+1).forEach((user) => {
          api.get(`posts?userId=${user.id}`)
            .then(res => {
              set({ userPosts: [...get().userPosts, ...res.data] });
              console.log('then', get().userPosts);
            });
        });
      }
    }
    catch(e) {
      if (e instanceof AxiosError) {
        console.log(e.message);
      }
    }
  }
}));

