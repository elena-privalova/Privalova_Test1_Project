import { useEffect } from 'react';
import { Alert, AlertTitle, Skeleton } from '@mui/material';

import { useUserStore, Table } from '../..';

export const Main = () => {
  const isLoading = useUserStore((state) => state.isLoading);
  const users = useUserStore((state) => state.users);
  const usersError = useUserStore((state) => state.usersError);
  const countsPostsError = useUserStore((state) => state.countsPostsError);
  const getUsers = useUserStore((state) => state.getUsers);
  const countsUsersPosts = useUserStore((state) => state.countsUsersPosts);

  useEffect(() => {
    getUsers();
  }, []);

  if (usersError) {
    return (
      <Alert severity="error">
        <AlertTitle>Error</AlertTitle>
        {usersError}
      </Alert>
    );
  }

  if (countsPostsError) {
    return (
      <Alert severity="error">
        <AlertTitle>Error</AlertTitle>
        {countsPostsError}
      </Alert>
    );
  }
  return (
    <>
      {isLoading ?
        <Skeleton variant="rectangular" width={400} height={600} /> :
        <Table users={users} countsPosts={countsUsersPosts} />
      }
    </>
  );
};

