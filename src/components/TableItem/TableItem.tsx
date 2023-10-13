import {
  useState,
  MouseEvent,
  useEffect
} from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import classNames from 'classnames';

import { UserData } from '../../store/users/types';
import { usePostsStore, useUserStore } from '../../store';

import './tableItem.css';

type TableItemProps = {
  user: UserData,
  numberUser: number,
  countPosts: number,
};

export const TableItem = (props: TableItemProps) => {
  const users = useUserStore((state) => state.users);
  const currentUser = useUserStore((state) => state.currentUser);
  const startUser = useUserStore((state) => state.startUser);
  const setCurrentUser = useUserStore((state) => state.setCurrentUser);
  const setStartUser = useUserStore((state) => state.setStartUser);

  const activePage = usePostsStore((state) => state.activePage);
  const userPostsByCmd = usePostsStore((state) => state.userPostsByCmd);
  const setUsersPostsByCmd = usePostsStore((state) => state.setUsersPostsByCmd);

  const [searchParams] = useSearchParams();
  const userId = searchParams.get('ids');
  const page = searchParams.get('page');

  const navigate = useNavigate();

  const [isSelect, setIsSelect] = useState(false);
  const [isSelectInterval, setIsSelectInterval] = useState(false);
  const [isSelectByCmd, setIsSelectByCmd] = useState(false);
  const [isReadyToAddInInterval, setIsReadyToAddInInterval] = useState(false);

  useEffect(() => {
    window.addEventListener('keyup', handleKeyup);
  }, []);

  const handleKeyup = (event: KeyboardEventInit) => {
    if (event.key === 'Meta') setIsReadyToAddInInterval(true);
  };

  const handleMouseDown = (event: MouseEvent<HTMLTableRowElement>) => {
    if (!event.shiftKey) setStartUser(props.user.id);
    if (event.metaKey) {
      if (!isReadyToAddInInterval && !isSelectByCmd) {
        setUsersPostsByCmd(props.user.id);
        setIsSelectByCmd(true);
        return;
      }
    }
  };

  const handleMouseUp = (event: MouseEvent<HTMLTableRowElement>) => {
    if (!event.metaKey) {
      if (event.shiftKey && !userId?.includes('-') || props.user.id !== startUser) {
        if (startUser > props.user.id) {
          navigate(`/posts?ids=${props.user.id}-${startUser}&page=${activePage}`);
        }
        else navigate(`posts?ids=${startUser}-${props.user.id}&page=${activePage}`);
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
        navigate(`posts/?ids=${props.user.id}&page=${activePage}`);
      }
      setIsSelect((prevState) => !prevState);
      return;
    }
    if (isSelectByCmd) navigate('/', { replace: true });
    setIsSelect(false);
    setIsSelectInterval(false);
  };

  const isOneUserHighlighted =
    (isSelect && props.user.id === Number(userId)) &&
    userId != undefined;

  const isOneUserSelect = userId != undefined && !userId.includes('-');
  const isSeveralUsersSelect = userId != undefined && userId.includes('-');
  const isSeveralUsersSelectByCmd = userId != undefined && userId.includes(',');

  useEffect(() => {
    if (isReadyToAddInInterval) {
      navigate(`posts/?ids=${userPostsByCmd}&page=${activePage}`);
      window.removeEventListener('keyup', handleKeyup);
      setIsReadyToAddInInterval(false);
    }

    if (isSeveralUsersSelectByCmd) {
      if (Number(page) === activePage) {
        userId.split(',').forEach((id) => {
          if (props.user.id === Number(id)) setIsSelectByCmd(true);
        });
      } else {
        setUsersPostsByCmd(-1);
      }

      if (props.numberUser === 0) setStartUser(props.user.id);
      return;
    }

    if (isOneUserSelect) {
      setIsSelect(true);
      setIsSelectInterval(false);
      setIsSelectByCmd(false);
      setStartUser(Number(userId));
      setUsersPostsByCmd(-1);
      return;
    }

    if (isSeveralUsersSelect) {
      const ids = userId.split('-');
      const start = users.findIndex((user) => {
        return user.id === Number(ids[0]);
      });
      const end = users.findIndex((user) => user.id === Number(ids[1]));
      if (props.numberUser >= start && props.numberUser <= end) {
        setIsSelectInterval(true);
      } else setIsSelectInterval(false);

      if (props.numberUser === 0) setStartUser(props.user.id);
      setUsersPostsByCmd(-1);
      setIsSelectByCmd(false);
      return;
    }

    if (props.numberUser === 0) setStartUser(props.user.id);
    setIsSelect(false);
    setIsSelectInterval(false);
    setIsSelectByCmd(false);
  }, [userId, isReadyToAddInInterval]);

  const tableRowClass = classNames({
    'table-user': true,
    'table-user_select': isOneUserHighlighted || isSelectInterval || isSelectByCmd
  });

  return (
    <tr
      className={tableRowClass}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <td>{`${props.user.firstName} ${props.user.lastName}`}</td>
      <td>{props.user.username}</td>
      <td>{props.user.email}</td>
      <td>{props.user.company.name}</td>
      <td>{props.countPosts}</td>
    </tr>
  );
};

