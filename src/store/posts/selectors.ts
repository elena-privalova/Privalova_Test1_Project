import { PostsState, usePostsStore } from '..';

export const selectIsUsersPostsLoading = (state: PostsState) => state.isUsersPostsLoading;
export const selectUserPosts = (state: PostsState) => state.userPosts;
export const selectUserPostsByCmd = (state: PostsState) => state.userPostsByCmd;
export const selectUserPostsError = (state: PostsState) => state.userPostsError;

export const setUsersPostsByCmd = usePostsStore.getState().setUsersPostsByCmd;
export const getUserPosts = usePostsStore.getState().getUserPosts;

