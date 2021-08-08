import "./aes"
import "./mode-ecb"
import "./pad-nopadding"


const key = CryptoJS.enc.Utf8.parse("1234123412ABCDEF"); 
const iv = CryptoJS.enc.Utf8.parse("ABCDEF1234123412"); 


module.exports.Decrypt = (data) => {
    console.log("decryptinggg")
    let encryptedHexStr = CryptoJS.enc.Hex.parse(data);
    let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
    let decrypt = CryptoJS.AES.decrypt(srcs, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
    console.log("decryptedddd")
    console.log(decryptedStr.toString())
    return decryptedStr.toString();
}

let test = Encrypt('abc')
console.log(test)
let str = Decrypt(test)
console.log(str)