const ObjectId = require('mongodb').ObjectId;
const responseHandlier = require('../libs/response/status');
const commonVariable  = require('../libs/static/common.js');
const commonFunction = require('../libs/util/commonFunctions.js');
const timezoneModel = require("../models/timezone-model.js")
const trackingModel = require('../models/tracking-model.js');


/**
 * @post
 * @param {*} req
 * @param {*} res
 * @returns to get all addState details in db
 */


module.exports.addHrTimezone = async(req,res)=>{
    try {
        let newTimezone = new timezoneModel({
            timezoneName : req.body.timezoneName,
            UST :req.body.UST,
            diffDuration : req.body.diffDuration,
            countryId : req.body.countryId,
            description :req.body.description,
            status: commonVariable.status.ACTIVE,
            createdBy: req.userId,
            createdOn: new Date(),

        })

        await newTimezone.save();
        let trackingId = newTimezone._id
            
        
        let trackingData ={
            trackingId : trackingId,
            module : 'TimeZone',
            mode :'add',
            postData : req.body,
            createdBy: req.userId,
            createdOn: new Date(),
        }
        trackingData.status = 'success',
        trackingData.message ="new timeZone added  successfully..";
        const newTrackingModel = new trackingModel(trackingData)
        newTrackingModel.save();
        responseHandlier,responseHandlier.successResponse(true,"timeZone inserted successfully",res)
    } catch (error) {
        console.error("error", error);
        responseHandlier.errorResponse(false, error, res);   
    }
}


module.exports.getHrTimeZone = async (req, res) => {
    try {
      const filterObj = commonFunction.filterObject(req);
  
      const productVersionDetails = await timezoneModel.find(filterObj)
        .populate({
          path: 'countryId',
          select: ['countryName'],
      })
        .select(commonVariable.unSelect.common)
        .exec();
  
        responseHandlier.successResponse(true, productVersionDetails, res);
    } catch (error) {
      console.log("error", error);
      responseHandlier.errorResponse(false, error, res);
    }
};

module.exports.updateHrTimezone = async function (req, res) {
    try {
        if (!req.body._id) {
            return responseHandlier.errorResponse(false, "TimeZone _id is required.", res);
        }

        const timezoneId = {
            _id: req.body._id
        };

        let trackingData = {
            trackingId: timezoneId,
            module: 'Timezone',
            mode: 'update',
            postData: req.body,
            createdBy: req.userId,
            createdOn: new Date(),
        };

        req.body.updatedBy = req.userId;
        req.body.updatedOn = new Date();
        const requestData = req.body;

        const updatedPositionDetails = await timezoneModel.findByIdAndUpdate(
            timezoneId,
            requestData,
            { new: true }
        );

        trackingData.status = 'success';
        trackingData.message = "Timezone updated successfully..";
        const newTrackingModel = new trackingModel(trackingData);
        await newTrackingModel.save();

        responseHandlier.successResponse(true, updatedPositionDetails, res);
    } catch (error) {
        console.log(error);
        responseHandlier.errorResponse(false, error, res);
    }
};

module.exports.deleteHrTimezone = async function (req, res) {
    try {
        if (!req.body._id || !Array.isArray(req.body._id)) {
            return responseHandlier.errorResponse(false, "timeZone _id array is required.", res);
        }

        const timezoneIds = req.body._id;

        let trackingData = {
            trackingId: timezoneIds,
            module: 'TimeZone',
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

        const updatedPositionDetails = await timezoneModel.updateMany(
            { _id: { $in: timezoneIds } },
            requestData,
            { new: true }
        );

        trackingData.status = 'success';
        trackingData.message = "timeZone Deleted successfully..";
        const newTrackingModel = new trackingModel(trackingData);
        await newTrackingModel.save();

        responseHandlier.successResponse(true, updatedPositionDetails, res);
    } catch (error) {
        console.log(error);
        responseHandlier.errorResponse(false, error, res);
    }
};