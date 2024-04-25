const responseHandlier = require('../libs/response/status');
const commonVariable = require('../libs/static/common');
const commonFunctions = require('../libs/util/commonFunctions');
const tokenGenerator = require("../libs/util/token-generator");
const userModel = require('../models/user-model');
const sessionModel = require('../models/session-model')
const md5 = require('md5');
 const axios = require('axios');
 const ipMiddleware = require('../ipMiddleware');
const bcrypt = require("bcryptjs");
const randomstring = require("randomstring");
const { v4: uuidv4 } = require("uuid");
const  loginTracking = require("../models/login-tracking-model")
const readXlsxFile = require("read-excel-file/node");
const Address =require("../models/ipaddress-model")
const Role =require("../models/role-model")
const hrmenu =require("../models/menu-model")
const hraccess =require("../models/access-model")
const designation =require("../models/hr-designation-model")


module.exports.register = async (req, res) => {
    try {

        let roleName = await Role.find({_id: req.body.roleId});
        let getRoleName = roleName.length > 0 ? roleName[0].name : '';

        let designationName = await designation.find({_id: req.body.designationId});
        let getdesignationName = designationName.length > 0 ? designationName[0].designationName : '';
        
        const newUser = new userModel({
            username: req.body.username,
            age: req.body.age,
            type: req.body.type,
            isLogin: req.body.isLogin,
            email: req.body.email,
            isLogin: req.body.isLogin,
            mobileNumber: req.body.mobileNumber,
            password: req.body.password,
            employeeId: req.body.employeeId,
            companyId: req.body.companyId,
            branchId: req.body.branchId,
            roleId: req.body.roleId,
            roleName: getRoleName,
            designationId:req.body.designationId,
            designationName: getdesignationName,
        });

        newUser.save()
            .then((newUser) => {
                responseHandlier.successResponse(true, "Register Successfully", res);
            })
            .catch((error) => {
                responseHandlier.errorResponse(false, error, res);
            });

    } catch (error) {
        console.log("nnn",error);
        return responseHandlier.errorResponse(false, error, res);
    }
}


// new login function 
// module.exports.login = async (req, res) => {

//     try {

//         let query = {
//             username: req.body.username,
           

//         };
      
//         userModel.findOne(query)
//             .then(async(userDetail) => {
//                 if(userDetail) {
//                     console.log('userDetail',userDetail);
//                     var validUser = await bcrypt.compare(req.body.password, userDetail.password);
//                     if(validUser) {
//                         const type = req.body.type;
                     
//                         const sessionId = randomstring.generate(20);

//                         const token = await tokenGenerator.generateToken(req, userDetail, sessionId);
                        
                            
//                         let userTokenArr = {
//                             sessionToken: sessionId,
//                             lastLoginDate: new Date(),
                    
//                         }

                        
//                         const updateUserToken  = await userModel.findByIdAndUpdate(userDetail._id, userTokenArr, { multi: true });
//                         const newSession = new sessionModel({
//                              sessionId: sessionId,
//                              userId: userDetail._id,
//                              isLogin: true,
//                              token: token,
//                              status: commonVariable.status.ACTIVE,

//                          });
                            
//                         const savedSession = await newSession.save();
                            
//                         if (savedSession) {
//                                  let responseArr = {
//                                 _id: userDetail._id,
//                                  userName: userDetail.username,
//                                  sessionInfo: token,
//                                  isLogin: true,
//                                  type: type,
//                                 };
                            
//                             // res.cookie('token', token); 
//                             return responseHandlier.successResponse(true, responseArr, res);
//                         } else {
//                             return responseHandlier.errorResponse(false, "Something went wrong, Please try again later", res);
//                         }
//                     } else {
//                         return responseHandlier.errorResponse(false, "Invalid password", res);
//                     }
//                 } else {
//                     return responseHandlier.errorResponse(false, "Invalid username", res);
//                 }
//             })
//             .catch((error) => {
//                 responseHandlier.errorResponse(false, error, res);
//             });
//     } catch (error) {
//         console.log(error);
//         return responseHandlier.errorResponse(false, error, res);
//     }
// }


// module.exports.login = async (req, res) => {
//     try {
//         let query = {
//             username: req.body.username,
//         };

//         userModel.findOne(query)
//             .then(async(userDetail) => {
//                 if(userDetail) {
//                     var validUser = await bcrypt.compare(req.body.password, userDetail.password);
//                     if(validUser) {
//                         const type = req.body.type;
//                         const sessionId = randomstring.generate(20);
//                         const token = await tokenGenerator.generateToken(req, userDetail, sessionId);

//                         let userTokenArr = {
//                             sessionToken: sessionId,
//                             lastLoginDate: new Date(),
//                         }

//                         const updateUserToken = await userModel.findByIdAndUpdate(userDetail._id, userTokenArr, { multi: true });

