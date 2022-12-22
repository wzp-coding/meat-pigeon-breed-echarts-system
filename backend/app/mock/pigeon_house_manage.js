const { Random, mock } = require('mockjs');
const moment = require('moment');
const { randomDate, randomTime } = require('../utils');

const year = moment().get('year');
const month = moment().get('month');
const day = moment().get('date');
// const hour = moment().get('hour');

module.exports = new Array(10).fill(0).map((_, i) => {
  const dayRange = [
    day,
    day - 1 < 0 ? day : day - 1,
    day - 2 < 0 ? day : day - 2,
  ];
  const hourRange = [ 8, 9, 12, 18, 17 ];
  return mock({
    name: i + 1 + '号鸽舍',
    lastCleanTime:
      randomDate(
        year,
        month,
        dayRange[Random.integer(0, dayRange.length - 1)]
      ) +
      ' ' +
      randomTime(),
    cleanGap: Random.integer(2, 4),
    lastFeedTime:
      randomDate(year, month, day) +
      ' ' +
      randomTime(hourRange[Random.integer(0, hourRange.length - 1)]),
    feedGap: Random.integer(5, 6),
  });
});
