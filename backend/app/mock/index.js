
exports.init = async app => {
  app;
  // await app.model.FeedManage.bulkCreate(require('./feed_manage'));
  // await app.model.PigeonCategoryManage.bulkCreate(require('./pigeon_category_manage'));
  // await app.model.User.bulkCreate(require('./user'));
  // await app.model.IllnessManage.bulkCreate(require('./illness_manage'));
  // await app.model.PigeonManage.bulkCreate(require('./pigeon_manage'));
  // await app.model.IllnessPigeon.bulkCreate(require('./illness_pigeon'));
  // await app.model.PigeonHouseManage.bulkCreate(require('./pigeon_house_manage'));
  console.log('创建mock数据成功！');
};

exports.destory = async app => {
  // 去除外键检查
  await app.model.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true });
  // await app.model.FeedManage.destroy({ truncate: true });
  // await app.model.PigeonCategoryManage.destroy({ truncate: true });
  // await app.model.User.destroy({ truncate: true });
  // await app.model.IllnessManage.destroy({ truncate: true });
  // await app.model.PigeonManage.destroy({ truncate: true });
  // await app.model.IllnessPigeon.destroy({ truncate: true });
  // await app.model.PigeonHouseManage.destroy({ truncate: true });
  // 还原外键检查
  await app.model.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true });
  console.log('销毁mock数据成功！');
};
