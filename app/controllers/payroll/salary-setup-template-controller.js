const ObjectId = require('mongodb').ObjectId;
const responseHandlier = require('../../libs/response/status.js');
const commonVariable  = require('../../libs/static/common.js');
const commonFunction = require('../../libs/util/commonFunctions.js');
const slarysetupModel = require("../../models/payroll/salary-setup-template-model.js")
const trackingModel = require('../../models/tracking-model.js');
const salaryPerameter = require("../../models/hr-salary-parameter-model.js")
const grade =require("../../models/hr-grade-model.js") 
const empProfile = require("../../models/employee-model.js")
const salarySetup = require("../../models/payroll/employee-salary-setup-model.js")


module.exports.addSalarySetupTemplate= async(req,res)=>{
    try {
         
        let salaryArr = [];

        for (const salaryDetails of req.body.salaryDetails) {
            const getId = salaryDetails.salaryParameterId;

        
            const [proInfo] = await Promise.all([
                salaryPerameter.findById(getId),
  
            ]);
        
            if (proInfo !== undefined) {
                let parameterName = proInfo ? proInfo.salaryParameterName : "";
                let typeparameter = proInfo ? proInfo.type : "";
                let psValue = proInfo ? proInfo.percentageValue : "";
                let psof = proInfo ? proInfo.percentageOf : "";

                
                salaryArr.push({
                    salaryParameterId: getId,
                    parameterType : typeparameter,
                    parameterPercentageValue :psValue,
                    salaryParameterName: parameterName,
                    parameterOf :psof,
                    grade: salaryDetails.grade,
                    type: salaryDetails.type,
                    monthYear: salaryDetails.monthYear,
                    monthlyAmount: salaryDetails.monthlyAmount,
                    yearlyAmount: salaryDetails.yearlyAmount,

                });
            } else {
                return responseHandlier.errorResponse(false, "Please check some IDs are missing", res);
            }
        }
        

        let getGrade = await grade.find({_id: new ObjectId(req.body.gradeId)});
        let gradeNames ;
        if (getGrade.length > 0) {
            gradeNames = getGrade[0].gradeName;
        } 

        let EmpData = await empProfile.find({_id: new ObjectId(req.body.employeeId)});
        let getemocode ;
        if (EmpData.length > 0) {
            getemocode = EmpData[0].empCode;
        }

        let getsalary = await slarysetupModel.find({_id: new ObjectId(req.body.salaryTemplateId)});
        let salaryCtc;
        if (getsalary.length > 0) {
            salaryCtc = getsalary[0].CTC;
        } 

        if(req.body.mode === true ){
            //emp included grade Id
            let EmpDatas = await empProfile.find({employeeGradeId: new ObjectId(req.body.gradeId)});
            let emp_ids ;
            if (EmpDatas.length > 0) {
             emp_ids = EmpDatas.map(empData => empData._id);        
            } 
             
            //includes check 
            let checkIn = await salarySetup.find({ employeeId: { $in: emp_ids } });
            // same emp change the status : 3
            checkIn.forEach(async (doc) => {
                doc.status = 3; 
                await doc.save(); 
            });

            let empSalarySetup = new salarySetup({
                employeeId : req.body.employeeId,
                empCode :getemocode,
                salaryTemplateId : req.body.salaryTemplateId,
                gradeId : req.body.gradeId,
                grossSalary : req.body.grossSalary,
                gradeName :gradeNames,
                CTC : salaryCtc,
                salaryDetails:salaryArr,
                status: commonVariable.status.ACTIVE,
                createdBy: req.userId,
                createdOn: new Date()
            })
    
            await empSalarySetup.save();

            let trackingId = empSalarySetup._id
            
        
            let trackingData ={
                trackingId : trackingId,
                module : 'employeesalarysetup',
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

        const existingRole = await slarysetupModel.findOne({ gradeId: req.body.gradeId });

        if (existingRole) {
            return responseHandlier.errorResponse(false, "same gradeId already exists", res);
        }

        let newrole = new slarysetupModel({
            gradeId : req.body.gradeId,
            gradeName : gradeNames,
            CTC :req.body.CTC,
            salaryDetails : salaryArr,
            status: commonVariable.status.ACTIVE,
            createdBy: req.userId,
            createdOn: new Date(),

        })

        await newrole.save();
        let trackingId = newrole._id
            
        
        let trackingData ={
            trackingId : trackingId,
            module : 'salarysetuptemplate',
            mode :'add',
            postData : req.body,
            createdBy: req.userId,
            createdOn: new Date(),
        }
        trackingData.status = 'success',
        trackingData.message ="added  successfully..";
        const newTrackingModel = new trackingModel(trackingData)
        newTrackingModel.save();
      responseHandlier.successResponse(true," inserted successfully",res)
    } catch (error) {
        console.error("error", error);
        responseHandlier.errorResponse(false, error, res);   
    }
}




module.exports.getSalarySetupTemplate= async (req, res) => {
    try {
        const filterObj = commonFunction.filterObject(req);

        const stateDetails = await slarysetupModel.find(filterObj, commonVariable.unSelect.common);

        responseHandlier.successResponse(true, stateDetails, res);
    } catch (error) {
        responseHandlier.errorResponse(false, error, res);
    }
};




module.exports.updateSalarySetupTemplate = async function (req, res) {
    try {
        if (!req.body._id) {
            return responseHandlier.errorResponse(false, " _id is required.", res);
        }

        const roleId = {
            _id: req.body._id
        };

        let trackingData = {
            trackingId: roleId,
            module: 'SalarySetupTemplate',
            mode: 'update',
            postData: req.body,
            createdBy: req.userId,
            createdOn: new Date(),
        };

        req.body.updatedBy = req.userId;
        req.body.updatedOn = new Date();
        const requestData = req.body;

        const updatedPositionDetails = await slarysetupModel.findByIdAndUpdate(
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



module.exports.deleteSalarySetupTemplate = async function (req, res) {
    try {
        if (!req.body._id || !Array.isArray(req.body._id)) {
            return responseHandlier.errorResponse(false, "_id array is required.", res);
        }

        const roleIds = req.body._id;

        let trackingData = {
            trackingId: roleIds,
            module: 'SalarySetupTemplate',
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

        const updatedPositionDetails = await slarysetupModel.updateMany(
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