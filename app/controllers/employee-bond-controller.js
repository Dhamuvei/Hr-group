const ObjectId = require('mongodb').ObjectId;
const responseHandlier = require('../libs/response/status');
const commonVariable  = require('../libs/static/common.js');
const commonFunction = require('../libs/util/commonFunctions.js');
const employee = require("../models/employee-model.js");
const trackingModel = require('../models/tracking-model.js');

/**
 * @post
 * @param {*} req
 * @param {*} res
 * @returns to get all addEmployeBond details in db
*/

module.exports.addEmployeBond = async(req,res)=>{
    try {
        let requestData = {
            empId : req.body.empId,
            bondType : req.body.bondType,
            bondStartDate : req.body.bondStartDate,
            bondEndDate :req.body.bondEndDate,
            bondDocument : req.body.bondDocument,
            noOfMonths : req.body.noOfMonths,
            bondSignDate : req.body.bondSignDate,
            status: commonVariable.status.ACTIVE,
            bondAckBy: req.userId,
            bondAckOn: new Date(),
            createdBy: req.userId,
            createdOn: new Date(),
            updatedBy: req.userId,
            updatedOn: new Date(),

        }

        const updatedEmployee = await employee.findByIdAndUpdate(
            req.body.empId,
            { $push: { employeeBond: requestData } }, 
            { new: true }
        );
            
        
        let trackingData ={
            trackingId : updatedEmployee._id,
            module : 'employeeBond',
            mode :'add',
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



module.exports.getHrEmployeBond = async (req, res) => {
    try {
        let query = {};
        if (req.body.empId) {
            query._id = req.body.empId;
        }
        query.status = 1;

        const employeeList = await employee.find(query);

        let data = [];
        employeeList.forEach(emp => {
            emp.employeeBond.forEach(Member => {
                if (Member.status !== 3) {
                    data.push({
                        "_id": Member._id,
                        "bondType": Member.bondType,
                        "bondStartDate": Member.bondStartDate,
                        "bondEndDate": Member.bondEndDate,
                        "bondDocument": Member.bondDocument,
                        "noOfMonths": Member.noOfMonths,
                        "bondSignDate": Member.bondSignDate,
                        "bondAckBy": Member.bondAckBy,
                        "bondAckOn": Member.bondAckOn,
                        "status": Member.status,
                        "createdBy": Member.createdBy,
                        "updatedBy": Member.updatedBy,
                        "createdOn": Member.createdOn,
                        "updatedon": Member.updatedon,
                    });
                }
            });
        });

        if (data.length > 0) {
            responseHandlier.successResponse(true, data, res);
        } else {
            responseHandlier.successResponse(false, "No  bond found for the given employee ID.", res);
        }
    } catch (error) {
        console.error("Error:", error);
        responseHandlier.errorResponse(false, error, res);
    }
};


module.exports.updateHrEmployeBond = async (req, res) => {
    try {
        const { empId, empBondId } = req.body; 
        const {
                bondType,
                bondStartDate,
                bondEndDate,
                bondDocument,
                noOfMonths,
                bondSignDate, 
                // bondAckBy, 
                // bondAckOn ,
                // status ,
                // createdBy ,
                // createdOn ,
                // updatedBy ,
                // updatedOn 
            } = req.body;

        const updatedEmployee = await employee.findOneAndUpdate(
            { "_id": empId, "employeeBond._id": empBondId },
            {
                "$set": {
                    "employeeBond.$.bondType": bondType,
                    "employeeBond.$.bondStartDate": bondStartDate,
                    "employeeBond.$.bondEndDate": bondEndDate,
                    "employeeBond.$.bondDocument": bondDocument,
                    "employeeBond.$.noOfMonths": noOfMonths,
                    "employeeBond.$.bondSignDate": bondSignDate
                    // "employeeBond.$.bondAckBy": bondAckBy,
                    // "employeeBond.$.updatedBy": req.userId,
                    // "employeeBond.$.updatedOn": new Date()
                }
            },
            { new: true }
        );

        if (!updatedEmployee) {
            return responseHandlier.errorResponse(false, "Employee or  bond id not found", res);
        }

        const updatedEmployeeFamily = updatedEmployee.employeeDocument;

        responseHandlier.successResponse(true, updatedEmployeeFamily, res);
    } catch (error) {
        console.error("Error:", error);
        responseHandlier.errorResponse(false, error, res);
    }
};



module.exports.deleteHrEmployeBond = async (req, res) => {
    try {
        const { empId, empBondId } = req.body; 
        const {  status } = req.body;

        const updatedEmployee = await employee.findOneAndUpdate(
            { "_id": empId, "employeeBond._id": empBondId },
            {
                "$set": {
                    "employeeBond.$.status": status,
                    "employeeBond.$.updatedBy": req.userId,
                    "employeeBond.$.updatedOn": new Date()
                }
            },
            { new: true }
        );

        if (!updatedEmployee) {
            return responseHandlier.errorResponse(false, "Employee or bond id not found", res);
        }

        const updatedEmployeeFamily = updatedEmployee.employeeDocument;

        responseHandlier.successResponse(true, updatedEmployeeFamily, res);
    } catch (error) {
        console.error("Error:", error);
        responseHandlier.errorResponse(false, error, res);
    }
};