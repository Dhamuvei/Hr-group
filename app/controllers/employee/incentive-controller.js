const ObjectId = require('mongodb').ObjectId;
const responseHandlier = require('../../libs/response/status.js');
const commonVariable  = require('../../libs/static/common.js');
const commonFunction = require('../../libs/util/commonFunctions.js');
const incentiveModel = require("../../models/employee/incentive-model.js")
const trackingModel = require('../../models/tracking-model.js');
const employee = require("../../models/employee-model.js")
const department = require("../../models/hr-department-model.js")
const project   =require("../../models/project_model.js")
const approvalSettingModel = require("../../models/level-approval-setting-models.js")
const empProfile =require("../../models/employee-model.js")
const userModel = require("../../models/user-model.js")


module.exports.addIncentive= async(req,res)=>{
    try {
         
        let incentiveArr = [];

        if (req.body.isIncludePayslip && (!req.body.payslipIncludeMonth || !req.body.payslipIncludeYear)) {
            return responseHandlier.errorResponse(false, "If isIncludePayslip is true, payslipIncludeMonth and payslipIncludeYear are mandatory", res);
        }

        for (const incentiveDetails of req.body.incentiveDetails) {
            const getEmpId = incentiveDetails.employeeId;
            const getDepId = incentiveDetails.departmentId;
            const getProId = incentiveDetails.projectId;
        
            const [empInfo, depInfo, proInfo] = await Promise.all([
                employee.findById(getEmpId),
                department.findById(getDepId),
                project.findById(getProId)
            ]);
        
            if (depInfo !== undefined && proInfo !== undefined) {
                let empFirst = empInfo ? empInfo.firstName : "";
                let empLast = empInfo ? empInfo.lastName : "";
                let fullName = empFirst + " " + empLast;
                
                let projectName = proInfo ? proInfo.projectName : "";
                let departmentName = depInfo ? depInfo.departmentName : "";
                let employeeCode = empInfo ? empInfo.empCode : "";
                
                incentiveArr.push({
                    employeeId: getEmpId,
                    employeename: fullName,
                    employeeCode: employeeCode,
                    departmentId: getDepId,
                    projectId: getProId,
                    projectName: projectName,
                    departmentName: departmentName,
                    incentiveamount: incentiveDetails.incentiveamount,
                    status: commonVariable.status.ACTIVE,
                    createdBy: req.userId,
                    createdOn: new Date()
                });
            } else {
                return responseHandlier.errorResponse(false, "Please check some IDs are missing", res);
            }
        }

        let leaveApproval = {};
        const empId = req.employeeId;

        const empDetail = await employee.findOne({ _id: new ObjectId(empId), status: 1 });

        const empbranch = empDetail ? empDetail.branchId : null;
        const empcompany = empDetail ? empDetail.companyId : null;
        const getreportingtoId = empDetail ? empDetail.reportingToId : null;

        const companyId = empcompany ? empcompany.toString() : null;
        const levelModuleApprovalDetail = companyId ? await approvalSettingModel.find({ companyId: new ObjectId(companyId), status: 1 }) : null;


        if (levelModuleApprovalDetail) {
            for (const approvalDetail of levelModuleApprovalDetail) {
                const modules = approvalDetail.modules; 
                if (modules) {
                    for (const module of modules) { 
                        if (module.moduleName == 'Incentive') {
                            leaveApproval = module.levelModuleApproval;
                        }
                    }
                }
            }
        }


        let matchedApproval = leaveApproval;
        if (Array.isArray(leaveApproval)) {
            for (const approval of leaveApproval) {
                if (approval.levelPosition === 1 && req.body.isDirectReporter === true) {
                    matchedApproval = approval;
                    break;
                }
            }
        }

        if (req.body.isDirectReporter === true) {
            let newIncentives = new incentiveModel({
                incentiveRequestNo : req.body.incentiveRequestNo,
                incentiveRequestDate :req.body.incentiveRequestDate,
                isIncludePayslip : req.body.isIncludePayslip,
                payslipIncludeMonth : req.body.payslipIncludeMonth,
                payslipIncludeYear : req.body.payslipIncludeYear,
                incentiveStauts : req.body.incentiveStauts,
                companyId :empcompany ,
                branchId : empbranch,
                reportingToId :getreportingtoId,
                levelModuleApproval: matchedApproval,
                incentiveDetails : incentiveArr,
                    status: commonVariable.status.ACTIVE,
                    createdBy: req.userId,
                    createdOn: new Date(),
                })
    
            await newIncentives.save();
            let trackingId = newIncentives._id
                
            
            let trackingDatas ={
                trackingId : trackingId,
                module : 'incentive',
                mode :'add',
                postData : req.body,
                createdBy: req.userId,
                createdOn: new Date(),
            }
            trackingDatas.status = 'success',
            trackingDatas.message ="added  successfully..";
            const newTrackingModel = new trackingModel(trackingDatas)
            newTrackingModel.save();

        }else {
            let newIncentive = new incentiveModel({
                incentiveRequestNo : req.body.incentiveRequestNo,
                incentiveRequestDate :req.body.incentiveRequestDate,
                isIncludePayslip : req.body.isIncludePayslip,
                payslipIncludeMonth : req.body.payslipIncludeMonth,
                payslipIncludeYear : req.body.payslipIncludeYear,
                incentiveStauts : req.body.incentiveStauts,
                companyId :empcompany ,
                branchId : empbranch,
                levelModuleApproval: leaveApproval,
                incentiveDetails : incentiveArr,
                    status: commonVariable.status.ACTIVE,
                    createdBy: req.userId,
                    createdOn: new Date(),
                })
    
            await newIncentive.save();
            let trackingId = newIncentive._id
                
            
            let trackingData ={
                trackingId : trackingId,
                module : 'incentive',
                mode :'add',
                postData : req.body,
                createdBy: req.userId,
                createdOn: new Date(),
            }
            trackingData.status = 'success',
            trackingData.message ="added  successfully..";
            const newTrackingModel = new trackingModel(trackingData)
            newTrackingModel.save();

        }

      responseHandlier.successResponse(true," inserted successfully",res)
    } catch (error) {
        console.error("error", error);
        responseHandlier.errorResponse(false, error, res);   
    }
}


