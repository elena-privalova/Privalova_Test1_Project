import { useUserStore } from '../../store';
import { COUNT_USERS_ON_PAGE } from '../../constants';
import { UserData } from '../../store/users/types';

import { Skeleton, TableItem } from '.';
import './table.css';

type TableProps = {
  users: UserData[],
  countsPosts: number[],
};

export const Table = (props: TableProps) => {
  const isLoading = useUserStore((state) => state.isLoading);

  const skeletonsArray: number[] = Array.from({ length: COUNT_USERS_ON_PAGE }, (_, i) => i + 1);

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
          props.users.map((user, index) =>
            <TableItem
              key={user.id}
              user={user}
              numberUser={index}
              countPosts={props.countsPosts[index]}
            />
          ) :
          skeletonsArray.map((skeleton) =>
            <tr key={skeleton}>
              <td key={skeleton} colSpan={5}><Skeleton /></td>
            </tr>
          )
        }
      </tbody>
    </table>
  );
};

