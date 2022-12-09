'use strict';

const { snakeCase } = require('lodash');
module.exports = app => {
  const { INTEGER, STRING, TINYINT } = app.Sequelize;
  const schema = {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      comment: '用户id',
    },
    account: {
      type: STRING(50),
      allowNull: false,
      comment: '账号',
    },
    name: {
      type: STRING(50),
      allowNull: true,
      defaultValue: '张三',
      comment: '用户名',
    },
    password: {
      type: STRING,
      allowNull: false,
      comment: '密码',
    },
    avatar: {
      type: STRING,
      allowNull: true,
      defaultValue: '/public/images/default.png',
      comment: '用户头像',
    },
    role: {
      type: TINYINT(1),
      allowNull: true,
      defaultValue: 1,
      comment: '用户权限: 0=超级管理员(只能有一个), 1=普通用户',
    },
    phone: {
      type: STRING(11),
      allowNull: true,
      defaultValue: '',
      comment: '手机号',
    },
    email: {
      type: STRING(20),
      allowNull: true,
      defaultValue: '',
      comment: '邮箱',
    },
  };
  Object.keys(schema).forEach(key => (schema[key].field = snakeCase(key)));

  const user = app.model.define('user', schema, {
    comment: '用户信息表',
  });
  return user;
};
