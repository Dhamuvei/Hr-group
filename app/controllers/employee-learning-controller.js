const ObjectId = require('mongodb').ObjectId;
const responseHandlier = require('../libs/response/status');
const commonVariable  = require('../libs/static/common');
const commonFunction = require('../libs/util/commonFunctions');
const emplloyeelearning = require("../models/employee-learning-model")
const tracking = require("../models/tracking-model")


/**
 * @POST
 * @param {*} req
 * @param {*} res
 * @returns to add addHrEmployeLearning details in db
 */

module.exports.addHrEmployeLearning= async (req, res) => {
    try {
        let newDepartment = new emplloyeelearning({
            empId: req.body.empId,
            learningCategory: req.body.learningCategory,
            remarks: req.body.remarks,
            duration: req.body.duration,
            consideredStatus: req.body.consideredStatus,
            comments: req.body.comments,
            remarks: req.body.remarks,
            isVerified: req.body.isVerified,
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
            module : 'employelearning',
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
 * @returns to get all getAllHrEmployeLearning details in db
 */

module.exports.getAllHrEmployeLearning = async (req, res) => {
    try {
        const filterObj = commonFunction.filterObject(req);

        const employmentTypeDetails = await emplloyeelearning.find(filterObj, commonVariable.unSelect.common);

        responseHandlier.successResponse(true, employmentTypeDetails, res);
    } catch (error) {
        responseHandlier.errorResponse(false, error, res);
    }
};


/**
 * @put
 * @param {*} req
 * @param {*} res
 * @returns to put all updateHrEmployeLearning details in db
 */
module.exports.updateHrEmployeLearning = async function (req, res) {
    try {
        if (!req.body._id) {
            return responseHandlier.errorResponse(false, "employmentType _id is required.", res);
        }

        const Id = {
            _id: req.body._id
        };

        let trackingData = {
            trackingId: Id,
            module: 'employeelearning',
            mode: 'update',
            postData: req.body,
            createdBy: req.userId,
            createdOn: new Date(),
        };

        req.body.updatedBy = req.userId;
        req.body.updatedOn = new Date();
        const requestData = req.body;

        const updatedPositionDetails = await emplloyeelearning.findByIdAndUpdate(
            Id,
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
 * @returns to ddelete all deleteHrEmployeLearning details in db
 */

module.exports.deleteHrEmployeLearning = async function (req, res) {
    try {
        if (!req.body._id || !Array.isArray(req.body._id)) {
            return responseHandlier.errorResponse(false, "employmentType _id array is required.", res);
        }

        const Ids = req.body._id;

        let trackingData = {
            trackingId: Ids,
            module: 'employeelearning',
            mode: 'delete',
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

        const updatedPositionDetails = await emplloyeelearning.updateMany(
            { _id: { $in: Ids } },
            requestData,
            { new: true }
        );

        trackingData.status = 'success';
        trackingData.message = "employment types updated successfully..";
        const newTrackingModel = new tracking(trackingData);
        await newTrackingModel.save();

        responseHandlier.successResponse(true, updatedPositionDetails, res);
    } catch (error) {
        console.log(error);
        responseHandlier.errorResponse(false, error, res);
    }
};