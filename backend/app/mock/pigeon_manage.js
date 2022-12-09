const { randomDate } = require('../utils/index');
const { Random, mock } = require('mockjs');

module.exports = new Array(100)
  .fill(0)
  .map((_, i) => mock({
    pigeonId: [ 'a', 'b', 'c' ][i % 3] + i,
    houseId: Random.integer(1, 5) + '号鸽舍',
    categoryId: Random.integer(1, 10),
    startFeedTime: randomDate(2022),
    feedCount: Random.integer(1, 10),
    weight: Random.integer(500, 1000),
    eggs: Random.integer(0, 20),
    'health|1': [ '健康', '亚健康' ],
  }));
