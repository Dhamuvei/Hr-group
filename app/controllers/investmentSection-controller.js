const ObjectId = require('mongodb').ObjectId;
const responseHandlier = require('../libs/response/status');
const commonVariable  = require('../libs/static/common.js');
const commonFunction = require('../libs/util/commonFunctions.js');
const investSectionModel = require("../models/investmentSection-model.js")
const trackingModel = require('../models/tracking-model.js');


/**
 * @post
 * @param {*} req
 * @param {*} res
 * @returns to get all addState details in db
 */


module.exports.addHrInvestmentSection = async(req,res)=>{
    try {
        let newInvestmentSection = new investSectionModel({
            section : req.body.section,
            exemptionValue :req.body.exemptionValue,
            exemptionPercentage : req.body.exemptionPercentage,
            description : req.body.description,
            status: commonVariable.status.ACTIVE,
            createdBy: req.userId,
            createdOn: new Date(),

        })

        await newInvestmentSection.save();
        let trackingId = newInvestmentSection._id
            
        
        let trackingData ={
            trackingId : trackingId,
            module : 'Investment Section',
            mode :'add',
            postData : req.body,
            createdBy: req.userId,
            createdOn: new Date(),
        }
        trackingData.status = 'success',
        trackingData.message ="new investment Section added  successfully..";
        const newTrackingModel = new trackingModel(trackingData)
        newTrackingModel.save();
        responseHandlier,responseHandlier.successResponse(true,"investment Section inserted successfully",res)
    } catch (error) {
        console.error("error", error);
        responseHandlier.errorResponse(false, error, res);   
    }
}


module.exports.getHrInvestmentSection = async (req, res) => {
    try {
        const filterObj = commonFunction.filterObject(req);

        const sectionDetails = await investSectionModel.find(filterObj, commonVariable.unSelect.common);

        responseHandlier.successResponse(true, sectionDetails, res);
    } catch (error) {
        responseHandlier.errorResponse(false, error, res);
    }
};

module.exports.updateHrInvestmentSection = async function (req, res) {
    try {
        if (!req.body._id) {
            return responseHandlier.errorResponse(false, "investmentSectionId _id is required.", res);
        }

        const investmentSectionId = {
            _id: req.body._id
        };

        let trackingData = {
            trackingId: investmentSectionId,
            module: 'Investment Section',
            mode: 'update',
            postData: req.body,
            createdBy: req.userId,
            createdOn: new Date(),
        };

        req.body.updatedBy = req.userId;
        req.body.updatedOn = new Date();
        const requestData = req.body;

        const updatedPositionDetails = await investSectionModel.findByIdAndUpdate(
            investmentSectionId,
            requestData,
            { new: true }
        );

        trackingData.status = 'success';
        trackingData.message = "investmentSection updated successfully..";
        const newTrackingModel = new trackingModel(trackingData);
        await newTrackingModel.save();

        responseHandlier.successResponse(true, updatedPositionDetails, res);
    } catch (error) {
        console.log(error);
        responseHandlier.errorResponse(false, error, res);
    }
};

module.exports.deleteHrInvestmentSection = async function (req, res) {
    try {
        if (!req.body._id || !Array.isArray(req.body._id)) {
            return responseHandlier.errorResponse(false, "investmentSection _id array is required.", res);
        }

        const investmentSectionIds = req.body._id;

        let trackingData = {
            trackingId: investmentSectionIds,
            module: 'Investment Section',
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

        const updatedPositionDetails = await investSectionModel.updateMany(
            { _id: { $in: investmentSectionIds } },
            requestData,
            { new: true }
        );

        trackingData.status = 'success';
        trackingData.message = "investmentSection deleted successfully..";
        const newTrackingModel = new trackingModel(trackingData);
        await newTrackingModel.save();

        responseHandlier.successResponse(true, updatedPositionDetails, res);
    } catch (error) {
        console.log(error);
        responseHandlier.errorResponse(false, error, res);
    }
};