//                         const newSession = new sessionModel({
//                             sessionId: sessionId,
//                             userId: userDetail._id,
//                             isLogin: true,
//                             token: token,
//                             status: commonVariable.status.ACTIVE,
//                         });

//                         const savedSession = await newSession.save();

//                         const hashedPassword = await bcrypt.hash(req.body.password, 10);  

//                         // Log successful login attempt
//                         const trackingData = {
//                             loginAutomTime: new Date(),
//                             ipAddress: req.body.ipAddress , 
//                             latitude: req.body.latitude,
//                             longitude: req.body.longitude,
//                             trackingId: userDetail._id, 
//                             module: 'User', 
//                             mode: 'login', 
//                             message: 'Login successful',
//                             postData: { username: req.body.username, password: hashedPassword },
                               //createdBy: req.userId,
//                             createdOn: new Date(),
//                             status: 'success' 
//                         };

//                         const newTracking = new loginTracking(trackingData); 
//                         await newTracking.save();

//                         if (savedSession) {
//                             let responseArr = {
//                                 _id: userDetail._id,
//                                 userName: userDetail.username,
//                                 sessionInfo: token,
//                                 isLogin: true,
//                                 type: type,
//                             };

//                             return responseHandlier.successResponse(true, responseArr, res);
//                         } else {
//                             return responseHandlier.errorResponse(false, "Something went wrong, Please try again later", res);
//                         }
//                     } else {

//                         const hashedPassword = await bcrypt.hash(req.body.password, 10);  

//                         // Log failed login attempt due to invalid password
//                         const trackingData = {
//                             loginAutomTime: new Date(),
//                             ipAddress:  req.body.ipAddress, 
//                             latitude:  req.body.latitude,
//                             longitude:  req.body.longitude,
//                             trackingId: userDetail._id, 
//                             module: 'User', 
//                             mode: 'login', 
//                             message: 'Invalid password for username: ' + req.body.username,
//                             postData: { username: req.body.username, password: hashedPassword },                            createdBy: req.userId, 
//                             createdOn: new Date(),
//                             status: 'failure' 
//                         };
//                         const newTracking = new loginTracking(trackingData); 
//                         await newTracking.save();

//                         return responseHandlier.errorResponse(false, "Invalid password", res);
//                     }
//                 } else {

//                     const hashedPassword = await bcrypt.hash(req.body.password, 10);  

//                     // Log failed login attempt due to invalid username
//                     const trackingData = {
//                         loginAutomTime: new Date(),
//                         ipAddress:  req.body.ipAddress, 
//                         latitude: req.body.latitude,
//                         longitude: req.body.longitude ,
//                         trackingId: userDetail._id,
//                         module: 'User',
//                         mode: 'login', 
//                         message: 'Invalid username: ' + req.body.username, 
//                         postData: { username: req.body.username, password: hashedPassword },                        createdBy: req.userId, 
//                         createdOn: new Date(),
//                         status: 'failure' 
//                     };
//                     const newTracking = new loginTracking(trackingData); 
//                     await newTracking.save();

//                     return responseHandlier.errorResponse(false, "Invalid username", res);
//                 }
//             })
//             .catch((error) => {
//                 responseHandlier.errorResponse(false, error, res);
//             });
//     } catch (error) {
//         console.log(error);
//         return responseHandlier.errorResponse(false, error, res);
//     }
// }


// module.exports.login = async (req, res) => {
//     try {
//         let query = {
//             username: req.body.username,
//         };

//         userModel.findOne(query)
//             .then(async(userDetail) => {
//                 if(userDetail) {
//                     var validUser = await bcrypt.compare(req.body.password, userDetail.password);
//                     if(validUser) {
//                         // Reset loginAttempt count since login is successful
//                         await userModel.findByIdAndUpdate(userDetail._id, { loginAttempt: 0 });

//                         const type = req.body.type;
//                         const sessionId = randomstring.generate(20);
//                         const token = await tokenGenerator.generateToken(req, userDetail, sessionId);

//                         let userTokenArr = {
//                             sessionToken: sessionId,
//                             lastLoginDate: new Date(),
//                         }

//                         const updateUserToken = await userModel.findByIdAndUpdate(userDetail._id, userTokenArr, { multi: true });

//                         const newSession = new sessionModel({
//                             sessionId: sessionId,
//                             userId: userDetail._id,
//                             isLogin: true,
//                             token: token,
//                             status: commonVariable.status.ACTIVE,
//                         });

//                         const savedSession = await newSession.save();

//                         const hashedPassword = await bcrypt.hash(req.body.password, 10);  

//                         // Log successful login attempt
//                         const trackingData = {
//                             loginAutomTime: new Date(),
//                             ipAddress: req.body.ipAddress , 
//                             latitude: req.body.latitude,
//                             longitude: req.body.longitude,
//                             trackingId: userDetail._id, 
//                             module: 'User', 
//                             mode: 'login', 
//                             message: 'Login successful',
//                             postData: { username: req.body.username, password: hashedPassword },                            createdBy: req.userId,
//                             createdOn: new Date(),
//                             status: 'success' 
//                         };

