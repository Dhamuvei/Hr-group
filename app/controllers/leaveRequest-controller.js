const ObjectId = require('mongodb').ObjectId;
const employeeModel =require('../models/employee-model.js')
const responseHandlier = require('../libs/response/status');
const commonVariable  = require('../libs/static/common.js');
const commonFunction = require('../libs/util/commonFunctions.js');
const trackingModel = require('../models/tracking-model.js');
const leaveRequestModel = require('../models/leaveRequest-model.js');
const approvalSettingModel = require("../models/level-approval-setting-models.js")
const empProfile =require("../models/employee-model.js")
const userModel = require("../models/user-model.js")


module.exports.addLeaveRequest = async (req, res) => {
    try {        
        let leaveApproval = {};
        const empId = req.employeeId;

        const empDetail = await employeeModel.findOne({ _id: new ObjectId(empId), status: 1 });

        const empbranch = empDetail?.branchId
        const empcompany = empDetail ? empDetail.companyId : null;
        const getreportingtoId = empDetail ? empDetail.reportingToId : null;

        const companyId = empcompany ? empcompany.toString() : null;
        const levelModuleApprovalDetail = companyId ? await approvalSettingModel.find({ companyId: new ObjectId(companyId), status: 1 }) : null;
      
        if (levelModuleApprovalDetail) {
            for (const approvalDetail of levelModuleApprovalDetail) {
                const modules = approvalDetail.modules; 
                if (modules) {
                    for (const module of modules) { 
                        if (module.moduleName == 'Leave') {
                            leaveApproval = module.levelModuleApproval;
                        }
                    }
                }
            }
        }

        // console.log("leaveApproval",leaveApproval)



        let matchedApproval = leaveApproval;
        if (Array.isArray(leaveApproval)) {
            for (const approval of leaveApproval) {
                if (approval.levelPosition === 1 && req.body.isDirectReporter === true) {
                    matchedApproval = approval;
                    break;
                }
            }
        }

         
        // Check if employee exists
        const employeeDetails = await employeeModel.findById(req.body.employeeId);
        if (!employeeDetails) {
            return responseHandlier.errorResponse(false, 'Employee not found', res);
        }

        // Construct employeeName
        const { firstName, lastName } = employeeDetails;
        const employeeName = `${firstName} ${lastName}`;

        // Generate request number
        const lrCount = await leaveRequestModel.countDocuments();
         
        const startNumber = 10000;
        
        const lrInc = lrCount + startNumber;
        const requestNo = `LR-${lrInc}`;
          

        if (req.body.isDirectReporter === true) {
            let newLeaveRequests = new leaveRequestModel({
                employeeId: req.body.employeeId,
                employeeName: employeeName,
                companyId :empcompany ,
                branchId : empbranch,
                requestNo: requestNo,
                reportingToId :getreportingtoId,
                levelModuleApproval: matchedApproval, 
                requestDate: req.body.requestDate,
                fromDate: req.body.fromDate,
                toDate: req.body.toDate,
                leaveType: req.body.leaveType,
                leaveTypeName: req.body.leaveTypeName,
                fromOption: req.body.fromOption,
                toOption: req.body.toOption,
                numberOfDays: req.body.numberOfDays,
                uploadDocument: req.body.uploadDocument,
                reason: req.body.reason,
                status: commonVariable.status.ACTIVE,
                createdBy: req.userId,
                createdOn: new Date()
            });
            
            // Save new leave request
            await newLeaveRequests.save();
    
            // Log tracking data
            let trackingDatas = {
                trackingId: newLeaveRequests._id,
                module: 'Leave Request',
                mode: 'add',
                postData: req.body,
                createdBy: req.userId,
                createdOn: new Date(),
                status: "success",
                message: "Inserted successfully."
            };
            let newtrackingmodels = new trackingModel(trackingDatas);
            await newtrackingmodels.save();

        }else {
            
        // Create new leave request object
        let newLeaveRequest = new leaveRequestModel({
            employeeId: req.body.employeeId,
            employeeName: employeeName,
            companyId :empcompany ,
            branchId : empbranch,
            requestNo: requestNo,
            levelModuleApproval: leaveApproval, 
            requestDate: req.body.requestDate,
            fromDate: req.body.fromDate,
            toDate: req.body.toDate,
            leaveType: req.body.leaveType,
            leaveTypeName: req.body.leaveTypeName,
            fromOption: req.body.fromOption,
            toOption: req.body.toOption,
            numberOfDays: req.body.numberOfDays,
            uploadDocument: req.body.uploadDocument,
            reason: req.body.reason,
            status: commonVariable.status.ACTIVE,
            createdBy: req.userId,
            createdOn: new Date()
        });

        // Save new leave request
        await newLeaveRequest.save();

        // Log tracking data
        let trackingData = {
            trackingId: newLeaveRequest._id,
            module: 'Leave Request',
            mode: 'add',
            postData: req.body,
            createdBy: req.userId,
            createdOn: new Date(),
            status: "success",
            message: "Inserted successfully."
        };
        let newtrackingmodel = new trackingModel(trackingData);
        await newtrackingmodel.save();

        }

        // Send success response
        responseHandlier.successResponse(true, 'Successfully Inserted', res);
    } catch (error) {
        console.error("error", error);
        responseHandlier.errorResponse(false, error, res);
    }
};


