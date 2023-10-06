import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-loading-skeleton/dist/skeleton.css';

import { Main, usePostsStore, useUserStore } from '../..';

import './layout.css';

export const Layout = () => {
  const usersError = useUserStore((state) => state.usersError);
  const countsPostsError = useUserStore((state) => state.countsPostsError);
  const userPostsError = usePostsStore((state) => state.userPostsError);

  const typeError = usersError || countsPostsError || userPostsError;

  return (
    <div className="layout-container">
      {!typeError && (
        <>
          <Main />
          <Outlet />
        </>
      )}
      <ToastContainer
        limit={1}
        position="top-right"
        autoClose={10000}
        hideProgressBar={false}
      />
    </div>
  );
};