//                         const newTracking = new loginTracking(trackingData); 
//                         await newTracking.save();

//                         if (savedSession) {
//                             let responseArr = {
//                                 _id: userDetail._id,
//                                 userName: userDetail.username,
//                                 sessionInfo: token,
//                                 isLogin: true,
//                                 type: type,
//                             };

//                             return responseHandlier.successResponse(true, responseArr, res);
//                         } else {
//                             return responseHandlier.errorResponse(false, "Something went wrong, Please try again later", res);
//                         }
//                     } else {
//                         // Increment loginAttempt count and update the user model
//                         await userModel.findByIdAndUpdate(userDetail._id, { $inc: { loginAttempt: 1 } });

//                         // Log failed login attempt due to invalid password
//                         const trackingData = {
//                             loginAutomTime: new Date(),
//                             ipAddress: req.body.ipAddress, 
//                             latitude: req.body.latitude,
//                             longitude: req.body.longitude,
//                             trackingId: userDetail._id, 
//                             module: 'User', 
//                             mode: 'login', 
//                             message: 'Invalid password for username: ' + req.body.username,
//                             postData: { username: req.body.username, password: req.body.password }, 
//                             createdBy: req.userId, 
//                             createdOn: new Date(),
//                             status: 'failure' 
//                         };

//                         const newTracking = new loginTracking(trackingData); 
//                         await newTracking.save();

//                         return responseHandlier.errorResponse(false, "Invalid password", res);
//                     }
//                 } else {
//                     // No user found with the given username
//                     const trackingData = {
//                         loginAutomTime: new Date(),
//                         ipAddress: req.body.ipAddress, 
//                         latitude: req.body.latitude,
//                         longitude: req.body.longitude,
//                         trackingId: null,
//                         module: 'User', 
//                         mode: 'login', 
//                         message: 'Invalid username: ' + req.body.username, 
//                         postData: { username: req.body.username, password: req.body.password }, 
//                         createdBy: req.userId, 
//                         createdOn: new Date(),
//                         status: 'failure' 
//                     };

//                     const newTracking = new loginTracking(trackingData); 
//                     await newTracking.save();

//                     return responseHandlier.errorResponse(false, "Invalid username", res);
//                 }
//             })
//             .catch((error) => {
//                 responseHandlier.errorResponse(false, error, res);
//             });
//     } catch (error) {
//         console.log(error);
//         return responseHandlier.errorResponse(false, error, res);
//     }
// }

// module.exports.loginOld = async (req, res) => {
//     try {
//         const { ipAddress, latitude, longitude } = await getIpAddressAndLocation(req);

//         const clientIpAddress = req.ip;

//         // const existingAddress = await Address.findOne({ ipAddress: ipAddress });

//         // if (existingAddress) {
//         //     return responseHandlier.errorResponse(false, "IP Address already exists.", res);
//         // } else {
//             const ipAddressData = {
//                 ipAddress: ipAddress,
//                 name: req.body.name,
//                 description: req.body.description,
//                 status: 'success',
//                 createdBy: req.userId,
//                 updatedBy: req.userId,
//                 createdOn: new Date(),
//                 updatedOn: new Date(),
//             };

//             const newpTracking = new Address(ipAddressData);
//             await newpTracking.save();
//         //}

//         let query = {
//             username: req.body.username,
//         };

//         const userDetail = await userModel.findOne(query);

//         if (userDetail) {
//             if (userDetail.loginAttempt >= 5) {
//                 // If login attempts exceed 5, block user
//                 return responseHandlier.errorResponse(false, "You have exceeded the maximum number of login attempts. Please contact the admin.", res);
//             }

//             const validUser = await bcrypt.compare(req.body.password, userDetail.password);
//             if (validUser) {
//                 // Reset loginAttempt count since login is successful
//                 await userModel.findByIdAndUpdate(userDetail._id, { loginAttempt: 0 });

//                 const type = req.body.type;
//                 const sessionId = randomstring.generate(20);
//                 const token = await tokenGenerator.generateToken(req, userDetail, sessionId);

//                 let userTokenArr = {
//                     sessionToken: sessionId,
//                     lastLoginDate: new Date(),
//                 }

//                 await userModel.findByIdAndUpdate(userDetail._id, userTokenArr, { multi: true });

//                 const newSession = new sessionModel({
//                     sessionId: sessionId,
//                     userId: userDetail._id,
//                     isLogin: true,
//                     token: token,
//                     status: commonVariable.status.ACTIVE,
//                 });

//                 await newSession.save();

//                 const hashedPassword = await bcrypt.hash(req.body.password, 10);

