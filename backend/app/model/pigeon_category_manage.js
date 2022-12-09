'use strict';
const { snakeCase } = require('lodash');
module.exports = app => {
  const { INTEGER, STRING } = app.Sequelize;
  const schema = {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      comment: '唯一id',
    },
    category: {
      type: STRING,
      allowNull: false,
      comment: '肉鸽种类',
    },
    yearEggs: {
      type: STRING(30),
      allowNull: false,
      comment: '年产卵（个）',
    },
    adultWeight: {
      type: STRING(30),
      allowNull: false,
      comment: '成年体重（g）',
    },
    fourAgeWeight: {
      type: STRING(30),
      allowNull: false,
      comment: '4周龄体重（g）',
    },
    feature: {
      type: STRING,
      allowNull: true,
      comment: '特点',
      defaultValue: '',
    },
  };
  Object.keys(schema).forEach(key => (schema[key].field = snakeCase(key)));
  const pigeonCategoryManage = app.model.define('pigeon_category_manage', schema, {
    comment: '肉鸽种类表',
  });
  return pigeonCategoryManage;
};
