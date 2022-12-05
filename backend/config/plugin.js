'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  sequelize: { enable: true, package: 'egg-sequelize' },
  validate: { enable: true, package: 'egg-validate' },
  cors: { enable: true, package: 'egg-cors' },
};
