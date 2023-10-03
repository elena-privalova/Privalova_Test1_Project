import { useEffect } from 'react';

import Table from '../Table/Table';
import useStore from '../../store';

const Main = () => {
  const { users, usersError, countsUsersPosts, getUsers } = useStore();

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <>
      {usersError === ''
        ? <Table users={users} countsPosts={countsUsersPosts} />
        : alert(usersError)
      }
    </>
  );
};

export default Main;

