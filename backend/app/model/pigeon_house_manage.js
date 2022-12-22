'use strict';
const { snakeCase } = require('lodash');
const moment = require('moment');

module.exports = app => {
  const { INTEGER, STRING, DATE } = app.Sequelize;
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
      comment: '鸽舍名',
    },
    lastCleanTime: {
      type: DATE,
      allowNull: false,
      comment: '上次清洁日期',
      get() {
        return moment(this.getDataValue('lastCleanTime')).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    cleanGap: {
      type: INTEGER,
      allowNull: false,
      comment: '定期清洁间隔',
    },
    lastFeedTime: {
      type: DATE,
      allowNull: false,
      comment: '上次投喂日期',
      get() {
        return moment(this.getDataValue('lastFeedTime')).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    feedGap: {
      type: INTEGER,
      allowNull: false,
      comment: '定期投喂间隔',
    },
  };
  Object.keys(schema).forEach(key => (schema[key].field = snakeCase(key)));
  const pigeonHouseManage = app.model.define('pigeon_house_manage', schema, {
    comment: '鸽舍管理表',
  });
  return pigeonHouseManage;
};
