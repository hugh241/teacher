const CryptoJS = require('crypto-js');  //引用AES源码js

    const key = CryptoJS.enc.Utf8.parse("1234123412ABCDEF");  //十六位十六进制数作为密钥
    const iv = CryptoJS.enc.Utf8.parse('ABCDEF1234123412');   //十六位十六进制数作为密钥偏移量

    export default {
        EncryptSha(msg) {
              var encrypted =CryptoJS.AES.encrypt(msg,  key, {
                iv: iv,
                padding: CryptoJS.pad.Pkcs7,
                mode: CryptoJS.mode.CTR
            });
            const base64Cipher = encrypted.ciphertext.toString(CryptoJS.enc.Base64);
            // 处理 Android 某些低版的BUG
            const resultCipher = base64Cipher.replace(/\+/g,'-').replace(/\//g,'_');
            // 返回加密后的经过处理的 Base64
            return resultCipher;
        },
        DecryptSha(msg) {
             // 先将 Base64 还原一下, 因为加密的时候做了一些字符的替换
            const restoreBase64 = msg.replace(/\-/g,'+').replace(/_/g,'/');
            // 这里 mode, padding, iv 一定要跟加密的时候完全一样
            var decrypted = CryptoJS.AES.decrypt(restoreBase64, key, {
                iv: iv,
                padding: CryptoJS.pad.Pkcs7,
                mode: CryptoJS.mode.CTR
            });
            return decrypted.toString(CryptoJS.enc.Utf8);
        }
    }
