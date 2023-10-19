import { useEffect } from 'react';

import {
  getSliceUsers,
  selectCountsUsersPosts,
  selectIsLoading,
  selectUsers
} from '../../store/users/selectors';
import { selectActivePage } from '../../store/pagination/selectors';
import { COUNT_USERS_ON_PAGE } from '../../constants';
import { usePaginationStore, useUserStore } from '../../store';
import { TableItem } from '../TableItem';
import { Skeleton } from '../Skeleton';

import './table.css';

const SKELETONS_ARRAY: number[] = Array.from({ length: COUNT_USERS_ON_PAGE }, (_, i) => i + 1);

export const Table = () => {
  const isLoading = useUserStore(selectIsLoading);
  const users = useUserStore(selectUsers);
  const countsUsersPosts = useUserStore(selectCountsUsersPosts);

  const activePage = usePaginationStore(selectActivePage);

  useEffect(() => {
    getSliceUsers();
  }, [activePage]);

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
              user={user}
              numberUser={index}
              countPosts={countsUsersPosts[index]}
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
};

