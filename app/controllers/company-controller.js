const ObjectId = require('mongodb').ObjectId;
const responseHandlier = require('../libs/response/status');
const commonVariable  = require('../libs/static/common');
const commonFunction = require('../libs/util/commonFunctions');
const company = require("../models/company-model")
const tracking = require("../models/tracking-model")
const configurationTracking = require("../models/configurationTracking-model")
/**
 * @POST
 * @param {*} req
 * @param {*} res
 * @returns to add department details in db
 */

module.exports.addHrCompany = async (req, res) => {
    try {
        let newDepartment = new company({
            companyName: req.body.companyName,
            shortCode: req.body.shortCode,
            address1: req.body.address1,
            address2: req.body.address2,
            cityId: req.body.cityId,
            stateId: req.body.stateId,
            countryId: req.body.countryId,
            zipcode: req.body.zipcode,
            panNo: req.body.panNo,
            gstNo: req.body.gstNo,
            gstType: req.body.gstType,
            cstNo: req.body.cstNo,
            serviceTaxNo: req.body.serviceTaxNo,
            tanNo: req.body.tanNo,
            vatNo: req.body.vatNo,
            logo: req.body.logo,
            mobileNo: req.body.mobileNo,
            emailId: req.body.emailId,
            phoneNo: req.body.phoneNo,
            documents: req.body.documents,
            webLink: req.body.webLink,
            status: commonVariable.status.ACTIVE,
            createdBy: req.userId,
            createdOn: new Date(),
            updatedBy: req.userId,
            updatedOn: new Date(),
        });

        await newDepartment.save();

        let getDesignationId = newDepartment._id

        let trackingData ={
            trackingId : getDesignationId,
            module : 'company',
            mode :'add',
            postData : req.body,
            createdBy: req.userId,
            createdOn: new Date(),
        }
        trackingData.status = "success"
        trackingData.message ="insert successfully..";
        let newtrackingmodel = new tracking(trackingData)
        newtrackingmodel.save()

        responseHandlier.successResponse(true, 'Successfully Inserted', res);
    } catch (error) {
        console.error("error", error);
        responseHandlier.errorResponse(false, error, res);
    }
};




/**
 * @GET
 * @param {*} req
 * @param {*} res
 * @returns to get all getAllHrCompany details in db
*/

module.exports.getAllHrCompany = async (req, res) => {
    try {
        const filterObj = commonFunction.filterObject(req);

        const employmentTypeDetails = await company.find(filterObj)
            .populate({
                path: 'cityId',
                select: 'cityName'
            })
            .populate({
                path: 'stateId',
                select: 'stateName'
            })
            .populate({
                path: 'countryId',
                select: 'countryName'
            })
            .select(commonVariable.unSelect.common)
            .exec();

        responseHandlier.successResponse(true, employmentTypeDetails, res);
    } catch (error) {
        responseHandlier.errorResponse(false, error, res);
    }
};




/**
 * @put
 * @param {*} req
 * @param {*} res
 * @returns to put all updateHrCompany details in db
 */
module.exports.updateHrCompany = async function (req, res) {
    try {
        if (!req.body._id) {
            return responseHandlier.errorResponse(false, "company _id is required.", res);
        }

        const companyId = {
            _id: req.body._id
        };

        let trackingData = {
            trackingId: companyId,
            module: 'employmentType',
            mode: 'update',
            postData: req.body,
            createdBy: req.userId,
            createdOn: new Date(),
        };

        req.body.updatedBy = req.userId;
        req.body.updatedOn = new Date();
        const requestData = req.body;

        const updatedPositionDetails = await company.findByIdAndUpdate(
            companyId,
            requestData,
            { new: true }
        );

        trackingData.status = 'success';
        trackingData.message = "  updated successfully..";
        const newTrackingModel = new tracking(trackingData);
        await newTrackingModel.save();

        responseHandlier.successResponse(true, updatedPositionDetails, res);
    } catch (error) {
        console.log(error);
        responseHandlier.errorResponse(false, error, res);
    }
};


/**
 * @delete
 * @param {*} req
 * @param {*} res
 * @returns to ddelete all deleteHrCompany details in db
 */
module.exports.deleteHrCompany = async function (req, res) {
    try {
        if (!req.body._id || !Array.isArray(req.body._id)) {
            return responseHandlier.errorResponse(false, " _id array is required.", res);
        }

        const companyIds = req.body._id;

        let trackingData = {
            trackingId: companyIds,
            module: 'employmentType',
            mode: 'update',
            postData: req.body,
            createdBy: req.userId,
            createdOn: new Date(),
        };

        const requestData = {
            $set: {
                status: req.body.status,
                updatedBy: req.userId,
                updatedOn: new Date(),
            },
        };

        const updatedPositionDetails = await company.updateMany(
            { _id: { $in: companyIds } },
            requestData,
            { new: true }
        );

        trackingData.status = 'success';
        trackingData.message = " deleted successfully..";
        const newTrackingModel = new tracking(trackingData);
        await newTrackingModel.save();

        responseHandlier.successResponse(true, updatedPositionDetails, res);
    } catch (error) {
        console.log(error);
        responseHandlier.errorResponse(false, error, res);
    }
};



