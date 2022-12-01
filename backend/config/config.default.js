/* eslint valid-jsdoc: "off" */

'use strict';

const { SECRET_KEYS } = require('../app/const');

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
        ignore: '/login',
      },
    },
    errorHandler: {
      match: '/*',
    },
    checkLogin: {
      ignore: '/login',
    },
    validate: {
      convert: true,
    },
  });

  // use for cookie sign key, should change to your own and keep security
  config.keys = SECRET_KEYS;

  // 加载 errorHandler 中间件
  config.middleware = [ 'errorHandler', 'checkLogin' ];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
