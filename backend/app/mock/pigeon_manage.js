const { randomDate } = require('../utils/index');
const { Random, mock } = require('mockjs');
const moment = require('moment');

module.exports = new Array(100).fill(0).map((_, i) => {
  const startFeedTime = randomDate(2022);
  const feedDays = moment().diff(startFeedTime, 'days');
  return mock({
    pigeonId: [ 'a', 'b', 'c' ][i % 3] + i,
    houseId: Random.integer(1, 10),
    categoryId: Random.integer(1, 10),
    startFeedTime,
    feedCount: Random.integer(1, 10),
    weight: Random.integer(500, 1000),
    eggs: Random.integer(0, 20),
    'health|1': [ '健康', '亚健康' ],
    feedDays,
    'isFinished|1': [ true, false ],
  });
});

