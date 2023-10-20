import { MouseEvent, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import classNames from 'classnames';

import {
  selectEndPage,
  getCountPages,
  selectActivePage,
  selectCountPages,
  selectFinalPage,
  setActivePage,
  setFinalPage
} from '../../store/pagination/selectors';
import { usePaginationStore, useUserStore } from '../../store';
import { selectIsHasMoreUsers } from '../../store/users/selectors';
import { PAGES_INTERVAL, getSlicePagesArray } from '../../utils/getSlicePagesArray';

import './pagination.css';

export const Pagination = () => {
  const [currentPage] = useSearchParams();

  const isHasMoreUsers = useUserStore(selectIsHasMoreUsers);

  const activePage = usePaginationStore(selectActivePage);
  const countPages = usePaginationStore(selectCountPages);
  const endPage = usePaginationStore(selectEndPage);
  const finalPage = usePaginationStore(selectFinalPage);

  useEffect(() => {
    getCountPages();
    if (currentPage.get('page') != undefined) {
      setActivePage(Number(currentPage.get('page')));
    }
  }, []);

  const handleChangePageNmber = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target instanceof HTMLButtonElement) {
      if (Number(event.target.innerText) !== endPage) setFinalPage(Number(event.target.innerText) + 1);
      setActivePage(Number(event.target.innerText));
    }
  };

  const pagesArray: number[] = Array
    .from({ length: countPages }, (_, i) => i + 1);

  const slicePagesArray = getSlicePagesArray(pagesArray, activePage, finalPage, countPages);

  const isHasPreviousButton = activePage > PAGES_INTERVAL;
  const isHasNextButton = activePage > PAGES_INTERVAL &&
    isHasMoreUsers && (countPages - activePage) > 1;

  const paginationClass = classNames({
    'layout-container__pagination pagination': true,
    'pagination_previous-button': isHasPreviousButton,
    'pagination_next-button': isHasNextButton
  });

  return (
    <div
      className={paginationClass}
      onClick={handleChangePageNmber}
    >
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

