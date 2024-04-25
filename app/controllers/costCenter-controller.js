const ObjectId = require('mongodb').ObjectId;
const responseHandlier = require('../libs/response/status.js');
const commonVariable  = require('../libs/static/common.js');
const commonFunction = require('../libs/util/commonFunctions.js');
const costCenterModel = require("../models/costCenter-model.js")
const trackingModel = require('../models/tracking-model.js');


/**
 * @post
 * @param {*} req
 * @param {*} res
 * @returns to get all addState details in db
 */


module.exports.addCostCenter = async(req,res)=>{
    try {
        let newCostCenter = new costCenterModel({
            costCenter: req.body.costCenter,
            shortCode:req.body.shortCode,
            description:req.body.description,
            status: commonVariable.status.ACTIVE,
            createdBy: req.userId,
            createdOn: new Date(),

        })

        await newCostCenter.save();
        let trackingId = newCostCenter._id
            
        
        let trackingData ={
            trackingId : trackingId,
            module : 'Cost Center',
            mode :'add',
            postData : req.body,
            createdBy: req.userId,
            createdOn: new Date(),
        }
        trackingData.status = 'success',
        trackingData.message ="new Cost Center added  successfully..";
        const newTrackingModel = new trackingModel(trackingData)
        newTrackingModel.save();
        responseHandlier,responseHandlier.successResponse(true,"Cost Center inserted successfully",res)
    } catch (error) {
        console.error("error", error);
        responseHandlier.errorResponse(false, error, res);   
    }
}

module.exports.getCostCenter = async (req, res) => {
    try {
      const filterObj = commonFunction.filterObject(req);
  
      const productVersionDetails = await costCenterModel.find(filterObj)
      
  
        responseHandlier.successResponse(true, productVersionDetails, res);
    } catch (error) {
      console.log("error", error);
      responseHandlier.errorResponse(false, error, res);
    }
  };

  module.exports.updateCostCenter= async function (req, res) {
    try {
        if (!req.body._id) {
            return responseHandlier.errorResponse(false, "cost center _id is required.", res);
        }

        const costCenterId = {
            _id: req.body._id
        };

        let trackingData = {
            trackingId: costCenterId,
            module: 'Cost Center',
            mode: 'update',
            postData: req.body,
            createdBy: req.userId,
            createdOn: new Date(),
        };

        req.body.updatedBy = req.userId;
        req.body.updatedOn = new Date();
        const requestData = req.body;

        const updatedPositionDetails = await costCenterModel.findByIdAndUpdate(
            costCenterId,
            requestData,
            { new: true }
        );

        trackingData.status = 'success';
        trackingData.message = "Cost Center updated successfully..";
        const newTrackingModel = new trackingModel(trackingData);
        await newTrackingModel.save();

        responseHandlier.successResponse(true, updatedPositionDetails, res);
    } catch (error) {
        console.log(error);
        responseHandlier.errorResponse(false, error, res);
    }
};

module.exports.deleteCostCenter = async function (req, res) {
    try {
        if (!req.body._id || !Array.isArray(req.body._id)) {
            return responseHandlier.errorResponse(false, "Cost Center _id array is required.", res);
        }

        const costCenterIds = req.body._id;

        let trackingData = {
            trackingId: costCenterIds,
            module: 'Cost Center',
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

        const updatedPositionDetails = await costCenterModel.updateMany(
            { _id: { $in: costCenterIds } },
            requestData,
            { new: true }
        );

        trackingData.status = 'success';
        trackingData.message = "Cost Center Deleted successfully..";
        const newTrackingModel = new trackingModel(trackingData);
        await newTrackingModel.save();

        responseHandlier.successResponse(true, updatedPositionDetails, res);
    } catch (error) {
        console.log(error);
        responseHandlier.errorResponse(false, error, res);
    }
};