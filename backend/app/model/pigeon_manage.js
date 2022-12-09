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
    pigeonId: {
      type: STRING(30),
      allowNull: false,
      comment: '肉鸽编号',
    },
    houseId: {
      type: STRING(30),
      allowNull: false,
      comment: '鸽舍编号',
    },
    // 外键 => pigeon_category_manage(id)
    categoryId: {
      type: INTEGER,
      allowNull: false,
      comment: '种类 id',
    },
    startFeedTime: {
      type: DATEONLY,
      allowNull: false,
      comment: '开始饲养时间',
    },
    feedCount: {
      type: INTEGER,
      allowNull: false,
      comment: '喂养次数',
    },
    weight: {
      type: INTEGER,
      allowNull: false,
      comment: '体重',
    },
    eggs: {
      type: INTEGER,
      allowNull: true,
      comment: '产卵',
      defaultValue: 0,
    },
    health: {
      type: STRING(30),
      allowNull: true,
      comment: '健康状况',
      defaultValue: '健康',
    },
  };
  Object.keys(schema).forEach(key => (schema[key].field = snakeCase(key)));
  const pigeonManage = app.model.define('pigeon_manage', schema, {
    comment: '肉鸽管理表',
  });
  pigeonManage.associate = function() {
    app.model.PigeonManage.belongsTo(app.model.PigeonCategoryManage, {
      foreignKey: 'category_id',
      onDelete: 'NO ACTION',
      onUpdate: 'NO ACTION',
      as: 'categoryInfo',
    });
  };
  return pigeonManage;
};
