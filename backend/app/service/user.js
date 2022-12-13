const { toInteger } = require('lodash');
const Service = require('egg').Service;
const { Op } = require('sequelize');

class UserService extends Service {
  async findAllUser() {
    const ctx = this.ctx;
    try {
      let { page, pageSize, keywords } = ctx.query;
      page = toInteger(page);
      pageSize = toInteger(pageSize);
      const query = {
        limit: pageSize,
        offset: pageSize * (page - 1),
        where: {
          role: 1,
          [Op.or]: {
            account: {
              [Op.like]: '%' + keywords + '%',
            },
            name: {
              [Op.like]: '%' + keywords + '%',
            },
            phone: {
              [Op.like]: '%' + keywords + '%',
            },
            email: {
              [Op.like]: '%' + keywords + '%',
            },
          },
        },
      };
      const data = await ctx.model.User.findAndCountAll(query);
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
