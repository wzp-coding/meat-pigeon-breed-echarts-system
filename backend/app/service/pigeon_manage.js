const { toInteger } = require('lodash');
const Service = require('egg').Service;
const { Op } = require('sequelize');

class pigeonManageService extends Service {
  async findAllPigeons() {
    const ctx = this.ctx;
    try {
      let { page, pageSize, keywords } = ctx.query;
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
            model: ctx.model.IllnessManage,
            as: 'illnesses',
            through: {
              attributes: [],
            },
          },
        ],
        attributes: {
          exclude: [ 'category_id' ],
          include: [
            [
              ctx.model.fn(
                'DATEDIFF',
                ctx.model.fn('CURRENT_DATE'),
                ctx.model.col('start_feed_time')
              ),
              'feedDays',
            ],
          ],
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
          attributes: [],
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
        include: [
          [
            ctx.model.fn(
              'DATEDIFF',
              ctx.model.fn('CURRENT_DATE'),
              ctx.model.col('start_feed_time')
            ),
            'feedDays',
          ],
          [ ctx.model.col('pigeon_category_manage.category'), 'category' ],
          [ ctx.model.col('pigeon_category_manage.year_eggs'), 'yearEggs' ],
          [ ctx.model.col('pigeon_category_manage.adult_weight'), 'adultWeight' ],
          [
            ctx.model.col('pigeon_category_manage.four_age_weight'),
            'fourAgeWeight',
          ],
        ],
      },
    });
    return data;
  }
}

module.exports = pigeonManageService;
