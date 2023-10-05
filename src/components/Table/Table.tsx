import { UserData } from '../../store/users/types';
import { TableItem } from '../..';

import './table.css';

type TableProps = {
  users: UserData[],
  countsPosts: number[],
};

export const Table = (props: TableProps) => {
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
        {props.users.map((user, index) =>
          <TableItem
            key={`${user.id}-${index}`}
            user={user}
            numberUser={index}
            countPosts={props.countsPosts[index]}
          />
        )}
      </tbody>
    </table>
  );
};

