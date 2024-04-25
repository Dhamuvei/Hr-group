const ObjectId = require('mongodb').ObjectId;
const responseHandlier = require('../libs/response/status');
const commonVariable  = require('../libs/static/common');
const commonFunction = require('../libs/util/commonFunctions');
const shiftController = require("../models/shift-model");
const company = require("../models/company-model");
const project = require('../models/project_model');
const tracking = require("../models/tracking-model")
/**
 * @POST
 * @param {*} req
 * @param {*} res
 * @returns to add addHrDocument details in db
 */

module.exports.addShift = async (req, res) => {
    try {


        
        if (!req.body.companyId) {
            throw new Error('companyId is required in the request body');
        }

        const companyInfo = await company.findById(req.body.companyId);

    
        if (!companyInfo) {
            throw new Error('Company not found with the given companyId');
        }

        if(!req.body.projectId){
            throw new Error('projectId is Required ')
        }

        const projectInfo = await project.findById(req.body.projectId);

    
        

        let newShift = new shiftController({
            shiftName: req.body.shiftName,
            fromTiming: req.body.fromTiming,
            companyId: req.body.companyId,
            companyName : companyInfo.companyName,
            projectId: req.body.projectId,
            projectName : projectInfo.projectName,
            toTiming: req.body.toTiming,
            status: commonVariable.status.ACTIVE,
            insertedBy:   req.userId,
            updatedBy:   req.userId,
            insertedOn: new Date(),
            updatedOn: new Date(),
        });

        await newShift.save();

        let getShiftId = newShift._id

        let trackingData ={
            trackingId : getShiftId,
            module : 'shift',
            mode :'add',
            postData : req.body,
            createdBy:  req.userId,
            createdOn: new Date(),
        }
        trackingData.status = "success"
        trackingData.message ="insert successfully..";
        let newtrackingmodel = new tracking(trackingData)
        newtrackingmodel.save()

        responseHandlier.successResponse(true, 'Successfully Inserted', res);
    } catch (error) {
        console.error("error", error);
        responseHandlier.errorResponse(false, error, res);
    }
};




/**
 * @GET
 * @param {*} req
 * @param {*} res
 * @returns to get all getAllHrDocument details in db
 */
module.exports.getAllShift = async (req, res) => {
    try {
        const filterObj = commonFunction.filterObject(req);

        const shiftDetails = await shiftController.find(filterObj, commonVariable.unSelect.common);

        responseHandlier.successResponse(true, shiftDetails, res);
    } catch (error) {
        responseHandlier.errorResponse(false, error, res);
    }
};


/**
 * @put
 * @param {*} req
 * @param {*} res
 * @returns to put all updateHrDocument details in db
 */

module.exports.updateShift = async function (req, res) {
    try {
        if (!req.body._id) {
            return responseHandlier.errorResponse(false, " _id is required.", res);
        }

        const shiftId = {
            _id: req.body._id
        };

        let trackingData = {
            trackingId: shiftId,
            module: 'shift',
            mode: 'update',
            postData: req.body,
            createdBy: req.userId,
            createdOn: new Date(),
        };

        req.body.updatedBy = req.userId;
        req.body.updatedOn = new Date();
        const requestData = req.body;

        const updatedPositionDetails = await shiftController.findByIdAndUpdate(
            shiftId,
            requestData,
            { new: true }
        );

        trackingData.status = 'success';
        trackingData.message = " updated successfully..";
        const newTrackingModel = new tracking(trackingData);
        await newTrackingModel.save();

        responseHandlier.successResponse(true, updatedPositionDetails, res);
    } catch (error) {
        console.log(error);
        responseHandlier.errorResponse(false, error, res);
    }
};


/**
 * @delete
 * @param {*} req
 * @param {*} res
 * @returns to ddelete all deleteHrDocument details in db
 */

module.exports.deleteShift = async function (req, res) {
    try {
        if (!req.body._id || !Array.isArray(req.body._id)) {
            return responseHandlier.errorResponse(false, " _id array is required.", res);
        }

        const shiftIds = req.body._id;

        let trackingData = {
            trackingId: shiftIds,
            module: 'shift',
            mode: 'update',
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

        const updatedPositionDetails = await shiftController.updateMany(
            { _id: { $in: shiftIds } },
            requestData,
            { new: true }
        );

        trackingData.status = 'success';
        trackingData.message = " updated successfully..";
        const newTrackingModel = new tracking(trackingData);
        await newTrackingModel.save();

        responseHandlier.successResponse(true, updatedPositionDetails, res);
    } catch (error) {
        console.log(error);
        responseHandlier.errorResponse(false, error, res);
    }
};