import { type FC } from 'react';

import TableItem from '../TableItem/TableItem';

import './table.css';

const Table: FC<TableContainerProps> = ({ users, countsPosts }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Username</th>
          <th>Email</th>
          <th>Posts</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user, index) => {
          return <TableItem
            key={user.id}
            user={user}
            countPosts={countsPosts[index]}
          />;
        })}
      </tbody>
    </table>
  );
};

export default Table;
