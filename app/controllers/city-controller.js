const ObjectId = require('mongodb').ObjectId;
const responseHandlier = require('../libs/response/status');
const commonVariable  = require('../libs/static/common.js');
const commonFunction = require('../libs/util/commonFunctions.js');
const cityModel = require("../models/city-model.js")
const trackingModel = require('../models/tracking-model.js');


/**
 * @post
 * @param {*} req
 * @param {*} res
 * @returns to get all addCity details in db
 */


module.exports.addHrCity = async(req,res)=>{
    console.log("userId",req.userId);

    try {
        let newCity = new cityModel({
            cityName : req.body.cityName,
            countryId :req.body.countryId,
            stateId :req.body.stateId,
            shortCode : req.body.shortCode,
            dialCode : req.body.dialCode,
            flagIcon :req.body.flagIcon,
            flagImage : req.body.flagImage,
            status: commonVariable.status.ACTIVE,
            createdBy: req.userId,
            createdOn: new Date(),

        })

        await newCity.save();
        let trackingId = newCity._id
            
        
        let trackingData ={
            trackingId : trackingId,
            module : 'City',
            mode :'add',
            postData : req.body,
            createdBy: req.userId,
            createdOn: new Date(),
        }
        trackingData.status = 'success',
        trackingData.message ="new city added  successfully..";
        const newTrackingModel = new trackingModel(trackingData)
        newTrackingModel.save();
        responseHandlier,responseHandlier.successResponse(true,"city inserted successfully",res)
    } catch (error) {
        console.error("error", error);
        responseHandlier.errorResponse(false, error, res);   
    }
}


module.exports.getHrCity = async (req, res) => {
    try {
      const filterObj = commonFunction.filterObject(req);
  
      const productVersionDetails = await cityModel.find(filterObj)
        .populate({
          path: 'countryId',
          select: ['countryName'],
      })
      .populate({
          path: 'stateId',
          select: ['stateName'],
      })
        .select(commonVariable.unSelect.common)
        .exec();
  
        responseHandlier.successResponse(true, productVersionDetails, res);
    } catch (error) {
      console.log("error", error);
      responseHandlier.errorResponse(false, error, res);
    }
};

module.exports.updateHrCity = async function (req, res) {
    try {
        if (!req.body._id) {
            return responseHandlier.errorResponse(false, "City _id is required.", res);
        }

        const cityId = {
            _id: req.body._id
        };

        let trackingData = {
            trackingId: cityId,
            module: 'City',
            mode: 'update',
            postData: req.body,
            createdBy: req.userId,
            createdOn: new Date(),
        };

        req.body.updatedBy = req.userId;
        req.body.updatedOn = new Date();
        const requestData = req.body;

        const updatedPositionDetails = await cityModel.findByIdAndUpdate(
            cityId,
            requestData,
            { new: true }
        );

        trackingData.status = 'success';
        trackingData.message = "City updated successfully..";
        const newTrackingModel = new trackingModel(trackingData);
        await newTrackingModel.save();

        responseHandlier.successResponse(true, updatedPositionDetails, res);
    } catch (error) {
        console.log(error);
        responseHandlier.errorResponse(false, error, res);
    }
};

module.exports.deleteHrCity = async function (req, res) {
    try {
        if (!req.body._id || !Array.isArray(req.body._id)) {
            return responseHandlier.errorResponse(false, "City _id array is required.", res);
        }

        const cityIds = req.body._id;

        let trackingData = {
            trackingId: cityIds,
            module: 'City',
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

        const updatedPositionDetails = await cityModel.updateMany(
            { _id: { $in: cityIds } },
            requestData,
            { new: true }
        );

        trackingData.status = 'success';
        trackingData.message = "City Deleted successfully..";
        const newTrackingModel = new trackingModel(trackingData);
        await newTrackingModel.save();

        responseHandlier.successResponse(true, updatedPositionDetails, res);
    } catch (error) {
        console.log(error);
        responseHandlier.errorResponse(false, error, res);
    }
};