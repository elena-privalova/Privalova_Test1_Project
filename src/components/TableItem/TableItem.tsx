import {
  useState,
  MouseEvent,
  useEffect
} from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useStore } from '../..';
import { UserData } from '../../store/types';

import './tableItem.css';

type TableItemProps = {
  user: UserData,
  countPosts: number,
  numberUser: number
};

export const TableItem = (props: TableItemProps) => {
  const currentUsers = useStore((state) => state.currentUsers);
  const setStartUserNumber = useStore((state) => state.setStartUserNumber);
  const setCurrentUsers = useStore((state) => state.setCurrentUsers);

  const { userId } = useParams();

  const navigate = useNavigate();

  const [isSelect, setIsSelect] = useState(false);
  const [isSelectInterval, setIsSelectInterval] = useState(false);

  const handleClickRow = () => {
    setStartUserNumber(props.numberUser);
    if (!isSelect) {
      navigate(`/${props.user.id}`);
    }
    else {
      navigate('/', { replace: true });
    }
    setIsSelect((prevState) => !prevState);
  };

  const isHighlighted = (isSelect || props.user.id === Number(userId))
    && userId != null
    || isSelectInterval;

  const handleMouseDown = (event: MouseEvent<HTMLTableRowElement>) => {
    if (event.shiftKey) {
      setCurrentUsers(props.numberUser);
    }
  };

  useEffect(() => {
    if (currentUsers.includes(props.user.id)) {
      setIsSelectInterval(true);
    }
  }, [currentUsers]);

  return (
    <tr
      className={isHighlighted ? 'table-row_select' : 'table-row'}
      onClick={handleClickRow}
      onMouseDown={handleMouseDown}
    >
      <td>{props.user.name}</td>
      <td>{props.user.username}</td>
      <td>{props.user.email}</td>
      <td>{props.countPosts}</td>
    </tr>
  );
};

