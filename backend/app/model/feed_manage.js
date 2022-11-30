'use strict';

module.exports = app => {
  const getField = require('../../database/tables/feed_manage');
  const feedManage = app.model.define('feed_manage', getField(app.Sequelize), {
    comment: '饲料信息表',
  });
  return feedManage;
};
