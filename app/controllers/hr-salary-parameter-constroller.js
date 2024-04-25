const ObjectId = require('mongodb').ObjectId;
const responseHandlier = require('../libs/response/status');
const commonVariable  = require('../libs/static/common');
const commonFunction = require('../libs/util/commonFunctions');
const salaryparameter = require("../models/hr-salary-parameter-model")
const tracking = require("../models/tracking-model")


/**
 * @POST
 * @param {*} req
 * @param {*} res
 * @returns to add department details in db
 */

module.exports.addHrSalaryParameter= async (req, res) => {
    try {

     // Find the count of existing documents
     const count = await salaryparameter.countDocuments({});
     const seqNo = count + 1;

        let newDepartment = new salaryparameter({
            salaryParameterName: req.body.salaryParameterName,
            shortCode: req.body.shortCode,
            type: req.body.type,
            seqNo: seqNo,
            additionDeduction: req.body.additionDeduction,
            paymentIn: req.body.paymentIn,
            percentageValue: req.body.percentageValue,
            monthYear: req.body.monthYear,
            percentageOf: req.body.percentageOf,
            isDisplay: req.body.isDisplay,
            isDisplayPayRegister: req.body.isDisplayPayRegister,
            isDisplayonAdditionalAllowance: req.body.isDisplayonAdditionalAllowance,
            isDisplayOnPayslip: req.body.isDisplayOnPayslip,
            description: req.body.description,
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
            module : 'salaryparameter',
            mode :'add',
            postData : req.body,
            createdBy:  req.userId,
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

module.exports.getAllHrSalaryParameter= async (req, res) => {
    try {
        const filterObj = commonFunction.filterObject(req);

        const employmentTypeDetails = await salaryparameter.find(filterObj, commonVariable.unSelect.common);

        responseHandlier.successResponse(true, employmentTypeDetails, res);
    } catch (error) {
        responseHandlier.errorResponse(false, error, res);
    }
};


/**
 * @put
 * @param {*} req
 * @param {*} res
 * @returns to put all updateHrDepartmen details in db
 */
module.exports.updateHrSalaryParameter = async function (req, res) {
    try {
        if (!req.body._id) {
            return responseHandlier.errorResponse(false, " _id is required.", res);
        }

        const bankId = {
            _id: req.body._id
        };

        let trackingData = {
            trackingId: bankId,
            module: 'salaryparameter',
            mode: 'update',
            postData: req.body,
            createdBy: req.userId,
            createdOn: new Date(),
        };

        req.body.updatedBy = req.userId;
        req.body.updatedOn = new Date();
        const requestData = req.body;

        const updatedPositionDetails = await salaryparameter.findByIdAndUpdate(
            bankId,
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


/**
 * @delete
 * @param {*} req
 * @param {*} res
 * @returns to ddelete all deleteHrDepartmen details in db
 */

module.exports.deleteHrSalaryParameter = async function (req, res) {
    try {
        if (!req.body._id || !Array.isArray(req.body._id)) {
            return responseHandlier.errorResponse(false, "employmentType _id array is required.", res);
        }

        const employmentTypeIds = req.body._id;

        let trackingData = {
            trackingId: employmentTypeIds,
            module: 'salaryparameter',
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

        const updatedPositionDetails = await salaryparameter.updateMany(
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