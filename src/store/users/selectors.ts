import { UserState, useUserStore } from '..';

export const selectIsLoading = (state: UserState) => state.isLoading;
export const selectCurrentUser = (state: UserState) => state.currentUser;
export const selectStartUser = (state: UserState) => state.startUser;
export const selectUsers = (state: UserState) => state.users;
export const selectCountUsers = (state: UserState) => state.countUsers;
export const selectCountsUsersPosts = (state: UserState) => state.countsUsersPosts;
export const selectUsersError = (state: UserState) => state.usersError;
export const selectCountsPostsError = (state: UserState) => state.countsPostsError;
export const selectUsersIds = (state: UserState) => state.selectedUsersIds;

export const setStartUser = useUserStore.getState().setStartUser;
export const setCurrentUser = useUserStore.getState().setCurrentUser;
export const setSelectedUsersIds = useUserStore.getState().setSelectedUsersIds;
export const getCountUsers = useUserStore.getState().getCountUsers;
export const getSliceUsers = useUserStore.getState().getSliceUsers;
export const getCountsUsersPosts = useUserStore.getState().getCountsUsersPosts;

