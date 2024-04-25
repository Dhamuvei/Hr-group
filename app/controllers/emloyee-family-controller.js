const ObjectId = require('mongodb').ObjectId;
const responseHandlier = require('../libs/response/status');
const commonVariable  = require('../libs/static/common.js');
const commonFunction = require('../libs/util/commonFunctions.js');
const employee = require("../models/employee-model.js");
const Qulification = require("../models/qualification-model.js");
const emptrackingModel = require('../models/employee-tracking-mdel.js');

/**
 * @post
 * @param {*} req
 * @param {*} res
 * @returns to get all addCountry details in db
 */

module.exports.addHrEmployeFamily = async (req, res) => {
    try {
        const requestData = {
            empId: req.body.empId,
            name: req.body.name,
            dob: req.body.dob,
            age: req.body.age,
            gender: req.body.gender,
            relationship: req.body.relationship,
            qualification: req.body.qualification,
            isNominee: req.body.isNominee,
            status: commonVariable.status.ACTIVE,
            createdBy: req.userId,
            createdOn: new Date()
        };

        const updatedEmployee = await employee.findByIdAndUpdate(
            req.body.empId,
            { $set: { employeeFamily: requestData } }, 
            { new: true }
        );

        const trackingData = {
            trackingId: updatedEmployee._id, 
            module: 'employeeFamily',
            mode: 'add',
            postData: req.body,
            createdBy: req.userId,
            createdOn: new Date(),
            status: 'success', 
            message: "Family member added successfully."
        };

        const newTrackingModel = new emptrackingModel(trackingData);
        await newTrackingModel.save();

        responseHandlier.successResponse(true, "Family member added successfully.", res);
    } catch (error) {
        responseHandlier.errorResponse(false, error, res);
    }
};


module.exports.getHrEmployeFamily = async (req, res) => {
    try {
        let query = {};
        if (req.body.empId) {
            query._id = req.body.empId;
        }
        query.status = 1;

        const employeeList = await employee.find(query).populate({
            path: 'employeeFamily.qualification',
            model: Qulification,
            select: 'qualificationName' 
        });

        let data = [];
        employeeList.forEach(emp => {
            emp.employeeFamily.forEach(familyMember => {
                if (familyMember.status !== 3) {
                    data.push({
                        "_id": familyMember._id,
                        "empId": emp._id,
                        "name": familyMember.name,
                        "dob": familyMember.dob,
                        "age": familyMember.age,
                        "gender": familyMember.gender,
                        "relationship": familyMember.relationship,
                        "qualification": familyMember.qualification._id,
                        "qualificationName": familyMember.qualification.qualificationName,
                        "isNominee": familyMember.isNominee,
                        "status": familyMember.status,
                        "createdBy": familyMember.createdBy,
                        "updatedBy": familyMember.updatedBy,
                        "createdOn": familyMember.createdOn,
                        "updatedon": familyMember.updatedon,
                    });
                }
            });
        });

        if (data.length > 0) {
            responseHandlier.successResponse(true, data, res);
        } else {
            responseHandlier.successResponse(false, "No family members found for the given employee ID.", res);
        }
    } catch (error) {
        console.error("Error:", error);
        responseHandlier.errorResponse(false, error, res);
    }
};


// module.exports.updateHrEmployeFamily = async (req, res) => {
//     try {
//         const { empId, familyMemberId } = req.body; 
//         const { name, dob, age, gender, relationship, qualification, isNominee } = req.body;

//         const updatedEmployee = await employee.findOneAndUpdate(
//             { "_id": empId, "employeeFamily._id": familyMemberId },
//             {
//                 "$set": {
//                     "employeeFamily.$.name": name,
//                     "employeeFamily.$.dob": dob,
//                     "employeeFamily.$.age": age,
//                     "employeeFamily.$.gender": gender,
//                     "employeeFamily.$.relationship": relationship,
//                     "employeeFamily.$.qualification": qualification,
//                     "employeeFamily.$.isNominee": isNominee,
//                     "employeeFamily.$.updatedBy": req.userId,
//                     "employeeFamily.$.updatedOn": new Date()
//                 }
//             },
//             { new: true }
//         );

//         if (!updatedEmployee) {
//             return responseHandlier.errorResponse(false, "Employee or family member not found", res);
//         }

//         const updatedEmployeeFamily = updatedEmployee.employeeFamily;

//         responseHandlier.successResponse(true, updatedEmployeeFamily, res);
//     } catch (error) {
//         console.error("Error:", error);
//         responseHandlier.errorResponse(false, error, res);
//     }
// };

module.exports.updateHrEmployeFamily = async (req, res) => {
    try {
        const { empId, familyMemberId } = req.body; 
        const { name, dob, age, gender, relationship, qualification, isNominee } = req.body;

        const updatedEmployee = await employee.findOneAndUpdate(
            { "_id": empId, "employeeFamily._id": familyMemberId },
            {
                "$set": {
                    "employeeFamily.$.name": name,
                    "employeeFamily.$.dob": dob,
                    "employeeFamily.$.age": age,
                    "employeeFamily.$.gender": gender,
                    "employeeFamily.$.relationship": relationship,
                    "employeeFamily.$.qualification": qualification,
                    "employeeFamily.$.isNominee": isNominee,
                    "employeeFamily.$.updatedBy": req.userId,
                    "employeeFamily.$.updatedOn": new Date()
                }
            },
            { new: true }
        );

        if (!updatedEmployee) {
            return responseHandlier.errorResponse(false, "Employee or family member not found", res);
        }

        // Tracking
        let trackingData = {
            trackingId: empId,
            module: 'employee',
            mode: 'update_family_member',
            postData: req.body,
            createdBy: req.userId,
            createdOn: new Date(),
            status: "success",
            message: "Employee family member details updated successfully."
        };

        const newTrackingModel = new emptrackingModel(trackingData);
        await newTrackingModel.save();

        const updatedEmployeeFamily = updatedEmployee.employeeFamily;

        responseHandlier.successResponse(true, updatedEmployeeFamily, res);
    } catch (error) {
        console.error("Error:", error);
        responseHandlier.errorResponse(false, error, res);
    }
}




module.exports.deleteHrEmployeFamily = async (req, res) => {
    try {
        const { empId, familyMemberId } = req.body; 
        const { status } = req.body;

        const updatedEmployee = await employee.findOneAndUpdate(
            { "_id": empId, "employeeFamily._id": familyMemberId },
            {
                "$set": {
                    "employeeFamily.$.status": status,
                    "employeeFamily.$.updatedBy": req.userId,
                    "employeeFamily.$.updatedOn": new Date()
                }
            },
            { new: true }
        );

        if (!updatedEmployee) {
            return responseHandlier.errorResponse(false, "Employee or family member not found", res);
        }

        const updatedEmployeeFamily = updatedEmployee.employeeFamily;

        responseHandlier.successResponse(true, updatedEmployeeFamily, res);
    } catch (error) {
        console.error("Error:", error);
        responseHandlier.errorResponse(false, error, res);
    }
};

