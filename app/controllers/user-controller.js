const ObjectId = require('mongodb').ObjectId;
const responseHandlier = require('../libs/response/status');
const commonVariable  = require('../libs/static/common');
const commonFunction = require('../libs/util/commonFunctions');
const userModel = require("../models/user-model");
const roleModel = require("../models/role-model");
const tracking = require("../models/tracking-model")

/**
 * @POST
 * @param {*} req
 * @param {*} res
 * @returns to add department details in db
 */


// module.exports.addEmployeeUser = async (req, res) => {
//     try {
//         let query = {
//             _id: req.userId
//         };

//         const user = await userModel.findOne(query).exec();
//         const sessionId = user.sessionToken;

//         // Assuming you have a Role model defined
//         const role = await roleModel.findOne({ _id: req.body.roleId }).exec();
//         const roleName = role ? role.name : null;

//         let newUser = new userModel({
//             employeeId: req.body.employeeId,
//             type: req.body.type,
//             username: req.body.username,
//             roleId: req.body.roleId,
//             roleName: roleName,  
//             companyId: req.body.companyId,
//             branchId: req.body.branchId,
//             age: req.body.age,
//             mobileNumber: req.body.mobileNumber,
//             email: req.body.email,
//             isLogin: req.body.isLogin,
//             password: req.body.password,
//             verified: req.body.verified,
//             sessionToken: sessionId,
//             latitude: req.body.latitude,
//             longtitude: req.body.longtitude,
//             lastLoginDate: req.body.lastLoginDate,
//             loginAttempt: req.body.loginAttempt,
//             updatedBy: req.userId,
//         });

//         await newUser.save();

//         let newEmpUserId = newUser._id;

//         let trackingData = {
//             trackingId: newEmpUserId,
//             module: 'userEmployee',
//             mode: 'add',
//             postData: req.body,
//             createdBy: req.userId,
//             createdOn: new Date(),
//         };
//         trackingData.status = "success";
//         trackingData.message = "insert successfully..";
//         let newtrackingmodel = new tracking(trackingData);
//         newtrackingmodel.save();

//         responseHandlier.successResponse(true, 'Successfully Inserted', res);
//     } catch (error) {
//         console.error("error", error);
//         responseHandlier.errorResponse(false, error, res);
//     }
// };


module.exports.addEmployeeUser = async (req, res) => {
    try {

        const existingUser = await userModel.findOne({ email: req.body.email }).exec();
        if (existingUser) {
            return responseHandlier.errorResponse(false, 'Email address already exists', res);
        }

        let query = {
            _id: req.userId
        };

        const user = await userModel.findOne(query).exec();
        const sessionId = user.sessionToken;

        // Assuming you have a Role model defined
        const role = await roleModel.findOne({ _id: req.body.roleId }).exec();
        const roleName = role ? role.name : null;

        const latestUser = await userModel.findOne({}, {}, { sort: { 'createdAt': -1 } }).exec();
        let nextUserCode = 1;
        if (latestUser && latestUser.userCode) {
            const latestCode = parseInt(latestUser.userCode.slice(4)); 
            nextUserCode = latestCode + 1; 
        }

        const userCode = "user" + ('000' + nextUserCode).slice(-3);

        let newUser = new userModel({
            employeeId: req.body.employeeId,
            type: req.body.type,
            username: req.body.username,
            roleId: req.body.roleId,
            roleName: roleName,
            companyId: req.body.companyId,
            branchId: req.body.branchId,
            age: req.body.age,
            mobileNumber: req.body.mobileNumber,
            email: req.body.email,
            isLogin: req.body.isLogin,
            password: req.body.password,
            verified: req.body.verified,
            sessionToken: sessionId,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            lastLoginDate: req.body.lastLoginDate,
            loginAttempt: req.body.loginAttempt,
            updatedBy: req.userId,
            userCode: userCode 
        });

        await newUser.save();

        let newEmpUserId = newUser._id;

        let trackingData = {
            trackingId: newEmpUserId,
            module: 'userEmployee',
            mode: 'add',
            postData: req.body,
            createdBy: req.userId,
            createdOn: new Date(),
        };
        trackingData.status = "success";
        trackingData.message = "insert successfully..";
        let newtrackingmodel = new tracking(trackingData);
        newtrackingmodel.save();

        responseHandlier.successResponse(true, 'Successfully Inserted', res);
    } catch (error) {
        console.error("error", error);
        responseHandlier.errorResponse(false, error, res);
    }
};



module.exports.updateEmployeeUser = async function (req, res) {
    try {
        if (!req.body._id) {
            return responseHandlier.errorResponse(false, "_id is required.", res);
        }

        const employeeUserId = {
            _id: req.body._id
        };

        let trackingData = {
            trackingId: employeeUserId,
            module: 'userEmployee',
            mode: 'update',
            postData: req.body,
            createdBy: req.userId,
            createdOn: new Date(),
        };

        req.body.updatedBy = req.userId;
        req.body.updatedOn = new Date();
        const requestData = req.body;

        const updatedPositionDetails = await userModel.findByIdAndUpdate(
            employeeUserId,
            requestData,
            { new: true }
        );

        trackingData.status = 'success';
        trackingData.message = " updated successfully..";
        const newTrackingModel = new tracking(trackingData);
        await newTrackingModel.save();

        responseHandlier.successResponse(true, updatedPositionDetails, res);
    } catch (error) {
        console.log(error);
        responseHandlier.errorResponse(false, error, res);
    }
};