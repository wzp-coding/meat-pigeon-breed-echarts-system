const { mock, Random } = require('mockjs');

module.exports = new Array(100).fill(0).map(() => {
  const amount = Random.natural(1, 100);
  const date = Random.now('yyyy-MM-dd');
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
    purchaseTime: date,
    purchaseAmount: amount,
    currentAmount: amount,
    produceTime: date,
    'shelfLife|1': [ 10, 20, 30, 60, 90 ],
  });
});
