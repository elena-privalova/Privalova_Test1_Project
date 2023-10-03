import { useEffect } from 'react';

import { useStore, Table } from '../..';

export const Main = () => {
  const users = useStore((state) => state.users);
  const usersError = useStore((state) => state.usersError);
  const countsUsersPosts = useStore((state) => state.countsUsersPosts);
  const getUsers = useStore((state) => state.getUsers);

  useEffect(() => {
    getUsers();
  }, []);

  if (usersError) {
    alert(usersError);
    return null;
  }

  return (
    <Table users={users} countsPosts={countsUsersPosts} />
  );
};

