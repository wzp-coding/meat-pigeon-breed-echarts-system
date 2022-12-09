const { toInteger } = require('lodash');
const Service = require('egg').Service;

class pigeonCategoryManageService extends Service {
  async findAllPigeonCategory() {
    const ctx = this.ctx;
    try {
      let { page, pageSize } = ctx.query;
      page = toInteger(page);
      pageSize = toInteger(pageSize);
      const query = {
        limit: pageSize,
        offset: pageSize * (page - 1),
      };
      const data = await ctx.model.PigeonCategoryManage.findAndCountAll(query);
      return data;
    } catch (error) {
      ctx.logger.error(error);
    }
  }
}

module.exports = pigeonCategoryManageService;
