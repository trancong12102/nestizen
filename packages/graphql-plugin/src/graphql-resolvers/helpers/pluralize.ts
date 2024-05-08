export const pluralize = (str: string) => {
  const lastChar = str.slice(-1);
  const lastTwoChars = str.slice(-2);
  const secondToLastChar = lastTwoChars[0];
  const vowels = ['a', 'e', 'i', 'o', 'u'];

  if (
    ['s', 'x', 'z'].includes(lastChar) ||
    ['ch', 'sh'].includes(lastTwoChars)
  ) {
    return `${str}es`;
  } else if (lastChar === 'y' && !vowels.includes(secondToLastChar)) {
    return `${str.slice(0, -1)}ies`;
  } else {
    return `${str}s`;
  }
};
