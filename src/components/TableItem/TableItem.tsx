import {
  useState,
  MouseEvent,
  useEffect
} from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { UserData } from '../../store/types';
import { useStore } from '../..';

import './tableItem.css';

type TableItemProps = {
  user: UserData,
  countPosts: number,
  numberUser: number
};

export const TableItem = (props: TableItemProps) => {
  const users = useStore((state) => state.users);

  const { userId } = useParams();

  const navigate = useNavigate();

  const [isSelect, setIsSelect] = useState(false);
  const [isSelectInterval, setIsSelectInterval] = useState(false);

  const handleClickRow = (event: MouseEvent<HTMLTableRowElement>) => {
    if (event.shiftKey && !userId?.includes('-')) {
      navigate(`/${userId}-${props.user.id}`);
      setIsSelectInterval(true);
    }
    else {
      if (isSelectInterval) {
        navigate('/', { replace: true });
      }
      else {
        if (!isSelect) {
          navigate(`/${props.user.id}`);
        }
        else {
          navigate('/', { replace: true });
        }
      }
    }
  };

  const isOneRowHighlighted =
    (isSelect && props.user.id === Number(userId)) &&
    userId != null;

  useEffect(() => {
    if (userId != undefined) {
      if (!userId.includes('-')) {
        setIsSelect(true);
        setIsSelectInterval(false);
      }
      else{
        const ids = userId.split('-');
        const start = users.findIndex((user) => user.id === Number(userId[0]));
        const end = users.findIndex((user) => user.id === Number(ids[ids.length - 1]));
        if (props.numberUser >= start && props.numberUser <= end) {
          setIsSelectInterval(true);
        }
      }
    }
    else {
      setIsSelect(false);
      setIsSelectInterval(false);
    }
  }, [userId]);

  return (
    <tr
      className={isOneRowHighlighted ||
        isSelectInterval ?
        'table-row_select' :
        'table-row'
      }
      onClick={handleClickRow}
    >
      <td>{props.user.name}</td>
      <td>{props.user.username}</td>
      <td>{props.user.email}</td>
      <td>{props.countPosts}</td>
    </tr>
  );
};

