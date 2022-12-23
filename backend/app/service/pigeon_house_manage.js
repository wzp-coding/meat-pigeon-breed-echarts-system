const { toInteger } = require('lodash');
const Service = require('egg').Service;
const { Op } = require('sequelize');

class pigeonHouseManageService extends Service {
  async findAllPigeonHouse() {
    const ctx = this.ctx;
    try {
      let { page, pageSize, keywords = '' } = ctx.request.body;
      page = toInteger(page);
      pageSize = toInteger(pageSize);
      const query = {
        limit: pageSize,
        offset: pageSize * (page - 1),
        where: {
          [Op.or]: {
            name: {
              [Op.like]: '%' + keywords + '%',
            },
          },
        },
      };
      const data = await ctx.model.PigeonHouseManage.findAndCountAll(query);
      return data;
    } catch (error) {
      ctx.logger.error(error);
    }
  }

  async feedByHouseId() {
    const ctx = this.ctx;
    const { houseId, feeds = [], lastFeedTime } = ctx.request.body;
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
      // 更新投喂时间
      const house = await ctx.model.PigeonHouseManage.findByPk(houseId);
      await house.update({ lastFeedTime }, { transaction: t });
    });
  }
}

module.exports = pigeonHouseManageService;
