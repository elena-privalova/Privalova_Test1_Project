import { useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';

import { useUserStore, usePostsStore } from '../../store';

import { Table, Pagination } from '.';

export const Main = () => {
  const isLoading = useUserStore((state) => state.isLoading);
  const users = useUserStore((state) => state.users);

  const activePage = usePostsStore((state) => state.activePage);
  const getCountUsers = useUserStore((state) => state.getCountUsers);
  const getSliceUsers = useUserStore((state) => state.getSliceUsers);
  const countsUsersPosts = useUserStore((state) => state.countsUsersPosts);

  useEffect(() => {
    getCountUsers();
  }, []);

  useEffect(() => {
    getSliceUsers(activePage);
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

