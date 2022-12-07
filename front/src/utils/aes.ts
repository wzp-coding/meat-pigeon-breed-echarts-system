import { LOCAL_STORAGE } from '@/constants';
import CryptoJS from 'crypto-js';

export const encrypto = (str: string) => CryptoJS.AES.encrypt(str, JSON.parse(localStorage.getItem(LOCAL_STORAGE.USER)!)?.csrfToken).toString();
export const decrypto = (str: string) =>
    CryptoJS.AES.decrypt(str, JSON.parse(localStorage.getItem(LOCAL_STORAGE.USER)!)?.csrfToken).toString(CryptoJS.enc.Utf8);

    
