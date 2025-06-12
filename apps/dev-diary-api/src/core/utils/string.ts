// function to return a string with the first letter capitalized

export const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const capitalizeFirstLetterOfEachWord = (str: string) => {
  return str.split(' ').map(capitalizeFirstLetter).join(' ');
};