//                 // Log successful login attempt
//                 const trackingData = {
//                     loginAutomTime: new Date(),
//                     ipAddress: ipAddress,
//                     latitude: latitude,
//                     longitude: longitude,
//                     trackingId: userDetail._id,
//                     module: 'User',
//                     mode: 'login',
//                     message: 'Login successful',
//                     postData: { username: req.body.username, password: hashedPassword },
//                     createdBy: req.userId,
//                     createdOn: new Date(),
//                     status: 'success'
//                 };

//                 const newTracking = new loginTracking(trackingData);
//                 await newTracking.save();

//                 let responseArr = {
//                     _id: userDetail._id,
//                     userName: userDetail.username,
//                     sessionInfo: token,
//                     isLogin: true,
//                     type: type,
//                     ipAddress: ipAddress,
//                     latitude: latitude,
//                     longitude: longitude,
//                 };

//                 return responseHandlier.successResponse(true, responseArr, res);
//             } else {
//                 const updatedUser = await userModel.findByIdAndUpdate(userDetail._id, { $inc: { loginAttempt: 1 } }, { new: true });

//                 const trackingData = {
//                     loginAutomTime: new Date(),
//                     ipAddress: ipAddress,
//                     latitude: latitude,
//                     longitude: longitude,
//                     trackingId: userDetail._id,
//                     module: 'User',
//                     mode: 'login',
//                     message: 'Invalid password for username: ' + req.body.username,
//                     postData: { username: req.body.username, password: req.body.password },
//                     createdBy: req.userId,
//                     createdOn: new Date(),
//                     status: 'failure'
//                 };

//                 const newTracking = new loginTracking(trackingData);
//                 await newTracking.save();

//                 if (updatedUser.loginAttempt >= 5) {
//                     return responseHandlier.errorResponse(false, "You have exceeded the maximum number of login attempts. Please contact the admin.", res);
//                 } else {
//                     return responseHandlier.errorResponse(false, "Invalid password", res);
//                 }
//             }
//         } else {

//             const trackingData = {
//                 loginAutomTime: new Date(),
//                 ipAddress: ipAddress,
//                 latitude: latitude,
//                 longitude: longitude,
//                 trackingId: null,
//                 module: 'User',
//                 mode: 'login',
//                 message: 'Invalid username: ' + req.body.username,
//                 postData: { username: req.body.username, password: req.body.password },
//                 createdBy: req.userId,
//                 createdOn: new Date(),
//                 status: 'failure'
//             };

//             const newTracking = new loginTracking(trackingData);
//             await newTracking.save();

//             return responseHandlier.errorResponse(false, "Invalid username", res);
//         }
//     } catch (error) {
//         console.log(error);
//         return responseHandlier.errorResponse(false, error, res);
//     }
// }



module.exports.login = async (req, res) => {
    try {
        const { ipAddress, latitude, longitude } = await getIpAddressAndLocation(req);

        let trackingData = {
            loginAutomTime: new Date(),
            ipAddress: ipAddress,
            latitude: latitude,
            longitude: longitude,
            module: 'User',
            mode: 'login',
            postData: { username: req.body.username, password: req.body.password },
            createdOn: new Date()
        };

        let query = {
            username: req.body.username,
        };

        const userDetail = await userModel.findOne(query);
        // let bodyRoleId = userDetail.roleId
        // console.log("bodyRoleId",bodyRoleId)

        if (userDetail) {
            if (userDetail.loginAttempt >= commonVariable.constants.loginAttempt) {
                // If login attempts exceed, block user
                return responseHandlier.errorResponse(false, "You have exceeded the maximum number of login attempts. Please contact the admin.", res);
            }

            const validUser = await bcrypt.compare(req.body.password, userDetail.password);
            if (validUser) {
                const type = req.body.type;
                const sessionId = randomstring.generate(20);
                const token = await tokenGenerator.generateToken(req, userDetail, sessionId);

                let userTokenArr = {
                    sessionToken: sessionId,
                    loginAttempt: 0,
                    lastLoginDate: new Date(),
                }

                await userModel.findByIdAndUpdate(userDetail._id, userTokenArr, { multi: true });

                const newSession = new sessionModel({
                    sessionId: sessionId,
                    userId: userDetail._id,
                    isLogin: true,
                    token: token,
                    status: commonVariable.status.ACTIVE,
                });

                await newSession.save();

                const hashedPassword = await bcrypt.hash(req.body.password, 10);

                // Log successful login attempt
                trackingData.trackingId = userDetail._id;
                trackingData.message = 'Login successful';
                trackingData.postData = { username: req.body.username, password: hashedPassword },
                trackingData.createdBy = userDetail._id;
                trackingData.createdOn = new Date();
                trackingData.status = 'success';

                const newTracking = new loginTracking(trackingData);
                await newTracking.save();
                
                let responseArr = {
                    _id: userDetail._id,
                    userName: userDetail.username,
                    employeeId: userDetail.employeeId,
                    roleId: userDetail.roleId,
                    roleName: userDetail.roleName,
                    designationId: userDetail.designationId,
                    designationName: userDetail.designationName,
                    companyId: userDetail.companyId,
                    branchId: userDetail.branchId,
                    sessionInfo: token,
                    isLogin: true,
                    type: type,
                    ipAddress: ipAddress,
                    latitude: latitude,
                    longitude: longitude
                };

                return responseHandlier.successResponse(true, responseArr, res);
            } else {
                const updatedUser = await userModel.findByIdAndUpdate(userDetail._id, { $inc: { loginAttempt: 1 } }, { new: true });

                trackingData.trackingId = userDetail._id;
                trackingData.message = 'Invalid password';
                trackingData.createdBy = userDetail._id;
                trackingData.status = 'failure';

                const newTracking = new loginTracking(trackingData);
                await newTracking.save();

                if (updatedUser.loginAttempt >= 5) {
                    return responseHandlier.errorResponse(false, "You have exceeded the maximum number of login attempts. Please contact the admin.", res);
                } else {
                    return responseHandlier.errorResponse(false, "Invalid password", res);
                }
            }
        } else {
            trackingData.message = 'Invalid username';
            trackingData.status = 'failure';

            const newTracking = new loginTracking(trackingData);
            await newTracking.save();

            return responseHandlier.errorResponse(false, "Invalid username", res);
        }
    } catch (error) {
        console.log("error",error)
        return responseHandlier.errorResponse(false, error, res);
    }
}


