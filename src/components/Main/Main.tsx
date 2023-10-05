import { useEffect } from 'react';

import { useUserStore, Table } from '../..';

export const Main = () => {
  const users = useUserStore((state) => state.users);
  const usersError = useUserStore((state) => state.usersError);
  const getUsers = useUserStore((state) => state.getUsers);
  const countsUsersPosts = useUserStore((state) => state.countsUsersPosts);
  const getCountsUsersPosts = useUserStore((state) => state.getCountsUsersPosts);

  useEffect(() => {
    getUsers().then((res) => getCountsUsersPosts(res));
  }, []);

  if (usersError) {
    alert(usersError);
    return null;
  }

  return (
    <Table users={users} countsPosts={countsUsersPosts} />
  );
};

