const CryptoJS = require('crypto-js');
const { SECRET_KEYS } = require('../const/index');
const { Op } = require('sequelize');

const encrypto = str => CryptoJS.AES.encrypt(str, SECRET_KEYS).toString();
const decrypto = str =>
  CryptoJS.AES.decrypt(str, SECRET_KEYS).toString(CryptoJS.enc.Utf8);

const moment = require('moment');

const randomDate = (year, month) => {
  // 随机生成0-11的数字
  const randomMonthNum = Math.floor(Math.random() * 11);
  // 随机生成1-30数字
  const randomDateNum = Math.ceil(Math.random() * 30);
  return moment()
    .year(year)
    .month(month ? month : randomMonthNum)
    .date(randomDateNum)
    .format('YYYY-MM-DD');
};


const geneRangeWhere = (arr = [], name) => {
  if (!arr.length || arr.length !== 2 || !arr[0] || !arr[1]) {
    return {};
  }
  return {
    [name]: {
      [Op.gte]: arr[0],
      [Op.lte]: arr[1],
    },
  };
};

module.exports = {
  encrypto,
  decrypto,
  randomDate,
  geneRangeWhere,
};
