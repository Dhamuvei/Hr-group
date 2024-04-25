const ObjectId = require('mongodb').ObjectId;
const responseHandlier = require('../libs/response/status');
const commonVariable  = require('../libs/static/common');
const commonFunction = require('../libs/util/commonFunctions');
const nonWorking = require("../models/hr-non-working-model")
const tracking = require("../models/tracking-model")



/**
 * @POST
 * @param {*} req
 * @param {*} res
 * @returns to add addHrNonWorking details in db
 */

module.exports.addHrNonWorking = async (req, res) => {
    try {
        let newNonWorking = new nonWorking({
            nonWorking: req.body.nonWorking,
            shortCode: req.body.shortCode,
            description: req.body.description,
            status: commonVariable.status.ACTIVE,
            createdBy:   req.userId,
            createdOn: new Date(),
            updatedBy:   req.userId,
            updatedOn: new Date(),
        });

        await newNonWorking.save();

        let getDesignationId = newNonWorking._id

        let trackingData ={
            trackingId : getDesignationId,
            module : 'nonWorking',
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
module.exports.getAllHrNonWorking = async (req, res) => {
    try {
        const filterObj = commonFunction.filterObject(req);

        const employmentTypeDetails = await nonWorking.find(filterObj, commonVariable.unSelect.common);

        responseHandlier.successResponse(true, employmentTypeDetails, res);
    } catch (error) {
        responseHandlier.errorResponse(false, error, res);
    }
};



/**
 * @put
 * @param {*} req
 * @param {*} res
 * @returns to put all updateHrNonWorking details in db
 */

module.exports.updateHrNonWorking = async function (req, res) {
    try {
        if (!req.body._id) {
            return responseHandlier.errorResponse(false, " _id is required.", res);
        }

        const nonWorkingId = {
            _id: req.body._id
        };

        let trackingData = {
            trackingId: nonWorkingId,
            module: 'nonWorking',
            mode: 'update',
            postData: req.body,
            createdBy: req.userId,
            createdOn: new Date(),
        };

        req.body.updatedBy = req.userId;
        req.body.updatedOn = new Date();
        const requestData = req.body;

        const updatedPositionDetails = await nonWorking.findByIdAndUpdate(
            nonWorkingId,
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
 * @returns to ddelete all deleteHrNonWorking details in db
 */

module.exports.deleteHrNonWorking = async function (req, res) {
    try {
        if (!req.body._id || !Array.isArray(req.body._id)) {
            return responseHandlier.errorResponse(false, " _id array is required.", res);
        }

        const nonWorkingIds = req.body._id;

        let trackingData = {
            trackingId: nonWorkingIds,
            module: 'nonworking',
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

        const updatedPositionDetails = await nonWorking.updateMany(
            { _id: { $in: nonWorkingIds } },
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