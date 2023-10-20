import {
  useState,
  MouseEvent,
  useEffect,
  useCallback
} from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import classNames from 'classnames';
import { createSelector } from 'reselect';

import { groupIds } from '../../utils/groupIds';
import { UserData } from '../../store/users/types';
import {
  UserState,
  usePaginatonStore,
  usePostsStore,
  useUserStore,
  useUserStoreBase
} from '../../store';

import './tableItem.css';

type TableItemProps = {
  user: UserData,
  numberUser: number,
  countPosts: number,
};

const selectUsersIds = (state: UserState) => state.selectedUsersIds;

const usersIdsSelector = createSelector(
  [selectUsersIds, (_, id) => id],
  (selectUsersIds, id) => selectUsersIds?.includes(id)
);

export const TableItem = ({ user, numberUser, countPosts }: TableItemProps) => {
  const activePage = usePaginatonStore.use.activePage();

  const isUsersPostsLoading = usePostsStore.use.isUsersPostsLoading();
  const userPostsByCmd = usePostsStore.use.userPostsByCmd();
  const setUsersPostsByCmd = usePostsStore.use.setUsersPostsByCmd();

  const currentUser = useUserStore.use.currentUser();
  const startUser = useUserStore.use.startUser();
  const setCurrentUser = useUserStore.use.setCurrentUser();
  const setStartUser = useUserStore.use.setStartUser();
  const setSelectedUsersIds = useUserStore.use.setSelectedUsersIds();

  const memoizedUsersIdsSelector = useCallback((state: UserState) => usersIdsSelector(state, user.id), [user.id]);
  const isSelectedUser = useUserStoreBase(memoizedUsersIdsSelector);

  const [searchParams] = useSearchParams();
  const userId = searchParams.get('ids');
  const page = searchParams.get('page');

  const navigate = useNavigate();

  const [isSelect, setIsSelect] = useState(false);
  const [isSelectInterval, setIsSelectInterval] = useState(false);
  const [isSelectByCmd, setIsSelectByCmd] = useState(false);
  const [isReadyToAddInInterval, setIsReadyToAddInInterval] = useState(false);

  const isCancelSelect = isSelect && user.id === currentUser;
  const isNotSelectedBefore = !isSelect || user.id !== currentUser;

  const isOneUserHighlighted =
    (isSelect && user.id === Number(userId)) &&
    userId != undefined;

  const isOneUserSelect = userId != undefined && !userId.includes('-');
  const isSeveralUsersSelect = userId != undefined && userId.includes('-');
  const isSeveralUsersSelectByCmd = userId != undefined && userId.includes(',');

  useEffect(() => {
    window.addEventListener('keyup', handleKeyup);
  }, []);

  const handleKeyup = (event: KeyboardEventInit) => {
    if (event.key === 'Meta') setIsReadyToAddInInterval(true);
  };

  const handleMouseDown = (event: MouseEvent<HTMLTableRowElement>) => {
    if (!event.shiftKey) setStartUser (user.id);
    if (event.metaKey && !isReadyToAddInInterval && !isSelectByCmd) {
      setUsersPostsByCmd(user.id);
      setIsSelectByCmd(true);
      return;
    }
  };

  const handleMouseUp = (event: MouseEvent<HTMLTableRowElement>) => {
    if (!event.metaKey) {
      if (event.shiftKey && !userId?.includes('-') || user.id !== startUser) {
        if (startUser > user.id) {
          setSelectedUsersIds([user.id, startUser]);
          navigate(`/posts?ids=${user.id}-${startUser}&page=${activePage}`);
          return;
        }
        setSelectedUsersIds([startUser, user.id]);
        navigate(`posts?ids=${startUser}-${user.id}&page=${activePage}`);
        return;
      }

      setCurrentUser(user.id);
      setIsSelect((prevState) => !prevState);

      if (isCancelSelect) {
        navigate('/', { replace: true });
        return;
      }
      if (isNotSelectedBefore) {
        navigate(`posts/?ids=${user.id}&page=${activePage}`);
        return;
      }

      if (isSelectInterval) {
        navigate('/', { replace: true });
      }

      return;
    }

    if (isSelectByCmd) navigate('/', { replace: true });
    setIsSelect(false);
    setIsSelectInterval(false);
  };

  useEffect(() => {
    if (isReadyToAddInInterval) {
      const formattedIds = groupIds(userPostsByCmd);
      setSelectedUsersIds(formattedIds);
      navigate(`posts/?ids=${formattedIds}&page=${activePage}`);
      window.removeEventListener('keyup', handleKeyup);
      setIsReadyToAddInInterval(false);
    }

    if (isSeveralUsersSelectByCmd) {
      if (Number(page) !== activePage) {
        setUsersPostsByCmd(-1);
        return;
      }

      setSelectedUsersIds(userId);
      if (isSelectedUser) setIsSelectByCmd(true);

      if (numberUser === 0) setStartUser(user.id);
      return;
    }

    if (isOneUserSelect) {
      setStartUser(Number(userId));
      setUsersPostsByCmd(-1);
      setSelectedUsersIds([]);
      setIsSelect(true);
      setIsSelectInterval(false);
      setIsSelectByCmd(false);
      return;
    }

    if (isSeveralUsersSelect) {
      const ids = userId.split('-');
      setSelectedUsersIds([Number(ids[0]), Number(ids[1])]);
      if (isSelectedUser) {
        setIsSelectInterval(true);
        return;
      }
      setIsSelectInterval(false);

      if (numberUser === 0) setStartUser(user.id);
      setUsersPostsByCmd(-1);
      setIsSelectByCmd(false);
      return;
    }

    if (numberUser === 0) setStartUser(user.id);
    setIsSelect(false);
    setIsSelectInterval(false);
  }, [userId, isReadyToAddInInterval, isUsersPostsLoading]);

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
      <td>{`${user.firstName} ${user.lastName}`}</td>
      <td>{user.username}</td>
      <td>{user.email}</td>
      <td>{user.company.name}</td>
      <td>{countPosts}</td>
    </tr>
  );
};

