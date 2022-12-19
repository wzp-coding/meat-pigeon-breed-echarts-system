'use strict';

const { snakeCase } = require('lodash');
module.exports = app => {
  const { INTEGER, STRING, DATEONLY } = app.Sequelize;
  const schema = {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      comment: '唯一id',
    },
    name: {
      type: STRING,
      allowNull: false,
      comment: '饲料名称',
    },
    category: {
      type: STRING(30),
      allowNull: false,
      comment: '饲料种类',
    },
    purchaseTime: {
      type: DATEONLY,
      allowNull: false,
      comment: '进货日期',
    },
    purchaseAmount: {
      type: INTEGER,
      allowNull: false,
      comment: '进货量',
    },
    currentAmount: {
      type: INTEGER,
      allowNull: false,
      comment: '当前存量',
    },
    produceTime: {
      type: DATEONLY,
      allowNull: false,
      comment: '生产日期',
    },
    shelfLife: {
      type: INTEGER,
      allowNull: false,
      comment: '保质期，统一换算成天数',
    },
  };
  Object.keys(schema).forEach(key => (schema[key].field = snakeCase(key)));
  const feedManage = app.model.define('feed_manage', schema, {
    comment: '饲料信息表',
  });
  return feedManage;
};
