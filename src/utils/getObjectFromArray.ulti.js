const getObjectFromArray = (data, key) => {
  return data.reduce((obj, item) => {
    return {
      ...obj,
      [item[key]]: [...(obj[item[key]] || []), item],
    };
  }, {});
};
module.exports = { getObjectFromArray };
