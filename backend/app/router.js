'use strict';
const path = require('path');

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;

  // 加载所有的校验规则
  const directory = path.join(app.config.baseDir, 'app/validate');
  app.loader.loadToApp(directory, 'validate');

  // 饲料管理
  router.post('/feedManage/feed', controller.feedManage.feedByHouseId);
  router.get('/feedManage/amount', controller.feedManage.amountGroupByCategory);
  router.get('/feedManage/group', controller.feedManage.findFeedsByGroup);

  router.post('/feedManage/create', controller.feedManage.create);
  router.delete('/feedManage/:id', controller.feedManage.destroy);
  router.put('/feedManage/:id', controller.feedManage.update);
  router.post('/feedManage', controller.feedManage.index);
  router.get('/feedManage/:id', controller.feedManage.show);

  // 肉鸽种类管理
  router.post('/pigeonCategoryManage/create', controller.pigeonCategoryManage.create);
  router.delete('/pigeonCategoryManage/:id', controller.pigeonCategoryManage.destroy);
  router.put('/pigeonCategoryManage/:id', controller.pigeonCategoryManage.update);
  router.post('/pigeonCategoryManage', controller.pigeonCategoryManage.index);
  router.get('/pigeonCategoryManage/:id', controller.pigeonCategoryManage.show);

  // 鸽舍管理
  router.post('/pigeonHouseManage/create', controller.pigeonHouseManage.create);
  router.delete('/pigeonHouseManage/:id', controller.pigeonHouseManage.destroy);
  router.put('/pigeonHouseManage/:id', controller.pigeonHouseManage.update);
  router.post('/pigeonHouseManage', controller.pigeonHouseManage.index);
  router.get('/pigeonHouseManage/:id', controller.pigeonHouseManage.show);

  // 用户管理
  router.post('/login', controller.user.login);
  router.post('/user/checkAccount', controller.user.checkAccount);

  router.post('/user/create', controller.user.create);
  router.delete('/user/:id', controller.user.destroy);
  router.put('/user/:id', controller.user.update);
  router.post('/user', controller.user.index);
  router.get('/user/:id', controller.user.show);

  // 疾病管理
  router.post('/illnessManage/create', controller.illnessManage.create);
  router.delete('/illnessManage/:id', controller.illnessManage.destroy);
  router.put('/illnessManage/:id', controller.illnessManage.update);
  router.post('/illnessManage', controller.illnessManage.index);
  router.get('/illnessManage/:id', controller.illnessManage.show);

  // 肉鸽管理
  router.post('/pigeonManage/create', controller.pigeonManage.create);
  router.delete('/pigeonManage/:id', controller.pigeonManage.destroy);
  router.put('/pigeonManage/:id', controller.pigeonManage.update);
  router.post('/pigeonManage', controller.pigeonManage.index);
  router.get('/pigeonManage/:id', controller.pigeonManage.show);
};
