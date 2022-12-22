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

  async feedByHouseId() {
    const ctx = this.ctx;
    const { houseId, feeds = [] } = ctx.request.body;
    return await ctx.model.transaction(async t => {
      // 查询 鸽舍id 的 鸽子们
      const rawPigeons = await ctx.service.pigeonManage.findPigeonsByHouseId(houseId);
      const newPigeonsData = rawPigeons.map(pigeon => ({
        ...pigeon.dataValues,
        feedCount: pigeon.dataValues.feedCount + 1,
      }));
      // 批量更新 鸽子表 的 喂养次数
      await ctx.model.PigeonManage.bulkCreate(newPigeonsData, { updateOnDuplicate: [ 'feedCount' ], transaction: t });
      // 查询 饲料表 的 饲料们
      const rawFeeds = await ctx.model.FeedManage.findAll({
        where: {
          id: {
            [Op.or]: feeds.map(item => item.id),
          },
        },
      });
      const idToAmount = new Map(feeds.map(feed => [ +feed.id, +feed.amount ]));
      const newFeedsData = rawFeeds.map(feed => ({
        ...feed.dataValues,
        currentAmount: feed.dataValues.currentAmount - idToAmount.get(feed.dataValues.id),
      }));
      // 批量更新 饲料表 的 当前存量
      await ctx.model.FeedManage.bulkCreate(newFeedsData, { updateOnDuplicate: [ 'currentAmount' ], transaction: t });
    });
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
