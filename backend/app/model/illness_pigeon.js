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
    app.model.PigeonManage.belongsToMany(app.model.IllnessManage, {
      through: illnessPigeon,
      as: 'illnesses',
      foreignKey: 'pigeon_id',
      constraints: false,
    });
    app.model.IllnessManage.belongsToMany(app.model.PigeonManage, {
      through: illnessPigeon,
      as: 'pigeons',
      foreignKey: 'illness_id',
      constraints: false,
    });
  };
  return illnessPigeon;
};
