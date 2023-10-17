import { MouseEvent, useEffect, useState } from 'react';
import classNames from 'classnames';

import { usePostsStore, useUserStore } from '../../store';
import { COUNT_USERS_ON_PAGE, MAX_COUNT_PAGES } from '../../constants';
import {
  selectActivePage,
  selectFinalPage,
  setActivePage
} from '../../store/posts/selectors';
import { selectCountUsers } from '../../store/users/selectors';

import './pagination.css';

export const Pagination = () => {
  const countUsers = useUserStore(selectCountUsers);

  const activePage = usePostsStore(selectActivePage);
  const finalPage = usePostsStore(selectFinalPage);

  const [pagesArray, setPagesArray] = useState(Array
    .from({ length: countUsers / COUNT_USERS_ON_PAGE }, (_, i) => i + 1));

  useEffect(() => {
    if (pagesArray.length > 3 && activePage === 1) {
      setPagesArray(pagesArray.slice(0, MAX_COUNT_PAGES));
    }

    if (finalPage - activePage >= 2 && finalPage > 3 && activePage > 1) {
      const lastVisiblePage = pagesArray.length - finalPage + activePage + 1;
      setPagesArray(pagesArray.slice(0, lastVisiblePage));
    }
  }, [activePage]);

  const handleChangePageNmber = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target instanceof HTMLButtonElement) {
      setActivePage(Number(event.target.innerText));
    }
  };

  const slicePagesArray = pagesArray.slice(-MAX_COUNT_PAGES);

  return (
    <div className="layout-container__pagination pagination" onClick={handleChangePageNmber}>
      {pagesArray.length > 3 && <span>...</span>}
      {slicePagesArray.map((page) =>
        <button
          key={page}
          className={classNames({ 'pagination__select-btn': activePage === page })}
        >
          {page}
        </button>)}
    </div>
  );
};

