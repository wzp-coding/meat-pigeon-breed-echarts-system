const { snakeCase } = require('lodash');
module.exports = ({ INTEGER, STRING }) => {
  const schema = {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      comment: '唯一id',
    },
    category: {
      type: STRING,
      allowNull: false,
      comment: '肉鸽种类',
    },
    yearEggs: {
      type: STRING(30),
      allowNull: false,
      comment: '年产卵（个）',
    },
    adultWeight: {
      type: STRING(30),
      allowNull: false,
      comment: '成年体重（g）',
    },
    fourAgeWeight: {
      type: STRING(30),
      allowNull: false,
      comment: '4周龄体重（g）',
    },
    feature: {
      type: STRING,
      allowNull: false,
      comment: '特点',
    },
  };
  Object.keys(schema).forEach(key => (schema[key].field = snakeCase(key)));
  return schema;
};
