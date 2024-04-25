const ObjectId = require('mongodb').ObjectId;
const responseHandlier = require('../libs/response/status');
const commonVariable  = require('../libs/static/common.js');
const commonFunction = require('../libs/util/commonFunctions.js');
const overtimeModel = require("../models/over-time-category-model.js")
const trackingModel = require('../models/tracking-model.js');


/**
 * @post
 * @param {*} req
 * @param {*} res
 * @returns to get all addState details in db
 */


module.exports.addOverTime = async(req,res)=>{
    try {
        let newLanguage = new overtimeModel({
            overTimeName: req.body.overTimeName,
            shortCode: req.body.shortCode,
            description:req.body.description,
            status: commonVariable.status.ACTIVE,
            createdBy: req.userId,
            createdOn: new Date(),

        })

        await newLanguage.save();
        let trackingId = newLanguage._id
            
        
        let trackingData ={
            trackingId : trackingId,
            module : 'Language',
            mode :'add',
            postData : req.body,
            createdBy: req.userId,
            createdOn: new Date(),
        }
        trackingData.status = 'success',
        trackingData.message ="new language added  successfully..";
        const newTrackingModel = new trackingModel(trackingData)
        newTrackingModel.save();
        responseHandlier,responseHandlier.successResponse(true,"language inserted successfully",res)
    } catch (error) {
        console.error("error", error);
        responseHandlier.errorResponse(false, error, res);   
    }
}

module.exports.getAllOverTime = async (req, res) => {
    try {
        const filterObj = commonFunction.filterObject(req);

        const overtimeDetails = await overtimeModel.find(filterObj, commonVariable.unSelect.common);

        responseHandlier.successResponse(true, overtimeDetails, res);
    } catch (error) {
        responseHandlier.errorResponse(false, error, res);
    }
};




  module.exports.updateOverTime= async function (req, res) {
    try {
        if (!req.body._id) {
            return responseHandlier.errorResponse(false, "over time _id is required.", res);
        }

        const languageId = {
            _id: req.body._id
        };

        let trackingData = {
            trackingId: languageId,
            module: 'Langauge',
            mode: 'update',
            postData: req.body,
            createdBy: req.userId,
            createdOn: new Date(),
        };

        req.body.updatedBy = req.userId;
        req.body.updatedOn = new Date();
        const requestData = req.body;

        const updatedPositionDetails = await overtimeModel.findByIdAndUpdate(
            languageId,
            requestData,
            { new: true }
        );

        trackingData.status = 'success';
        trackingData.message = "overtime updated successfully..";
        const newTrackingModel = new trackingModel(trackingData);
        await newTrackingModel.save();

        responseHandlier.successResponse(true, updatedPositionDetails, res);
    } catch (error) {
        console.log(error);
        responseHandlier.errorResponse(false, error, res);
    }
};


module.exports.deleteOverTime = async function (req, res) {
    try {
        if (!req.body._id || !Array.isArray(req.body._id)) {
            return responseHandlier.errorResponse(false, "over time _id array is required.", res);
        }

        const languageIds = req.body._id;

        let trackingData = {
            trackingId: languageIds,
            module: 'Langauge',
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

        const updatedPositionDetails = await overtimeModel.updateMany(
            { _id: { $in: languageIds } },
            requestData,
            { new: true }
        );

        trackingData.status = 'success';
        trackingData.message = "overtime Deleted successfully..";
        const newTrackingModel = new trackingModel(trackingData);
        await newTrackingModel.save();

        responseHandlier.successResponse(true, updatedPositionDetails, res);
    } catch (error) {
        console.log(error);
        responseHandlier.errorResponse(false, error, res);
    }
};
