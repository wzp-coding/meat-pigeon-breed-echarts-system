const { encrypto } = require('../utils/index');
const { mock, Random } = require('mockjs');
Random.extend({
  phone() {
    const phonePrefixs = ['132', '135', '189'];
    return this.pick(phonePrefixs) + mock(/\d{8}/);
  },
});

module.exports = new Array(10)
  .fill(0)
  .map((_, i) => {
    const account = 'user' + Number(i + 1);
    return {
      account,
      name: Random.cname(),
      password: encrypto(account),
      avatar: Random.image('200x100', '#ffcc33', '#FFF', 'png', account),
      phone: Random.phone(),
      email: Random.email('qq.com'),
    };
  })
  .concat({
    account: 'admin',
    name: '超级管理员',
    password: encrypto('admin'),
    avatar: Random.image('200x100', '#ffcc33', '#FFF', 'png', 'admin'),
    role: 0,
    phone: '13143758550',
    email: '2236277721@qq.com',
  });