// module.exports.getAllHrConfiguration = async (req, res) => {
//     try {
        // const { companyId } = req.body;

        // const filterObj = companyId ? { _id: companyId } : commonFunction.filterObject(req);

        // const configurationDetails = await company.find(filterObj, commonVariable.unSelect.common);

//         let configurationResult = configurationDetails.map(configuration => {
//             const result = {
//                 _id: configuration._id,
//                 sendPaySlipEmail: configuration.sendPaySlipEmail,
//                 sendBankAdviceEmail: configuration.sendBankAdviceEmail,
//                 leaveYear: configuration.leaveYear,
//                 leaveEncashment: configuration.leaveEncashment,
//                 leaveRoundOff: configuration.leaveRoundOff,
//                 displayYTDinPaySlip: configuration.displayYTDinPaySlip,
//                 halfDayLeaveHours: configuration.halfDayLeaveHours,
//                 fullDayLeaveHours: configuration.fullDayLeaveHours,
//             };

          
//             if (configuration.sendBankAdviceEmail) {
//                 result.bankEmailId = configuration.bankEmailId;
//             }

//             // Iterate over the keys and set to null if the value is undefined or null
//             Object.keys(result).forEach(key => {
//                 if (result[key] === undefined || result[key] === null) {
//                     result[key] = null;
//                 }
//             });

//             return result;
//         });

//         responseHandlier.successResponse(true, configurationResult, res);
//     } catch (error) {
//         responseHandlier.errorResponse(false, error, res);
//     }
// };

module.exports.getAllHrConfiguration = async (req, res) => {
    try {
        const { companyId } = req.body;

        const filterObj = companyId ? { _id: companyId } : commonFunction.filterObject(req);

        const configurationDetails = await company.find(filterObj, commonVariable.unSelect.common);

        let employeFinalRes = configurationDetails.map(configuration => ({
                _id: configuration._id,
                sendPaySlipEmail: configuration.sendPaySlipEmail,
                sendBankAdviceEmail: configuration.sendBankAdviceEmail,
                leaveYear: configuration.leaveYear,
                leaveEncashment: configuration.leaveEncashment,
                leaveRoundOff: configuration.leaveRoundOff,
                displayYTDinPaySlip: configuration.displayYTDinPaySlip,
                halfDayLeaveHours: configuration.halfDayLeaveHours,
                fullDayLeaveHours: configuration.fullDayLeaveHours,
        }));

        responseHandlier.successResponse(true, employeFinalRes, res);
    } catch (error) {
        responseHandlier.errorResponse(false, error, res);
    }
};


/**
 * @update
 * @param {*} req
 * @param {*} res
 * @returns to add all updateHrEmployeeBank details in db
 */

// module.exports.updateConfiguration = async function (req, res) {
//     try {
//         if (!req.body._id) {
//             return responseHandlier.errorResponse(false, "_id is required.", res);
//         }

//         const companyId = {
//             _id: req.body._id
//         };

        // let trackingData = {
        //     trackingId: companyId,
        //     module: 'configuration',
        //     mode: 'update',
        //     postData: req.body,
        //     createdBy: req.userId,
        //     createdOn: new Date(),
        // };

//         req.body.updatedBy = req.userId;
//         req.body.updatedOn = new Date();
//         const requestData = req.body;

//         const updatedPositionDetails = await company.findByIdAndUpdate(
//             companyId,
//             requestData,
//             { new: true }
//         );

        // trackingData.status = 'success';
        // trackingData.message = " updated successfully..";
//         const newTrackingModel = new configurationTracking(trackingData);
//         await newTrackingModel.save();

//         responseHandlier.successResponse(true, updatedPositionDetails, res);
//     } catch (error) {
//         console.log(error);
//         responseHandlier.errorResponse(false, error, res);
//     }
// };



module.exports.updateConfiguration = async (req, res) => {
    try {
        const {
            _id,
            sendPaySlipEmail,
            sendBankAdviceEmail,
            bankEmailId,
            leaveRoundOff,
            displayYTDinPaySlip,
            leaveYear,
            leaveEncashment,
            leaveEncashmentDays,
            halfDayLeaveHours,
            fullDayLeaveHours
        } = req.body;

        const updatedEmployee = await company.findOneAndUpdate(
            { "_id": _id },
            {
                "$set": {
                    sendPaySlipEmail,
                    sendBankAdviceEmail,
                    bankEmailId,
                    leaveRoundOff,
                    displayYTDinPaySlip,
                    leaveYear,
                    leaveEncashment,
                    leaveEncashmentDays,
                    halfDayLeaveHours,
                    fullDayLeaveHours
                }
            },
            { new: true }
        );

        if (!updatedEmployee) {
            return responseHandlier.errorResponse(false, "Employee not found", res);
        }
        let getCompanyId = updatedEmployee._id

        // Tracking
        let trackingData = {
            trackingId: getCompanyId,
            module: 'configuration',
            mode: 'update',
            postData: req.body,
            createdBy: req.userId,
            createdOn: new Date(),
        };
        
        trackingData.status = 'success';
        trackingData.message = " updated successfully..";
        const newTrackingModel = new configurationTracking(trackingData);
        await newTrackingModel.save();

        responseHandlier.successResponse(true, updatedEmployee, res);
    } catch (error) {
        console.error("Error:", error);
        responseHandlier.errorResponse(false, error.message || error, res);
    }
};