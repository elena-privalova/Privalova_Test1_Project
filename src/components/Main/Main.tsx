import { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';
import 'react-toastify/dist/ReactToastify.css';
import 'react-loading-skeleton/dist/skeleton.css';

import { useUserStore, Table, usePostsStore } from '../..';

export const Main = () => {
  const isLoading = useUserStore((state) => state.isLoading);
  const users = useUserStore((state) => state.users);
  const usersError = useUserStore((state) => state.usersError);

  const countsPostsError = useUserStore((state) => state.countsPostsError);
  const getUsers = useUserStore((state) => state.getUsers);
  const countsUsersPosts = useUserStore((state) => state.countsUsersPosts);

  const userPostsError = usePostsStore((state) => state.userPostsError);

  useEffect(() => {
    getUsers();
  }, []);

  const typeError = usersError || countsPostsError || userPostsError;

  if (typeError) {
    toast.error(typeError, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
      hideProgressBar: false
    });
    return (
      <ToastContainer limit={1} />
    );
  }

  return (
    <>
      {isLoading ?
        <Skeleton width={400} height={600} /> :
        <Table users={users} countsPosts={countsUsersPosts} />
      }
    </>
  );
};

