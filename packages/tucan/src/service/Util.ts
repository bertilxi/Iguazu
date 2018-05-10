const match = (option, searched) => {
  return (
    option
      .toString()
      .toLowerCase()
      .indexOf(searched.toLowerCase()) >= 0
  );
};

const search = (array: any[], searched: string = "") => {
  if (!searched || !array || !array.length) {
    return array || [];
  }
  return array.filter(option => match(option.name, searched)) || [];
};

const to = promise => {
  return promise.then(data => [null, data]).catch(err => [err]);
};

export const tucan = {
  match,
  search,
  to
};
