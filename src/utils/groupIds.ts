export const groupIds = (ids: number[]) => {
  let count = 0;
  const sortedIds = [...ids];

  return sortedIds.sort((a, b) => a - b).reduce((acc, id, index) => {
    const isNotLast = (index + 1) <= sortedIds.length;
    const nextOneByOne = sortedIds[index + 1] - id === 1;

    if (isNotLast && nextOneByOne) {
      count++;
      return acc;
    }

    const isEmptyChain = count === 0;
    const prev = acc ? `${acc},` : '';

    if (isEmptyChain) {
      return prev + sortedIds[index];
    }

    const newAcc = `${prev}${sortedIds[index - count]}-${id}`;
    count = 0;

    return newAcc;
  }, '');
};
