const { SECRET_KEYS } = require('../const');

module.exports = () => {
  return async function checkLogin(ctx, next) {
    // 获取 用户token
    const userToken = ctx.headers['token'];
    if (!userToken) {
      ctx.body = {
        msg: '用户未登录',
        code: -1,
      };
      return;
    }
    // 验证接口权限
    const cookieToken = ctx.cookies.get('csrfToken', { signed: false });
    const csrfToken = ctx.headers['x-csrf-token'];
    if (
      !cookieToken ||
      cookieToken !== SECRET_KEYS ||
      cookieToken !== csrfToken
    ) {
      ctx.status = 403;
      ctx.body = {
        code: -1,
        msg: '缺少csrfToken或者错误',
      };
      return;
    }
    await next();
  };
};
