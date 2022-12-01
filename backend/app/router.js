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
  router.post('/feedManage/feed/:id', controller.feedManage.feed);
  router.get('/feedManage/amount', controller.feedManage.amountGroupByCategory);
  router.resources('feed_manage', '/feedManage', controller.feedManage);
  // 肉鸽种类管理
  router.resources(
    'pigeon_category_manage',
    '/pigeonCategoryManage',
    controller.pigeonCategoryManage
  );
  // 用户管理
  router.resources('user', '/user', controller.user);
  router.post('/login', controller.user.login);
};
