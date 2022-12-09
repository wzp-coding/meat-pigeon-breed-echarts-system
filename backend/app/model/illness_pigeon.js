'use strict';
const { snakeCase } = require('lodash');

module.exports = app => {
  const { INTEGER } = app.Sequelize;
  const schema = {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      comment: '唯一id',
    },
    // 外键 => pigeon_manage(id)
    pigeonId: {
      type: INTEGER,
      allowNull: false,
      comment: '鸽子 id(不是编号)',
    },
    // 外键 => illness_manage(id)
    illnessId: {
      type: INTEGER,
      allowNull: false,
      comment: '病因 id',
    },
  };
  Object.keys(schema).forEach(key => (schema[key].field = snakeCase(key)));
  const illnessPigeon = app.model.define('illness_pigeon', schema, {
    comment: '疾病id和鸽子id映射表',
  });
  illnessPigeon.associate = function() {
    app.model.IllnessPigeon.belongsTo(app.model.PigeonManage, {
      foreignKey: 'pigeon_id',
      onDelete: 'NO ACTION',
      onUpdate: 'NO ACTION',
    });
    app.model.IllnessPigeon.belongsTo(app.model.IllnessManage, {
      foreignKey: 'illness_id',
      onDelete: 'NO ACTION',
      onUpdate: 'NO ACTION',
    });
  };
  return illnessPigeon;
};