async function getIpAddressAndLocation(req) {
    try {
        const publicIpAddress = await getPublicIpAddress();
        const locationInfo = await getLocationInfo(publicIpAddress);

        return {
            ipAddress: publicIpAddress || req.clientIp,
            latitude: locationInfo ? locationInfo.loc.split(',')[0] : null,
            longitude: locationInfo ? locationInfo.loc.split(',')[1] : null,
        };
    } catch (error) {
        console.error('Error fetching IP address and location information:', error.message);
        return {};
    }
}

async function getPublicIpAddress() {
    try {
        const response = await axios.get('https://api64.ipify.org?format=json');
        return response.data.ip;
    } catch (error) {
        console.error('Error fetching public IP address:', error.message);
        return null;
    }
}

async function getLocationInfo(ipAddress) {
    try {
        const response = await axios.get(`http://ipinfo.io/${ipAddress}/json`);
        return response.data;
    } catch (error) {
        console.error('Error fetching location information:', error.message);
        return null;
    }
}


// module.exports.login = async (req, res) => {
//     try {

//         const clientIpAddress = req.ip;

//         const existingAddress = await Address.findOne({ ipAddress: req.body.ipAddress });

//         if (existingAddress) {
//             return responseHandlier.errorResponse(false, "IP Address already exists.", res);
//         } else {

//             const ipAddressData = {
//                 ipAddress: req.body.ipAddress,
//                 name: req.body.name,
//                 description: req.body.description,
//                 status: 'success',
//                 createdBy: req.userId,
//                 updatedBy: req.userId,
//                 createdOn: new Date(),
//                 updatedOn: new Date(),
//             };

//             const newpTracking = new Address(ipAddressData);
//             await newpTracking.save();
//         }


//         let query = {
//             username: req.body.username,
//         };

//         const userDetail = await userModel.findOne(query);

//         if (userDetail) {
//             if (userDetail.loginAttempt >= 5) {
//                 // If login attempts exceed 5, block user
//                 return responseHandlier.errorResponse(false, "You have exceeded the maximum number of login attempts. Please contact the admin.", res);
//             }

//             const validUser = await bcrypt.compare(req.body.password, userDetail.password);
//             if (validUser) {
//                 // Reset loginAttempt count since login is successful
//                 await userModel.findByIdAndUpdate(userDetail._id, { loginAttempt: 0 });

//                 const type = req.body.type;
//                 const sessionId = randomstring.generate(20);
//                 const token = await tokenGenerator.generateToken(req, userDetail, sessionId);

//                 let userTokenArr = {
//                     sessionToken: sessionId,
//                     lastLoginDate: new Date(),
//                 }

//                 await userModel.findByIdAndUpdate(userDetail._id, userTokenArr, { multi: true });

//                 const newSession = new sessionModel({
//                     sessionId: sessionId,
//                     userId: userDetail._id,
//                     isLogin: true,
//                     token: token,
//                     status: commonVariable.status.ACTIVE,
//                 });

//                 await newSession.save();

//                 const hashedPassword = await bcrypt.hash(req.body.password, 10);

//                 // Log successful login attempt
//                 const trackingData = {
//                     loginAutomTime: new Date(),
//                     ipAddress: req.body.ipAddress,
//                     latitude: req.body.latitude,
//                     longitude: req.body.longitude,
//                     trackingId: userDetail._id,
//                     module: 'User',
//                     mode: 'login',
//                     message: 'Login successful',
//                     postData: { username: req.body.username, password: hashedPassword },
//                     createdBy: req.userId,
//                     createdOn: new Date(),
//                     status: 'success'
//                 };

