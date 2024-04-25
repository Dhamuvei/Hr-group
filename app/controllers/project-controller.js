const ObjectId = require('mongodb').ObjectId;
const responseHandlier = require('../libs/response/status');
const commonVariable  = require('../libs/static/common.js');
const commonFunction = require('../libs/util/commonFunctions.js');
const projectModel = require("../models/project_model.js");
const trackingModel = require('../models/tracking-model.js');

/**
 * @post
 * @param {*} req
 * @param {*} res
 * @returns to get all addProject details in db
 */


module.exports.addHrProject = async(req,res) =>{
    try {
        let newProject = new projectModel({
            projectName : req.body.projectName,
            shortCode : req.body.shortCode,
            description : req.body.description,
            status : commonVariable.status.ACTIVE,
            createdBy : req.userId,
            createdOn : new Date(),
        })
        await newProject.save();

        let trackingId = newProject._id

        let trackingData ={
            trackingId : trackingId,
            module : 'project',
            mode : 'add',
            postData : req.body,
            createdBy: req.userId,
            createdOn: new Date(),
        }
        trackingData.status = 'success',
        trackingData.message ="new project added successfully..";
        const newTrackingModel = new trackingModel(trackingData)
        newTrackingModel.save();
        responseHandlier.successResponse(true,"successfully inserted..",res);
        
    } catch (error) {
        console.error("error", error);
        responseHandlier.errorResponse(false, error, res); 
    }
}

module.exports.getHrProject = async (req, res) => {
    try {
        const filterObj = commonFunction.filterObject(req);

        const projectDetails = await projectModel.find(filterObj, commonVariable.unSelect.common);

        responseHandlier.successResponse(true, projectDetails, res);
    } catch (error) {
        responseHandlier.errorResponse(false, error, res);
    }
};

module.exports.updateHrProject = async function (req, res) {
    try {
        if (!req.body._id) {
            return responseHandlier.errorResponse(false, "Project _id is required.", res);
        }

        const projectId = {
            _id: req.body._id
        };

        let trackingData = {
            trackingId: projectId,
            module: 'project',
            mode: 'update',
            postData: req.body,
            createdBy: req.userId,
            createdOn: new Date(),
        };

        req.body.updatedBy = req.userId;
        req.body.updatedOn = new Date();
        const requestData = req.body;

        const updatedPositionDetails = await projectModel.findByIdAndUpdate(
            projectId,
            requestData,
            { new: true }
        );

        trackingData.status = 'success';
        trackingData.message = "porject updated successfully..";
        const newTrackingModel = new trackingModel(trackingData);
        await newTrackingModel.save();

        responseHandlier.successResponse(true, updatedPositionDetails, res);
    } catch (error) {
        console.log(error);
        responseHandlier.errorResponse(false, error, res);
    }
};

module.exports.deleteHrProject = async function (req, res) {
    try {
        if (!req.body._id || !Array.isArray(req.body._id)) {
            return responseHandlier.errorResponse(false, "project _id array is required.", res);
        }

        const projectIds = req.body._id;

        let trackingData = {
            trackingId: projectIds,
            module: 'project',
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

        const updatedPositionDetails = await projectModel.updateMany(
            { _id: { $in: projectIds } },
            requestData,
            { new: true }
        );

        trackingData.status = 'success';
        trackingData.message = "project deleted successfully..";
        const newTrackingModel = new trackingModel(trackingData);
        await newTrackingModel.save();

        responseHandlier.successResponse(true, updatedPositionDetails, res);
    } catch (error) {
        console.log(error);
        responseHandlier.errorResponse(false, error, res);
    }
};
