export const START_PAGE_NUMBER = 1;
export const PAGES_INTERVAL = 2;
export const MAX_COUNT_PAGES = 3;

export const getSlicePagesArray = (pagesArray: number[],
  activePage: number,
  finalPage: number,
  countPages: number): number[] => {
  return activePage > START_PAGE_NUMBER ?
    activePage === finalPage || activePage === countPages ?
      pagesArray.slice(-MAX_COUNT_PAGES) :
      pagesArray.slice(activePage - PAGES_INTERVAL, activePage + START_PAGE_NUMBER) :
    pagesArray.slice(activePage - START_PAGE_NUMBER, activePage + PAGES_INTERVAL);
};

