'use strict';

const Subscription = require('egg').Subscription;
const moment = require('moment');

class UpdateFeedDays extends Subscription {
  static get schedule() {
    return {
      cron: '0 0 0 * * ?',
      type: 'worker',
    };
  }

  async subscribe() {
    const ctx = this.ctx;
    const data = await ctx.model.PigeonManage.findAll({
      where: {
        isFinished: false,
      },
    });
    const newData = data.map(dataModel => ({ ...dataModel.dataValues, feedDays: moment().diff(dataModel.dataValues.startFeedTime, 'days') }));
    ctx.model.PigeonManage.bulkCreate(newData, { updateOnDuplicate: [ 'feedDays' ] });
  }
}

module.exports = UpdateFeedDays;
