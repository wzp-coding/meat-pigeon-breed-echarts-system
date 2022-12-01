const CryptoJS = require('crypto-js');
const { SECRET_KEYS } = require('../const/index');

const encrypto = str => CryptoJS.AES.encrypt(str, SECRET_KEYS).toString();
const decrypto = str =>
  CryptoJS.AES.decrypt(str, SECRET_KEYS).toString(CryptoJS.enc.Utf8);

module.exports = {
  encrypto,
  decrypto,
};