module.exports.getLeaveRequest = async (req, res) => {
    try {
        const filterObj = commonFunction.filterObject(req);

        const leaveRequestDetails = await leaveRequestModel
            .find(filterObj, commonVariable.unSelect.common)
            .populate('levelModuleApproval.approvalRole', 'name'); 

        responseHandlier.successResponse(true, leaveRequestDetails, res);
    } catch (error) {
        console.log("error",error)
        responseHandlier.errorResponse(false, error, res);
    }
};


module.exports.updateLeaveRequest = async function (req, res) {
    try {
        if (!req.body._id) {
            return responseHandlier.errorResponse(false, "calendar _id is required.", res);
        }

        const leaveRequestId = {
            _id: req.body._id
        };

        let trackingData = {
            trackingId: leaveRequestId,
            module: 'Leave Request',
            mode: 'update',
            postData: req.body,
            createdBy: req.userId,
            createdOn: new Date(),
        };

        req.body.updatedBy = req.userId;
        req.body.updatedOn = new Date();
        const requestData = req.body;

        const updatedPositionDetails = await leaveRequestModel.findByIdAndUpdate(
            leaveRequestId,
            requestData,
            { new: true }
        );

        trackingData.status = 'success';
        trackingData.message = "leaveRequest updated successfully..";
        const newTrackingModel = new trackingModel(trackingData);
        await newTrackingModel.save();

        responseHandlier.successResponse(true, updatedPositionDetails, res);
    } catch (error) {
        console.log(error);
        responseHandlier.errorResponse(false, error, res);
    }
};


