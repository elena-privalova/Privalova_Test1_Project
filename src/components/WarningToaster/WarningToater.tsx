import { ToastContainer } from 'react-toastify';

import { selectCountsPostsError, selectUsersError } from '../../store/users/selectors';
import { selectUserPostsError } from '../../store/posts/selectors';
import { usePostsStore, useUserStore } from '../../store';

export const WarningToaster = () => {
  const usersError = useUserStore(selectUsersError);
  const countsPostsError = useUserStore(selectCountsPostsError);
  const userPostsError = usePostsStore(selectUserPostsError);

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

