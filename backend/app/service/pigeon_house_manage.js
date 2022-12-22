const { toInteger } = require('lodash');
const Service = require('egg').Service;
const { Op } = require('sequelize');

class pigeonHouseManageService extends Service {
  async findAllPigeonHouse() {
    const ctx = this.ctx;
    try {
      let { page, pageSize, keywords = '' } = ctx.request.body;
      page = toInteger(page);
      pageSize = toInteger(pageSize);
      const query = {
        limit: pageSize,
        offset: pageSize * (page - 1),
        where: {
          [Op.or]: {
            name: {
              [Op.like]: '%' + keywords + '%',
            },
          },
        },
      };
      const data = await ctx.model.PigeonHouseManage.findAndCountAll(query);
      return data;
    } catch (error) {
      ctx.logger.error(error);
    }
  }
}

module.exports = pigeonHouseManageService;
