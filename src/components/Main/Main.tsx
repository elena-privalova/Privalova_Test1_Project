import { useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';

import { useUserStore, Table } from '../..';

export const Main = () => {
  const isLoading = useUserStore((state) => state.isLoading);
  const users = useUserStore((state) => state.users);

  const getUsers = useUserStore((state) => state.getUsers);
  const countsUsersPosts = useUserStore((state) => state.countsUsersPosts);

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <>
      {isLoading ?
        <Skeleton width={400} height={600} /> :
        <Table users={users} countsPosts={countsUsersPosts} />
      }
    </>
  );
};

