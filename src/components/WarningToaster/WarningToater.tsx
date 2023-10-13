import { ToastContainer } from 'react-toastify';

import { usePostsStore, useUserStore } from '../../store';

export const WarningToaster = () => {
  const usersError = useUserStore((state) => state.usersError);
  const countsPostsError = useUserStore((state) => state.countsPostsError);
  const userPostsError = usePostsStore((state) => state.userPostsError);

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

