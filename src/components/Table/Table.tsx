import { useEffect } from 'react';

import { usePaginatonStore, useUserStore } from '../../store';
import { COUNT_USERS_ON_PAGE } from '../../constants';
import { TableItem } from '../TableItem';
import { Skeleton } from '../Skeleton';

import './table.css';

const SKELETONS_ARRAY: number[] = Array.from({ length: COUNT_USERS_ON_PAGE }, (_, i) => i + 1);

export const Table = () => {
  const isLoading = useUserStore.use.isLoading();
  const users = useUserStore.use.users();
  const countsUsersPosts = useUserStore.use.countsUsersPosts();
  const getSliceUsers = useUserStore.use.getSliceUsers();

  const activePage = usePaginatonStore.use.activePage();

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

