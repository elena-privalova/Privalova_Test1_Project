import { type FC, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import './tableItem.css';

const TableItem: FC<TableItemProps> = ({ user, countPosts }) => {
  const { userId } = useParams();

  const navigate = useNavigate();

  const [isSelect, setSelect] = useState(false);

  const handleClickRow = () => {
    setSelect((prevState) => !prevState);
    if (!isSelect) {
      navigate(`/${user.id}`);
    }
    else {
      navigate('/', { replace: true });
    }
  };

  const isHighlighted = (isSelect || user.id === Number(userId))
    && userId != null;

  return (
    <tr
      className={isHighlighted ? 'select-row' : ''}
      onClick={handleClickRow}
    >
      <td>{user.name}</td>
      <td>{user.username}</td>
      <td>{user.email}</td>
      <td>{countPosts}</td>
    </tr>
  );
};

export default TableItem;

