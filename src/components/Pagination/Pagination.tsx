import { MouseEvent } from 'react';
import classNames from 'classnames';

import { usePostsStore, useUserStore } from '../../store';
import { COUNT_USERS_ON_PAGE } from '../../constants';
import { selectActivePage, setActivePage } from '../../store/posts/selectors';
import { selectCountUsers } from '../../store/users/selectors';

import './pagination.css';

export const Pagination = () => {
  const countUsers = useUserStore(selectCountUsers);

  const activePage = usePostsStore(selectActivePage);

  const handleChangePageNmber = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target instanceof HTMLButtonElement) {
      setActivePage(Number(event.target.innerText));
    }
  };

  const pagesArray: number[] = Array.from({ length: countUsers / COUNT_USERS_ON_PAGE }, (_, i) => i + 1);

  return (
    <div className="layout-container__pagination pagination" onClick={handleChangePageNmber}>
      {pagesArray.map((page) =>
        <button
          key={page}
          className={classNames({ 'pagination__select-btn': activePage === page })}
        >
          {page}
        </button>)}
    </div>
  );
};

