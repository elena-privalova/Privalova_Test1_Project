import {
  useState,
  MouseEvent,
  useEffect
} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import classNames from 'classnames';

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
      return;
    }

    if (isSelectInterval) {
      navigate('/', { replace: true });
      return;
    }

    setCurrentUser(props.user.id);
    if (isSelect && props.user.id === currentUser) {
      navigate('/', { replace: true });
    } else if (!isSelect || props.user.id !== currentUser) {
      navigate(`/${props.user.id}`);
    }
    setIsSelect((prevState) => !prevState);
  };

  const isOneUserHighlighted =
    (isSelect && props.user.id === Number(userId)) &&
    userId != null;

  const isOneUserSelect = userId != undefined && !userId.includes('-');
  const isSeveralUsersSelect = userId != undefined && userId.includes('-');

  useEffect(() => {
    if (isOneUserSelect) {
      setIsSelect(true);
      setIsSelectInterval(false);
      return;
    }

    if (isSeveralUsersSelect) {
      const ids = userId.split('-');
      const start = users.findIndex((user) => user.id === Number(ids[0]));
      const end = users.findIndex((user) => user.id === Number(ids[1]));
      if (props.numberUser >= start && props.numberUser <= end) {
        setIsSelectInterval(true);
      }
      return;
    }

    setIsSelect(false);
    setIsSelectInterval(false);
  }, [userId]);

  const tableRowClass = classNames({
    'table-user': true,
    'table-user_select': isOneUserHighlighted || isSelectInterval
  });

  return (
    <tr
      className={tableRowClass}
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

