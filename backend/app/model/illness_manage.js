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
    name: {
      type: STRING(30),
      allowNull: false,
      comment: '疾病名称',
    },
    description: {
      type: STRING,
      allowNull: true,
      comment: '症状描述',
      defaultValue: '暂无',
    },
    treatment: {
      type: STRING,
      allowNull: true,
      comment: '治疗方法',
      defaultValue: '暂无',
    },
    pictures: {
      type: STRING,
      allowNull: true,
      comment: '症状图片(逗号分隔)',
      defaultValue: '',
    },
  };
  Object.keys(schema).forEach(key => (schema[key].field = snakeCase(key)));

  const illnessManage = app.model.define('illness_manage', schema, {
    comment: '疾病管理表',
  });
  return illnessManage;
};
