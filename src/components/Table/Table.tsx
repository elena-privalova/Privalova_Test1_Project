import { UserData } from '../../store/types';
import { TableItem } from '../..';

import './table.css';

type TableProps = {
  users: UserData[],
  countsPosts: number[],
};

export const Table = (props: TableProps) => {
  return (
    <table className="layout-container__table table-row">
      <thead>
        <tr>
          <th>Name</th>
          <th>Username</th>
          <th>Email</th>
          <th>Posts</th>
        </tr>
      </thead>
      <tbody>
        {props.users.map((user, index) =>
          <TableItem
            key={user.id}
            user={user}
            countPosts={props.countsPosts[index]}
            numberUser={index}
          />
        )}
      </tbody>
    </table>
  );
};

