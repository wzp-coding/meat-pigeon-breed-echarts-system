const { mock, Random } = require('mockjs');
const { isEqual, uniqWith } = require('lodash');
const { randomDate } = require('../utils');

module.exports = uniqWith(new Array(100).fill(0).map(() => {
  const amount = Random.natural(1, 100);
  const produceMonth = Random.integer(1, 11);
  const purchaseMonth = produceMonth + 1;
  return mock({
    'category|1': [
      '植物蛋白质饲料',
      '动物蛋白质饲料',
      '碳水化合物饲料',
      '脂肪饲料',
      '青绿饲料',
      '矿物质饲料',
      '特种饲料',
    ],
    purchaseTime: randomDate(2022, purchaseMonth),
    purchaseAmount: amount,
    currentAmount: amount,
    produceTime: randomDate(2022, produceMonth),
    'shelfLife|1': [ 30, 60, 90 ],
  });
}), isEqual);