//                 const newTracking = new loginTracking(trackingData);
//                 await newTracking.save();

//                 let responseArr = {
//                     _id: userDetail._id,
//                     userName: userDetail.username,
//                     sessionInfo: token,
//                     isLogin: true,
//                     type: type,
//                 };

//                 return responseHandlier.successResponse(true, responseArr, res);
//             } else {
//                 const updatedUser = await userModel.findByIdAndUpdate(userDetail._id, { $inc: { loginAttempt: 1 } }, { new: true });

//                 const trackingData = {
//                     loginAutomTime: new Date(),
//                     ipAddress: req.body.ipAddress,
//                     latitude: req.body.latitude,
//                     longitude: req.body.longitude,
//                     trackingId: userDetail._id,
//                     module: 'User',
//                     mode: 'login',
//                     message: 'Invalid password for username: ' + req.body.username,
//                     postData: { username: req.body.username, password: req.body.password },
//                     createdBy: req.userId,
//                     createdOn: new Date(),
//                     status: 'failure'
//                 };

//                 const newTracking = new loginTracking(trackingData);
//                 await newTracking.save();

//                 if (updatedUser.loginAttempt >= 5) {
//                     return responseHandlier.errorResponse(false, "You have exceeded the maximum number of login attempts. Please contact the admin.", res);
//                 } else {
//                     return responseHandlier.errorResponse(false, "Invalid password", res);
//                 }
//             }
//         } else {

//             const trackingData = {
//                 loginAutomTime: new Date(),
//                 ipAddress: req.body.ipAddress,
//                 latitude: req.body.latitude,
//                 longitude: req.body.longitude,
//                 trackingId: null,
//                 module: 'User',
//                 mode: 'login',
//                 message: 'Invalid username: ' + req.body.username,
//                 postData: { username: req.body.username, password: req.body.password },
//                 createdBy: req.userId,
//                 createdOn: new Date(),
//                 status: 'failure'
//             };

//             const newTracking = new loginTracking(trackingData);
//             await newTracking.save();

//             return responseHandlier.errorResponse(false, "Invalid username", res);
//         }
//     } catch (error) {
//         console.log(error);
//         return responseHandlier.errorResponse(false, error, res);
//     }
// }

module.exports.changePassword = async (req, res) => {
    try {
        userModel.findById(req.userId)
            .then(async(userDetail) => {
                var validUser = await bcrypt.compare(req.body.currentPassword, userDetail.password);
                console.log(validUser);
                if(validUser) {
                    const salt = await bcrypt.genSalt(10);
                    const passwordHash = await bcrypt.hash(req.body.newPassword, salt);

                    let userArr = {
                        password: passwordHash,
                        updatedDate: new Date(),
                    }
                    
                    const updateUserToken  = await userModel.findByIdAndUpdate(userDetail._id, userArr, { multi: true });
                    if(updateUserToken) { 
                        return responseHandlier.successResponse(true, "Password changed successfully", res);
                    } else {
                        return responseHandlier.errorResponse(false, "Password changed failed", res);
                    }
                } else {
                    return responseHandlier.errorResponse(false, "Invalid old password", res);
                }
            })
            .catch((error) => {
                responseHandlier.errorResponse(false, error, res);
            });
    } catch (error) {
        console.log(error);
        return responseHandlier.errorResponse(false, error, res);
    }
}


// module.exports.getSessionUserInfo = async (req, res) => {
//     try {

//        if (!req.userId) {
//             return responseHandlier.errorResponse(false, 'Bad request - Invalid token', res);
//         }

//         let query = {
//             _id: req.userId
//         };

//         const user = await userModel.findOne(query).exec();


//         if (!user) {
//             return responseHandlier.errorResponse(false, "Details not recognised, please try again.", res);
       
//         } else {
          
//             const sessionId = user.sessionToken;

//             const type = req.body.type;

//             const publicIpAddress = await getPublicIpAddress();

//             const deviceIdentifier = md5(req.headers['user-agent']);

//             const locationInfo = await getLocationInfo(publicIpAddress);

//             const latitude = locationInfo ? locationInfo.loc.split(',')[0] : null;

//             const longitude = locationInfo ? locationInfo.loc.split(',')[1] : null;

//             const browserInfo = req.useragent || {};

//             const currentDate = new Date();
//             const formattedDate = currentDate.toString();
          
//             const token = await tokenGenerator.generateToken(req, user, sessionId);
                
//             const userId = {
//                 _id: user._id
//             };

//             const sessionInfo = {
//                 type : type,
//                 sessionId: sessionId,
//                 isLogin: true,
//                 token: token,
//                 status: commonVariable.status.ACTIVE,
//                 ipAddress: publicIpAddress || req.clientIp,
//                 deviceId: deviceIdentifier,
//                 deviceName: req.headers['user-agent'] || null,
//                 location: {
//                     latitude: latitude,
//                     longitude: longitude,
//                 },
//                 browserInfo : {
//                     name : browserInfo.browser || null,
//                     version : browserInfo.version || null,
//                     os : browserInfo.os || null
//                 },
//                 DateTime : formattedDate
               
                   
//             };

