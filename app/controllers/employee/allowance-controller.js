const ObjectId = require('mongodb').ObjectId;
const responseHandlier = require('../../libs/response/status.js');
const commonVariable  = require('../../libs/static/common.js');
const commonFunction = require('../../libs/util/commonFunctions.js');
const allowanceModel = require("../../models/employee/allowance-model.js")
const trackingModel = require('../../models/tracking-model.js');
const employee = require("../../models/employee-model.js")
const department = require("../../models/hr-department-model.js")
const project   =require("../../models/project_model.js")
const approvalSettingModel = require("../../models/level-approval-setting-models.js")
const userModel = require("../../models/user-model.js")



module.exports.addAllowance= async(req,res)=>{
    try {
         
        let allowancesArr = [];

        if (req.body.isIncludePayslip && (!req.body.payslipIncludeMonth || !req.body.payslipIncludeYear)) {
            return responseHandlier.errorResponse(false, "If isIncludePayslip is true, payslipIncludeMonth and payslipIncludeYear are mandatory", res);
        }

        for (const allowanceDetails of req.body.allowanceDetails) {
            const getEmpId = allowanceDetails.employeeId;
            const getDepId = allowanceDetails.departmentId;
            const getProId = allowanceDetails.projectId;
        
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
                
                allowancesArr.push({
                    employeeId: getEmpId,
                    employeename: fullName,
                    employeeCode: employeeCode,
                    departmentId: getDepId,
                    projectId: getProId,
                    projectName: projectName,
                    departmentName: departmentName,
                    allowanceamount: allowanceDetails.allowanceamount,
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
                        if (module.moduleName == 'Allowance') {
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
        
        if (req.body.isDirectReporter === true) {
            let newrole = new allowanceModel({
                allowanceRequestNo : req.body.allowanceRequestNo,
                allowanceRequestDate :req.body.allowanceRequestDate,
                isIncludePayslip : req.body.isIncludePayslip,
                payslipIncludeMonth : req.body.payslipIncludeMonth,
                payslipIncludeYear : req.body.payslipIncludeYear,
                allowanceStauts : req.body.allowanceStauts,
                companyId :empcompany ,
                branchId : empbranch,
                reportingToId :getreportingtoId,
                levelModuleApproval: matchedApproval, 
                allowanceDetails : allowancesArr,
                    status: commonVariable.status.ACTIVE,
                    createdBy: req.userId,
                    createdOn: new Date(),
                })
    
            await newrole.save();
            let trackingId = newrole._id
                
            
            let trackingData ={
                trackingId : trackingId,
                module : 'allowance',
                mode :'add',
                postData : req.body,
                createdBy: req.userId,
                createdOn: new Date(),
            }
            trackingData.status = 'success',
            trackingData.message ="added  successfully..";
            const newTrackingModel = new trackingModel(trackingData)
            newTrackingModel.save();
        }else{
            let newroles = new allowanceModel({
                allowanceRequestNo : req.body.allowanceRequestNo,
                allowanceRequestDate :req.body.allowanceRequestDate,
                isIncludePayslip : req.body.isIncludePayslip,
                payslipIncludeMonth : req.body.payslipIncludeMonth,
                payslipIncludeYear : req.body.payslipIncludeYear,
                allowanceStauts : req.body.allowanceStauts,
                companyId :empcompany ,
                branchId : empbranch,
                levelModuleApproval: leaveApproval, 
                allowanceDetails : allowancesArr,
                    status: commonVariable.status.ACTIVE,
                    createdBy: req.userId,
                    createdOn: new Date(),
                })
    
            await newroles.save();
            let trackingId = newroles._id
                
            
            let trackingDatas ={
                trackingId : trackingId,
                module : 'allowance',
                mode :'add',
                postData : req.body,
                createdBy: req.userId,
                createdOn: new Date(),
            }
            trackingDatas.status = 'success',
            trackingDatas.message ="added  successfully..";
            const newTrackingModels = new trackingModel(trackingDatas)
            newTrackingModels.save();
        }


      responseHandlier.successResponse(true," inserted successfully",res)
    } catch (error) {
        console.error("error", error);
        responseHandlier.errorResponse(false, error, res);   
    }
}


module.exports.getAllowance= async (req, res) => {
    try {
        const filterObj = commonFunction.filterObject(req);

        const stateDetails = await allowanceModel.find(filterObj, commonVariable.unSelect.common);

        responseHandlier.successResponse(true, stateDetails, res);
    } catch (error) {
        responseHandlier.errorResponse(false, error, res);
    }
};



module.exports.updateAllowance = async function (req, res) {
    try {
        if (!req.body._id) {
            return responseHandlier.errorResponse(false, " _id is required.", res);
        }

        const roleId = {
            _id: req.body._id
        };

        let trackingData = {
            trackingId: roleId,
            module: 'allowance',
            mode: 'update',
            postData: req.body,
            createdBy: req.userId,
            createdOn: new Date(),
        };

        req.body.updatedBy = req.userId;
        req.body.updatedOn = new Date();
        const requestData = req.body;

        const updatedPositionDetails = await allowanceModel.findByIdAndUpdate(
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



module.exports.deleteAllowance = async function (req, res) {
    try {
        if (!req.body._id || !Array.isArray(req.body._id)) {
            return responseHandlier.errorResponse(false, "_id array is required.", res);
        }

        const allwanceIds = req.body._id;

        let trackingData = {
            trackingId: allwanceIds,
            module: 'allowance',
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

        const updatedPositionDetails = await allowanceModel.updateMany(
            { _id: { $in: allwanceIds } },
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


// module.exports.bounsGetEmployee = async (req, res) => {
//     try {
//         if (!req.body.departmentId) {
//             return responseHandlier.errorResponse(false, "departmentId is required.", res);
//         }
        
//         const filterObj = commonFunction.filterObject(req);

//         if(req.body.departmentId){
//             filterObj.departmentId = (req.body.departmentId)
//         }

//         if(req.body.projectId){
//             filterObj.projectId = (req.body.projectId)
//         }

//         const requestQuery = [
//             {
//                 $match: filterObj,
//             },
//             {
//                 $lookup: {
//                     from: "departments",
//                     localField: "departmentId",
//                     foreignField: "_id",
//                     as: "output",
//                 },
//             },
//             {
//                 $lookup: {
//                     from: "hrprojects",
//                     localField: "projectId",
//                     foreignField: "_id",
//                     as: "projectoutput",
//                 },
//             },
//             {
//                 $project: {
//                     _id: 1,
//                     empCode: 1,
//                     firstName: 1,
//                     lastName: 1,
//                     departmentId: 1,
//                     projectId:1,
//                     status: 1,
//                     createdBy: 1,
//                     updatedBy: 1,
//                     createdOn: 1,
//                     updatedon: 1,
//                     departmentName: { $arrayElemAt: ["$output.departmentName", 0] },
//                     projectName: { $arrayElemAt: ["$projectoutput.projectName", 0] },
//                 },
//             },
//         ];

//         const equipment = await employee.aggregate(requestQuery);
//         responseHandlier.successResponse(true, equipment, res);
//     } catch (error) {
//         responseHandlier.errorResponse(false, error, res);
//     }
// };


module.exports.allownceGetEmployee = async (req, res) => {
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



module.exports.updaateAllowanceResponseDetails = async(req,res)=>{
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

        const updatedEmployee = await allowanceModel.findByIdAndUpdate(
            req.body.incentiveId,
            { $push: { responseDetails: requestData } }, 
            { new: true }
        );
            
        
        let trackingData ={
            trackingId : updatedEmployee._id,
            module : 'allowanceResponseDetails',
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

module.exports.allowanceRequestList = async (req, res) => {
    try {
        const filterObj = commonFunction.filterObject(req);

        const stateDetails = await allowanceModel
            .find(filterObj, commonVariable.unSelect.common)
            .sort({ _id: -1 });

        responseHandlier.successResponse(true, stateDetails, res);
    } catch (error) {
        responseHandlier.errorResponse(false, error, res);
    }
};


module.exports.updateAllowanceApproval = async (req, res) => {
    try {
        let inputArr = req.body;
        // console.log("inputArr",inputArr)

        // Extract payload data
        let { levelPosition, allowanceRequsetId, isDirectReporter, approvalStatus, reason } = inputArr;

        const bonusReqDetail = await allowanceModel.findOne({
            _id: new ObjectId(allowanceRequsetId),
            allowanceStauts: 'Pending',
            status: 1
        });
        if(!bonusReqDetail) {
            return responseHandlier.errorResponse(false, 'Invalid bonus Id', res);
        }


        let levelModuleApproval = bonusReqDetail.levelModuleApproval;
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

            await allowanceModel.updateOne(
                { _id: allowanceRequsetId, "levelModuleApproval.levelPosition": levelPosition },
                { $set: {
                    'levelModuleApproval.$.approvalStatus': approvalStatus,
                    'levelModuleApproval.$.reason': reason,
                }}
            );

            if(approvalStatus == 'Approved' && levelModuleApprovalLength == levelPosition) {
                await allowanceModel.updateOne(
                    { _id: allowanceRequsetId, "levelModuleApproval.levelPosition": levelPosition },
                    { $set: {
                        'approvalStatus': approvalStatus,
                        'reason': reason,
                    }}
                );
            }
        }
        
        const updatedDocument = await allowanceModel.findOne({ _id: allowanceRequsetId });
        responseHandlier.successResponse(true, updatedDocument, res);

    } catch (error) {
        console.log("error",error)
        responseHandlier.errorResponse(false, error, res);
    }
};



module.exports.getApplyAllowanceRequest = async (req, res) => {
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

        const leaveRequestDetail = await allowanceModel.find({
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
                    allowanceRequestNo: levelApproval.allowanceRequestNo,
                    companyId: levelApproval.companyId,
                    branchId: levelApproval.branchId,
                    allowanceRequestDate: levelApproval.allowanceRequestDate,
                    isIncludePayslip: levelApproval.isIncludePayslip,
                    payslipIncludeMonth: levelApproval.payslipIncludeMonth,
                    payslipIncludeYear: levelApproval.payslipIncludeYear,
                    reportingToId: levelApproval.reportingToId,
                    allowanceStauts: levelApproval.allowanceStauts,
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