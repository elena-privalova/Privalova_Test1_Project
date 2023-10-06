import { MouseEvent } from 'react';

import { useUserStore } from '../..';
import { COUNT_USERS_ON_PAGE } from '../../constants';

import './pagination.css';

type PaginationProps = {
  currentPage: number,
  changePageNumber: (event: MouseEvent<HTMLButtonElement>) => void,
}

export const Pagination = (props: PaginationProps) => {
  const countUsers = useUserStore((state) => state.countUsers);

  return (
    <div className="layout-container__pagination pagination">
      {Array.from({ length: countUsers / COUNT_USERS_ON_PAGE })
        .map((page, index) =>
          <button
            key={index}
            className={props.currentPage === index + 1 ?
              'pagination__select-btn' :
              ''
            }
            onClick={props.changePageNumber}
          >
            {index+1}
          </button>)}
    </div>
  );
};

