'use strict';

/** @type {import('sequelize-cli').Migration} */
const getField = require('../tables/feed_manage.js');
module.exports = {
  // 在执行数据库升级时调用的函数，创建 feed_manage 表
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('feed_manage', getField(Sequelize));
  },

  // 在执行数据库降级时调用的函数，删除 feed_manage 表
  async down(queryInterface) {
    await queryInterface.dropTable('feed_manage');
  },
};
