const ObjectId = require('mongodb').ObjectId;
const responseHandlier = require('../libs/response/status');
const commonVariable  = require('../libs/static/common.js');
const commonFunction = require('../libs/util/commonFunctions.js');
const languageModel = require("../models/language-model.js")
const trackingModel = require('../models/tracking-model.js');


/**
 * @post
 * @param {*} req
 * @param {*} res
 * @returns to get all addState details in db
 */


module.exports.addHrLanguage = async(req,res)=>{
    try {
        let newLanguage = new languageModel({
            languageName: req.body.languageName,
            countryId: req.body.countryId,
            stateId:req.body.stateId,
            shortCode:req.body.shortCode,
            layoutPosition:req.body.layoutPosition,
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


module.exports.getHrLanguage = async (req, res) => {
    try {
      const filterObj = commonFunction.filterObject(req);
  
      const productVersionDetails = await languageModel.find(filterObj)
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

  module.exports.updateHrLanguage= async function (req, res) {
    try {
        if (!req.body._id) {
            return responseHandlier.errorResponse(false, "TimeZone _id is required.", res);
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

        const updatedPositionDetails = await languageModel.findByIdAndUpdate(
            languageId,
            requestData,
            { new: true }
        );

        trackingData.status = 'success';
        trackingData.message = "Langauge updated successfully..";
        const newTrackingModel = new trackingModel(trackingData);
        await newTrackingModel.save();

        responseHandlier.successResponse(true, updatedPositionDetails, res);
    } catch (error) {
        console.log(error);
        responseHandlier.errorResponse(false, error, res);
    }
};

module.exports.deleteHrLanguage = async function (req, res) {
    try {
        if (!req.body._id || !Array.isArray(req.body._id)) {
            return responseHandlier.errorResponse(false, "Langauge _id array is required.", res);
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

        const updatedPositionDetails = await timezoneModel.updateMany(
            { _id: { $in: languageIds } },
            requestData,
            { new: true }
        );

        trackingData.status = 'success';
        trackingData.message = "Langauge Deleted successfully..";
        const newTrackingModel = new trackingModel(trackingData);
        await newTrackingModel.save();

        responseHandlier.successResponse(true, updatedPositionDetails, res);
    } catch (error) {
        console.log(error);
        responseHandlier.errorResponse(false, error, res);
    }
};
