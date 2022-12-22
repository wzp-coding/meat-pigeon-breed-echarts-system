const CryptoJS = require('crypto-js');
const { SECRET_KEYS } = require('../const/index');
const { Op } = require('sequelize');

const encrypto = str => CryptoJS.AES.encrypt(str, SECRET_KEYS).toString();
const decrypto = str =>
  CryptoJS.AES.decrypt(str, SECRET_KEYS).toString(CryptoJS.enc.Utf8);

const moment = require('moment');
const { isUndefined } = require('lodash');

const randomDate = (year, month, day) => {
  // 随机生成0-11的数字
  const randomMonthNum = Math.floor(Math.random() * 11);
  // 随机生成1-30数字
  const randomDateNum = Math.ceil(Math.random() * 30);
  return moment()
    .year(year)
    .month(month ? month : randomMonthNum)
    .date(day ? day : randomDateNum)
    .format('YYYY-MM-DD');
};

const randomTime = (hour, minute, second) => {
  // 随机生成0-23的数字--小时
  const randomHour = Math.floor(Math.random() * 23);
  // 随机生成1-59数字--分
  const randomMinute = Math.floor(Math.random() * 59);
  // 随机生成1-59数字--秒
  const randomSecond = Math.floor(Math.random() * 59);
  return moment()
    .hour(hour ? hour : randomHour)
    .minute(minute ? minute : randomMinute)
    .second(second ? second : randomSecond)
    .format('HH:mm:ss');
};

const geneRangeWhere = (arr = [], name) => {
  if (!arr.length || arr.length !== 2 || isUndefined(arr[0]) || isUndefined(arr[1])) {
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
  randomTime,
  geneRangeWhere,
};
