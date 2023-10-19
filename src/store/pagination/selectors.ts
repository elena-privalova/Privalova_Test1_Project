import { PaginationState, usePaginationStore } from './paginationStore';

export const selectActivePage = (state: PaginationState) => state.activePage;
export const selectFinalPage = (state: PaginationState) => state.finalPage;
export const selectCountPages = (state: PaginationState) => state.countPages;
export const selectEndPage = (state: PaginationState) => state.endPage;

export const setActivePage = usePaginationStore.getState().setActivePage;
export const setFinalPage = usePaginationStore.getState().setFinalPage;
export const setEndPage = usePaginationStore.getState().setEndPage;
export const getCountPages = usePaginationStore.getState().getCountPages;

