const Controller = require('egg').Controller;

// 定义创建接口的请求参数规则
const validRule = {
  pigeonId: 'string',
  houseId: 'string',
  categoryId: 'int',
  startFeedTime: 'date',
  feedCount: 'int',
  weight: 'int',
  eggs: 'int',
  health: 'string',
  illnessIds: 'array?',
};

class PigeonManageController extends Controller {
  async index() {
    const ctx = this.ctx;
    ctx.validate(
      {
        page: 'int',
        pageSize: 'int',
        keywords: 'string?',
        startFeedTime: 'array?',
        feedDays: 'array?',
      },
      ctx.request.body
    );
    const data = await ctx.service.pigeonManage.findAllPigeons();
    if (!data) {
      ctx.body = { code: -1, msg: '查询失败' };
      return;
    }
    ctx.status = 200;
    ctx.body = { code: 1, msg: '查询成功', data };
  }

  async show() {
    const ctx = this.ctx;
    ctx.validate({ id: 'int' }, ctx.params);
    const data = await ctx.service.pigeonManage.findPigeon();
    if (!data) {
      ctx.body = { code: -1, msg: '查询失败' };
      return;
    }
    ctx.status = 200;
    ctx.body = { code: 1, msg: '查询成功', data };
  }

  async create() {
    const ctx = this.ctx;
    ctx.validate(validRule, ctx.request.body);
    try {
      const result = await ctx.model.transaction(async t => {
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
      console.log('result: ', result);
      ctx.status = 200;
      ctx.body = { code: 1, msg: '创建成功' };
    } catch (error) {
      console.log('error: ', error);
      ctx.body = { code: -1, msg: '创建失败' };
      return;
    }
  }

  async update() {
    const ctx = this.ctx;
    ctx.validate({ id: 'int' }, ctx.params);
    const pigeonData = await ctx.model.PigeonManage.findByPk(ctx.params.id);
    ctx.validate(validRule, ctx.request.body);
    if (!pigeonData) {
      ctx.body = { code: -1, msg: '查询不到该id信息' };
      return;
    }
    try {
      const result = await ctx.model.transaction(async t => {
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
      console.log('result: ', result);
      ctx.status = 200;
      ctx.body = { code: 1, msg: '更新成功' };
    } catch (error) {
      console.log('error: ', error);
      ctx.body = { code: -1, msg: '更新失败' };
      return;
    }
  }

  async destroy() {
    const ctx = this.ctx;
    ctx.validate({ id: 'int' }, ctx.params);
    const pigeonData = await ctx.model.PigeonManage.findByPk(ctx.params.id);
    if (!pigeonData) {
      ctx.body = { code: -1, msg: '删除失败' };
      return;
    }
    try {
      const result = await ctx.model.transaction(async t => {
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
        // 删除 pigeon_manage 表
        await pigeonData.destroy({
          transaction: t,
        });
      });
      console.log('result: ', result);
      ctx.status = 200;
      ctx.body = { code: 1, msg: '删除成功' };
    } catch (error) {
      console.log('error: ', error);
      ctx.body = { code: -1, msg: '删除失败' };
      return;
    }
  }
}

module.exports = PigeonManageController;
