const { mock, Random } = require('mockjs');
const { isEqual, uniqWith } = require('lodash');
const { randomDate } = require('../utils');

const categoryList = [
  {
    name: '植物蛋白质饲料',
    list: [ '碗豆', '蚕豆', '绿豆', '黑豆' ],
  },
  {
    name: '动物蛋白质饲料',
    list: [ '鱼粉', '肉粉', '虾粉', '血粉' ],
  },
  {
    name: '碳水化合物饲料',
    list: [ '玉米', '大米', '小麦', '稻谷', '高梁', '大麦' ],
  },
  {
    name: '脂肪饲料',
    list: [ '油菜籽', '芝麻', '花生' ],
  },
  {
    name: '青绿饲料',
    list: [ '青菜', '胡萝卜' ],
  },
  {
    name: '矿物质饲料',
    list: [ '食盐', '骨粉', '磷酸氢钙', '石灰石', '贝壳粉', '蛋贝粉' ],
  },
  {
    name: '特种饲料',
    list: [ '抗菌素', '酶制剂' ],
  },
];
module.exports = uniqWith(new Array(100).fill(0).map(() => {
  const amount = Random.natural(1, 100);
  const produceMonth = Random.integer(1, 11);
  const purchaseMonth = produceMonth + 1;
  const category = categoryList[Random.integer(0, categoryList.length - 1)];
  return mock({
    name: category.list[Random.integer(0, category.list.length - 1)],
    category: category.name,
    purchaseTime: randomDate(2022, purchaseMonth),
    purchaseAmount: amount,
    currentAmount: amount,
    produceTime: randomDate(2022, produceMonth),
    'shelfLife|1': [ 30, 60, 90 ],
  });
}), isEqual);
