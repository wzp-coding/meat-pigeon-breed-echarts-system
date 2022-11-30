module.exports = class App {
  constructor(app) {
    this.app = app;
  }

  async willReady() {
    const app = this.app;

    // 同步数据库
    await app.model
      .sync()
      .then(() => {
        app.logger.info('Sync Tables...');
      })
      .catch(err => {
        app.logger.error(err);
      });
  }

  serverDidReady() {
    // require('./app/mock/index').destory(this.app);
    // require('./app/mock/index').init(this.app);
  }
};
