const { toInteger } = require('lodash');
const Service = require('egg').Service;
const { Op } = require('sequelize');
const { geneRangeWhere } = require('../utils');

class pigeonManageService extends Service {
  async findAllPigeons() {
    const ctx = this.ctx;
    try {
      let { page, pageSize } = ctx.request.body;
      const { startFeedTime = [], feedDays = [], keywords = '' } = ctx.request.body;
      page = toInteger(page);
      pageSize = toInteger(pageSize);
      const data = await ctx.model.PigeonManage.findAndCountAll({
        limit: pageSize,
        offset: pageSize * (page - 1),
        include: [
          {
            model: ctx.model.PigeonCategoryManage,
            as: 'categoryInfo',
            required: true,
          },
          {
            model: ctx.model.PigeonHouseManage,
            as: 'houseInfo',
            required: true,
          },
          {
            model: ctx.model.IllnessManage,
            as: 'illnesses',
            through: {
              attributes: [],
            },
          },
        ],
        attributes: {
          exclude: [ 'category_id' ],
        },
        where: {
          [Op.or]: {
            pigeonId: {
              [Op.like]: '%' + keywords + '%',
            },
            houseId: {
              [Op.like]: '%' + keywords + '%',
            },
            '$categoryInfo.category$': {
              [Op.like]: '%' + keywords + '%',
            },
            '$categoryInfo.feature$': {
              [Op.like]: '%' + keywords + '%',
            },
          },
          ...geneRangeWhere(startFeedTime, 'startFeedTime'),
          ...geneRangeWhere(feedDays, 'feedDays'),
        },
        distinct: true,
      });
      return data;
    } catch (error) {
      ctx.logger.error(error);
    }
  }

  async findPigeon() {
    const ctx = this.ctx;
    const data = await ctx.model.PigeonManage.findOne({
      where: {
        id: ctx.params.id,
      },
      include: [
        {
          model: ctx.model.PigeonCategoryManage,
          as: 'categoryInfo',
          required: true,
        },
        {
          model: ctx.model.PigeonHouseManage,
          as: 'houseInfo',
          required: true,
        },
        {
          model: ctx.model.IllnessManage,
          as: 'illnesses',
          through: {
            attributes: [],
          },
        },
      ],
      attributes: {
        exclude: [ 'category_id', 'house_id' ],
        // include: [
        //   [ ctx.model.col('pigeon_category_manage.category'), 'category' ],
        //   [ ctx.model.col('pigeon_category_manage.year_eggs'), 'yearEggs' ],
        //   [ ctx.model.col('pigeon_category_manage.adult_weight'), 'adultWeight' ],
        //   [
        //     ctx.model.col('pigeon_category_manage.four_age_weight'),
        //     'fourAgeWeight',
        //   ],
        // ],
      },
    });
    return data;
  }
}

module.exports = pigeonManageService;