//             const requestData = {
//                 $push: {
//                     sessionInfo
//                 }
//             };

//             const responseObject = {
//                 id: user._id,
//                 name: user.name,
//                 email: user.email,
//                 sessionInfo: sessionInfo
//             };

//             await userModel.updateOne(userId, requestData);

          


//             responseHandlier.successResponse(true, responseObject, res);
//         }
//     } catch (error) {
//         console.log("error", error);
//         return responseHandlier.errorResponse(false, error, res);
//     }
// };


module.exports.getSessionUserInfo = async (req, res) => {
    try {
        if (!req.userId) {
            return responseHandlier.errorResponse(false, 'Bad request - Invalid token', res);
        }

        let query = {
            _id: req.userId
        };

        const user = await userModel.findOne(query).exec();

        if (!user) {
            return responseHandlier.errorResponse(false, "Details not recognised, please try again.", res);
        } else {
            const sessionId = user.sessionToken;
            const type = req.body.type;

            const publicIpAddress = await getPublicIpAddress();
            const deviceIdentifier = md5(req.headers['user-agent']);
            const locationInfo = await getLocationInfo(publicIpAddress);
            const latitude = locationInfo ? locationInfo.loc.split(',')[0] : null;
            const longitude = locationInfo ? locationInfo.loc.split(',')[1] : null;
            const browserInfo = req.useragent || {};
            const currentDate = new Date();
            const formattedDate = currentDate.toString();

            const token = await tokenGenerator.generateToken(req, user);

            // Generate tokens with different expiration times
            const userId = { _id: user._id };

            const sessionInfo = {
                type: type,
                sessionId: sessionId,
                isLogin: true,
                tokens: token,
                status: commonVariable.status.ACTIVE,
                ipAddress: publicIpAddress || req.clientIp,
                deviceId: deviceIdentifier,
                deviceName: req.headers['user-agent'] || null,
                location: {
                    latitude: latitude,
                    longitude: longitude,
                },
                browserInfo: {
                    name: browserInfo.browser || null,
                    version: browserInfo.version || null,
                    os: browserInfo.os || null
                },
                DateTime: formattedDate
            };

            const requestData = {
                $push: {
                    sessionInfo
                }
            };

            const responseObject = {
                id: user._id,
                name: user.username,
                email: user.email,
                sessionInfo: sessionInfo

            };

            await userModel.updateOne(userId, requestData);

            responseHandlier.successResponse(true, responseObject, res);
        }
    } catch (error) {
        console.log("error", error);
        return responseHandlier.errorResponse(false, error, res);
    }
};

async function getPublicIpAddress() {
    try {
        const response = await axios.get('https://api64.ipify.org?format=json');
        return response.data.ip;
    } catch (error) {
        console.error('Error fetching public IP address:', error.message);
        return null;
    }
}

async function getLocationInfo(ipAddress) {
    try {
        const response = await axios.get(`http://ipinfo.io/${ipAddress}/json`);
        return response.data;
    } catch (error) {
        console.error('Error fetching location information:', error.message);
        return null;
    }
}


module.exports.imageUpload = async (req, res) => {
    try {
        var filename = req.file.filename;  
      var attachmentFileExtenstion = filename.split(".");

      var attachmentFileExtenstionType =
        attachmentFileExtenstion[attachmentFileExtenstion.length - 1];
        
      var attachmentType = "file";
  
      if (attachmentFileExtenstionType) {
        if (
          attachmentFileExtenstionType == "jpg" ||
          attachmentFileExtenstionType == "png" ||
          attachmentFileExtenstionType == "jpeg" ||
          attachmentFileExtenstionType == "JPEG" ||
          attachmentFileExtenstionType == "Jpeg"
        ) {
          attachmentType = "image";
        } else if (
          attachmentFileExtenstionType == "mp3" ||
          attachmentFileExtenstionType == "wav" ||
          attachmentFileExtenstionType == "mp4" ||
          attachmentFileExtenstionType == "m4a" ||
          attachmentFileExtenstionType == "m4b" ||
          attachmentFileExtenstionType == "msv" ||
          attachmentFileExtenstionType == "mmf" ||
          attachmentFileExtenstionType == "m4p" ||
          attachmentFileExtenstionType == "wma" ||
          attachmentFileExtenstionType == "aac" ||
          attachmentFileExtenstionType == "ac3" ||
          attachmentFileExtenstionType == "aiff" ||
          attachmentFileExtenstionType == "flac" ||
          attachmentFileExtenstionType == "ogg" ||
          attachmentFileExtenstionType == "opus" ||
          attachmentFileExtenstionType == "ts" ||
          attachmentFileExtenstionType == "wav" ||
          attachmentFileExtenstionType == "amr"
        ) {
          attachmentType = "audio";
        } else if (attachmentFileExtenstionType == "pdf") {
          attachmentType = "pdf";
        }
      }
  
      if (
        attachmentType == "image" ||
        attachmentType == "audio" ||
        attachmentType == "pdf"
      ) {
        const baseurl = commonFunctions.getPort(req);
        var filepath = baseurl + "/uploads/" + filename;
        responseHandlier.successResponse(true, filepath, res);
      } else {
        responseHandlier.errorResponse(false, "Invalid file type", res);
      }
    } catch (error) {
        console.error(error); 
      return responseHandlier.errorResponse(false, error, res);
    }
  };




