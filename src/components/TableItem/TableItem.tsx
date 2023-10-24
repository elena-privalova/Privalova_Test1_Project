import {
  useState,
  MouseEvent,
  useEffect,
  useCallback,
  memo
} from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import classNames from 'classnames';
import { createSelector } from 'reselect';

import {
  UserState,
  usePaginatonStore,
  usePostsStore,
  useUserStore,
  useUserStoreBase
} from '../../store';

import './tableItem.css';

type TableItemProps = {
  id: number,
  firstName: string,
  lastName: string,
  username: string,
  email: string,
  companyName: string,
  userNumber: number,
  countPosts: number,
  handleKeyUp: (event: KeyboardEventInit) => void
};

const selectUsersIds = (state: UserState) => state.selectedUsersIds;

const usersIdsSelector = createSelector(
  [selectUsersIds, (_, id) => id],
  (selectUsersIds, id) => selectUsersIds?.includes(id)
);

export const TableItem = memo(({
  id,
  firstName,
  lastName,
  username,
  email,
  companyName,
  userNumber,
  countPosts,
  handleKeyUp
}: TableItemProps) => {
  const activePage = usePaginatonStore.use.activePage();

  const isUsersPostsLoading = usePostsStore.use.isUsersPostsLoading();
  const isReadyToAddInInterval = usePostsStore.use.isReadyToAddInterval();

  const currentUser = useUserStore.use.currentUser();
  const setCurrentUser = useUserStore.use.setCurrentUser();
  const setSelectedUsersIds = useUserStore.use.setSelectedUsersIds();

  const memoizedUsersIdsSelector = useCallback((state: UserState) => usersIdsSelector(state, id), [id]);
  const isSelectedUser = useUserStoreBase(memoizedUsersIdsSelector);

  const [searchParams] = useSearchParams();
  const userId = searchParams.get('ids');

  const navigate = useNavigate();

  const [isSelect, setIsSelect] = useState(false);
  const [isSelectInterval, setIsSelectInterval] = useState(false);

  const isCancelSelect = isSelect && id === currentUser;
  const isNotSelectedBefore = !isSelect || isSelectInterval;

  const handleMouseDown = (event: MouseEvent<HTMLTableRowElement>) => {
    if (!event.shiftKey) setCurrentUser(id);
  };

  const handleMouseUp = (event: MouseEvent<HTMLTableRowElement>) => {
    if (!event.metaKey) {
      if (event.shiftKey && id !== currentUser || id !== currentUser) {
        if (currentUser > id) {
          setSelectedUsersIds([id, currentUser]);
          navigate(`/posts?ids=${id}-${currentUser}&page=${activePage}`);
          return;
        }
        setSelectedUsersIds([currentUser, id]);
        navigate(`posts?ids=${currentUser}-${id}&page=${activePage}`);
        return;
      }

      setIsSelect((prevState) => !prevState);

      if (isNotSelectedBefore) {
        navigate(`posts/?ids=${id}&page=${activePage}`);
        return;
      }

      if (isCancelSelect) {
        navigate('/', { replace: true });
        return;
      }
      return;
    }
  };

  useEffect(() => {
    if (userNumber === 0) setCurrentUser(id);

    if (userId?.includes('-')) {
      const formattedUserId = userId.split('-');
      setSelectedUsersIds([Number(formattedUserId[0]), Number(formattedUserId[1])]);

      if (isSelectedUser) setIsSelectInterval(true);
      else setIsSelectInterval(false);

      setIsSelect(false);
      return;
    }

    if (userId != undefined) {
      if (id === Number(userId)) {
        setIsSelect(true);
        setCurrentUser(Number(id));
      } else setIsSelect(false);

      setIsSelectInterval(false);
      return;
    }

    setIsSelect(false);
    setIsSelectInterval(false);
  }, [userId, isUsersPostsLoading, isReadyToAddInInterval]);

  const tableRowClass = classNames({
    'table-user': true,
    'table-user_select': isSelect || isSelectInterval
  });

  return (
    <tr
      className={tableRowClass}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <td>{`${firstName} ${lastName}`}</td>
      <td>{username}</td>
      <td>{email}</td>
      <td>{companyName}</td>
      <td>{countPosts}</td>
    </tr>
  );
});

