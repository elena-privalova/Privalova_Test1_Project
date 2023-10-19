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
import {
  selectIsHasMoreUsers
} from '../../store/users/selectors';
import {
  usePaginationStore,
  useUserStore
} from '../../store';

import './pagination.css';

const START_PAGE_NUMBER = 1;
const PAGES_INTERVAL = 2;
const MAX_COUNT_PAGES = 3;

export const Pagination = () => {
  const [currentPage] = useSearchParams();

  const isHasMoreUsers = useUserStore(selectIsHasMoreUsers);

  const finalPage = usePaginationStore(selectFinalPage);
  const endPage = usePaginationStore(selectEndPage);

  useEffect(() => {
    getCountPages();
    if (currentPage.get('page') != undefined) {
      setActivePage(Number(currentPage.get('page')));
    }
  }, []);

  const countPages = usePaginationStore(selectCountPages);

  const activePage = usePaginationStore(selectActivePage);

  const handleChangePageNmber = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target instanceof HTMLButtonElement) {
      if (Number(event.target.innerText) !== endPage) setFinalPage(Number(event.target.innerText) + 1);
      setActivePage(Number(event.target.innerText));
    }
  };

  const pagesArray: number[] = Array
    .from({ length: countPages }, (_, i) => i + 1);

  const slicePagesArray = activePage > START_PAGE_NUMBER ?
    activePage === finalPage ?
      pagesArray.slice(-MAX_COUNT_PAGES) :
      pagesArray.slice(activePage - PAGES_INTERVAL, activePage + START_PAGE_NUMBER) :
    pagesArray.slice(activePage - START_PAGE_NUMBER, activePage + PAGES_INTERVAL);

  const isHasPreviousButton = activePage > 2;
  const isHasNextButton = activePage > 2 && isHasMoreUsers;

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

