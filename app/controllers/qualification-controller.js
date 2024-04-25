const ObjectId = require('mongodb').ObjectId;
const responseHandlier = require('../libs/response/status');
const commonVariable  = require('../libs/static/common.js');
const commonFunction = require('../libs/util/commonFunctions.js');
const qualificationModel = require("../models/qualification-model.js");
const trackingModel = require('../models/tracking-model.js');

/**
 * @post
 * @param {*} req
 * @param {*} res
 * @returns to get all addQualification details in db
 */


module.exports.addHrQualification = async(req,res) =>{
    try {
        let newQualification = new qualificationModel({
            qualificationName : req.body.qualificationName,
            shortCode :req.body.shortCode,
            description : req.body.description,
            status : commonVariable.status.ACTIVE,
            createdBy : req.userId,
            createdOn : new Date(),

        })
        await newQualification.save();
        let trackingId = newQualification._id
            
        
        let trackingData ={
            trackingId : trackingId,
            module : 'Qualification',
            mode :'add',
            postData : req.body,
            createdBy: req.userId,
            createdOn: new Date(),
        }
        trackingData.status = 'success',
        trackingData.message ="new qualification added successfully..";
        const newTrackingModel = new trackingModel(trackingData)
        newTrackingModel.save();
        responseHandlier.successResponse(true,"successfully inserted..",res);


    } catch (error) {
        console.error("error", error);
        responseHandlier.errorResponse(false, error, res);  
    }
};

module.exports.getHrQualification = async (req, res) => {
    try {
        const filterObj = commonFunction.filterObject(req);

        const qualificationDetails = await qualificationModel.find(filterObj, commonVariable.unSelect.common);

        responseHandlier.successResponse(true, qualificationDetails, res);
    } catch (error) {
        responseHandlier.errorResponse(false, error, res);
    }
};

module.exports.updateHrQualification = async function (req, res) {
    try {
        if (!req.body._id) {
            return responseHandlier.errorResponse(false, "Qualification _id is required.", res);
        }

        const qualificationId = {
            _id: req.body._id
        };

        let trackingData = {
            trackingId: qualificationId,
            module: 'Qualification',
            mode: 'update',
            postData: req.body,
            createdBy: req.userId,
            createdOn: new Date(),
        };

        req.body.updatedBy = req.userId;
        req.body.updatedOn = new Date();
        const requestData = req.body;

        const updatedPositionDetails = await qualificationModel.findByIdAndUpdate(
            qualificationId,
            requestData,
            { new: true }
        );

        trackingData.status = 'success';
        trackingData.message = "qualification updated successfully..";
        const newTrackingModel = new trackingModel(trackingData);
        await newTrackingModel.save();

        responseHandlier.successResponse(true, updatedPositionDetails, res);
    } catch (error) {
        console.log(error);
        responseHandlier.errorResponse(false, error, res);
    }
};

module.exports.deleteHrQualification = async function (req, res) {
    try {
        if (!req.body._id || !Array.isArray(req.body._id)) {
            return responseHandlier.errorResponse(false, "Qualification _id array is required.", res);
        }

        const qualificationIds = req.body._id;

        let trackingData = {
            trackingId: qualificationIds,
            module: 'Qualification',
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

        const updatedPositionDetails = await qualificationModel.updateMany(
            { _id: { $in: qualificationIds } },
            requestData,
            { new: true }
        );

        trackingData.status = 'success';
        trackingData.message = "qualification deleted successfully..";
        const newTrackingModel = new trackingModel(trackingData);
        await newTrackingModel.save();

        responseHandlier.successResponse(true, updatedPositionDetails, res);
    } catch (error) {
        console.log(error);
        responseHandlier.errorResponse(false, error, res);
    }
};
