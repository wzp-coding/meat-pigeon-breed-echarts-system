const Controller = require('egg').Controller;


// 定义创建接口的请求参数规则
const validRule = {
  name: 'string',
  category: 'string',
  purchaseTime: 'date',
  purchaseAmount: 'int',
  currentAmount: 'int',
  produceTime: 'date',
  shelfLife: 'int',
};

class FeedManageController extends Controller {
  async index() {
    const ctx = this.ctx;
    ctx.validate(
      {
        page: 'int',
        pageSize: 'int',
        keywords: 'string?',
        category: 'string?',
        purchaseTime: 'array?',
        purchaseAmount: 'array?',
        currentAmount: 'array?',
        produceTime: 'array?',
        shelfLife: 'array?',
      },
      ctx.request.body
    );
    const data = await ctx.service.feedManage.findAllFeeds();
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
    const data = await ctx.model.FeedManage.findByPk(ctx.params.id);
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
    const data = await ctx.model.FeedManage.create(ctx.request.body);
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
    const data = await ctx.model.FeedManage.findByPk(ctx.params.id);
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
    const data = await ctx.model.FeedManage.findByPk(ctx.params.id);
    if (!data) {
      ctx.body = { code: -1, msg: '删除失败' };
      return;
    }
    await data.destroy();
    ctx.status = 200;
    ctx.body = { code: 1, msg: '删除成功' };
  }

  async findFeedsByGroup() {
    const ctx = this.ctx;
    const data = await ctx.service.feedManage.findFeedsByGroup();
    if (!data) {
      ctx.body = { code: -1, msg: '查询失败' };
      return;
    }
    ctx.status = 200;
    ctx.body = { code: 1, msg: '查询成功', data };
  }

  async amountGroupByCategory() {
    const ctx = this.ctx;
    const data = await ctx.service.feedManage.amountGroupByCategory();
    if (!data) {
      ctx.body = { code: -1, msg: '查询失败' };
      return;
    }
    ctx.status = 200;
    ctx.body = { code: 1, msg: '查询成功', data };
  }
}

module.exports = FeedManageController;
