const ObjectId = require('mongodb').ObjectId;
const responseHandlier = require('../libs/response/status');
const commonVariable  = require('../libs/static/common.js');
const commonFunction = require('../libs/util/commonFunctions.js');
const accessModel = require("../models/access-model.js")
const trackingModel = require('../models/tracking-model.js');


/**
 * @post
 * @param {*} req
 * @param {*} res
 * @returns to get all addCity details in db
 */


module.exports.addHrAceess = async(req,res)=>{
    console.log("userId",req.userId);

    try {
        let newAccess = new accessModel({
            accessName: req.body.accessName,
            description: req.body.description,
            isDefault:req.body.isDefault,
            status: commonVariable.status.ACTIVE,
            createdBy: req.userId,
            createdOn: new Date(),

        })

        await newAccess.save();
        let trackingId = newAccess._id
            
        
        let trackingData ={
            trackingId : trackingId,
            module : 'Acccess',
            mode :'add',
            postData : req.body,
            createdBy: req.userId,
            createdOn: new Date(),
        }
        trackingData.status = 'success',
        trackingData.message ="new access added  successfully..";
        const newTrackingModel = new trackingModel(trackingData)
        newTrackingModel.save();
        responseHandlier,responseHandlier.successResponse(true,"access inserted successfully",res)
    } catch (error) {
        console.error("error", error);
        responseHandlier.errorResponse(false, error, res);   
    }
}

module.exports.getHrAccess= async (req, res) => {
    try {
        const filterObj = commonFunction.filterObject(req);

        const accessDetails = await accessModel.find(filterObj, commonVariable.unSelect.common);

        responseHandlier.successResponse(true, accessDetails, res);
    } catch (error) {
        responseHandlier.errorResponse(false, error, res);
    }
};

module.exports.updateHrAccess = async function (req, res) {
    try {
        if (!req.body._id) {
            return responseHandlier.errorResponse(false, "Access _id is required.", res);
        }

        const accessId = {
            _id: req.body._id
        };

        let trackingData = {
            trackingId: accessId,
            module: 'Access',
            mode: 'update',
            postData: req.body,
            createdBy: req.userId,
            createdOn: new Date(),
        };

        req.body.updatedBy = req.userId;
        req.body.updatedOn = new Date();
        const requestData = req.body;

        const updatedPositionDetails = await accessModel.findByIdAndUpdate(
            accessId,
            requestData,
            { new: true }
        );

        trackingData.status = 'success';
        trackingData.message = "access updated successfully..";
        const newTrackingModel = new trackingModel(trackingData);
        await newTrackingModel.save();

        responseHandlier.successResponse(true, updatedPositionDetails, res);
    } catch (error) {
        console.log(error);
        responseHandlier.errorResponse(false, error, res);
    }
};

module.exports.deleteHrAccess = async function (req, res) {
    try {
        if (!req.body._id || !Array.isArray(req.body._id)) {
            return responseHandlier.errorResponse(false, "access _id array is required.", res);
        }

        const accessIds = req.body._id;

        let trackingData = {
            trackingId: accessIds,
            module: 'Access',
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

        const updatedPositionDetails = await accessModel.updateMany(
            { _id: { $in: accessIds } },
            requestData,
            { new: true }
        );

        trackingData.status = 'success';
        trackingData.message = "access deleted successfully..";
        const newTrackingModel = new trackingModel(trackingData);
        await newTrackingModel.save();

        responseHandlier.successResponse(true, updatedPositionDetails, res);
    } catch (error) {
        console.log(error);
        responseHandlier.errorResponse(false, error, res);
    }
};