import { useEffect, useMemo } from 'react';

import { Table } from '../Table';
import { Pagination } from '../Pagination';
import { usePaginatonStore, useUserStore } from '../../store';
import { Search } from '../Search';

export const Main = () => {
  const filteredUsers = useUserStore.use.filteredUsers();
  const countsUsersPosts = useUserStore.use.countsUsersPosts();
  const getSliceUsers = useUserStore.use.getSliceUsers();

  const activePage = usePaginatonStore.use.activePage();

  const memoizedUsers = useMemo(() => filteredUsers, [filteredUsers, activePage]);
  const memoizedCountsUsersPosts = useMemo(() => countsUsersPosts, [filteredUsers, activePage]);

  useEffect(() => {
    getSliceUsers();
  }, [activePage]);

  return (
    <>
      <Search />
      <Table users={memoizedUsers} countsUsersPosts={memoizedCountsUsersPosts} />
      <Pagination />
    </>
  );
};

