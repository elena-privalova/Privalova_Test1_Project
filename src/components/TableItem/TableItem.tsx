import {
  useState,
  MouseEvent,
  useEffect
} from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import classNames from 'classnames';

import { groupIds } from '../../utils/groupIds';
import { getIndex } from '../../utils/getIndex';
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
    if (event.metaKey && !isReadyToAddInInterval) {
      setUsersPostsByCmd(props.user.id);
      setIsSelectByCmd(true);
      return;
    }
  };

  const handleMouseUp = (event: MouseEvent<HTMLTableRowElement>) => {
    if (!event.metaKey) {
      if (event.shiftKey && !userId?.includes('-') || props.user.id !== startUser) {
        setIsSelectInterval(true);
        if (startUser > props.user.id) {
          navigate(`/posts?ids=${props.user.id}-${startUser}&page=${activePage}`);
          return;
        }
        navigate(`posts?ids=${startUser}-${props.user.id}&page=${activePage}`);
        return;
      }

      if (isSelectInterval) {
        navigate('/', { replace: true });
        return;
      }

      setCurrentUser(props.user.id);
      setIsSelect((prevState) => !prevState);

      if (isSelect && props.user.id === currentUser) {
        navigate('/', { replace: true });
        return;
      }
      if (!isSelect || props.user.id !== currentUser) {
        navigate(`posts/?ids=${props.user.id}&page=${activePage}`);
      }
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
      const formatedIds = groupIds(userPostsByCmd);
      navigate(`posts/?ids=${formatedIds}&page=${activePage}`);
      window.removeEventListener('keyup', handleKeyup);
      setIsReadyToAddInInterval(false);
    }

    if (isSeveralUsersSelectByCmd) {
      if (Number(page) !== activePage) {
        setUsersPostsByCmd(-1);
        return;
      }

      userId.split(',').forEach((id) => {
        if (id.includes('-')) {
          const ids = id.split('-');
          const startIndex = getIndex(users, Number(ids[0]));
          const endIndex = getIndex(users, Number(ids[1]));
          const isInSelectInerval = props.numberUser >= startIndex &&
            props.numberUser <= endIndex;
          if (isInSelectInerval) setIsSelectByCmd(true);
          return;
        }

        if (props.user.id === Number(id)) setIsSelectByCmd(true);
      });

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
      const start = users.findIndex((user) => user.id === Number(ids[0]));
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

