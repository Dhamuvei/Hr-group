const ObjectId = require('mongodb').ObjectId;
const responseHandlier = require('../libs/response/status');
const commonVariable  = require('../libs/static/common.js');
const commonFunction = require('../libs/util/commonFunctions.js');
const stateModel = require("../models/state-model.js")
const trackingModel = require('../models/tracking-model.js');


/**
 * @post
 * @param {*} req
 * @param {*} res
 * @returns to get all addState details in db
 */


module.exports.addHrState = async(req,res)=>{
    try {
        let newState = new stateModel({
            stateName : req.body.stateName,
            countryId :req.body.countryId,
            shortCode : req.body.shortCode,
            dialCode : req.body.dialCode,
            flagIcon :req.body.flagIcon,
            flagImage : req.body.flagImage,
            status: commonVariable.status.ACTIVE,
            createdBy: req.userId,
            createdOn: new Date(),

        })

        await newState.save();
        let trackingId = newState._id
            
        
        let trackingData ={
            trackingId : trackingId,
            module : 'state',
            mode :'add',
            postData : req.body,
            createdBy: req.userId,
            createdOn: new Date(),
        }
        trackingData.status = 'success',
        trackingData.message ="new state added  successfully..";
        const newTrackingModel = new trackingModel(trackingData)
        newTrackingModel.save();
        responseHandlier,responseHandlier.successResponse(true,"state inserted successfully",res)
    } catch (error) {
        console.error("error", error);
        responseHandlier.errorResponse(false, error, res);   
    }
}


module.exports.getHrState= async (req, res) => {
    try {
        const filterObj = commonFunction.filterObject(req);

        const stateDetails = await stateModel.find(filterObj, commonVariable.unSelect.common);

        responseHandlier.successResponse(true, stateDetails, res);
    } catch (error) {
        responseHandlier.errorResponse(false, error, res);
    }
};

module.exports.updateHrState = async function (req, res) {
    try {
        if (!req.body._id) {
            return responseHandlier.errorResponse(false, "State _id is required.", res);
        }

        const stateId = {
            _id: req.body._id
        };

        let trackingData = {
            trackingId: stateId,
            module: 'State',
            mode: 'update',
            postData: req.body,
            createdBy: req.userId,
            createdOn: new Date(),
        };

        req.body.updatedBy = req.userId;
        req.body.updatedOn = new Date();
        const requestData = req.body;

        const updatedPositionDetails = await stateModel.findByIdAndUpdate(
            stateId,
            requestData,
            { new: true }
        );

        trackingData.status = 'success';
        trackingData.message = "State updated successfully..";
        const newTrackingModel = new trackingModel(trackingData);
        await newTrackingModel.save();

        responseHandlier.successResponse(true, updatedPositionDetails, res);
    } catch (error) {
        console.log(error);
        responseHandlier.errorResponse(false, error, res);
    }
};

module.exports.deleteHrState = async function (req, res) {
    try {
        if (!req.body._id || !Array.isArray(req.body._id)) {
            return responseHandlier.errorResponse(false, "state _id array is required.", res);
        }

        const stateIds = req.body._id;

        let trackingData = {
            trackingId: stateIds,
            module: 'State',
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

        const updatedPositionDetails = await stateModel.updateMany(
            { _id: { $in: stateIds } },
            requestData,
            { new: true }
        );

        trackingData.status = 'success';
        trackingData.message = "state deleted successfully..";
        const newTrackingModel = new trackingModel(trackingData);
        await newTrackingModel.save();

        responseHandlier.successResponse(true, updatedPositionDetails, res);
    } catch (error) {
        console.log(error);
        responseHandlier.errorResponse(false, error, res);
    }
};
