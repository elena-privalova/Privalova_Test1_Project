import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import {
  getCountUsers,
  getSliceUsers,
  selectCountsUsersPosts,
  selectIsLoading,
  selectUsers
} from '../../store/users/selectors';
import {
  selectActivePage,
  selectFinalPage,
  setActivePage,
  setFinalPage
} from '../../store/posts/selectors';
import { useUserStore, usePostsStore } from '../../store';
import { Table } from '../Table';
import { Pagination } from '../Pagination';

export const Main = () => {
  const isLoading = useUserStore(selectIsLoading);
  const users = useUserStore(selectUsers);
  const countsUsersPosts = useUserStore(selectCountsUsersPosts);

  const activePage = usePostsStore(selectActivePage);
  const finalPage = usePostsStore(selectFinalPage);

  const [currentPage] = useSearchParams();

  useEffect(() => {
    getCountUsers();
    if (currentPage.get('page') != undefined) {
      setActivePage(Number(currentPage.get('page')));
    }
  }, []);

  useEffect(() => {
    getSliceUsers();
    if (activePage === finalPage - 1) {
      setFinalPage(finalPage + 1);
      getSliceUsers(true);
    }
  }, [activePage]);

  return (
    <>
      <Table users={users} countsPosts={countsUsersPosts} />
      {!isLoading && (
        <Pagination />
      )}
    </>
  );
};

