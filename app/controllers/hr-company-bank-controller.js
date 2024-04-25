const ObjectId = require('mongodb').ObjectId;
const responseHandlier = require('../libs/response/status');
const commonVariable  = require('../libs/static/common');
const commonFunction = require('../libs/util/commonFunctions');
const companyBank = require("../models/hr-cmopany-bank-model")
const tracking = require("../models/tracking-model")
/**
 * @POST
 * @param {*} req
 * @param {*} res
 * @returns to add department details in db
 */

module.exports.addHrCompanyBank= async (req, res) => {
    try {
        let newDepartment = new companyBank({
            bankId: req.body.bankId,
            accountHolderName: req.body.accountHolderName,
            accountNo: req.body.accountNo,
            branchName: req.body.branchName,
            accountType: req.body.accountType,
            address1: req.body.address1,
            address2: req.body.address2,
            cityId: req.body.cityId,
            stateId: req.body.stateId,
            countryId: req.body.countryId,
            zipcode: req.body.zipcode,
            mobileNo: req.body.mobileNo,
            otherMobileNo: req.body.otherMobileNo,
            emailId: req.body.emailId,
            otherEmailId: req.body.otherEmailId,
            companyId: req.body.companyId,
            status: commonVariable.status.ACTIVE,
            createdBy:  req.userId,
            createdOn: new Date(),
            updatedBy: req.userId,
            updatedOn: new Date(),
        });

        await newDepartment.save();

        let getDesignationId = newDepartment._id

        let trackingData ={
            trackingId : getDesignationId,
            module : 'companyBank',
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
 * @returns to get all getAllHrDepartmen details in db
 */

// module.exports.getAllHrCompanyBank = async (req, res) => {
//     try {
//         const filterObj = commonFunction.filterObject(req);

//         const employmentTypeDetails = await companyBank.find(filterObj, commonVariable.unSelect.common);

//         responseHandlier.successResponse(true, employmentTypeDetails, res);
//     } catch (error) {
//         responseHandlier.errorResponse(false, error, res);
//     }
// };

module.exports.getAllHrCompanyBank = async (req, res) => {
    try {
        const filterObj = commonFunction.filterObject(req);

        const employmentTypeDetails = await companyBank.find(filterObj)
            .populate({
                path: 'bankId',
                select: 'bankName'
            })
            .populate({
                path: 'companyId',
                select: 'companyName'
            })
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
 * @returns to put all updateHrCompanyBank details in db
 */

module.exports.updateHrCompanyBank = async function (req, res) {
    try {
        if (!req.body._id) {
            return responseHandlier.errorResponse(false, "employmentType _id is required.", res);
        }

        const employmentTypeId = {
            _id: req.body._id
        };

        let trackingData = {
            trackingId: employmentTypeId,
            module: 'companyBank',
            mode: 'update',
            postData: req.body,
            createdBy: req.userId,
            createdOn: new Date(),
        };

        req.body.updatedBy = req.userId;
        req.body.updatedOn = new Date();
        const requestData = req.body;

        const updatedPositionDetails = await companyBank.findByIdAndUpdate(
            employmentTypeId,
            requestData,
            { new: true }
        );

        trackingData.status = 'success';
        trackingData.message = "employment type updated successfully..";
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
 * @returns to ddelete all deleteHrCompanyBank details in db
 */

module.exports.deleteHrCompanyBank = async function (req, res) {
    try {
        if (!req.body._id || !Array.isArray(req.body._id)) {
            return responseHandlier.errorResponse(false, "employmentType _id array is required.", res);
        }

        const employmentTypeIds = req.body._id;

        let trackingData = {
            trackingId: employmentTypeIds,
            module: 'companyBank',
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

        const updatedPositionDetails = await companyBank.updateMany(
            { _id: { $in: employmentTypeIds } },
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