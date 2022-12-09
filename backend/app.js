module.exports = class App {
  constructor(app) {
    this.app = app;
  }

  async willReady() {
    const app = this.app;

    // 同步数据库
    await app.model
      .sync({
        alter: true,
      })
      .then(() => {
        app.logger.info('模型更新同步成功');
      })
      .catch(err => {
        app.logger.error(err);
      });
  }

  async serverDidReady() {
    await require('./app/mock/index').destory(this.app);
    await require('./app/mock/index').init(this.app);
  }
};
