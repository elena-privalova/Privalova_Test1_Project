import { create } from 'zustand';
import { AxiosError } from 'axios';

import api from './adapter';

const useStore = create<StoreState>((set, get) => ({
  users: [],
  usersError: '',
  countsUsersPosts: [],
  allPosts: [],
  userPosts: [],
  postsError: '',
  getUsers: async() => {
    try {
      const { data } = await api.get('users');
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
  getUserPosts: async(userId: number) => {
    try {
      const { data } = await api.get(`posts?userId=${userId}`);
      set({ userPosts: data });
    }
    catch(e) {
      if (e instanceof AxiosError) {
        console.log(e.message);
      }
    }
  }
}));

export default useStore;

