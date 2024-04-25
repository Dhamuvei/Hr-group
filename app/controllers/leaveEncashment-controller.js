const employeeModel =require('../models/employee-model.js')
const responseHandlier = require('../libs/response/status');
const commonVariable  = require('../libs/static/common.js');
const commonFunction = require('../libs/util/commonFunctions.js');
const trackingModel = require('../models/tracking-model.js');
const leaveEncashment = require('../models/leaveEncashment-model.js');
const approvalSettingModel = require("../models/level-approval-setting-models.js")
const userModel = require("../models/user-model.js")
const ObjectId = require('mongodb').ObjectId;


module.exports.addLeaveEncashment = async (req, res) => {
    try {

        let leaveApproval = {};
        const empId = req.employeeId;

        const empDetail = await employeeModel.findOne({ _id: new ObjectId(empId), status: 1 });

        const empbranch = empDetail?.branchId
        const empcompany = empDetail ? empDetail.companyId : null;
        const getreportingtoId = empDetail ? empDetail.reportingToId : null;

        const companyId = empcompany ? empcompany.toString() : null;
        const levelModuleApprovalDetail = companyId ? await approvalSettingModel.find({ companyId: new ObjectId(companyId), status: 1 }) : null;
        // console.log("levelModuleApprovalDetail",levelModuleApprovalDetail)

        if (levelModuleApprovalDetail) {
            for (const approvalDetail of levelModuleApprovalDetail) {
                const modules = approvalDetail.modules; 
                if (modules) {
                    for (const module of modules) { 
                        if (module.moduleName == 'leaveEncashment') {
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
      
        const employeeDetails = await employeeModel.findById(req.body.employeeId);
        if (!employeeDetails) {
            return responseHandlier.errorResponse(false, 'Employee not found', res);
        }

        const { firstName, lastName } = employeeDetails;
        const employeeName = `${firstName} ${lastName}`;

        const lrCount = await leaveEncashment.countDocuments();
         
        const startNumber = 10000;
        
        const lrInc = lrCount + startNumber;
        const encashmentRequestNo = `LER-${lrInc}`;


        if (req.body.isDirectReporter === true) {
            let newLeaveEncashment = new leaveEncashment({
                encashmentRequestNo: encashmentRequestNo,
                employeeId: req.body.employeeId,
                employeeName: employeeName ,
                dayCount: req.body.dayCount,
                companyId :empcompany ,
                branchId : empbranch,
                reportingToId :getreportingtoId,
                levelModuleApproval: matchedApproval, 
                grossSalary: req.body.grossSalary,  
                encashmentAmount: req.body.encashmentAmount,
                isAmountPartOfNetPay: req.body.isAmountPartOfNetPay,
                status: commonVariable.status.ACTIVE,
                createdBy: req.userId,
                createdOn: new Date()
            });
    
            await newLeaveEncashment.save();
    
            let encashmentId = newLeaveEncashment._id;
    
            let trackingData = {
                trackingId: encashmentId,
                module: 'Leave Encashment',
                mode: 'add',
                postData: req.body,
                createdBy: req.userId,
                createdOn: new Date(),
            };
            trackingData.status = "success";
            trackingData.message = "insert successfully..";
            let newtrackingmodel = new trackingModel(trackingData);
            newtrackingmodel.save();
        }else{
            let newLeaveEncashment = new leaveEncashment({
                encashmentRequestNo: encashmentRequestNo,
                employeeId: req.body.employeeId,
                employeeName: employeeName,
                companyId :empcompany ,
                branchId : empbranch,
                levelModuleApproval: leaveApproval, 
                dayCount: req.body.dayCount,
                grossSalary: req.body.grossSalary,  
                encashmentAmount: req.body.encashmentAmount,
                isAmountPartOfNetPay: req.body.isAmountPartOfNetPay,
                status: commonVariable.status.ACTIVE,
                createdBy: req.userId,
                createdOn: new Date()
            });
    
            await newLeaveEncashment.save();
    
            let encashmentId = newLeaveEncashment._id;
    
            let trackingData = {
                trackingId: encashmentId,
                module: 'Leave Encashment',
                mode: 'add',
                postData: req.body,
                createdBy: req.userId,
                createdOn: new Date(),
            };
            trackingData.status = "success";
            trackingData.message = "insert successfully..";
            let newtrackingmodel = new trackingModel(trackingData);
            newtrackingmodel.save();

        }

        responseHandlier.successResponse(true, 'Successfully Inserted', res);
    } catch (error) {
        console.error("error", error);
        responseHandlier.errorResponse(false, error, res);
    }
};


module.exports.getLeaveEncashment = async (req, res) => {
    try {
        const filterObj = commonFunction.filterObject(req);

        const encahsmentDetails = await leaveEncashment.find(filterObj, commonVariable.unSelect.common);

        responseHandlier.successResponse(true, encahsmentDetails, res);
    } catch (error) {
        responseHandlier.errorResponse(false, error, res);
    }
};


module.exports.updateLeaveEncashment = async function (req, res) {
    try {
        if (!req.body._id) {
            return responseHandlier.errorResponse(false, "encashment _id is required.", res);
        }

        const encashmentId = {
            _id: req.body._id
        };

        let trackingData = {
            trackingId: encashmentId,
            module: 'Leave Encashment',
            mode: 'update',
            postData: req.body,
            createdBy: req.userId,
            createdOn: new Date(),
        };

        req.body.updatedBy = req.userId;
        req.body.updatedOn = new Date();
        const requestData = req.body;

        const updatedPositionDetails = await leaveEncashment.findByIdAndUpdate(
            encashmentId,
            requestData,
            { new: true }
        );

        trackingData.status = 'success';
        trackingData.message = "leaveEncashment updated successfully..";
        const newTrackingModel = new trackingModel(trackingData);
        await newTrackingModel.save();

        responseHandlier.successResponse(true, updatedPositionDetails, res);
    } catch (error) {
        console.log(error);
        responseHandlier.errorResponse(false, error, res);
    }
};

module.exports.deleteLeaveEncashment = async function (req, res) {
    try {
        if (!req.body._id || !Array.isArray(req.body._id)) {
            return responseHandlier.errorResponse(false, "encashment _id array is required.", res);
        }

        const encashmentIds = req.body._id;

        let trackingData = {
            trackingId: encashmentIds,
            module: 'Leave Encashment',
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

        const updatedPositionDetails = await leaveEncashment.updateMany(
            { _id: { $in: encashmentIds } },
            requestData,
            { new: true }
        );

        trackingData.status = 'success';
        trackingData.message = "leaveEncashment deleted successfully..";
        const newTrackingModel = new trackingModel(trackingData);
        await newTrackingModel.save();

        responseHandlier.successResponse(true, updatedPositionDetails, res);
    } catch (error) {
        console.log(error);
        responseHandlier.errorResponse(false, error, res);
    }
};


module.exports.leaveEncashmentRequestList = async (req, res) => {
    try {
        const filterObj = commonFunction.filterObject(req);

        const stateDetails = await leaveEncashment
            .find(filterObj, commonVariable.unSelect.common)
            .sort({ _id: -1 });

        responseHandlier.successResponse(true, stateDetails, res);
    } catch (error) {
        responseHandlier.errorResponse(false, error, res);
    }
};



module.exports.leaveEncashmentGetEmployee = async (req, res) => {
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

        const stateDetails = await employeeModel.find(filterObj)
            .select('empCode firstName lastName departmentId projectId')
            .populate('departmentId', 'departmentName')
            .populate('projectId', 'projectName');

        responseHandlier.successResponse(true, stateDetails, res);
    } catch (error) {
        console.log("error",error)
        responseHandlier.errorResponse(false, error, res);
    }
};


module.exports.getApplyLeaveEncashmentRequest = async (req, res) => {
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
        console.log("userRole",userRole)

        const companyIdMatches = userCompany.map(company => company.toString());
        const branchIdMatches = userBranch.map(branch => branch.toString());

        const leaveRequestDetail = await leaveEncashment.find({
            companyId: { $in: companyIdMatches },
            branchId: { $in: branchIdMatches },
            'levelModuleApproval.approvalRole': userRole,
            status: commonVariable.status.ACTIVE
        });
        // console.log("leaveRequestDetail",leaveRequestDetail)

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
                    encashmentRequestNo: levelApproval.encashmentRequestNo,
                    employeeId: levelApproval.employeeId,
                    employeeName: levelApproval.employeeName,
                    companyId: levelApproval.companyId,
                    branchId: levelApproval.branchId,
                    dayCount: levelApproval.dayCount,
                    grossSalary: levelApproval.grossSalary,
                    encashmentAmount: levelApproval.encashmentAmount,
                    isAmountPartOfNetPay: levelApproval.isAmountPartOfNetPay,
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



module.exports.updateLeaveEncashmentApproval = async (req, res) => {
    try {
        let inputArr = req.body;

        // Extract payload data
        let { levelPosition, leaveEncashmentId, isDirectReporter, approvalStatus, reason } = inputArr;
         console.log("leaveEncashmentId",leaveEncashmentId)

        const leaveRequestDetail = await leaveEncashment.findOne({
            _id: new ObjectId(leaveEncashmentId),
            leaveEncashmentStatus: 'Pending',
            status: 1
        });
        // console.log("leaveRequestDetail",leaveRequestDetail)

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

            await leaveEncashment.updateOne(
                { _id: leaveEncashmentId, "levelModuleApproval.levelPosition": levelPosition },
                { $set: {
                    'levelModuleApproval.$.approvalStatus': approvalStatus,
                    'levelModuleApproval.$.reason': reason,
                }}
            );

            if(approvalStatus == 'Approved' && levelModuleApprovalLength == levelPosition) {
                await leaveEncashment.updateOne(
                    { _id: leaveEncashmentId, "levelModuleApproval.levelPosition": levelPosition },
                    { $set: {
                        'approvalStatus': approvalStatus,
                        'reason': reason,
                    }}
                );
            }
        }

        const updatedDocument = await leaveEncashment.findOne({ _id: leaveEncashmentId });
        responseHandlier.successResponse(true, updatedDocument, res);

    } catch (error) {
        console.log("error",error)
        responseHandlier.errorResponse(false, error, res);
    }
};