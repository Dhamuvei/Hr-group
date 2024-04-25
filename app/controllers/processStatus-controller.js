const ObjectId = require('mongodb').ObjectId;
const responseHandlier = require('../libs/response/status');
const commonVariable  = require('../libs/static/common.js');
const commonFunction = require('../libs/util/commonFunctions.js');
const processStatusModel = require("../models/processStatus-model.js")
const trackingModel = require('../models/tracking-model.js');



/**
 * @post
 * @param {*} req
 * @param {*} res
 * @returns to insert processStatus details in db
 */


module.exports.addHrProcessStatus = async(req, res) => {
    try {

        const newProcessStatus = new processStatusModel({
            processStatus: req.body.processStatus,
            description: req.body.description,
            shortCode:req.body.shortCode,
            colorCode:req.body.colorCode,
            mode:req.body.mode,
            status: commonVariable.status.ACTIVE,
            createdBy: req.userId,
            createdOn: new Date(),
        });
        
        await newProcessStatus.save();
        let trackingId = newProcessStatus._id
            
        
        let trackingData ={
            trackingId : trackingId,
            module : 'Process Status',
            mode :'add',
            postData : req.body,
            createdBy: req.userId,
            createdOn: new Date(),
        }
        trackingData.status = 'success',
        trackingData.message ="new processStatus added  successfully..";
        const newTrackingModel = new trackingModel(trackingData)
        newTrackingModel.save();
        responseHandlier,responseHandlier.successResponse(true,"processStatus inserted successfully",res)
    } catch (error) {
        console.error("error", error);
        responseHandlier.errorResponse(false, error, res);   
    }
}





/**
 * @GET
 * @param {*} req
 * @param {*} res
 * @returns to get all processStatus details in db
 */

module.exports.getHrProcessStatus = async (req, res) => {
    try {
        const filterObj = commonFunction.filterObject(req);

        const processStatusDetails = await processStatusModel.find(filterObj, commonVariable.unSelect.common);

        responseHandlier.successResponse(true, processStatusDetails, res);
    } catch (error) {
        responseHandlier.errorResponse(false, error, res);
    }
};

module.exports.updateHrProcessStatus = async function (req, res) {
    try {
        if (!req.body._id) {
            return responseHandlier.errorResponse(false, "processStatus _id is required.", res);
        }

        const processStatusId = {
            _id: req.body._id
        };

        let trackingData = {
            trackingId: processStatusId,
            module: 'process status',
            mode: 'update',
            postData: req.body,
            createdBy: req.userId,
            createdOn: new Date(),
        };

        req.body.updatedBy = req.userId;
        req.body.updatedOn = new Date();
        const requestData = req.body;

        const updatedPositionDetails = await processStatusModel.findByIdAndUpdate(
            processStatusId,
            requestData,
            { new: true }
        );

        trackingData.status = 'success';
        trackingData.message = "processStatus updated successfully..";
        const newTrackingModel = new trackingModel(trackingData);
        await newTrackingModel.save();

        responseHandlier.successResponse(true, updatedPositionDetails, res);
    } catch (error) {
        console.log(error);
        responseHandlier.errorResponse(false, error, res);
    }
};

module.exports.deleteHrProcessStatus = async function (req, res) {
    try {
        if (!req.body._id || !Array.isArray(req.body._id)) {
            return responseHandlier.errorResponse(false, "processStatus _id array is required.", res);
        }

        const processStatusIds = req.body._id;

        let trackingData = {
            trackingId: processStatusIds,
            module: 'process status',
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

        const updatedPositionDetails = await processStatusModel.updateMany(
            { _id: { $in: processStatusIds } },
            requestData,
            { new: true }
        );

        trackingData.status = 'success';
        trackingData.message = "processStatus deleted successfully..";
        const newTrackingModel = new trackingModel(trackingData);
        await newTrackingModel.save();

        responseHandlier.successResponse(true, updatedPositionDetails, res);
    } catch (error) {
        console.log(error);
        responseHandlier.errorResponse(false, error, res);
    }
};
