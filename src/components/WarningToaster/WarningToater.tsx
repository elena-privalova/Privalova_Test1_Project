import { ToastContainer } from 'react-toastify';

import { usePostsStore, useUserStore } from '../../store';

export const WarningToaster = () => {
  const usersError = useUserStore.use.usersError();
  const countsPostsError = useUserStore.use.countsPostsError();
  const userPostsError = usePostsStore.use.userPostsError();

  const typeError = usersError || countsPostsError || userPostsError;

  return (
    <>
      {typeError && (
        <ToastContainer
          limit={1}
          position="top-right"
          autoClose={15000}
          hideProgressBar={false}
        />
      )}
    </>
  );
};