module.exports.getIncentive= async (req, res) => {
    try {
        const filterObj = commonFunction.filterObject(req);

        const stateDetails = await incentiveModel.find(filterObj, commonVariable.unSelect.common);

        responseHandlier.successResponse(true, stateDetails, res);
    } catch (error) {
        responseHandlier.errorResponse(false, error, res);
    }
};



module.exports.updateIncentive = async function (req, res) {
    try {
        if (!req.body._id) {
            return responseHandlier.errorResponse(false, " _id is required.", res);
        }

        const roleId = {
            _id: req.body._id
        };

        let trackingData = {
            trackingId: roleId,
            module: 'incentive',
            mode: 'update',
            postData: req.body,
            createdBy: req.userId,
            createdOn: new Date(),
        };

        req.body.updatedBy = req.userId;
        req.body.updatedOn = new Date();
        const requestData = req.body;

        const updatedPositionDetails = await incentiveModel.findByIdAndUpdate(
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



module.exports.deleteIncentive = async function (req, res) {
    try {
        if (!req.body._id || !Array.isArray(req.body._id)) {
            return responseHandlier.errorResponse(false, "_id array is required.", res);
        }

        const roleIds = req.body._id;

        let trackingData = {
            trackingId: roleIds,
            module: 'incentive',
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

        const updatedPositionDetails = await incentiveModel.updateMany(
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



module.exports.incentiveGetEmployee = async (req, res) => {
    try {
        const departmentId = req.body.departmentId;
        const projectId = req.body.projectId;

        if (!departmentId) {
            return responseHandlier.errorResponse(false, 'departmentId is required in the payload', res);
        }

        let filterObj = commonFunction.filterObject(req);

        filterObj = { ...filterObj, departmentId };

        if (projectId) {
            filterObj.projectId = projectId;
        }

        const employees = await employee.find(filterObj)
        .select('_id empCode firstName lastName')
        .populate('departmentId', 'departmentName')
        .populate('projectId', 'projectName')
        .exec();

        responseHandlier.successResponse(true, employees, res);
    } catch (error) {
        responseHandlier.errorResponse(false, error, res);
    }
};



module.exports.updaateIncentiveResponseDetails = async(req,res)=>{
    try {
        let requestData = {
            levelapprovalId : req.body.levelapprovalId,
            levelapprovalDetailId : req.body.levelapprovalDetailId,
            responseStatus : req.body.responseStatus,
            remarks :req.body.remarks,
            status: commonVariable.status.ACTIVE,
            responsedBy: req.userId,
            responsedOn: new Date(),

        }

        const updatedEmployee = await incentiveModel.findByIdAndUpdate(
            req.body.incentiveId,
            { $push: { responseDetails: requestData } }, 
            { new: true }
        );
            
        
        let trackingData ={
            trackingId : updatedEmployee._id,
            module : 'incentiveResponseDetails',
            mode :'update',
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

module.exports.incentiveRequestList = async (req, res) => {
    try {
        const filterObj = commonFunction.filterObject(req);

        const stateDetails = await incentiveModel
            .find(filterObj, commonVariable.unSelect.common)
            .sort({ _id: -1 });

        responseHandlier.successResponse(true, stateDetails, res);
    } catch (error) {
        responseHandlier.errorResponse(false, error, res);
    }
};


// module.exports.getApplyIncentiveRequest = async (req, res) => {
//     try {
//         const empId = req.employeeId;
//         const userId = req.userId;
//         const empDetail = await empProfile.findOne({ _id: new ObjectId(empId), status: 1 });
//         const empBranch = empDetail.branchId;
//         const empCompany = empDetail.companyId;

//         const leaveReq = await incentiveModel.find({ companyId: new ObjectId(empCompany), branchId: new ObjectId(empBranch), status: 1 });

//         const compaerUserTable = await userModel.findOne({ _id: new ObjectId(userId) });

//         //user table comId and branchId 
//         const companyIdAndBranch = [];

//         if (compaerUserTable) {
//             const userCompany = compaerUserTable.companyId;
//             const userBranch = compaerUserTable.branchId;
//             const userRoleBranch = compaerUserTable.roleId;
         
//             const companyAndBranchObj = {
//                 companyId: userCompany,
//                 branchId: userBranch,
//                 roleId : userRoleBranch
//             };
//             companyIdAndBranch.push(companyAndBranchObj);
//         }


//         // get user roleId
//         let roleId;
//        companyIdAndBranch.forEach(obj => {
//             roleId = obj.roleId;
//         });
        
//         // roleUser  and emp company and bracnh match
//         const match = companyIdAndBranch.some(obj => 
//             obj.companyId.toString() === empCompany.toString() && 
//             obj.branchId.toString() === empBranch.toString()
//         );

//         if (!match) {
//             return responseHandlier.errorResponse(false, "User company and branch is not matched", res, 403);
//         }

//         let isUpdated = 0;

//         if (leaveReq.length > 0) {
//             for (const leaveRequest of leaveReq) {
//                 const levelModuleApproval = leaveRequest.levelModuleApproval;
        
//                 for (let j = 0; j < levelModuleApproval.length; j++) {
//                     const currentLevel = levelModuleApproval[j];
//                     let currentRoleId = currentLevel.approvalRole;
//                     let payRoleId = roleId;

//                    const prevLevel = j > 0 ? levelModuleApproval[j - 1] : null;
//                     const prevPrevLevel = j > 1 ? levelModuleApproval[j - 2] : null;

//                     if (payRoleId.toString() === currentRoleId.toString() && currentLevel.approvalStatus === 'Approved') {
//                         isUpdated++;
//                     }

//                     if (j > 0 && payRoleId.toString() === currentRoleId.toString() && prevLevel.approvalStatus === 'Approved') {
//                         isUpdated++;
//                     }

//                    if (j > 1 && payRoleId.toString() === currentRoleId.toString() && prevPrevLevel.approvalStatus === 'Approved') {
//                         isUpdated++;
//                     }

//                 }
//             }
//         } else {
//             console.log("No leave requests found");
//         }
        
//         const data = leaveReq.map(req => ({
            // _id: req._id,
            // companyId: req.companyId,
            // branchId: req.branchId,
            // incentiveRequestNo: req.incentiveRequestNo,
            // incentiveRequestDate: req.incentiveRequestDate,
            // isIncludePayslip: req.isIncludePayslip,
            // payslipIncludeMonth: req.payslipIncludeMonth,
            // payslipIncludeYear: req.payslipIncludeYear,
            // status: req.status,
            // createdBy: req.createdBy,
            // createdOn: req.createdOn,
            // createdAt: req.createdAt,
            // updatedAt: req.updatedAt
//         }));

//         const responseData = { data, isUpdated };
//         responseHandlier.successResponse(true, responseData, res);
//     } catch (error) {
//         console.log("error", error);
//         responseHandlier.errorResponse(false, error, res);
//     }
// };


module.exports.getApplyIncentiveRequest = async (req, res) => {
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

        const leaveRequestDetail = await incentiveModel.find({
            companyId: { $in: companyIdMatches },
            branchId: { $in: branchIdMatches },
            'levelModuleApproval.approvalRole': userRole,
            status: commonVariable.status.ACTIVE
        });
        
        console.log("leaveRequestDetail", leaveRequestDetail);
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
                            console.log("rrrnnam",rrrnnam)
                            console.log("approvalRoleString",approvalRoleString)
                            if (rrrnnam === approvalRoleString) {
                                if (approvalItem.approvalStatus == 'Pending') {

                                    if (lastApproval.approvalStatus === 'Approved') {
                                        isUpdated = 1;
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
                    companyId: levelApproval.companyId,
                    branchId: levelApproval.branchId,
                    incentiveRequestNo: levelApproval.incentiveRequestNo,
                    incentiveRequestDate: levelApproval.incentiveRequestDate,
                    isIncludePayslip: levelApproval.isIncludePayslip,
                    payslipIncludeMonth: levelApproval.payslipIncludeMonth,
                    payslipIncludeYear: levelApproval.payslipIncludeYear,
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


module.exports.updateIncentiveApproval = async (req, res) => {
    try {
        let inputArr = req.body;

        // Extract payload data
        let { levelPosition, incentiveRequsetId, isDirectReporter, approvalStatus, reason } = inputArr;

        const leaveRequestDetail = await incentiveModel.findOne({
            _id: new ObjectId(incentiveRequsetId),
            incentiveStauts: 'Pending',
            status: 1
        });

        if(!leaveRequestDetail) {
            return responseHandlier.errorResponse(false, 'Invalid incentive Id', res);
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

            await incentiveModel.updateOne(
                { _id: incentiveRequsetId, "levelModuleApproval.levelPosition": levelPosition },
                { $set: {
                    'levelModuleApproval.$.approvalStatus': approvalStatus,
                    'levelModuleApproval.$.reason': reason,
                }}
            );

            if(approvalStatus == 'Approved' && levelModuleApprovalLength == levelPosition) {
                await incentiveModel.updateOne(
                    { _id: incentiveRequsetId, "levelModuleApproval.levelPosition": levelPosition },
                    { $set: {
                        'approvalStatus': approvalStatus,
                        'reason': reason,
                    }}
                );
            }
        }

        const updatedDocument = await incentiveModel.findOne({ _id: incentiveRequsetId });
        responseHandlier.successResponse(true, updatedDocument, res);

    } catch (error) {
        responseHandlier.errorResponse(false, error, res);
    }
};