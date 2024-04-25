const ObjectId = require('mongodb').ObjectId;
const responseHandlier = require('../libs/response/status');
const commonVariable  = require('../libs/static/common.js');
const commonFunction = require('../libs/util/commonFunctions.js');
const employeCategoryModel = require("../models/employee-category-model.js");
const trackingModel = require('../models/tracking-model.js');

/**
 * @post
 * @param {*} req
 * @param {*} res
 * @returns to get all addCountry details in db
 */


module.exports.addHrEmployeCategory = async(req,res)=>{
    try {
        let newCategory = new employeCategoryModel({
            categoryName : req.body.categoryName,
            shortCode : req.body.shortCode,
            description : req.body.description,
            status: commonVariable.status.ACTIVE,
            createdBy: req.userId,
            createdOn: new Date(),

        })

        await newCategory.save();
        let trackingId = newCategory._id
            
        
        let trackingData ={
            trackingId : trackingId,
            module : 'employeCategory',
            mode :'add',
            postData : req.body,
            createdBy: req.userId,
            createdOn: new Date(),
        }
        trackingData.status = 'success',
        trackingData.message ="  added  successfully..";
        const newTrackingModel = new trackingModel(trackingData)
        newTrackingModel.save();
        responseHandlier,responseHandlier.successResponse(true,"country inserted successfully",res)
    } catch (error) {
        console.error("error", error);
        responseHandlier.errorResponse(false, error, res);   
    }
}

module.exports.getHrEmployeCategory = async (req, res) => {
    try {
        const filterObj = commonFunction.filterObject(req);

        const countryDetails = await employeCategoryModel.find(filterObj, commonVariable.unSelect.common);

        responseHandlier.successResponse(true, countryDetails, res);
    } catch (error) {
        responseHandlier.errorResponse(false, error, res);
    }
};


module.exports.updateHrEmployeCategory = async function (req, res) {
    try {
        if (!req.body._id) {
            return responseHandlier.errorResponse(false, " _id is required.", res);
        }

        const countryId = {
            _id: req.body._id
        };

        let trackingData = {
            trackingId: countryId,
            module: 'employeCategory',
            mode: 'update',
            postData: req.body,
            createdBy: req.userId,
            createdOn: new Date(),
        };

        req.body.updatedBy = req.userId;
        req.body.updatedOn = new Date();
        const requestData = req.body;

        const updatedPositionDetails = await employeCategoryModel.findByIdAndUpdate(
            countryId,
            requestData,
            { new: true }
        );

        trackingData.status = 'success';
        trackingData.message = " updated successfully..";
        const newTrackingModel = new trackingModel(trackingData);
        await newTrackingModel.save();

        responseHandlier.successResponse(true, updatedPositionDetails, res);
    } catch (error) {
        console.log(error);
        responseHandlier.errorResponse(false, error, res);
    }
};

module.exports.deleteHrEmployeCategory = async function (req, res) {
    try {
        if (!req.body._id || !Array.isArray(req.body._id)) {
            return responseHandlier.errorResponse(false, " _id array is required.", res);
        }

        const Ids = req.body._id;

        let trackingData = {
            trackingId: Ids,
            module: 'employeCategory',
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

        const updatedPositionDetails = await employeCategoryModel.updateMany(
            { _id: { $in: Ids } },
            requestData,
            { new: true }
        );

        trackingData.status = 'success';
        trackingData.message = " deleted successfully..";
        const newTrackingModel = new trackingModel(trackingData);
        await newTrackingModel.save();

        responseHandlier.successResponse(true, updatedPositionDetails, res);
    } catch (error) {
        console.log(error);
        responseHandlier.errorResponse(false, error, res);
    }
};
