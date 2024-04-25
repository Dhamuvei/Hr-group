const ObjectId = require('mongodb').ObjectId;
const responseHandlier = require('../libs/response/status');
const commonVariable  = require('../libs/static/common');
const commonFunction = require('../libs/util/commonFunctions');
const leaveType = require("../models/hr-leave-type-model")
const tracking = require("../models/tracking-model")


/**
 * @POST
 * @param {*} req
 * @param {*} res
 * @returns to add addHrNonWorking details in db
 */

module.exports.addHrLeaveType = async (req, res) => {
    try {
        let newLeaveType = new leaveType({
            leaveType: req.body.leaveType,
            shortCode: req.body.shortCode,
            description: req.body.description,
            isEligibleEncashment : req.body.isEligibleEncashment,
            minimumHoldingDays : req.body.minimumHoldingDays,
            status: commonVariable.status.ACTIVE,
            createdBy:   req.userId,
            createdOn: new Date(),
            updatedBy:   req.userId,
            updatedOn: new Date(),
        });

        await newLeaveType.save();

        let getDesignationId = newLeaveType._id

        let trackingData ={
            trackingId : getDesignationId,
            module : 'leaveType',
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
 * @returns to get all getAllHrNonWorking details in db
 */
module.exports.getAllHrLeaveType = async (req, res) => {
    try {
        const filterObj = commonFunction.filterObject(req);

        const employmentTypeDetails = await leaveType.find(filterObj, commonVariable.unSelect.common);

        responseHandlier.successResponse(true, employmentTypeDetails, res);
    } catch (error) {
        responseHandlier.errorResponse(false, error, res);
    }
};



/**
 * @put
 * @param {*} req
 * @param {*} res
 * @returns to put all updateHrLeaveType details in db
 */

module.exports.updateHrLeaveType = async function (req, res) {
    try {
        if (!req.body._id) {
            return responseHandlier.errorResponse(false, " _id is required.", res);
        }

        const leaveTypeId = {
            _id: req.body._id
        };

        let trackingData = {
            trackingId: leaveTypeId,
            module: 'nonWorking',
            mode: 'update',
            postData: req.body,
            createdBy: req.userId,
            createdOn: new Date(),
        };

        req.body.updatedBy = req.userId;
        req.body.updatedOn = new Date();
        const requestData = req.body;

        const updatedPositionDetails = await leaveType.findByIdAndUpdate(
            leaveTypeId,
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
 * @returns to ddelete all deleteHrLeaveType details in db
 */

module.exports.deleteHrLeaveType = async function (req, res) {
    try {
        if (!req.body._id || !Array.isArray(req.body._id)) {
            return responseHandlier.errorResponse(false, " _id array is required.", res);
        }

        const leaveTypeIds = req.body._id;

        let trackingData = {
            trackingId: leaveTypeIds,
            module: 'leavetype',
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

        const updatedPositionDetails = await leaveType.updateMany(
            { _id: { $in: leaveTypeIds } },
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