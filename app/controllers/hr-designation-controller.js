const ObjectId = require('mongodb').ObjectId;
const responseHandlier = require('../libs/response/status');
const commonVariable  = require('../libs/static/common');
const commonFunction = require('../libs/util/commonFunctions');
const Designation = require("../models/hr-designation-model")
const tracking = require("../models/tracking-model")
/**
 * @POST
 * @param {*} req
 * @param {*} res
 * @returns to add department details in db
 */

module.exports.addHrDesignation = async (req, res) => {
    try {
        let newDepartment = new Designation({
            designationName: req.body.designationName,
            departmentId: req.body.departmentId,
            shortCode: req.body.shortCode,
            description: req.body.description,
            status: commonVariable.status.ACTIVE,
            createdBy:   req.userId,
            createdOn: new Date(),
            updatedBy:   req.userId,
            updatedOn: new Date(),
        });

        await newDepartment.save();

        let getDesignationId = newDepartment._id

        let trackingData ={
            trackingId : getDesignationId,
            module : 'designation',
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
 * @returns to get all getAllHrDepartmen details in db
 */
module.exports.getAllHrDesignation = async (req, res) => {
    try {
        const filterObj = commonFunction.filterObject(req);

        const employmentTypeDetails = await Designation.find(filterObj, commonVariable.unSelect.common);

        responseHandlier.successResponse(true, employmentTypeDetails, res);
    } catch (error) {
        responseHandlier.errorResponse(false, error, res);
    }
};

module.exports.getAllHrDesignation = async (req, res) => {
    try {
        const filterObj = commonFunction.filterObject(req);

        const employmentTypeDetails = await Designation.find(filterObj)
            .populate({
                path: 'departmentId',
                select: 'departmentName'
            })
            .select(commonVariable.unSelect.common)
            .exec();

        responseHandlier.successResponse(true, employmentTypeDetails, res);
    } catch (error) {
        responseHandlier.errorResponse(false, error, res);
    }
};


/**
 * @put
 * @param {*} req
 * @param {*} res
 * @returns to put all updateHrDepartmen details in db
 */
module.exports.updateHrDesignation = async function (req, res) {
    try {
        if (!req.body._id) {
            return responseHandlier.errorResponse(false, " _id is required.", res);
        }

        const employmentTypeId = {
            _id: req.body._id
        };

        let trackingData = {
            trackingId: employmentTypeId,
            module: 'designation',
            mode: 'update',
            postData: req.body,
            createdBy: req.userId,
            createdOn: new Date(),
        };

        req.body.updatedBy = req.userId;
        req.body.updatedOn = new Date();
        const requestData = req.body;

        const updatedPositionDetails = await Designation.findByIdAndUpdate(
            employmentTypeId,
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
 * @returns to ddelete all deleteHrDepartmen details in db
 */
module.exports.deleteHrDesignation = async function (req, res) {
    try {
        if (!req.body._id || !Array.isArray(req.body._id)) {
            return responseHandlier.errorResponse(false, "employmentType _id array is required.", res);
        }

        const employmentTypeIds = req.body._id;

        let trackingData = {
            trackingId: employmentTypeIds,
            module: 'designation',
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

        const updatedPositionDetails = await Designation.updateMany(
            { _id: { $in: employmentTypeIds } },
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