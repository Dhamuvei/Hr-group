const ObjectId = require('mongodb').ObjectId;
const responseHandlier = require('../libs/response/status');
const commonVariable  = require('../libs/static/common.js');
const commonFunction = require('../libs/util/commonFunctions.js');
const countryModel = require("../models/country-model.js");
const trackingModel = require('../models/tracking-model.js');

/**
 * @post
 * @param {*} req
 * @param {*} res
 * @returns to get all addCountry details in db
 */


module.exports.addHrCountries = async(req,res)=>{
     console.log("userId",req.userId)
    try {
        let newCountry = new countryModel({
            countryName : req.body.countryName,
            shortCode : req.body.shortCode,
            dialCode : req.body.dialCode,
            flagIcon :req.body.flagIcon,
            flagImage : req.body.flagImage,
            status: commonVariable.status.ACTIVE,
            createdBy: req.userId,
            createdOn: new Date(),

        })

        await newCountry.save();
        let trackingId = newCountry._id
            
        
        let trackingData ={
            trackingId : trackingId,
            module : 'Country',
            mode :'add',
            postData : req.body,
            createdBy: req.userId,
            createdOn: new Date(),
        }
        trackingData.status = 'success',
        trackingData.message ="new Country added  successfully..";
        const newTrackingModel = new trackingModel(trackingData)
        newTrackingModel.save();
        responseHandlier,responseHandlier.successResponse(true,"country inserted successfully",res)
    } catch (error) {
        console.error("error", error);
        responseHandlier.errorResponse(false, error, res);   
    }
}

module.exports.getHrCountry = async (req, res) => {
    try {
        const filterObj = commonFunction.filterObject(req);

        const countryDetails = await countryModel.find(filterObj, commonVariable.unSelect.common);

        responseHandlier.successResponse(true, countryDetails, res);
    } catch (error) {
        responseHandlier.errorResponse(false, error, res);
    }
};

module.exports.updateHrCountry = async function (req, res) {
    try {
        if (!req.body._id) {
            return responseHandlier.errorResponse(false, "Country _id is required.", res);
        }

        const countryId = {
            _id: req.body._id
        };

        let trackingData = {
            trackingId: countryId,
            module: 'Country',
            mode: 'update',
            postData: req.body,
            createdBy: req.userId,
            createdOn: new Date(),
        };

        req.body.updatedBy = req.userId;
        req.body.updatedOn = new Date();
        const requestData = req.body;

        const updatedPositionDetails = await countryModel.findByIdAndUpdate(
            countryId,
            requestData,
            { new: true }
        );

        trackingData.status = 'success';
        trackingData.message = "Country updated successfully..";
        const newTrackingModel = new trackingModel(trackingData);
        await newTrackingModel.save();

        responseHandlier.successResponse(true, updatedPositionDetails, res);
    } catch (error) {
        console.log(error);
        responseHandlier.errorResponse(false, error, res);
    }
};

module.exports.deleteHrCountry = async function (req, res) {
    try {
        if (!req.body._id || !Array.isArray(req.body._id)) {
            return responseHandlier.errorResponse(false, "Country _id array is required.", res);
        }

        const coutnryIds = req.body._id;

        let trackingData = {
            trackingId: coutnryIds,
            module: 'Country',
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

        const updatedPositionDetails = await countryModel.updateMany(
            { _id: { $in: coutnryIds } },
            requestData,
            { new: true }
        );

        trackingData.status = 'success';
        trackingData.message = "Country deleted successfully..";
        const newTrackingModel = new trackingModel(trackingData);
        await newTrackingModel.save();

        responseHandlier.successResponse(true, updatedPositionDetails, res);
    } catch (error) {
        console.log(error);
        responseHandlier.errorResponse(false, error, res);
    }
};