// old login function 

// module.exports.login = async (req, res) => {
//     try {
//         let query = {
//             username: req.body.username,
//         };

//         userModel.findOne(query)
//             .then(async (userDetail) => {
//                 if (userDetail) {
//                     var validUser = await bcrypt.compare(req.body.password, userDetail.password);
//                     if (validUser) {
//                         const type = req.body.type;
//                         const sessionId = randomstring.generate(20);

//                         const token = await tokenGenerator.generateToken(req, userDetail, sessionId);

//                         console.log("token",token);

//                         const userTokenArr = {
//                             sessionToken: sessionId,
//                             lastLoginDate: new Date(),
//                         };

//                         const updateUserToken = await userModel.findByIdAndUpdate(userDetail._id, userTokenArr, { multi: true });

//                         if (updateUserToken) {                          
//                             let responseArr = {
//                                     _id: userDetail._id,
//                                     userName: userDetail.username,
//                                     sessionInfo: token,
//                                     isLogin: true,
//                                     type: type,
//                                 };

//                                 return responseHandlier.successResponse(true, responseArr, res);
//                             } else {
//                                 return responseHandlier.errorResponse(false, "Something went wrong, Please try again later", res);
//                             }
//                         } else {
//                             return responseHandlier.errorResponse(false, "Something went wrong, Please try again later", res);
//                         }
//                     } else {
//                         return responseHandlier.errorResponse(false, "Invalid password", res);
//                     }
//                 } else {
//                     return responseHandlier.errorResponse(false, "Invalid username", res);
//                 }
//             })
//             .catch((error) => {
//                 responseHandlier.errorResponse(false, error, res);
//             });
//     } catch (error) {
//         console.log(error);
//         return responseHandlier.errorResponse(false, error, res);
//     }
// };


// module.exports.imageUpload = async (req, res) => {
//     try {
//       var filename = req.file.filename;

      
  
//       var attachmentFileExtenstion = filename.split(".");
//       var attachmentFileExtenstionType =
//         attachmentFileExtenstion[attachmentFileExtenstion.length - 1];
  
//       var attachmentType = "file";
  
//       if (attachmentFileExtenstionType) {
//         if (
//           attachmentFileExtenstionType == "jpg" ||
//           attachmentFileExtenstionType == "png" ||
//           attachmentFileExtenstionType == "jpeg" ||
//           attachmentFileExtenstionType == "JPEG" ||
//           attachmentFileExtenstionType == "Jpeg"
//         ) {
//           attachmentType = "image";
//         } else if (
//           attachmentFileExtenstionType == "mp3" ||
//           attachmentFileExtenstionType == "wav" ||
//           attachmentFileExtenstionType == "mp4" ||
//           attachmentFileExtenstionType == "m4a" ||
//           attachmentFileExtenstionType == "m4b" ||
//           attachmentFileExtenstionType == "msv" ||
//           attachmentFileExtenstionType == "mmf" ||
//           attachmentFileExtenstionType == "m4p" ||
//           attachmentFileExtenstionType == "wma" ||
//           attachmentFileExtenstionType == "aac" ||
//           attachmentFileExtenstionType == "ac3" ||
//           attachmentFileExtenstionType == "aiff" ||
//           attachmentFileExtenstionType == "flac" ||
//           attachmentFileExtenstionType == "ogg" ||
//           attachmentFileExtenstionType == "opus" ||
//           attachmentFileExtenstionType == "ts" ||
//           attachmentFileExtenstionType == "wav" ||
//           attachmentFileExtenstionType == "amr"
//         ) {
//           attachmentType = "audio";
//         } else if (attachmentFileExtenstionType == "pdf") {
//           attachmentType = "pdf";
//         }
//       }
  
//       if (
//         attachmentType == "image" ||
//         attachmentType == "audio" ||
//         attachmentType == "pdf"
//       ) {
//         const baseurl = commonFunction.getPort(req);
//         var filepath = baseurl + "/uploads/" + filename;
//         responseHandlier.successResponse(true, filepath, res);
//       } else {
//         responseHandlier.errorResponse(false, "Invalid file type", res);
//       }
//     } catch (error) {
//         console.error(error); 
//       return responseHandlier.errorResponse(false, error, res);
//     }
//   };

