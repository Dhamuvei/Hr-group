
const jwt = require('jsonwebtoken');
const config = require('../../config');
const CryptoJS = require("crypto-js");
let useragent = require('express-useragent');

/**
 * @param {*} req 
 * @param {*} userData 
 * @returns 
 * @desc : generate token function - create access token for user - Using jsonwebtoken
 */
//first
// const generateToken = async function (req, userData, newSessionId) {
//     let userAgent = useragent.parse(req.headers['user-agent']);
//     try {
//         let cipher = CryptoJS.AES.encrypt('' + userData._id, config.SECRET_KEY);
//         cipher = cipher.toString();

//         const token = jwt.sign({
//             user: cipher,
//             sessionId: newSessionId,
//             browser: userAgent.browser,
//             os: userAgent.os,
//             platform: userAgent.platform,
//         }, config.JWT_SALT, { expiresIn: '15d' });


//         return token;
//     } catch (err) {
//         console.log("\n\n\n\n\n\n err", err)
//     }
// }

//secound
// const generateToken = async function (req, userData, newSessionId) {
//     const userAgent = useragent.parse(req.headers['user-agent']);
//     try {
//         // Encrypt user ID using AES encryption
//         const cipher = CryptoJS.AES.encrypt(userData._id.toString(), config.SECRET_KEY).toString();

//         // Calculate token expiration time based on UTC
//         const expirationTimeUTC = Math.floor(Date.now() / 1000) + (2 * 24 * 60 * 60); // 2 days in seconds

//         // Create JWT token with encrypted user ID, session ID, and other data
//         const token = jwt.sign({
//             user: cipher,
//             sessionId: newSessionId,
//             browser: userAgent.browser,
//             os: userAgent.os,
//             platform: userAgent.platform,
//             exp: expirationTimeUTC // Set token expiration time in seconds
//         }, config.JWT_SALT);

//         return token;
//     } catch (err) {
//         console.error('Error generating token:', err);
//         throw err;
//     }
// }

//third
const generateToken = async function (req, userData, newSessionId) {
    let userAgent = useragent.parse(req.headers['user-agent']);
    try {
        let cipher = CryptoJS.AES.encrypt('' + userData._id, config.SECRET_KEY);
        cipher = cipher.toString();

        const token = jwt.sign({
            user: cipher,
            sessionId: newSessionId,
            browser: userAgent.browser,
            os: userAgent.os,
            platform: userAgent.platform,
        }, config.JWT_SALT, { expiresIn: '15d' });


        return token;
    } catch (err) {
        console.error("Error generating token:", err);
        throw err; // Propagate the error for proper error handling
    }
}

/**
 * @param {*} plainText 
 * @returns Encrypt plain text 
 */
const encryptCipher = async function (plainText) {
    const encryptedCipherValue = CryptoJS.AES.encrypt(plainText, config.cryptoKey);
    
    return encryptedCipherValue.toString();
}

/**
 * @param {*} encryptedText 
 * @returns Decrypt encrypted value
 */
const decryptCipher = async function (encryptedText) {
    const decryptCiphervalue = CryptoJS.AES.decrypt(encryptedText, config.cryptoKey);
    
    return decryptCiphervalue.toString(CryptoJS.enc.Utf8);
}

module.exports = { generateToken, encryptCipher, decryptCipher }