const ObjectId = require('mongodb').ObjectId;
const responseHandlier = require('../libs/response/status');
const commonVariable  = require('../libs/static/common.js');
const commonFunction = require('../libs/util/commonFunctions.js');
const hierarchylevel = require("../models/hierarchylevel-model.js")
const trackingModel = require('../models/tracking-model.js');


/**
 * @post
 * @param {*} req
 * @param {*} res
 * @returns to get all addState details in db
 */


module.exports.addHierarchyLevel = async(req,res)=>{
    try {
        let newLanguage = new hierarchylevel({
            levelName: req.body.levelName,
            levelPosition: req.body.levelPosition,
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
        trackingData.message =" added  successfully..";
        const newTrackingModel = new trackingModel(trackingData)
        newTrackingModel.save();
        responseHandlier,responseHandlier.successResponse(true," inserted successfully",res)
    } catch (error) {
        console.error("error", error);
        responseHandlier.errorResponse(false, error, res);   
    }
}

module.exports.getAllHierarchyLevel = async (req, res) => {
    try {
        const filterObj = commonFunction.filterObject(req);

        const overtimeDetails = await hierarchylevel.find(filterObj, commonVariable.unSelect.common);

        responseHandlier.successResponse(true, overtimeDetails, res);
    } catch (error) {
        responseHandlier.errorResponse(false, error, res);
    }
};

