export const START_PAGE_NUMBER = 1;
export const PAGES_INTERVAL = 2;
export const MAX_COUNT_PAGES = 3;

export const getSlicePagesArray = (pagesArray: number[],
  activePage: number,
  finalPage: number,
  countPages: number): number[] => {
  const startInterval: number[] = [activePage - START_PAGE_NUMBER, activePage + PAGES_INTERVAL];
  const interval: number[] = activePage === finalPage ||
    activePage === countPages ?
    [activePage - MAX_COUNT_PAGES, activePage] :
    [activePage - PAGES_INTERVAL, activePage + START_PAGE_NUMBER];

  return activePage > START_PAGE_NUMBER ?
    pagesArray.slice(interval[0], interval[1]) :
    pagesArray.slice(startInterval[0], startInterval[1]);
};

