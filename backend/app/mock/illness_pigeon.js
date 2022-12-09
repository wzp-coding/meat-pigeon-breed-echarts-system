const { isEqual, uniqWith } = require('lodash');
const { Random, mock } = require('mockjs');

module.exports = uniqWith(
  new Array(100).fill(0).map(() =>
    mock({
      pigeonId: Random.integer(1, 100),
      illnessId: Random.integer(1, 9),
    })
  ),
  isEqual
);

