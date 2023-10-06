import { MouseEvent, useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';

import { useUserStore, Table, Pagination } from '../..';

export const Main = () => {
  const isLoading = useUserStore((state) => state.isLoading);
  const users = useUserStore((state) => state.users);

  const getCountUsers = useUserStore((state) => state.getCountUsers);
  const getSliceUsers = useUserStore((state) => state.getSliceUsers);
  const countsUsersPosts = useUserStore((state) => state.countsUsersPosts);

  const [activePage, setActivePage] = useState(1);

  const handleChangePageNmber = (event: MouseEvent<HTMLButtonElement>) => {
    if (event.target instanceof HTMLButtonElement) {
      setActivePage(Number(event.target.innerText));
    }
  };

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
          <Pagination currentPage={activePage} changePageNumber={handleChangePageNmber} />
        </>
      }
    </>
  );
};

