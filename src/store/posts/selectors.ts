import { PostsState, usePostsStore } from '..';

export const selectActivePage = (state: PostsState) => state.activePage;
export const selectFinalPage = (state: PostsState) => state.finalPage;
export const selectIsUsersPostsLoading = (state: PostsState) => state.isUsersPostsLoading;
export const selectUserPosts = (state: PostsState) => state.userPosts;
export const selectUserPostsByCmd = (state: PostsState) => state.userPostsByCmd;
export const selectUserPostsError = (state: PostsState) => state.userPostsError;

export const setActivePage = usePostsStore.getState().setActivePage;
export const setFinalPage = usePostsStore.getState().setFinalPage;
export const setUsersPostsByCmd = usePostsStore.getState().setUsersPostsByCmd;
export const getUserPosts = usePostsStore.getState().getUserPosts;

