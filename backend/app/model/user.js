'use strict';

module.exports = app => {
  const getField = require('../../database/tables/user');
  const user = app.model.define('user', getField(app.Sequelize), {
    comment: '用户信息表',
  });
  return user;
};
