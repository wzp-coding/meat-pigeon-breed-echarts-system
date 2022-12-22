const { toInteger } = require('lodash');
const Service = require('egg').Service;
const { Op } = require('sequelize');
const { geneRangeWhere } = require('../utils');
class FeedManageService extends Service {
  async findAllFeeds() {
    const ctx = this.ctx;
    try {
      let { page, pageSize } = ctx.request.body;
      const {
        keywords = '',
        category = '',
        purchaseTime = [],
        produceTime = [],
        purchaseAmount = [],
        shelfLife = [],
        currentAmount = [],
      } = ctx.request.body;
      page = toInteger(page);
      pageSize = toInteger(pageSize);
      const categoryWhere = category ? { category } : {};
      const query = {
        limit: pageSize,
        offset: pageSize * (page - 1),
        where: {
          [Op.or]: {
            category: {
              [Op.like]: '%' + keywords + '%',
            },
            name: {
              [Op.like]: '%' + keywords + '%',
            },
          },
          ...categoryWhere,
          ...geneRangeWhere(purchaseTime, 'purchaseTime'),
          ...geneRangeWhere(produceTime, 'produceTime'),
          ...geneRangeWhere(purchaseAmount, 'purchaseAmount'),
          ...geneRangeWhere(currentAmount, 'currentAmount'),
          ...geneRangeWhere(shelfLife, 'shelfLife'),
        },
      };
      const data = await ctx.model.FeedManage.findAndCountAll(query);
      return data;
    } catch (error) {
      ctx.logger.error(error);
    }
  }

  /** 分类查询各种类的饲料数组 */
  async findFeedsByGroup() {
    const ctx = this.ctx;
    try {
      const categoryList = await this.findCategoryList();
      const promiseAll = categoryList.map(async category => await this.findFeedsByCategory(category));
      const list = await Promise.all(promiseAll);
      return list.map(itemArr => ({ label: itemArr[0].category, options: itemArr }));
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

  /** 根据 种类 查询 饲料数组 */
  async findFeedsByCategory(category) {
    const ctx = this.ctx;
    return await ctx.model.FeedManage.findAll({
      where: {
        category,
      },
      // 优先使用 存量多、进货日期早 的饲料
      order: [[ 'currentAmount', 'DESC' ], [ 'purchaseTime', 'ASC' ]],
    });
  }

  /** 查询 种类 数组 */
  async findCategoryList() {
    const ctx = this.ctx;
    const categoryObjList = await ctx.model.FeedManage.findAll({
      attributes: [
        [ ctx.model.fn('DISTINCT', ctx.model.col('category')), 'name' ],
      ],
    });
    return categoryObjList.map(i => i.name);
  }
}

module.exports = FeedManageService;
