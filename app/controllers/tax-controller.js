const ObjectId = require('mongodb').ObjectId;
const responseHandlier = require('../libs/response/status');
const commonVariable  = require('../libs/static/common.js');
const commonFunction = require('../libs/util/commonFunctions.js');
const processStatusModel = require("../models/processStatus-model.js");
const taxModel = require('../models/tax-model.js');
const trackingModel = require('../models/tracking-model.js');



/**
 * @post
 * @param {*} req
 * @param {*} res
 * @returns to insert processStatus details in db
 */


module.exports.addHrTax = async(req,res)=>{
    try {
        const newTax = taxModel({
            taxName: req.body.taxName,
            description: req.body.description,
            shortCode:req.body.shortCode,
            cgst:req.body.cgst,
            sgst:req.body.sgst,
            igst:req.body.igst,
            status: commonVariable.status.ACTIVE,
            createdBy: req.userId,
            createdOn: new Date(),
        })
        await newTax.save();
        let trackingId = newTax._id
            
        
        let trackingData ={
            trackingId : trackingId,
            module : 'Tax',
            mode :'add',
            postData : req.body,
            createdBy: req.userId,
            createdOn: new Date(),
        }
        trackingData.status = 'success',
        trackingData.message ="new Tax added  successfully..";
        const newTrackingModel = new trackingModel(trackingData)
        newTrackingModel.save();
        responseHandlier,responseHandlier.successResponse(true,"Tax inserted successfully",res)
        
    } catch (error) {
        console.error("error", error);
        responseHandlier.errorResponse(false, error, res);      
    }
}

module.exports.getHrTax= async (req, res) => {
    try {
        const filterObj = commonFunction.filterObject(req);

        const taxDetails = await taxModel.find(filterObj, commonVariable.unSelect.common);

        responseHandlier.successResponse(true, taxDetails, res);
    } catch (error) {
        responseHandlier.errorResponse(false, error, res);
    }
};

module.exports.updateHrTax = async function (req, res) {
    try {
        if (!req.body._id) {
            return responseHandlier.errorResponse(false, "Tax _id is required.", res);
        }

        const taxId = {
            _id: req.body._id
        };

        let trackingData = {
            trackingId: taxId,
            module: 'Tax',
            mode: 'update',
            postData: req.body,
            createdBy: req.userId,
            createdOn: new Date(),
        };

        req.body.updatedBy = req.userId;
        req.body.updatedOn = new Date();
        const requestData = req.body;

        const updatedPositionDetails = await taxModel.findByIdAndUpdate(
            taxId,
            requestData,
            { new: true }
        );

        trackingData.status = 'success';
        trackingData.message = "tax updated successfully..";
        const newTrackingModel = new trackingModel(trackingData);
        await newTrackingModel.save();

        responseHandlier.successResponse(true, updatedPositionDetails, res);
    } catch (error) {
        console.log(error);
        responseHandlier.errorResponse(false, error, res);
    }
};

module.exports.deleteHrTax = async function (req, res) {
    try {
        if (!req.body._id || !Array.isArray(req.body._id)) {
            return responseHandlier.errorResponse(false, "tax _id array is required.", res);
        }

        const taxIds = req.body._id;

        let trackingData = {
            trackingId: taxIds,
            module: 'Tax',
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

        const updatedPositionDetails = await taxModel.updateMany(
            { _id: { $in: taxIds } },
            requestData,
            { new: true }
        );

        trackingData.status = 'success';
        trackingData.message = "Tax deleted successfully..";
        const newTrackingModel = new trackingModel(trackingData);
        await newTrackingModel.save();

        responseHandlier.successResponse(true, updatedPositionDetails, res);
    } catch (error) {
        console.log(error);
        responseHandlier.errorResponse(false, error, res);
    }
};