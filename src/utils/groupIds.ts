export const groupIds = (ids: number[]) => {
  let count = 0;
  const formattedIds = ids.sort((a, b) => a - b).reduce((acc, id, index, ids) => {
    if ((index + 1) > ids.length || ids[index + 1] - id !== 1) {
      if (count !== 0) {
        const newAcc = acc ?
          `${acc},${ids[index - count]}-${id}` :
          `${ids[index - count]}-${id}`;
        count = 0;
        return newAcc;
      }
      return acc ?
        `${acc},${ids[index - count]}` :
        `${ids[index - count]}`;
    }
    count++;
    return acc;
  }, '');
  return formattedIds;
};

