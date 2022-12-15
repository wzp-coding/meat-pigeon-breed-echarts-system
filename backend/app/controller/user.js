const Controller = require('egg').Controller;

const { SECRET_KEYS } = require('../const');
const { decrypto, encrypto } = require('../utils');

// 定义创建接口的请求参数规则
const validRule = {
  account: 'string',
  name: 'string?',
  password: 'string',
  avatar: 'string?',
  role: 'int?',
  phone: 'string?',
  email: 'string?',
};
class UserController extends Controller {
  async index() {
    const ctx = this.ctx;
    ctx.validate(
      {
        page: 'int',
        pageSize: 'int',
        keywords: 'string?',
      },
      ctx.request.body
    );
    const data = await ctx.service.user.findAllUser();
    if (!data) {
      ctx.body = { code: -1, msg: '查询失败' };
      return;
    }
    ctx.status = 200;
    ctx.body = { code: 1, msg: '查询成功', data };
  }

  async show() {
    const ctx = this.ctx;
    console.log('ctx.params: ', ctx.params);
    ctx.validate({ id: 'int' }, ctx.params);
    const data = await ctx.model.User.findByPk(ctx.params.id);
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
    const data = await ctx.model.User.create(ctx.request.body);
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
    const data = await ctx.model.User.findByPk(ctx.params.id);
    ctx.validate(
      Object.assign(validRule, { password: 'string?' }),
      ctx.request.body
    );
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
    const data = await ctx.model.User.findByPk(ctx.params.id);
    if (!data) {
      ctx.body = { code: -1, msg: '删除失败' };
      return;
    }
    await data.destroy();
    ctx.status = 200;
    ctx.body = { code: 1, msg: '删除成功' };
  }

  // 校验账号是否重复
  async checkAccount() {
    const ctx = this.ctx;
    console.log('ctx.request.body: ', ctx.request.body);
    ctx.validate({ account: 'string' }, ctx.request.body);
    const { account } = ctx.request.body;
    const data = await ctx.model.User.findOne({
      where: { account },
    });
    if (data) {
      ctx.body = { code: -1, msg: '账号已存在' };
      return;
    }
    ctx.body = { code: 1, msg: '账号合法' };
  }

  // 支持账号，邮箱，手机号登陆
  async login() {
    const ctx = this.ctx;
    ctx.validate(validRule, ctx.request.body);
    const { account, password } = ctx.request.body;
    const data = await ctx.service.user.findAccount();
    if (!data) {
      ctx.body = { code: -1, msg: '不存在此账户' };
      return;
    }
    const userInfo = data.dataValues;
    if (password !== decrypto(userInfo.password)) {
      ctx.body = { code: -1, msg: '用户名或密码错误' };
      return;
    }
    ctx.cookies.set('csrfToken', SECRET_KEYS, {
      httpOnly: true,
      signed: true,
      encrypt: true,
    });
    userInfo.csrfToken = SECRET_KEYS;
    userInfo.token = encrypto(`${account}_${password}`);
    ctx.status = 200;
    ctx.body = { code: 1, msg: '登陆成功', userInfo };
  }
}

module.exports = UserController;
