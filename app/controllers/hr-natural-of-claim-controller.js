const ObjectId = require('mongodb').ObjectId;
const responseHandlier = require('../libs/response/status');
const commonVariable  = require('../libs/static/common');
const commonFunction = require('../libs/util/commonFunctions');
const naturalofclaim = require("../models/hr-natural-of-claim-model")
const tracking = require("../models/tracking-model")
/**
 * @POST
 * @param {*} req
 * @param {*} res
 * @returns to add addNaturalOfClaim details in db
 */

module.exports.addNaturalOfClaim= async (req, res) => {
    try {
        let newDepartment = new naturalofclaim({
            claimName: req.body.claimName,
            shortCode: req.body.shortCode,
            claimPercentage: req.body.claimPercentage,
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
            module : 'naturalofclaim',
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
        responseHandlier.errorResponse(false, error, res);
    }
};




/**
 * @GET
 * @param {*} req
 * @param {*} res
 * @returns to get all getAllNaturalOfClaim details in db
 */
module.exports.getAllNaturalOfClaim = async (req, res) => {
    try {
        const filterObj = commonFunction.filterObject(req);

        const employmentTypeDetails = await naturalofclaim.find(filterObj, commonVariable.unSelect.common);

        responseHandlier.successResponse(true, employmentTypeDetails, res);
    } catch (error) {
        responseHandlier.errorResponse(false, error, res);
    }
};



/**
 * @put
 * @param {*} req
 * @param {*} res
 * @returns to put all updateNaturalOfClaim details in db
 */

module.exports.updateNaturalOfClaim = async function (req, res) {
    try {
        if (!req.body._id) {
            return responseHandlier.errorResponse(false, " _id is required.", res);
        }

        const employmentTypeId = {
            _id: req.body._id
        };

        let trackingData = {
            trackingId: employmentTypeId,
            module: 'naturalofclaim',
            mode: 'update',
            postData: req.body,
            createdBy: req.userId,
            createdOn: new Date(),
        };

        req.body.updatedBy = req.userId;
        req.body.updatedOn = new Date();
        const requestData = req.body;

        const updatedPositionDetails = await naturalofclaim.findByIdAndUpdate(
            employmentTypeId,
            requestData,
            { new: true }
        );

        trackingData.status = 'success';
        trackingData.message = "employment type updated successfully..";
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
 * @returns to ddelete all deleteNaturalOfClaim details in db
 */
module.exports.deleteNaturalOfClaim = async function (req, res) {
    try {
        if (!req.body._id || !Array.isArray(req.body._id)) {
            return responseHandlier.errorResponse(false, " _id array is required.", res);
        }

        const employmentTypeIds = req.body._id;

        let trackingData = {
            trackingId: employmentTypeIds,
            module: 'naturalofclaim',
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

        const updatedPositionDetails = await naturalofclaim.updateMany(
            { _id: { $in: employmentTypeIds } },
            requestData,
            { new: true }
        );

        trackingData.status = 'success';
        trackingData.message = " deleted successfully..";
        const newTrackingModel = new tracking(trackingData);
        await newTrackingModel.save();

        responseHandlier.successResponse(true, updatedPositionDetails, res);
    } catch (error) {
        console.log(error);
        responseHandlier.errorResponse(false, error, res);
    }
};