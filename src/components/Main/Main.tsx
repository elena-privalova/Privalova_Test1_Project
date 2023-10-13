import { useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useSearchParams } from 'react-router-dom';

import { useUserStore, usePostsStore } from '../../store';

import { Table, Pagination } from '.';

export const Main = () => {
  const isLoading = useUserStore((state) => state.isLoading);
  const users = useUserStore((state) => state.users);
  const getCountUsers = useUserStore((state) => state.getCountUsers);
  const getSliceUsers = useUserStore((state) => state.getSliceUsers);
  const countsUsersPosts = useUserStore((state) => state.countsUsersPosts);

  const activePage = usePostsStore((state) => state.activePage);
  const setActivePage = usePostsStore((state) => state.setActivePage);

  const [currentPage] = useSearchParams();

  useEffect(() => {
    getCountUsers();
    if (currentPage.get('page') != undefined) {
      setActivePage(Number(currentPage.get('page')));
    }
  }, []);

  useEffect(() => {
    getSliceUsers();
  }, [activePage]);

  return (
    <>
      {isLoading ?
        <Skeleton width={400} height={600} /> :
        <>
          <Table users={users} countsPosts={countsUsersPosts} />
          <Pagination />
        </>
      }
    </>
  );
};

