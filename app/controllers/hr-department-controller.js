const ObjectId = require('mongodb').ObjectId;
const responseHandlier = require('../libs/response/status');
const commonVariable  = require('../libs/static/common');
const commonFunction = require('../libs/util/commonFunctions');
const department = require("../models/hr-department-model")
const tracking = require("../models/tracking-model")
/**
 * @POST
 * @param {*} req
 * @param {*} res
 * @returns to add department details in db
 */

module.exports.addHrDepartment = async (req, res) => {
    try {
        let newDepartment = new department({
            departmentName: req.body.departmentName,
            shortCode: req.body.shortCode,
            description: req.body.description,
            status: commonVariable.status.ACTIVE,
            createdBy:   (req.userId),
            createdOn: new Date(),
            updatedBy:   req.userId,
            updatedOn: new Date(),
        });

        await newDepartment.save();

        let getDeparmentId = newDepartment._id

        let trackingData ={
            trackingId : getDeparmentId,
            module : 'department',
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

module.exports.getAllHrDepartment = async (req, res) => {
    try {
        const filterObj = commonFunction.filterObject(req);

        const employmentTypeDetails = await department.find(filterObj, commonVariable.unSelect.common);

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
module.exports.updateHrDepartment = async function (req, res) {
    try {
        if (!req.body._id) {
            return responseHandlier.errorResponse(false, "employmentType _id is required.", res);
        }

        const employmentTypeId = {
            _id: req.body._id
        };

        let trackingData = {
            trackingId: employmentTypeId,
            module: 'department',
            mode: 'update',
            postData: req.body,
            createdBy: req.userId,
            createdOn: new Date(),
        };

        req.body.updatedBy = req.userId;
        req.body.updatedOn = new Date();
        const requestData = req.body;

        const updatedPositionDetails = await department.findByIdAndUpdate(
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

module.exports.deleteHrDepartment = async function (req, res) {
    try {
        if (!req.body._id || !Array.isArray(req.body._id)) {
            return responseHandlier.errorResponse(false, "department _id array is required.", res);
        }

        const departmentIds = req.body._id;

        let trackingData = {
            trackingId: departmentIds,
            module: 'department',
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

        const updatedPositionDetails = await department.updateMany(
            { _id: { $in: departmentIds } },
            requestData,
            { new: true }
        );

        trackingData.status = 'success';
        trackingData.message = "department  deleted successfully..";
        const newTrackingModel = new tracking(trackingData);
        await newTrackingModel.save();

        responseHandlier.successResponse(true, updatedPositionDetails, res);
    } catch (error) {
        console.log(error);
        responseHandlier.errorResponse(false, error, res);
    }
};