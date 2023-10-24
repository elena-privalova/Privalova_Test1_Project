import { memo, useCallback, useEffect } from 'react';

import { usePostsStore, useUserStore } from '../../store';
import { UserData } from '../../store/users/types';
import { COUNT_USERS_ON_PAGE } from '../../constants';
import { TableItem } from '../TableItem';
import { Skeleton } from '../Skeleton';

import './table.css';

type TableProps = {
  users: UserData[],
  countsUsersPosts: number[]
};

const SKELETONS_ARRAY: number[] = Array.from({ length: COUNT_USERS_ON_PAGE }, (_, i) => i + 1);

export const Table = memo(({ users, countsUsersPosts }: TableProps) => {
  const isLoading = useUserStore.use.isLoading();

  const setIsReadyToAddInInterval = usePostsStore.use.setIsReadyToAddInterval();

  const handleKeyUp = (event: KeyboardEventInit) => {
    if (event.key === 'Meta') setIsReadyToAddInInterval(true);
  };

  useEffect(() => {
    window.addEventListener('keyup', handleKeyUp);
  }, []);

  const memoizedHandleKeyUp = useCallback(() => handleKeyUp, [handleKeyUp]);

  return (
    <table className="layout-container__table table-user">
      <thead>
        <tr>
          <th>Name</th>
          <th>Username</th>
          <th>Email</th>
          <th>Company</th>
          <th>Posts</th>
        </tr>
      </thead>
      <tbody>
        {!isLoading ?
          users.map((user, index) =>
            <TableItem
              key={user.id}
              id={user.id}
              firstName={user.firstName}
              lastName={user.lastName}
              username={user.username}
              email={user.email}
              companyName={user.company.name}
              userNumber={index}
              countPosts={countsUsersPosts[index]}
              handleKeyUp={memoizedHandleKeyUp}
            />
          ) :
          SKELETONS_ARRAY.map((skeleton) =>
            <tr key={skeleton}>
              <td key={skeleton} colSpan={5}><Skeleton /></td>
            </tr>
          )
        }
      </tbody>
    </table>
  );
});

