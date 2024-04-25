const jwt = require('jsonwebtoken');
const config = require('../../config');
const CryptoJS = require("crypto-js");
const commonVariable = require('../../libs/static/common');
const commonFunction = require('../../libs/util/commonFunctions.js');
const userModel = require('../../models/user-model');
const ipAddressModel = require('../../models/ipaddress-model.js');
const axios = require('axios'); 


// module.exports.checkAuth = async function (req, res, next) {
//     if (!req.cookies.token) {
//         return res.status(403).json({
//             error: 'Protected resource, use Authorization header to get access.'
//         });
//     }

//     const token = req.cookies.token;

//     try {
//         const verifyJwtStatus = jwt.verify(token, config.JWT_SALT); // JWT verify

//         if (!verifyJwtStatus) {
//             return res.status(401).send({
//                 message: 'Protected resource, use Authorization header to get access.',
//             });
//         }
        
//         const sessionId = verifyJwtStatus.sessionId;
//         let userId = CryptoJS.AES.decrypt(verifyJwtStatus.user, config.SECRET_KEY); // Decrypt user ID
//         userId = userId.toString(CryptoJS.enc.Utf8);

//         let query = {
//             _id: new Object(userId),
//             sessionToken: sessionId,
//         };
        
//         let loginUserDetail = await userModel.findOne(query);
//         if(loginUserDetail) {
//             req.userId = new Object(userId);
//             req.sessionId = verifyJwtStatus.sessionId;
//             next();
//         } else {
//             return res.status(401).send({
//                 message: 'Protected resource, use Authorization header to get access.',
//             });
//         }
//     } catch (err) {
//         return res.status(401).send({
//             message: ' Authorization token verification failed!.',
//         });

//     }
// }

// module.exports.checkUnAuth = async function (req, res, next) {
//     try {
//         next();
//     } catch (err) {
//         return res.status(401).send({
//         message: ' Authorization token verification failed!.',
//     });
//     }
// }


//cookies removed

// last one
module.exports.checkAuth = async function (req, res, next) {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
        return res.status(403).json({
            error: 'Protected resource, Authorization header missing or invalid.'
        });
    }

    const token = authorizationHeader.split(' ')[1];

    try {
        const verifyJwtStatus = jwt.verify(token, config.JWT_SALT);

        if (!verifyJwtStatus) {
            return res.status(401).json({
                message: 'Unauthorized. Invalid token.',
            });
        }

        const sessionId = verifyJwtStatus.sessionId;
        let userId = CryptoJS.AES.decrypt(verifyJwtStatus.user, config.SECRET_KEY);
        userId = userId.toString(CryptoJS.enc.Utf8);
        
        const query = {
            _id: userId,
            sessionToken: sessionId,
        };

        const loginUserDetail = await userModel.findOne(query);

        if (loginUserDetail) {
            //req employee Id
            const employeeId = loginUserDetail.employeeId;
            //roleid user
            const roleId = loginUserDetail.roleId;
            const companyId = loginUserDetail.companyId;
            const branchId = loginUserDetail.branchId;
            req.userId = userId;
            req.employeeId  = employeeId; //emp profile _id
            req.roleId  = roleId; //role  _id
            req.companyId  = companyId; //user assined companyId
            req.branchId  = branchId; //user assined branchId
            req.sessionId = sessionId;
            next();
        } else {
            return res.status(401).json({
                message: 'Unauthorized. User not found or invalid session.',
            });
        }
    } catch (err) {
        return res.status(401).json({
            message: 'Unauthorized. Token verification failed.',
        });
    }
}

module.exports.checkIpAddress = async function (req, res, next) {
    try {
        const getServerIp = commonFunction.getIpAddress();

        const validIpAddress = await ipAddressModel.findOne({
            ipAddress: getServerIp
        });

        if(!validIpAddress) {
            // return res.status(401).json({
            //     message: 'Invalid IP address.',
            // });
        }

        next();
    } catch (err) {
        return res.status(401).json({
            message: 'Something went wrong! Please try again later.',
        });
    }
}

module.exports.checkUnAuth = async function (req, res, next) {
    try {
        next();
    } catch (err) {
        return res.status(401).send({
            message: ' Authorization token verification failed!.',
        });
    }
}







// module.exports.checkAuth = async function (req, res, next) {
//     const authorizationHeader = req.headers.authorization;
//      console.log("authorizationHeader",authorizationHeader)

//     if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
//         return res.status(403).json({
//             error: 'Protected resource, Authorization header missing or invalid.'
//         });
//     }

//     const token = authorizationHeader.split(' ')[1];
//      console.log("token",token)
//     try {
//         const verifyJwtStatus = jwt.verify(token, config.JWT_SALT);
//         console.log("verifyJwtStatus",verifyJwtStatus)

//         if (!verifyJwtStatus) {
//             return res.status(401).json({
//                 message: 'Unauthorized. Invalid token.',
//             });
//         }

//         const sessionId = verifyJwtStatus.sessionId;
//         let userId = CryptoJS.AES.decrypt(verifyJwtStatus.user, config.SECRET_KEY);
//         userId = userId.toString(CryptoJS.enc.Utf8);
  
//         console.log("userId",userId)

//         const query = {
//             _id: userId,
//             sessionToken: sessionId,
//         };

//         const loginUserDetail = await userModel.findOne(query);

//         if (loginUserDetail) {
//             req.userId = userId;
//             req.sessionId = sessionId;
//             next();
//         } else {
//             // Attempt token refresh
//             try {
//                 const newToken = await refreshToken(); // Implement refreshToken function to obtain a new token
//                 const decodedNewToken = jwt.verify(newToken, config.JWT_SALT);
//                 const newSessionId = decodedNewToken.sessionId;
//                 let newUserId = CryptoJS.AES.decrypt(decodedNewToken.user, config.SECRET_KEY);
//                 newUserId = newUserId.toString(CryptoJS.enc.Utf8);

//                 const newQuery = {
//                     _id: newUserId,
//                     sessionToken: newSessionId,
//                 };

//                 const newLoginUserDetail = await userModel.findOne(newQuery);

//                 if (newLoginUserDetail) {
//                     req.userId = newUserId;
//                     req.sessionId = newSessionId;
//                     res.setHeader('Authorization', 'Bearer ' + newToken);
//                     next();
//                 } else {
//                     return res.status(401).json({
//                         message: 'Unauthorized. User not found even after token refresh.',
//                     });
//                 }
//             } catch (refreshErr) {
//                 return res.status(401).json({
//                     message: 'Unauthorized. Token verification failed even after refresh.',
//                 });
//             }
//         }
//     } catch (err) {
//         return res.status(401).json({
//             message: 'Unauthorized. Token verification failed.',
//         });
//     }
// }

// module.exports.checkUnAuth = async function (req, res, next) {
//     try {
//         next();
//     } catch (err) {
//         return res.status(401).send({
//             message: ' Authorization token verification failed!.',
//         });
//     }
// }

// async function refreshToken() {
//     try {
//         // Make a request to the token refresh endpoint
//         const response = await axios.post('/refresh-token', { refreshToken: 'currentRefreshToken' }); 

//         // Assuming the response contains the new JWT token
//         const newToken = response.data.token;

//         return newToken;
//     } catch (error) {
//         console.error('Error refreshing token:', error.message);
//         throw error;
//     }
// }
