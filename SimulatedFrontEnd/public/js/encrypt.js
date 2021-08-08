


function Encrypt() {
    const data = $('#passwordInput').val();
    const key = CryptoJS.enc.Utf8.parse("1234123412ABCDEF");
    const iv = CryptoJS.enc.Utf8.parse("ABCDEF1234123412");
    let srcs = CryptoJS.enc.Utf8.parse(data);
    let encrypted = CryptoJS.AES.encrypt(srcs, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    console.log(encrypted.ciphertext.toString().toUpperCase())
    console.log("updating password encryption")
    $('#passwordEncrypt').val(encrypted.ciphertext.toString().toUpperCase());

    return encrypted.ciphertext.toString().toUpperCase();
}