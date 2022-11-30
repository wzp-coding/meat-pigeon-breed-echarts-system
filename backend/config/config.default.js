/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {
    sequelize: {
      dialect: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      database: 'pigeon',
      define: {
        freezeTableName: true,
        timestamps: false,
        underscored: true,
      },
    },
    security: {
      csrf: {
        enable: true,
        headerName: 'token',
      },
    },
    // 只对 /api 前缀的 url 路径生效
    errorHandler: {
      match: '/*',
    },
    validate: {
      convert: true,
    },
  });

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_meat-pigeon';

  // 加载 errorHandler 中间件
  config.middleware = ['errorHandler'];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
