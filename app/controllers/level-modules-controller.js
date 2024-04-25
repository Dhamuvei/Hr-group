const ObjectId = require('mongodb').ObjectId;
const responseHandlier = require('../libs/response/status');
const commonVariable = require('../libs/static/common.js');
const commonFunction = require('../libs/util/commonFunctions.js');
const leavelmodulesModel = require("../models/level-modules-model.js");
const trackingModel = require('../models/tracking-model.js');
const companyModel = require('../models/company-model');
const hierarchylevel = require("../models/hierarchylevel-model.js");


module.exports.addLevelModules = async (req, res) => {
    try {
        if (!req.body.companyId) {
            throw new Error('companyId is required in the request body');
        }

        const companyInfo = await companyModel.findById(req.body.companyId);

        if (!companyInfo) {
            throw new Error('Company not found with the given companyId');
        }

        let modules = [];

        for (const module of req.body.modules) {
            const moduleLevels = [];

            for (const moduleLevel of module.moduleLevel) {
                const getId = moduleLevel.levelId;
                const levelInfo = await hierarchylevel.findById(getId);

                if (levelInfo) {
                    let levelPosition = Array.isArray(levelInfo.levelPosition) ? levelInfo.levelPosition[0] : levelInfo.levelPosition;
                    moduleLevels.push({
                        levelId: getId,
                        levelName: levelInfo.levelName,
                        levelPosition: levelPosition
                    });
                } else {
                    return responseHandlier.errorResponse(false, `LevelId ${getId} does not exist`, res);
                }
            }

            modules.push({
                moduleName: module.moduleName,
                moduleLevel: moduleLevels
            });
        }

        let newRole = new leavelmodulesModel({
            companyId: req.body.companyId,
            companyName: companyInfo.companyName,
            modules: modules, // Corrected field name
            status: commonVariable.status.ACTIVE,
            createdBy: req.userId,
            createdOn: new Date(),
        });

        await newRole.save();
        let trackingId = newRole._id;

        let trackingData = {
            trackingId: trackingId,
            module: 'level modules',
            mode: 'add',
            postData: req.body,
            createdBy: req.userId,
            createdOn: new Date(),
            status: 'success',
            message: "Added successfully."
        };
        const newTrackingModel = new trackingModel(trackingData);
        await newTrackingModel.save();
        responseHandlier.successResponse(true, "Inserted successfully", res);
    } catch (error) {
        console.error("error", error);
        responseHandlier.errorResponse(false, error.message, res);
    }
};





module.exports.getLevelModules= async (req, res) => {
    try {

       const companyId = req.body.companyId;

        if (!companyId) {
            return responseHandlier.errorResponse(false, 'companyId is required in the payload', res);
        }

        let filterObj = commonFunction.filterObject(req);

        filterObj = { ...filterObj, companyId };

        const stateDetails = await leavelmodulesModel.find(filterObj, commonVariable.unSelect.common);

        responseHandlier.successResponse(true, stateDetails, res);
    } catch (error) {
        responseHandlier.errorResponse(false, error, res);
    }
};


module.exports.updateLevelModules = async function (req, res) {
    try {
        if (!req.body._id) {
            return responseHandlier.errorResponse(false, " _id is required.", res);
        }

        const levelModuleId = {
            _id: req.body._id
        };

        let trackingData = {
            trackingId: levelModuleId,
            module: 'level modules',
            mode: 'update',
            postData: req.body,
            createdBy: req.userId,
            createdOn: new Date(),
        };

        req.body.updatedBy = req.userId;
        req.body.updatedOn = new Date();
        const requestData = req.body;

        const updatedPositionDetails = await leavelmodulesModel.findByIdAndUpdate(
            levelModuleId,
            requestData,
            { new: true }
        );

        trackingData.status = 'success';
        trackingData.message = "updated successfully..";
        const newTrackingModel = new trackingModel(trackingData);
        await newTrackingModel.save();

        responseHandlier.successResponse(true, updatedPositionDetails, res);
    } catch (error) {
        console.log(error);
        responseHandlier.errorResponse(false, error, res);
    }
};



module.exports.deleteLevelModules= async function (req, res) {
    try {
        if (!req.body._id || !Array.isArray(req.body._id)) {
            return responseHandlier.errorResponse(false, "_id array is required.", res);
        }

        const roleIds = req.body._id;

        let trackingData = {
            trackingId: roleIds,
            module: 'level modules',
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

        const updatedPositionDetails = await leavelmodulesModel.updateMany(
            { _id: { $in: roleIds } },
            requestData,
            { new: true }
        );

        trackingData.status = 'success';
        trackingData.message = " deleted successfully..";
        const newTrackingModel = new trackingModel(trackingData);
        await newTrackingModel.save();

        responseHandlier.successResponse(true, updatedPositionDetails, res);
    } catch (error) {
        console.log(error);
        responseHandlier.errorResponse(false, error, res);
    }
};