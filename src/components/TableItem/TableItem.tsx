import {
  useState,
  MouseEvent,
  useEffect
} from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { UserData } from '../../store/users/types';
import { useUserStore } from '../..';

import './tableItem.css';

type TableItemProps = {
  user: UserData,
  numberUser: number,
  countPosts: number,
};

export const TableItem = (props: TableItemProps) => {
  const users = useUserStore((state) => state.users);
  const currentUser = useUserStore((state) => state.currentUser);
  const setCurrentUser = useUserStore((state) => state.setCurrentUser);

  const { userId } = useParams();

  const navigate = useNavigate();

  const [isSelect, setIsSelect] = useState(false);
  const [isSelectInterval, setIsSelectInterval] = useState(false);

  const handleClickUser = (event: MouseEvent<HTMLTableRowElement>) => {
    if (event.shiftKey && !userId?.includes('-')) {
      navigate(`/${userId}-${props.user.id}`);
      setIsSelectInterval(true);
    }
    else {
      if (isSelectInterval) {
        navigate('/', { replace: true });
      } else {
        setCurrentUser(props.user.id);
        if (!isSelect || props.user.id !== currentUser) {
          navigate(`/${props.user.id}`);
        } else {
          navigate('/', { replace: true });
        }
        setIsSelect((prevState) => !prevState);
      }
    }
  };

  const isOneUserHighlighted =
    (isSelect && props.user.id === Number(userId)) &&
    userId != null;

  useEffect(() => {
    if (userId != undefined) {
      if (!userId.includes('-')) {
        setIsSelect(true);
        setIsSelectInterval(false);
      } else {
        const ids = userId.split('-');
        const start = users.findIndex((user) => user.id === Number(ids[0]));
        const end = users.findIndex((user) => user.id === Number(ids[ids.length - 1]));
        if (props.numberUser >= start && props.numberUser <= end) {
          setIsSelectInterval(true);
        }
      }
    } else {
      setIsSelect(false);
      setIsSelectInterval(false);
    }
  }, [userId]);

  return (
    <tr
      className={isOneUserHighlighted ||
        isSelectInterval ?
        'table-user_select' :
        'table-user'
      }
      onClick={handleClickUser}
    >
      <td>{`${props.user.firstName} ${props.user.lastName}`}</td>
      <td>{props.user.username}</td>
      <td>{props.user.email}</td>
      <td>{props.user.company.name}</td>
      <td>{props.countPosts}</td>
    </tr>
  );
};

