const ObjectId = require('mongodb').ObjectId;
const responseHandlier = require('../libs/response/status');
const commonVariable  = require('../libs/static/common.js');
const commonFunction = require('../libs/util/commonFunctions.js');
const leavelapprovalsModel = require("../models/level-approval-setting-models.js")
const trackingModel = require('../models/tracking-model.js');
const hierarchylevel =require("../models/hierarchylevel-model.js")
const levelmodules =require("../models/level-modules-model.js")
const companyModel = require('../models/company-model')
const moduleModel = require("../models/module-setup-model.js")



module.exports.addLevelApprovals = async (req, res) => {
    try {
        if (!req.body.companyId) {
            return responseHandlier.errorResponse(false, 'Company is required', res);
        }

        const companyInfo = await companyModel.findById(req.body.companyId);

        if (!companyInfo) {
            return responseHandlier.errorResponse(false, 'Invalid Company', res);
        }

        let modulesArr = [];

        let moduleNames = [];

        for (const module of req.body.modules) {
            let levelModuleApprovalArr = [];

            for (const levelModuleApproval of module.levelModuleApproval) {
                levelModuleApprovalArr.push({
                    levelPosition: levelModuleApproval.levelPosition,
                    approvalStatus: levelModuleApproval.approvalStatus,
                    approvalRole: levelModuleApproval.approvalRole,
                    approvalEmployeesId: levelModuleApproval.approvalEmployeesId,
                    isDirectReporter: levelModuleApproval.isDirectReporter,
                    status: commonVariable.status.ACTIVE
                });
            }

            let moduleNames = []; 

                let moduleIdReq = module.moduleId;

                let moduleName = await moduleModel.findById(moduleIdReq);

                if (moduleName !== null) {
                    moduleNames.push(moduleName.moduleName); 
                } else {
                    console.log("Module not found for moduleId:", moduleIdReq);
                }
                let lastModuleName =  moduleNames.join(', ')


            modulesArr.push({
                moduleId: module.moduleId,
                moduleName: lastModuleName,
                levelModuleApproval: levelModuleApprovalArr,
                status: commonVariable.status.ACTIVE
            });
        }

        let leavelapprovalSettingArr = new leavelapprovalsModel({
            companyId: companyInfo._id,
            companyName: companyInfo.companyName,
            modules: modulesArr,
            status: commonVariable.status.ACTIVE,
            createdBy: req.userId,
            createdOn: new Date(),
        });
        
        let leavelapprovalSetting = await leavelapprovalSettingArr.save(); 

        if(leavelapprovalSetting) {
            const newTrackingModelArr = new trackingModel({
                trackingId: leavelapprovalSetting._id,
                module: 'level approval setting',
                mode: 'add',
                postData: req.body,
                createdBy: req.userId,
                createdOn: new Date(),
                status: 'success',
                message: "Added successfully."
            });
            
            let newTrackingModel = await newTrackingModelArr.save(); 
            
            responseHandlier.successResponse(true, "Inserted successfully", res);
        } else {
            responseHandlier.errorResponse(false, "Inserted Failed", res);
        }
    } catch (error) {
        console.log("error",error)
        responseHandlier.errorResponse(false, error, res);
    }
};


module.exports.getLevelApprovals= async (req, res) => {
    try {
        // const filterObj = commonFunction.filterObject(req);

        const companyId = req.body.companyId;

        if (companyId) {
            responseHandlier.errorResponse(false, "CompanyId is required in the request.", res);
            return;
        }

        const filterObj = { companyId, ...commonFunction.filterObject(req) };

        const stateDetails = await leavelapprovalsModel.find(filterObj, commonVariable.unSelect.common);

        responseHandlier.successResponse(true, stateDetails, res);
    } catch (error) {
        responseHandlier.errorResponse(false, error, res);
    }
};


module.exports.updateLevelApprovals = async function (req, res) {
    try {
        if (!req.body._id) {
            return responseHandlier.errorResponse(false, " _id is required.", res);
        }

        const roleId = {
            _id: req.body._id
        };

        let trackingData = {
            trackingId: roleId,
            module: 'level modules',
            mode: 'update',
            postData: req.body,
            createdBy: req.userId,
            createdOn: new Date(),
        };

        req.body.updatedBy = req.userId;
        req.body.updatedOn = new Date();
        const requestData = req.body;

        const updatedPositionDetails = await leavelapprovalsModel.findByIdAndUpdate(
            roleId,
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



module.exports.deleteLevelApprovals= async function (req, res) {
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

        const updatedPositionDetails = await leavelapprovalsModel.updateMany(
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