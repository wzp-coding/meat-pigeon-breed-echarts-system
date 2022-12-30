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
            '$houseInfo.name$': {
              [Op.like]: '%' + keywords + '%',
            },
            '$categoryInfo.category$': {
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

  /** 创建鸽子 关联 疾病-鸽子表 */
  async createPigeonInfo() {
    const ctx = this.ctx;
    return await ctx.model.transaction(async t => {
      const pigeonData = await ctx.model.PigeonManage.create(
        ctx.request.body,
        {
          transaction: t,
        }
      );
      const { illnessIds } = ctx.request.body;
      const insertDatas = illnessIds.map(illId => ({
        illnessId: parseInt(illId),
        pigeonId: pigeonData.dataValues.id,
      }));
      await ctx.model.IllnessPigeon.bulkCreate(insertDatas, {
        transaction: t,
      });
    });
  }

  async updatePigeonInfo(pigeonData) {
    const ctx = this.ctx;
    return await ctx.model.transaction(async t => {
      // 更新 pigeon_manage 表
      await pigeonData.update(ctx.request.body, { transaction: t });
      // 删除 illness_pigeon 表中 该鸽子 原来的关联关系
      await ctx.model.IllnessPigeon.destroy(
        {
          where: {
            pigeonId: pigeonData.dataValues.id,
          },
        },
        {
          transaction: t,
        }
      );
      // 新增 illness_pigeon 表中 该鸽子 最新的关联关系
      const { illnessIds } = ctx.request.body;
      const insertDatas = illnessIds.map(illId => ({
        illnessId: parseInt(illId),
        pigeonId: pigeonData.dataValues.id,
      }));
      await ctx.model.IllnessPigeon.bulkCreate(insertDatas, {
        transaction: t,
      });
    });
  }

  /** 根据 鸽舍id 查找 鸽子数组 */
  async findPigeonsByHouseId(houseId) {
    const ctx = this.ctx;
    return await ctx.model.PigeonManage.findAll({
      where: {
        houseId,
      },
    });
  }
}

module.exports = pigeonManageService;
