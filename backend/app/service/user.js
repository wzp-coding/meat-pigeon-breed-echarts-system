const { toInteger } = require('lodash');
const Service = require('egg').Service;
const { Op } = require('sequelize');

class UserService extends Service {
  async findAllUser() {
    const ctx = this.ctx;
    try {
      let { page, pageSize } = ctx.query;
      page = toInteger(page);
      pageSize = toInteger(pageSize);
      const query = {
        limit: pageSize,
        offset: pageSize * (page - 1),
      };
      const data = await ctx.model.User.findAndCountAll({
        ...query,
        where: {
          role: 1,
        },
      });
      return data;
    } catch (error) {
      ctx.logger.error(error);
    }
  }

  async findAccount() {
    const ctx = this.ctx;
    try {
      const { account } = ctx.request.body;
      const data = await ctx.model.User.findOne({
        where: {
          [Op.or]: [{ account }, { email: account }, { phone: account }],
        },
      });
      return data;
    } catch (error) {
      ctx.logger.error(error);
    }
  }
}

module.exports = UserService;
