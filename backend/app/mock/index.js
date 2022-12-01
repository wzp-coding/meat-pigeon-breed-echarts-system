exports.init = async app => {
  // await app.model.FeedManage.bulkCreate(require('./feed_manage'));
  // await app.model.PigeonCategoryManage.bulkCreate(require('./pigeon_category_manage'));
  // await app.model.User.bulkCreate(require('./user'));
  console.log('创建mock数据成功！');
};

exports.destory = async app => {
  // await app.model.FeedManage.destroy({ truncate: true });
  // await app.model.PigeonCategoryManage.destroy({ truncate: true });
  // await app.model.User.destroy({ truncate: true });
  console.log('销毁mock数据成功！');
};
