'use strict';

/** @type {import('sequelize-cli').Migration} */
const getField = require('../tables/user.js');
module.exports = {
  // 在执行数据库升级时调用的函数，创建 user 表
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user', getField(Sequelize));
  },

  // 在执行数据库降级时调用的函数，删除 user 表
  async down(queryInterface) {
    await queryInterface.dropTable('user');
  },
};
