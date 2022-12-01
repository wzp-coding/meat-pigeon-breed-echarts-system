const Controller = require('egg').Controller;

const { toInteger } = require('lodash');

// 定义创建接口的请求参数规则
const validRule = {
  category: 'string',
  yearEggs: 'string',
  adultWeight: 'string',
  fourAgeWeight: 'string',
  feature: 'string?',
};

class PigeonCategoryManageController extends Controller {
  async index() {
    const ctx = this.ctx;
    let { page, pageSize } = ctx.query;
    ctx.validate(
      {
        page: 'int',
        pageSize: 'int',
      },
      ctx.query
    );
    page = toInteger(page);
    pageSize = toInteger(pageSize);
    const query = {
      limit: pageSize,
      offset: pageSize * (page - 1),
    };
    ctx.body = await ctx.model.PigeonCategoryManage.findAndCountAll(query);
  }

  async show() {
    const ctx = this.ctx;
    ctx.validate({ id: 'int' }, ctx.params);
    const data = await ctx.model.PigeonCategoryManage.findByPk(ctx.params.id);
    ctx.body = data || {};
  }

  async create() {
    const ctx = this.ctx;
    ctx.validate(validRule, ctx.request.body);
    const data = await ctx.model.PigeonCategoryManage.create(ctx.request.body);
    if (!data) {
      ctx.body = { code: -1, msg: '创建失败' };
      return;
    }
    ctx.status = 200;
    ctx.body = { code: 1, msg: '创建成功' };
  }

  async update() {
    const ctx = this.ctx;
    ctx.validate({ id: 'int' }, ctx.params);
    const data = await ctx.model.PigeonCategoryManage.findByPk(ctx.params.id);
    ctx.validate(validRule, ctx.request.body);
    if (!data) {
      ctx.body = { code: -1, msg: '更新失败' };
      return;
    }
    await data.update(ctx.request.body);
    ctx.body = { code: 1, msg: '更新成功' };
  }

  async destroy() {
    const ctx = this.ctx;
    ctx.validate({ id: 'int' }, ctx.params);
    const data = await ctx.model.PigeonCategoryManage.findByPk(ctx.params.id);
    if (!data) {
      ctx.body = { code: -1, msg: '删除失败' };
      return;
    }
    await data.destroy();
    ctx.status = 200;
    ctx.body = { code: 1, msg: '删除成功' };
  }
}

module.exports = PigeonCategoryManageController;
