const ObjectId = require('mongodb').ObjectId;
const responseHandlier = require('../libs/response/status');
const commonVariable  = require('../libs/static/common.js');
const commonFunction = require('../libs/util/commonFunctions.js');
// const employeedocumentModel = require("../models/employe-document-model.js");
const employee = require("../models/employee-model.js");
const docModel =require("../models/hr-document-model.js")

const emptrackingModel = require('../models/employee-tracking-mdel.js');

/**
 * @post
 * @param {*} req
 * @param {*} res
 * @returns to get all addCountry details in db
 */


module.exports.addHrEmployeDocument = async(req,res)=>{
    try {
        let requestData = {
            empId : req.body.empId,
            mode : req.body.mode,
            docType : req.body.docType,
            docNature :req.body.docNature,
            docNo : req.body.docNo,
            docDate : req.body.docDate,
            document : req.body.document,
            status: commonVariable.status.ACTIVE,
            createdBy: req.userId,
            createdOn: new Date(),

        }

        const updatedEmployee = await employee.findByIdAndUpdate(
            req.body.empId,
            { $push: { employeeDocument: requestData } }, 
            { new: true }
        );
            
        
        let trackingData ={
            trackingId : updatedEmployee._id,
            module : 'employeedocument',
            mode :'add',
            postData : req.body,
            createdBy: req.userId,
            createdOn: new Date(),
        }
        trackingData.status = 'success',
        trackingData.message =" added  successfully..";
        const newTrackingModel = new emptrackingModel(trackingData)
        newTrackingModel.save();
        responseHandlier,responseHandlier.successResponse(true," inserted successfully",res)
    } catch (error) {
        console.error("error", error);
        responseHandlier.errorResponse(false, error, res);   
    }
}



// module.exports.getHrEmployeDocument = async (req, res) => {
//     try {
//         let query = {};
//         if (req.body.empId) {
//             query._id = req.body.empId;
//         }
//         query.status = 1;

//         const employeeList = await employee.find(query);

//         let data = [];
//         employeeList.forEach(emp => {
//             emp.employeeDocument.forEach(Member => {
//                 if (Member.status !== 3) {
//                     data.push({
//                         "_id": Member._id,
//                         "empId": Member.empId,
//                         "docType": Member.docType,
//                         "mode": Member.mode,
//                         "docNature": Member.docNature,
//                         "docNo": Member.docNo,
//                         "docDate": Member.docDate,
//                         "document": Member.document,
//                         "status": Member.status,
//                         "createdBy": Member.createdBy,
//                         "updatedBy": Member.updatedBy,
//                         "createdOn": Member.createdOn,
//                         "updatedon": Member.updatedon,
//                     });
//                 }
//             });
//         });

//         if (data.length > 0) {
//             responseHandlier.successResponse(true, data, res);
//         } else {
//             responseHandlier.successResponse(false, "No family members found for the given employee ID.", res);
//         }
//     } catch (error) {
//         console.error("Error:", error);
//         responseHandlier.errorResponse(false, error, res);
//     }
// };

module.exports.getHrEmployeDocument = async (req, res) => {
    try {
        let query = {};
        if (req.body.empId) {
            query._id = req.body.empId;
        }
        query.status = 1;

        const employeeList = await employee.find(query).populate({
            path: 'employeeDocument.docType',
            model: docModel,
            select: 'documentName' 
        });

        let data = [];
        employeeList.forEach(emp => {
            emp.employeeDocument.forEach(member => {
                if (member.status !== 3) {
                    data.push({
                        "_id": member._id,
                        "empId": member.empId,
                        "docType": member.docType._id, 
                        "documentName": member.docType.documentName, 
                        "mode": member.mode,
                        "docNature": member.docNature,
                        "docNo": member.docNo,
                        "docDate": member.docDate,
                        "document": member.document,
                        "status": member.status,
                        "createdBy": member.createdBy,
                        "updatedBy": member.updatedBy,
                        "createdOn": member.createdOn,
                        "updatedOn": member.updatedon, // Corrected property name
                    });
                }
            });
        });

        if (data.length > 0) {
            responseHandlier.successResponse(true, data, res);
        } else {
            responseHandlier.successResponse(false, "No doc found for the given employee ID.", res);
        }
    } catch (error) {
        console.error("Error:", error);
        responseHandlier.errorResponse(false, error, res);
    }
};


module.exports.updateHrEmployeDocument = async (req, res) => {
    try {
        const { empId, documentId } = req.body; 
        const {  mode, docType, docNature, docDate, document,docNo } = req.body;

        const updatedEmployee = await employee.findOneAndUpdate(
            { "_id": empId, "employeeDocument._id": documentId },
            {
                "$set": {
                    "employeeDocument.$.empId": empId,
                    "employeeDocument.$.mode": mode,
                    "employeeDocument.$.docType": docType,
                    "employeeDocument.$.docNature": docNature,
                    "employeeDocument.$.docNo": docNo,
                    "employeeDocument.$.docDate": docDate,
                    "employeeDocument.$.document": document,
                    "employeeDocument.$.updatedBy": req.userId,
                    "employeeDocument.$.updatedOn": new Date()
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

        const updatedEmployeeFamily = updatedEmployee.employeeDocument;

        responseHandlier.successResponse(true, updatedEmployeeFamily, res);
    } catch (error) {
        console.error("Error:", error);
        responseHandlier.errorResponse(false, error, res);
    }
};



module.exports.deleteHrEmployeDocument = async (req, res) => {
    try {
        const { empId, documentId } = req.body; 
        const {  status, docType, docNature, docDate, document,docNo } = req.body;

        const updatedEmployee = await employee.findOneAndUpdate(
            { "_id": empId, "employeeDocument._id": documentId },
            {
                "$set": {
                    "employeeDocument.$.status": status,
                    "employeeDocument.$.updatedBy": req.userId,
                    "employeeDocument.$.updatedOn": new Date()
                }
            },
            { new: true }
        );

        if (!updatedEmployee) {
            return responseHandlier.errorResponse(false, "Employee or document not found", res);
        }

        const updatedEmployeeFamily = updatedEmployee.employeeDocument;

        responseHandlier.successResponse(true, updatedEmployeeFamily, res);
    } catch (error) {
        console.error("Error:", error);
        responseHandlier.errorResponse(false, error, res);
    }
};