'use strict';

module.exports = app => {
  const getField = require('../../database/tables/pigeon_category_manage.js');
  const pigeonCategoryManage = app.model.define('pigeon_category_manage', getField(app.Sequelize), {
    comment: '肉鸽种类表',
  });
  return pigeonCategoryManage;
};
