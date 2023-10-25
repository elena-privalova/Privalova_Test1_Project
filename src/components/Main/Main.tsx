import { useEffect, useMemo } from 'react';

import { Table } from '../Table';
import { Pagination } from '../Pagination';
import { usePaginatonStore, useUserStore } from '../../store';

export const Main = () => {
  const users = useUserStore.use.users();
  const countsUsersPosts = useUserStore.use.countsUsersPosts();
  const getSliceUsers = useUserStore.use.getSliceUsers();

  const activePage = usePaginatonStore.use.activePage();

  const memoizedUsers = useMemo(() => users, [users, activePage]);
  const memoizedCountsUsersPosts = useMemo(() => countsUsersPosts, [users, activePage]);

  useEffect(() => {
    getSliceUsers();
  }, [activePage]);

  return (
    <>
      <Table users={memoizedUsers} countsUsersPosts={memoizedCountsUsersPosts} />
      <Pagination />
    </>
  );
};

