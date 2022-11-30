const { snakeCase } = require('lodash');
module.exports = ({ INTEGER, STRING, DATEONLY }) => {
  const schema = {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      comment: '唯一id',
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
  return schema;
};
