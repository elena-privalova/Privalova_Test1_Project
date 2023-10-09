import { MouseEvent } from 'react';

import { usePostsStore, useUserStore } from '../..';
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

  return (
    <div className="layout-container__pagination pagination" onClick={handleChangePageNmber}>
      {Array.from({ length: countUsers / COUNT_USERS_ON_PAGE })
        .map((page, index) =>
          <button
            key={index}
            className={activePage === index + 1 ?
              'pagination__select-btn' :
              ''
            }
          >
            {index+1}
          </button>)}
    </div>
  );
};

