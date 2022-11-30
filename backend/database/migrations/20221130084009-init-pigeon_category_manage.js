'use strict';

/** @type {import('sequelize-cli').Migration} */
const getField = require('../tables/pigeon_category_manage.js');
module.exports = {
  // 在执行数据库升级时调用的函数，创建 pigeon_category_manage 表
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('pigeon_category_manage', getField(Sequelize));
  },

  // 在执行数据库降级时调用的函数，删除 pigeon_category_manage 表
  async down(queryInterface) {
    await queryInterface.dropTable('pigeon_category_manage');
  },
};
