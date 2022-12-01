const Controller = require('egg').Controller;

const { toInteger } = require('lodash');
const { Op } = require('sequelize');
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
    ctx.body = await ctx.model.User.findAndCountAll(query);
  }

  async show() {
    const ctx = this.ctx;
    ctx.validate({ id: 'int' }, ctx.params);
    const data = await ctx.model.User.findByPk(ctx.params.id);
    ctx.body = data || {};
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
    const data = await ctx.model.User.findByPk(ctx.params.id);
    if (!data) {
      ctx.body = { code: -1, msg: '删除失败' };
      return;
    }
    await data.destroy();
    ctx.status = 200;
    ctx.body = { code: 1, msg: '删除成功' };
  }

  // 支持账号，邮箱，手机号登陆
  async login() {
    const ctx = this.ctx;
    ctx.validate(validRule, ctx.request.body);
    const { account, password } = ctx.request.body;
    const data = await ctx.model.User.findOne({
      where: { [Op.or]: [{ account }, { email: account }, { phone: account }] },
    });
    if (!data) {
      ctx.body = { code: -1, msg: '不存在此账户' };
      return;
    }
    const userInfo = data.dataValues;
    if (password !== decrypto(userInfo.password)) {
      ctx.body = { code: -1, msg: '用户名或密码错误' };
      return;
    }
    ctx.cookies.set('csrfToken', SECRET_KEYS);
    userInfo.csrfToken = SECRET_KEYS;
    userInfo.token = encrypto(`${account}_${password}`);
    ctx.status = 200;
    ctx.body = { code: 1, msg: '登陆成功', userInfo };
  }
}

module.exports = UserController;
