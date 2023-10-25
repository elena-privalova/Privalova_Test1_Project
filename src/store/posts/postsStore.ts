import { create } from 'zustand';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';

import { useUserStoreBase } from '..';
import api from '../adapter';
import createSelectors from '../selectors';

import { PostData } from './types';

export type PostsState = {
  isUsersPostsLoading: boolean,
  isReadyToAddInterval: boolean,
  userPosts: PostData[],
  userPostsByCmd: number[],
  userPostsError: string,
  error: string,
}

type PostsActions = {
  getUserPosts: (id?: string) => Promise<void>,
  setUsersPostsByCmd: (id: number | number[]) => void,
  setIsReadyToAddInterval: (isReady: boolean) => void
};

export const usePostsStoreBase = create<PostsState & PostsActions>((set, get) => ({
  isUsersPostsLoading: false,
  isReadyToAddInterval: false,
  userPosts: [],
  userPostsByCmd: [],
  userPostsError: '',
  error: '',
  countsUsersPosts: [],
  getUserPosts: async (id?: string) => {
    const selectedUsersIds = useUserStoreBase.getState().selectedUsersIds;

    set({ isUsersPostsLoading: true });

    try {
      set({ userPosts: [] });
      if (id != undefined) {
        const { data } = await api.get(`posts/user/${id}`);
        set({ userPosts: data.posts });
        return;
      }

      const usersPosts = await Promise.all(selectedUsersIds.map((id) => {
        return api.get(`posts/user/${id}`).then(res => res.data.posts);
      }));

      set({
        isUsersPostsLoading: false,
        userPosts: usersPosts.flat(),
        userPostsByCmd: selectedUsersIds,
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
  setUsersPostsByCmd: (id: number | number[]) => {
    if (Array.isArray(id)) {
      set({ userPostsByCmd: id });
      return;
    }

    if (Number(id) === -1) {
      const postsByCmd = get().userPostsByCmd;
      postsByCmd.shift();
      set({ userPostsByCmd: postsByCmd });
      return;
    }

    set({ userPostsByCmd: [...get().userPostsByCmd, id] });
  },
  setIsReadyToAddInterval: (isReady: boolean) => {
    set({ isReadyToAddInterval: isReady });
  }
}));

export const usePostsStore = createSelectors(usePostsStoreBase);

