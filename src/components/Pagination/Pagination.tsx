import { MouseEvent } from 'react';
import classNames from 'classnames';

import { usePostsStore, useUserStore } from '../../store';
import { COUNT_USERS_ON_PAGE } from '../../constants';

import './pagination.css';

export const Pagination = () => {
  const countUsers = useUserStore((state) => state.countUsers);

  const activePage = usePostsStore((state) => state.activePage);
  const setActivePage = usePostsStore((state) => state.setActivePage);

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

