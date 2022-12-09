const { toInteger } = require('lodash');
const Service = require('egg').Service;

class FeedManageService extends Service {
  async findAllFeeds() {
    const ctx = this.ctx;
    try {
      let { page, pageSize } = ctx.query;
      page = toInteger(page);
      pageSize = toInteger(pageSize);
      const query = {
        limit: pageSize,
        offset: pageSize * (page - 1),
      };
      const data = await ctx.model.FeedManage.findAndCountAll(query);
      return data;
    } catch (error) {
      ctx.logger.error(error);
    }
  }
  /** 根据饲料种类统计当前剩余饲料量和总饲料量 */
  async amountGroupByCategory() {
    const ctx = this.ctx;
    const data = await ctx.model.FeedManage.findAll({
      group: 'category',
      attributes: [
        'category',
        [
          ctx.model.fn('SUM', ctx.model.col('current_amount')),
          'currentAmountTotal',
        ],
        [
          ctx.model.fn('SUM', ctx.model.col('purchase_amount')),
          'purchaseAmountTotal',
        ],
      ],
    });
    return data;
  }
}

module.exports = FeedManageService;
