export const getDate = (D: Date) => {
  return D.toString()
    .split(' ')
    .splice(1, 3)
    .reduce((a, b) => a + ' ' + b, '')
    .slice(1);
};