module.exports.deleteLeaveRequest = async function (req, res) {
    try {
        if (!req.body._id || !Array.isArray(req.body._id)) {
            return responseHandlier.errorResponse(false, "calendar _id array is required.", res);
        }

        const leaveRequestIds = req.body._id;

        let trackingData = {
            trackingId: leaveRequestIds,
            module: 'Leave Request',
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

        const updatedPositionDetails = await leaveRequestModel.updateMany(
            { _id: { $in: leaveRequestIds } },
            requestData,
            { new: true }
        );

        trackingData.status = 'success';
        trackingData.message = "leaveRequest deleted successfully..";
        const newTrackingModel = new trackingModel(trackingData);
        await newTrackingModel.save();

        responseHandlier.successResponse(true, updatedPositionDetails, res);
    } catch (error) {
        console.log(error);
        responseHandlier.errorResponse(false, error, res);
    }
};


module.exports.leaveRequestList = async (req, res) => {
    try {
        const filterObj = commonFunction.filterObject(req);

        const stateDetails = await leaveRequestModel
            .find(filterObj, commonVariable.unSelect.common)
            .sort({ _id: -1 });

        responseHandlier.successResponse(true, stateDetails, res);
    } catch (error) {
        responseHandlier.errorResponse(false, error, res);
    }
};


module.exports.leaveGetEmployee = async (req, res) => {
    try {
        let filterObj = commonFunction.filterObject(req); 

        const departmentId = req.body.departmentId;
        const projectId = req.body.projectId;

        if (!departmentId) {
            return responseHandlier.errorResponse(false, 'departmentId is required in the payload', res);
        }

        filterObj = { ...filterObj, departmentId }; 

        if (projectId) {
            filterObj.projectId = projectId;
        }

        const stateDetails = await empProfile.find(filterObj)
            .select('empCode firstName lastName departmentId projectId')
            .populate('departmentId', 'departmentName')
            .populate('projectId', 'projectName');

        responseHandlier.successResponse(true, stateDetails, res);
    } catch (error) {
        console.log("error",error)
        responseHandlier.errorResponse(false, error, res);
    }
};



module.exports.getApplyLeaveRequest = async (req, res) => {
    try {
        const empId = req.employeeId;
        const userId = req.userId;

        const userDetail = await userModel.findOne({ _id: new ObjectId(userId) });
        if (!userDetail) {
            return responseHandlier.errorResponse(false, 'User not found', res); 
        }

        const userCompany = userDetail.companyId;
        const userBranch = userDetail.branchId;
        const userRole = userDetail.roleId;

        const companyIdMatches = userCompany.map(company => company.toString());
        const branchIdMatches = userBranch.map(branch => branch.toString());

        const leaveRequestDetail = await leaveRequestModel.find({
            companyId: { $in: companyIdMatches },
            branchId: { $in: branchIdMatches },
            'levelModuleApproval.approvalRole': userRole,
            status: commonVariable.status.ACTIVE
        });
        
        // console.log("leaveRequestDetail", leaveRequestDetail);
        let leaveRequestArr = [];
        let isUpdated = 0; 

        if (leaveRequestDetail.length > 0) {
            let i = 0;
            for (const levelApproval of leaveRequestDetail) {
                let approvalArray = levelApproval.levelModuleApproval;
                const lastApprovalIndex = approvalArray.length - 2; 
                const lastApproval = approvalArray[lastApprovalIndex];
                if (approvalArray.length > 0) {
                    for (const approvalItem of approvalArray) {
                        let approvalRoleIds = approvalItem.approvalRole;
                    
                        if (approvalRoleIds !== undefined) {
                            let rrrnnam = userRole.toString();
                            let approvalRoleString = approvalRoleIds.toString();
                    
                            if (rrrnnam === approvalRoleString) {
                                if (approvalItem.approvalStatus == 'Pending') {
                                    if (approvalItem.levelPosition > 0) {
                                        if (lastApproval && lastApproval.approvalStatus === 'Approved') {
                                            isUpdated = 1;
                                        }
                                    } else {
                                        isUpdated = 0;
                                    }
                                }
                            }
                            
                        }
                    }
                    
                }
        
                i++;
                leaveRequestArr.push({
                    _id: levelApproval._id,
                    employeeId: levelApproval.employeeId,
                    companyId: levelApproval.companyId,
                    branchId: levelApproval.branchId,
                    employeeName: levelApproval.employeeName,
                    requestNo: levelApproval.requestNo,
                    requestDate: levelApproval.requestDate,
                    fromDate: levelApproval.fromDate,
                    toDate: levelApproval.toDate,
                    leaveType: levelApproval.leaveType,
                    leaveTypeName: levelApproval.leaveTypeName,
                    fromOption: levelApproval.fromOption,
                    toOption: levelApproval.toOption,
                    numberOfDays: levelApproval.numberOfDays,
                    uploadDocument: levelApproval.uploadDocument,
                    reason: levelApproval.reason,
                    approvalStatus: levelApproval.approvalStatus,
                    status: levelApproval.status,
                    createdBy: levelApproval.createdBy,
                    createdOn: levelApproval.createdOn,
                    createdAt: levelApproval.createdAt,
                    updatedAt: levelApproval.updatedAt,
                    isUpdated: isUpdated
                });
            }
        }
                
        responseHandlier.successResponse(true, leaveRequestArr, res);

    } catch (error) {
        console.log("error", error);
        responseHandlier.errorResponse(false, error.message || 'Something went wrong', res);
    }
};



module.exports.updateLeaveApproval = async (req, res) => {
    try {
        let inputArr = req.body;

        // Extract payload data
        let { levelPosition, leaveRequsetId, isDirectReporter, approvalStatus, reason } = inputArr;

        const leaveRequestDetail = await leaveRequestModel.findOne({
            _id: new ObjectId(leaveRequsetId),
            approvalStatus: 'Pending',
            status: 1
        });

        if(!leaveRequestDetail) {
            return responseHandlier.errorResponse(false, 'Invalid Leave Id', res);
        }

        let levelModuleApproval = leaveRequestDetail.levelModuleApproval;
        let levelModuleApprovalLength = levelModuleApproval.length;
        if(levelModuleApprovalLength > 0) {
            if(levelPosition > 1) {
                let checkLevelPosition = parseInt(levelPosition) - parseInt(2);
                console.log(checkLevelPosition);
                console.log(levelModuleApproval[checkLevelPosition]);
                let checkApprovalStatus = levelModuleApproval[checkLevelPosition].approvalStatus;
                if(checkApprovalStatus != 'Approved') {
                    return responseHandlier.errorResponse(false, 'Invalid Request', res);
                }
            }

            await leaveRequestModel.updateOne(
                { _id: leaveRequsetId, "levelModuleApproval.levelPosition": levelPosition },
                { $set: {
                    'levelModuleApproval.$.approvalStatus': approvalStatus,
                    'levelModuleApproval.$.reason': reason,
                }}
            );

            if(approvalStatus == 'Approved' && levelModuleApprovalLength == levelPosition) {
                await leaveRequestModel.updateOne(
                    { _id: leaveRequsetId, "levelModuleApproval.levelPosition": levelPosition },
                    { $set: {
                        'approvalStatus': approvalStatus,
                        'reason': reason,
                    }}
                );
            }
        }

/*
     // Define updateObject
        const updateObject = {};

        // first level approval status "Approved" or "Rejected"
        if (approvalStatus === "Approved") {
            // Update isDirectReporter and approvalStatus
            updateObject["levelModuleApproval.$.isDirectReporter"] = isDirectReporter;
            updateObject["levelModuleApproval.$.approvalStatus"] = "Approved";
        } else if (approvalStatus === "Rejected") {
            // Update isDirectReporter, approvalStatus, and reason
            updateObject["levelModuleApproval.$.isDirectReporter"] = isDirectReporter;
            updateObject["levelModuleApproval.$.approvalStatus"] = "Rejected";
            updateObject["levelModuleApproval.$.reason"] = reason;
        }

        // Update document using $set operator
        await leaveRequestModel.updateOne(
            { _id: leaveRequsetId, status: 1, "levelModuleApproval.levelPosition": levelPosition },
            { $set: updateObject }
        );

        // secound level approval 
        if (levelPosition === 2) {

            const docWithRejectedStatus = await leaveRequestModel.findOne({
                _id: leaveRequsetId,
                status: 1,
                "levelModuleApproval.levelPosition": 1,
                "levelModuleApproval.approvalStatus": "Rejected"
            });

            if (! docWithRejectedStatus) {
                console.log("Cannot update approvalStatus for levelPosition 2. ApprovalStatus for levelPosition 1 is not approved or it's rejected.");
                responseHandlier.errorResponse(false, "ApprovalStatus for levelPosition 1 is not approved or it's rejected.", res);
                return;
            }


            // Define updateObject
            const updateObject = {};

            if (approvalStatus === "Approved") {
                updateObject["levelModuleApproval.$.approvalStatus"] = "Approved";
            } else if (approvalStatus === "Rejected") {
                // Update approvalStatus, and reason
                updateObject["levelModuleApproval.$.approvalStatus"] = "Rejected";
                updateObject["levelModuleApproval.$.reason"] = reason;
            }
    
            // Update document using $set operator
            await leaveRequestModel.updateOne(
                { _id: leaveRequsetId, status: 1, "levelModuleApproval.levelPosition": levelPosition },
                { $set: updateObject }
            );

        }

        // Third level approval 
        if (levelPosition === 3) {

            const docWithRejectedStatus = await leaveRequestModel.findOne({
                _id: leaveRequsetId,
                status: 1,
                "levelModuleApproval.levelPosition": 1,
                "levelModuleApproval.approvalStatus": "Rejected"
            });
            

            if (!docWithRejectedStatus) {
                responseHandlier.errorResponse(false, "ApprovalStatus for levelPosition 1 is  it's rejected.", res);
                return;
            }

            const updateObject = {};

            if (approvalStatus === "Approved") {
                updateObject["levelModuleApproval.$.approvalStatus"] = "Approved";
            } else if (approvalStatus === "Rejected") {
                // Update approvalStatus, and reason
                // updateObject["levelModuleApproval.$.isDirectReporter"] = isDirectReporter;
                updateObject["levelModuleApproval.$.approvalStatus"] = "Rejected";
                updateObject["levelModuleApproval.$.reason"] = reason;
            }
    
            // Update document using $set operator
            await leaveRequestModel.updateOne(
                { _id: leaveRequsetId, status: 1, "levelModuleApproval.levelPosition": levelPosition },
                { $set: updateObject }
            );

        }
        */
        const updatedDocument = await leaveRequestModel.findOne({ _id: leaveRequsetId });
        responseHandlier.successResponse(true, updatedDocument, res);

    } catch (error) {
        console.log("error",error)
        responseHandlier.errorResponse(false, error, res);
    }
};