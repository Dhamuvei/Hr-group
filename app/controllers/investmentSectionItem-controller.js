const ObjectId = require('mongodb').ObjectId;
const responseHandlier = require('../libs/response/status');
const commonVariable  = require('../libs/static/common.js');
const commonFunction = require('../libs/util/commonFunctions.js');
const investmentSectionItemModel = require("../models/investmentSectionItem-model.js")
const trackingModel = require('../models/tracking-model.js');


/**
 * @post
 * @param {*} req
 * @param {*} res
 * @returns to get all addState details in db
 */


module.exports.addHrInvestmentSectionItem = async(req,res)=>{
    try {
        let newInvestmentSectionItem = new investmentSectionItemModel({
            sectionId : req.body.sectionId,
            itemName :req.body.itemName,
            description : req.body.description,
            status: commonVariable.status.ACTIVE,
            createdBy: req.userId,
            createdOn: new Date(),

        })

        await newInvestmentSectionItem.save();
        let trackingId = newInvestmentSectionItem._id
            
        
        let trackingData ={
            trackingId : trackingId,
            module : 'Investment Section Item',
            mode :'add',
            postData : req.body,
            createdBy: req.userId,
            createdOn: new Date(),
        }
        trackingData.status = 'success',
        trackingData.message ="new investment Section Item added  successfully..";
        const newTrackingModel = new trackingModel(trackingData)
        newTrackingModel.save();
        responseHandlier,responseHandlier.successResponse(true,"investment Section Item inserted successfully",res)
    } catch (error) {
        console.error("error", error);
        responseHandlier.errorResponse(false, error, res);   
    }
}


module.exports.getHrInvestmentSectionItem = async (req, res) => {
    try {
      const filterObj = commonFunction.filterObject(req);
  
      const productVersionDetails = await investmentSectionItemModel.find(filterObj)
        .populate({
          path: 'sectionId',
          select: ['section'],
      })
        .select(commonVariable.unSelect.common)
        .exec();
  
        responseHandlier.successResponse(true, productVersionDetails, res);
    } catch (error) {
      console.log("error", error);
      responseHandlier.errorResponse(false, error, res);
    }
};

module.exports.updateHrInvestmentSectionItem= async function (req, res) {
    try {
        if (!req.body._id) {
            return responseHandlier.errorResponse(false, "investemntSectionItem _id is required.", res);
        }

        const investmentSectionItemId = {
            _id: req.body._id
        };

        let trackingData = {
            trackingId: investmentSectionItemId,
            module: 'Investment Section Item',
            mode: 'update',
            postData: req.body,
            createdBy: req.userId,
            createdOn: new Date(),
        };

        req.body.updatedBy = req.userId;
        req.body.updatedOn = new Date();
        const requestData = req.body;

        const updatedPositionDetails = await investmentSectionItemModel.findByIdAndUpdate(
            investmentSectionItemId,
            requestData,
            { new: true }
        );

        trackingData.status = 'success';
        trackingData.message = "investmentSectionItem updated successfully..";
        const newTrackingModel = new trackingModel(trackingData);
        await newTrackingModel.save();

        responseHandlier.successResponse(true, updatedPositionDetails, res);
    } catch (error) {
        console.log(error);
        responseHandlier.errorResponse(false, error, res);
    }
};

module.exports.deleteHrInvestemntSectionItem = async function (req, res) {
    try {
        if (!req.body._id || !Array.isArray(req.body._id)) {
            return responseHandlier.errorResponse(false, "investemntSectionItem _id array is required.", res);
        }

        const investmentSectionItemIds = req.body._id;

        let trackingData = {
            trackingId: investmentSectionItemIds,
            module: 'Investment Section Item',
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

        const updatedPositionDetails = await investmentSectionItemModel.updateMany(
            { _id: { $in: investmentSectionItemIds } },
            requestData,
            { new: true }
        );

        trackingData.status = 'success';
        trackingData.message = "investmentSectionItem Deleted successfully..";
        const newTrackingModel = new trackingModel(trackingData);
        await newTrackingModel.save();

        responseHandlier.successResponse(true, updatedPositionDetails, res);
    } catch (error) {
        console.log(error);
        responseHandlier.errorResponse(false, error, res);
    }
};


