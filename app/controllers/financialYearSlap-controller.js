const ObjectId = require('mongodb').ObjectId;
const responseHandlier = require('../libs/response/status');
const commonVariable  = require('../libs/static/common.js');
const commonFunction = require('../libs/util/commonFunctions.js');
const financialYearSlapModel = require("../models/financialYearSlap-model.js")
const trackingModel = require('../models/tracking-model.js');


/**
 * @post
 * @param {*} req
 * @param {*} res
 * @returns to get all addState details in db
 */


module.exports.addHrFinancialYearSlap = async(req,res)=>{
    try {
        let newFinancialYearSlap = new financialYearSlapModel({
            financialYear : req.body.financialYear,
            fromYear :req.body.fromYear,
            toYear : req.body.toYear,
            startDate : req.body.startDate,
            endDate : req.body.endDate ,
            isCurrentYear : req.body.isCurrentYear,
            status: commonVariable.status.ACTIVE,
            createdBy: req.userId,
            createdOn: new Date(),

        })

        await newFinancialYearSlap.save();
        let trackingId = newFinancialYearSlap._id
            
        
        let trackingData ={
            trackingId : trackingId,
            module : 'Financial Year Slap',
            mode :'add',
            postData : req.body,
            createdBy: req.userId,
            createdOn: new Date(),
        }
        trackingData.status = 'success',
        trackingData.message ="new Fianancial Year Slap added  successfully..";
        const newTrackingModel = new trackingModel(trackingData)
        newTrackingModel.save();
        responseHandlier,responseHandlier.successResponse(true,"Financial Year Slap inserted successfully",res)
    } catch (error) {
        console.error("error", error);
        responseHandlier.errorResponse(false, error, res);   
    }
}

module.exports.getHrFinancialYearSlap = async (req, res) => {
    try {
        const filterObj = commonFunction.filterObject(req);

        const yearSlapDetails = await financialYearSlapModel.find(filterObj, commonVariable.unSelect.common);

        responseHandlier.successResponse(true, yearSlapDetails, res);
    } catch (error) {
        responseHandlier.errorResponse(false, error, res);
    }
};

module.exports.updateHrFinancialYearSlap = async function (req, res) {
    try {
        if (!req.body._id) {
            return responseHandlier.errorResponse(false, "yearSlap _id is required.", res);
        }

        const yearSlapId = {
            _id: req.body._id
        };

        let trackingData = {
            trackingId: yearSlapId,
            module: 'Financial Year Slap',
            mode: 'update',
            postData: req.body,
            createdBy: req.userId,
            createdOn: new Date(),
        };

        req.body.updatedBy = req.userId;
        req.body.updatedOn = new Date();
        const requestData = req.body;

        const updatedPositionDetails = await financialYearSlapModel.findByIdAndUpdate(
            yearSlapId,
            requestData,
            { new: true }
        );

        trackingData.status = 'success';
        trackingData.message = "financialYearSlap updated successfully..";
        const newTrackingModel = new trackingModel(trackingData);
        await newTrackingModel.save();

        responseHandlier.successResponse(true, updatedPositionDetails, res);
    } catch (error) {
        console.log(error);
        responseHandlier.errorResponse(false, error, res);
    }
};

module.exports.deleteHrFinancialYearSlap = async function (req, res) {
    try {
        if (!req.body._id || !Array.isArray(req.body._id)) {
            return responseHandlier.errorResponse(false, "financialYearSlap _id array is required.", res);
        }

        const yearSlapIds = req.body._id;

        let trackingData = {
            trackingId: yearSlapIds,
            module: 'Financial Year Slap',
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

        const updatedPositionDetails = await financialYearSlapModel.updateMany(
            { _id: { $in: yearSlapIds } },
            requestData,
            { new: true }
        );

        trackingData.status = 'success';
        trackingData.message = "financialYearSlap deleted successfully..";
        const newTrackingModel = new trackingModel(trackingData);
        await newTrackingModel.save();

        responseHandlier.successResponse(true, updatedPositionDetails, res);
    } catch (error) {
        console.log(error);
        responseHandlier.errorResponse(false, error, res);
    }
};
