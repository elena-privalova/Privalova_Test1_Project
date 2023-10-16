import { selectIsLoading } from '../../store/users/selectors';
import { COUNT_USERS_ON_PAGE } from '../../constants';
import { UserData } from '../../store/users/types';
import { useUserStore } from '../../store';
import { TableItem } from '../TableItem';
import { Skeleton } from '../Skeleton';

import './table.css';

type TableProps = {
  users: UserData[],
  countsPosts: number[],
};

const SKELETONS_ARRAY: number[] = Array.from({ length: COUNT_USERS_ON_PAGE }, (_, i) => i + 1);

export const Table = ({ users, countsPosts }: TableProps) => {
  const isLoading = useUserStore(selectIsLoading);

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
              countPosts={countsPosts[index]}
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

