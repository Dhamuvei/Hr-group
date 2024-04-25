const ObjectId = require('mongodb').ObjectId;
const responseHandlier = require('../libs/response/status');
const commonVariable  = require('../libs/static/common');
const commonFunction = require('../libs/util/commonFunctions');
const employee = require("../models/employee-model")
const tracking = require("../models/tracking-model")
const emptracking =require("../models/employee-tracking-mdel")
const role =require("../models/role-model")


/**
 * @POST
 * @param {*} req
 * @param {*} res
 * @returns to add department details in db
 */

module.exports.addHrEmployee= async (req, res) => {
    try {

        let roleName = await role.find({_id: req.body.roleId});
        let getRoleName = roleName.length > 0 ? roleName[0].name : '';
        
        let newDepartment = new employee({
            branchId : req.body.branchId,
            roleId: req.body.roleId,
            roleName:getRoleName,
            companyId: req.body.companyId,
            reportingToId: req.body.reportingToId,
            userId: req.body.userId,
            empCode: req.body.empCode,
            personalEmailId: req.body.personalEmailId,
            bloodGroup: req.body.bloodGroup,
            dateOfBirth: req.body.dateOfBirth,
            mobileNo: req.body.mobileNo,
            officialEmailId: req.body.officialEmailId,
            phoneNo: req.body.phoneNo,
            gender: req.body.gender,
            maritalStatus: req.body.maritalStatus,
            uploadPhoto: req.body.uploadPhoto,
            weddingDate: req.body.weddingDate,
            panNo: req.body.panNo,
            lastName: req.body.lastName,
            firstName: req.body.firstName,
            panCardAttachment: req.body.panCardAttachment,
            status: commonVariable.status.ACTIVE,
            empStatus: commonVariable.status.ACTIVE,
            createdBy:  req.userId,
            createdOn: new Date(),
            updatedBy: req.userId,
            updatedOn: new Date(),
        });

        await newDepartment.save();

        let getDesignationId = newDepartment._id

        let trackingData ={
            trackingId : getDesignationId,
            module : 'employee',
            mode :'add',
            postData : req.body,
            createdBy: req.userId,
            createdOn: new Date(),
        }
        trackingData.status = "success"
        trackingData.message ="insert successfully..";
        let newtrackingmodel = new tracking(trackingData)
        newtrackingmodel.save()

        responseHandlier.successResponse(true, 'Successfully Inserted', res);
    } catch (error) {
        console.error("error", error);
        responseHandlier.errorResponse(false, error, res);
    }
};




/**
 * @GET
 * @param {*} req
 * @param {*} res
 * @returns to get all getAllHrDepartmen details in db
 */

module.exports.getAllHrEmployee = async (req, res) => {
    try {
        const filterObj = commonFunction.filterObject(req);

        const employmentTypeDetails = await employee.find(filterObj, commonVariable.unSelect.common);

        let employeFinalRes = employmentTypeDetails.map(employee => ({
            _id: employee._id,
            branchId : employee.branchId,
            roleId: employee.roleId,
            userId: employee.userId,
            lastName: employee.lastName,
            firstName: employee.firstName,
            empCode: employee.empCode,
            personalEmailId: employee.personalEmailId,
            bloodGroup: employee.bloodGroup,
            dateOfBirth: employee.dateOfBirth,
            mobileNo: employee.mobileNo,
            officialEmailId: employee.officialEmailId,
            phoneNo: employee.phoneNo,
            gender: employee.gender,
            maritalStatus: employee.maritalStatus,
            bloodGroup: employee.bloodGroup,
            uploadPhoto: employee.uploadPhoto,
            weddingDate: employee.weddingDate,
            panNo: employee.panNo,
            panCardAttachment: employee.panCardAttachment,
            status: employee.status,
            empStatus: employee.empStatus,
            createdBy: employee.createdBy,
            createdOn: employee.createdOn,
            updatedBy: employee.updatedBy,
            updatedOn: employee.updatedOn
        }));

        responseHandlier.successResponse(true, employeFinalRes, res);
    } catch (error) {
        responseHandlier.errorResponse(false, error, res);
    }
};



module.exports.getHrEmployee = async (req, res) => {
    try {
        const filterObj = commonFunction.filterObject(req);

        const employeDetails = await employee.find(filterObj, commonVariable.unSelect.common);

        responseHandlier.successResponse(true, employeDetails, res);
    } catch (error) {
        responseHandlier.errorResponse(false, error, res);
    }
};


/**
 * @put
 * @param {*} req
 * @param {*} res
 * @returns to put all updateHrCompanyBank details in db
 */

module.exports.updateHrEmployee = async function (req, res) {
    try {
        if (!req.body._id) {
            return responseHandlier.errorResponse(false, "_id is required.", res);
        }

        const employmentTypeId = {
            _id: req.body._id
        };

        let trackingData = {
            trackingId: employmentTypeId,
            module: 'employee',
            mode: 'update',
            postData: req.body,
            createdBy: req.userId,
            createdOn: new Date(),
        };

        req.body.updatedBy = req.userId;
        req.body.updatedOn = new Date();
        const requestData = req.body;

        const updatedPositionDetails = await employee.findByIdAndUpdate(
            employmentTypeId,
            requestData,
            { new: true }
        );

        trackingData.status = 'success';
        trackingData.message = " updated successfully..";
        const newTrackingModel = new tracking(trackingData);
        await newTrackingModel.save();

        responseHandlier.successResponse(true, updatedPositionDetails, res);
    } catch (error) {
        console.log(error);
        responseHandlier.errorResponse(false, error, res);
    }
};


/**
 * @delete
 * @param {*} req
 * @param {*} res
 * @returns to ddelete all deleteHrCompanyBank details in db
 */

module.exports.deleteHrEmployee = async function (req, res) {
    try {
        if (!req.body._id || !Array.isArray(req.body._id)) {
            return responseHandlier.errorResponse(false, " _id array is required.", res);
        }

        const employmentTypeIds = req.body._id;

        let trackingData = {
            trackingId: employmentTypeIds,
            module: 'employee',
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

        const updatedPositionDetails = await employee.updateMany(
            { _id: { $in: employmentTypeIds } },
            requestData,
            { new: true }
        );

        trackingData.status = 'success';
        trackingData.message = " updated successfully..";
        const newTrackingModel = new tracking(trackingData);
        await newTrackingModel.save();

        responseHandlier.successResponse(true, updatedPositionDetails, res);
    } catch (error) {
        console.log(error);
        responseHandlier.errorResponse(false, error, res);
    }
};


/**
 * @add
 * @param {*} req
 * @param {*} res
 * @returns to add all addHrEmployeeOfficial details in db
 */

// module.exports.addHrEmployeeOfficial  = async (req, res) => {
//     try {
//         const {
//             empId,
//             departmentId,
//             designationId,
//             projectId,
//             employeeGradeId,
//             employeeTypeId,
//             employeeCategoryId,
//             employeeShiftId,
//             dateOfJoin,
//             confirmationDate,
//             reportingManager,
//             workLocation,
//             metroNonMetro,
//             costCenter,
//             paymentMethod,
//             uanNo,
//             isPF,
//             pfNo,
//             isEsi,
//             esiNo,
//             isOvertimeApplicable,
//             overTimeCategoryId
//         } = req.body;

//         const updatedEmployee = await employee.findOneAndUpdate(
//             { "_id": empId },
//             {
//                 "$set": {
//                     departmentId,
//                     designationId,
//                     projectId,
//                     employeeGradeId,
//                     employeeTypeId,
//                     employeeCategoryId,
//                     employeeShiftId,
//                     dateOfJoin,
//                     confirmationDate,
//                     reportingManager,
//                     workLocation,
//                     metroNonMetro,
//                     costCenter,
//                     paymentMethod,
//                     uanNo,
//                     isPF,
//                     pfNo,
//                     isEsi,
//                     esiNo,
//                     isOvertimeApplicable,
//                     overTimeCategoryId
//                 }
//             },
//             { new: true }
//         );

//         if (!updatedEmployee) {
//             return responseHandlier.errorResponse(false, "Employee not found", res);
//         }

//         responseHandlier.successResponse(true, updatedEmployee, res);
//     } catch (error) {
//         console.error("Error:", error);
//         responseHandlier.errorResponse(false, error.message || error, res); 
//     }
// };

module.exports.addHrEmployeeOfficial = async (req, res) => {
    try {
        const {
            empId,
            departmentId,
            designationId,
            projectId,
            employeeGradeId,
            employeeTypeId,
            employeeCategoryId,
            employeeShiftId,
            dateOfJoin,
            confirmationDate,
            reportingManager,
            workLocation,
            metroNonMetro,
            costCenter,
            paymentMethod,
            uanNo,
            isPF,
            pfNo,
            isEsi,
            esiNo,
            isOvertimeApplicable,
            overTimeCategoryId
        } = req.body;

        const updatedEmployee = await employee.findOneAndUpdate(
            { "_id": empId },
            {
                "$set": {
                    departmentId,
                    designationId,
                    projectId,
                    employeeGradeId,
                    employeeTypeId,
                    employeeCategoryId,
                    employeeShiftId,
                    dateOfJoin,
                    confirmationDate,
                    reportingManager,
                    workLocation,
                    metroNonMetro,
                    costCenter,
                    paymentMethod,
                    uanNo,
                    isPF,
                    pfNo,
                    isEsi,
                    esiNo,
                    isOvertimeApplicable,
                    overTimeCategoryId
                }
            },
            { new: true }
        );

        if (!updatedEmployee) {
            return responseHandlier.errorResponse(false, "Employee not found", res);
        }

        // Tracking
        let trackingData = {
            trackingId: updatedEmployee._id,
            module: 'employee',
            mode: 'update',
            postData: req.body,
            createdBy: req.userId,
            createdOn: new Date(),
            status: "success",
            message: "Employee details updated successfully."
        };

        const newTrackingModel = new emptracking(trackingData);
        await newTrackingModel.save();

        responseHandlier.successResponse(true, updatedEmployee, res);
    } catch (error) {
        console.error("Error:", error);
        responseHandlier.errorResponse(false, error.message || error, res);
    }
};


/**
 * @get
 * @param {*} req
 * @param {*} res
 * @returns to add all getAllHrEmployeeOfficial details in db
 */

module.exports.getAllHrEmployeeOfficial = async (req, res) => {
    try {
        const filterObj = commonFunction.filterObject(req);

        const employmentTypeDetails = await employee.find(filterObj, commonVariable.unSelect.common);

        let employeFinalRes = employmentTypeDetails.map(employee => ({
            _id: employee._id,
            departmentId: employee.departmentId,
            designationId: employee.designationId,
            projectId: employee.projectId,
            employeeGradeId: employee.employeeGradeId,
            employeeShiftId: employee.employeeShiftId,
            dateOfJoin: employee.dateOfJoin,
            confirmationDate: employee.confirmationDate,
            reportingManager: employee.reportingManager,
            workLocation: employee.workLocation,
            metroNonMetro: employee.metroNonMetro,
            costCenter: employee.costCenter,
            paymentMethod: employee.paymentMethod,
            uanNo: employee.uanNo,
            isPF: employee.isPF,
            pfNo: employee.pfNo,
            isEsi: employee.isEsi,
            esiNo: employee.esiNo,
            isOvertimeApplicable: employee.isOvertimeApplicable,
            overTimeCategoryId: employee.overTimeCategoryId
        }));

        responseHandlier.successResponse(true, employeFinalRes, res);
    } catch (error) {
        responseHandlier.errorResponse(false, error, res);
    }
};

/**
 * @update
 * @param {*} req
 * @param {*} res
 * @returns to add all updateHrEmployeeOfficial details in db
 */

module.exports.updateHrEmployeeOfficial = async function (req, res) {
    try {
        if (!req.body._id) {
            return responseHandlier.errorResponse(false, "_id is required.", res);
        }

        const employmentTypeId = {
            _id: req.body._id
        };

        let trackingData = {
            trackingId: employmentTypeId,
            module: 'employeeofficial',
            mode: 'update',
            postData: req.body,
            createdBy: req.userId,
            createdOn: new Date(),
        };

        req.body.updatedBy = req.userId;
        req.body.updatedOn = new Date();
        const requestData = req.body;

        const updatedPositionDetails = await employee.findByIdAndUpdate(
            employmentTypeId,
            requestData,
            { new: true }
        );

        trackingData.status = 'success';
        trackingData.message = " updated successfully..";
        const newTrackingModel = new emptracking(trackingData);
        await newTrackingModel.save();

        responseHandlier.successResponse(true, updatedPositionDetails, res);
    } catch (error) {
        console.log(error);
        responseHandlier.errorResponse(false, error, res);
    }
};

/**
 * @add
 * @param {*} req
 * @param {*} res
 * @returns to add all addHrEmployeeBank details in db
 */

// module.exports.addHrEmployeeBank  = async (req, res) => {
//     try {
//         const {
//             empId,
//             isBankAccount,
//             bankId,
//             bankAccountNo,
//             bankAccountHolderName,
//             ifsc,
//             bankBranch,
//             accountType
//         } = req.body;

//         const updatedEmployee = await employee.findOneAndUpdate(
//             { "_id": empId },
//             {
//                 "$set": {
//                     isBankAccount,
//                     bankId,
//                     bankAccountNo,
//                     bankAccountHolderName,
//                     ifsc,
//                     bankBranch,
//                     accountType,

//                 }
//             },
//             { new: true }
//         );

//         if (!updatedEmployee) {
//             return responseHandlier.errorResponse(false, "Employee not found", res);
//         }

//         responseHandlier.successResponse(true, updatedEmployee, res);
//     } catch (error) {
//         console.error("Error:", error);
//         responseHandlier.errorResponse(false, error.message || error, res); 
//     }
// };

module.exports.addHrEmployeeBank = async (req, res) => {
    try {
        const {
            empId,
            isBankAccount,
            bankId,
            bankAccountNo,
            bankAccountHolderName,
            ifsc,
            bankBranch,
            accountType
        } = req.body;

        const updatedEmployee = await employee.findOneAndUpdate(
            { "_id": empId },
            {
                "$set": {
                    isBankAccount,
                    bankId,
                    bankAccountNo,
                    bankAccountHolderName,
                    ifsc,
                    bankBranch,
                    accountType,
                }
            },
            { new: true }
        );

        if (!updatedEmployee) {
            return responseHandlier.errorResponse(false, "Employee not found", res);
        }

        // Tracking
        let trackingData = {
            trackingId: updatedEmployee._id,
            module: 'employee',
            mode: 'update_bank_details',
            postData: req.body,
            createdBy: req.userId,
            createdOn: new Date(),
            status: "success",
            message: "Employee bank details updated successfully."
        };

        const newTrackingModel = new emptracking(trackingData);
        await newTrackingModel.save();

        responseHandlier.successResponse(true, updatedEmployee, res);
    } catch (error) {
        console.error("Error:", error);
        responseHandlier.errorResponse(false, error.message || error, res);
    }
};


/**
 * @get
 * @param {*} req
 * @param {*} res
 * @returns to add all getAllHrEmployeeBank details in db
*/

module.exports.getAllHrEmployeeBank = async (req, res) => {
    try {
        const filterObj = commonFunction.filterObject(req);

        const employmentTypeDetails = await employee.find(filterObj, commonVariable.unSelect.common);

        let employeFinalRes = employmentTypeDetails.map(employee => ({
            _id: employee._id,
            isBankAccount: employee.isBankAccount,
            bankId: employee.bankId,
            bankAccountNo: employee.bankAccountNo,
            bankAccountHolderName: employee.bankAccountHolderName,
            ifsc: employee.ifsc,
            bankBranch: employee.bankBranch,
            accountType: employee.accountType
        }));

        responseHandlier.successResponse(true, employeFinalRes, res);
    } catch (error) {
        responseHandlier.errorResponse(false, error, res);
    }
};

/**
 * @update
 * @param {*} req
 * @param {*} res
 * @returns to add all updateHrEmployeeBank details in db
 */

module.exports.updateHrEmployeeBank = async function (req, res) {
    try {
        if (!req.body._id) {
            return responseHandlier.errorResponse(false, "_id is required.", res);
        }

        const employmentTypeId = {
            _id: req.body._id
        };

        let trackingData = {
            trackingId: employmentTypeId,
            module: 'employeebank',
            mode: 'update',
            postData: req.body,
            createdBy: req.userId,
            createdOn: new Date(),
        };

        req.body.updatedBy = req.userId;
        req.body.updatedOn = new Date();
        const requestData = req.body;

        const updatedPositionDetails = await employee.findByIdAndUpdate(
            employmentTypeId,
            requestData,
            { new: true }
        );

        trackingData.status = 'success';
        trackingData.message = " updated successfully..";
        const newTrackingModel = new emptracking(trackingData);
        await newTrackingModel.save();

        responseHandlier.successResponse(true, updatedPositionDetails, res);
    } catch (error) {
        console.log(error);
        responseHandlier.errorResponse(false, error, res);
    }
};

/**
 * @add
 * @param {*} req
 * @param {*} res
 * @returns to add all addHrEmployeeAddress details in db
 */

// module.exports.addHrEmployeeAddress  = async (req, res) => {
//     try {
//         const {
//             empId,
//             permanentAddress1,
//             permanentAddress2,
//             pCityId,
//             pStateId,
//             pCountryId,
//             pzipcode,
//             plandlineNo,
//             issameas,
//             communicationAddress1,
//             communicationAddress2,
//             cCityId,
//             cStateId,
//             cCountryId,
//             czipcode,
//             clandlineNo
//         } = req.body;

//         const updatedEmployee = await employee.findOneAndUpdate(
//             { "_id": empId },
//             {
//                 "$set": {
//                     permanentAddress1,
//                     permanentAddress2,
//                     pCityId,
//                     pStateId,
//                     pCountryId,
//                     pzipcode,
//                     plandlineNo,
//                     issameas,
//                     communicationAddress1,
//                     communicationAddress2,
//                     cCityId,
//                     cStateId,
//                     cCountryId,
//                     czipcode,
//                     clandlineNo
//                 }
//             },
//             { new: true }
//         );

//         if (!updatedEmployee) {
//             return responseHandlier.errorResponse(false, "Employee not found", res);
//         }

//         responseHandlier.successResponse(true, updatedEmployee, res);
//     } catch (error) {
//         console.error("Error:", error);
//         responseHandlier.errorResponse(false, error.message || error, res); 
//     }
// };

module.exports.addHrEmployeeAddress = async (req, res) => {
    try {
        const {
            empId,
            permanentAddress1,
            permanentAddress2,
            pCityId,
            pStateId,
            pCountryId,
            pzipcode,
            plandlineNo,
            issameas,
            communicationAddress1,
            communicationAddress2,
            cCityId,
            cStateId,
            cCountryId,
            czipcode,
            clandlineNo
        } = req.body;

        const updatedEmployee = await employee.findOneAndUpdate(
            { "_id": empId },
            {
                "$set": {
                    permanentAddress1,
                    permanentAddress2,
                    pCityId,
                    pStateId,
                    pCountryId,
                    pzipcode,
                    plandlineNo,
                    issameas,
                    communicationAddress1,
                    communicationAddress2,
                    cCityId,
                    cStateId,
                    cCountryId,
                    czipcode,
                    clandlineNo
                }
            },
            { new: true }
        );

        if (!updatedEmployee) {
            return responseHandlier.errorResponse(false, "Employee not found", res);
        }

        // Tracking
        let trackingData = {
            trackingId: updatedEmployee._id,
            module: 'employee',
            mode: 'update',
            postData: req.body,
            createdBy: req.userId,
            createdOn: new Date(),
            status: "success",
            message: "Employee address details updated successfully."
        };

        const newTrackingModel = new emptracking(trackingData);
        await newTrackingModel.save();

        responseHandlier.successResponse(true, updatedEmployee, res);
    } catch (error) {
        console.error("Error:", error);
        responseHandlier.errorResponse(false, error.message || error, res);
    }
};


/**
 * @get
 * @param {*} req
 * @param {*} res
 * @returns to add all getAllHrEmployeeAddress details in db
 */

module.exports.getAllHrEmployeeAddress = async (req, res) => {
    try {
        const filterObj = commonFunction.filterObject(req);

        const employmentTypeDetails = await employee.find(filterObj, commonVariable.unSelect.common);

        let employeFinalRes = employmentTypeDetails.map(employee => ({
            _id: employee._id,
            permanentAddress1: employee.permanentAddress1,
            permanentAddress2: employee.permanentAddress2,
            pCityId: employee.pCityId,
            pStateId: employee.pStateId,
            pCountryId: employee.pCountryId,
            pzipcode: employee.pzipcode,
            plandlineNo: employee.plandlineNo,
            issameas: employee.issameas,
            communicationAddress1: employee.communicationAddress1,
            communicationAddress2: employee.communicationAddress2,
            cCityId: employee.cCityId,
            cStateId: employee.cStateId,
            cCountryId: employee.cCountryId,
            czipcode: employee.czipcode,
            clandlineNo: employee.clandlineNo
        }));

        responseHandlier.successResponse(true, employeFinalRes, res);
    } catch (error) {
        responseHandlier.errorResponse(false, error, res);
    }
};

/**
 * @update
 * @param {*} req
 * @param {*} res
 * @returns to add all updateHrEmployeeAddress details in db
 */

module.exports.updateHrEmployeeAddress = async function (req, res) {
    try {
        if (!req.body._id) {
            return responseHandlier.errorResponse(false, "_id is required.", res);
        }

        const employmentTypeId = {
            _id: req.body._id
        };

        let trackingData = {
            trackingId: employmentTypeId,
            module: 'employeeaddress',
            mode: 'validModes',
            postData: req.body,
            createdBy: req.userId,
            createdOn: new Date(),
        };

        req.body.updatedBy = req.userId;
        req.body.updatedOn = new Date();
        const requestData = req.body;

        const updatedPositionDetails = await employee.findByIdAndUpdate(
            employmentTypeId,
            requestData,
            { new: true }
        );

        trackingData.status = 'success';
        trackingData.message = " updated successfully..";
        const newTrackingModel = new emptracking(trackingData);
        await newTrackingModel.save();

        responseHandlier.successResponse(true, updatedPositionDetails, res);
    } catch (error) {
        console.log(error);
        responseHandlier.errorResponse(false, error, res);
    }
};

/**
 * @add
 * @param {*} req
 * @param {*} res
 * @returns to add all addHrEmployeeKycDoc details in db
 */

// module.exports.addHrEmployeeKycDoc   = async (req, res) => {
//     try {
//         const {
//             empId,
//             isPassport,
//             passportNo,
//             passportValidUpto,
//             isDrivingLicence,
//             DrivingLicenceNo,
//             DrivingLicenceValidUpto,
//             isAadharCard,
//             aadharCardNo
//         } = req.body;

//         const updatedEmployee = await employee.findOneAndUpdate(
//             { "_id": empId },
//             {
//                 "$set": {
//                     isPassport,
//                     passportNo,
//                     passportValidUpto,
//                     isDrivingLicence,
//                     DrivingLicenceNo,
//                     DrivingLicenceValidUpto,
//                     isAadharCard,
//                     aadharCardNo
//                 }
//             },
//             { new: true }
//         );

//         if (!updatedEmployee) {
//             return responseHandlier.errorResponse(false, "Employee not found", res);
//         }

//         responseHandlier.successResponse(true, updatedEmployee, res);
//     } catch (error) {
//         console.error("Error:", error);
//         responseHandlier.errorResponse(false, error.message || error, res); 
//     }
// };

module.exports.addHrEmployeeKycDoc = async (req, res) => {
    try {
        const {
            empId,
            isPassport,
            passportNo,
            passportValidUpto,
            isDrivingLicence,
            DrivingLicenceNo,
            DrivingLicenceValidUpto,
            isAadharCard,
            aadharCardNo
        } = req.body;

        const updatedEmployee = await employee.findOneAndUpdate(
            { "_id": empId },
            {
                "$set": {
                    isPassport,
                    passportNo,
                    passportValidUpto,
                    isDrivingLicence,
                    DrivingLicenceNo,
                    DrivingLicenceValidUpto,
                    isAadharCard,
                    aadharCardNo
                }
            },
            { new: true }
        );

        if (!updatedEmployee) {
            return responseHandlier.errorResponse(false, "Employee not found", res);
        }

        // Tracking
        let trackingData = {
            trackingId: updatedEmployee._id,
            module: 'employee',
            mode: 'update_kyc_docs',
            postData: req.body,
            createdBy: req.userId,
            createdOn: new Date(),
            status: "success",
            message: "Employee KYC documents updated successfully."
        };

        const newTrackingModel = new emptracking(trackingData);
        await newTrackingModel.save();

        responseHandlier.successResponse(true, updatedEmployee, res);
    } catch (error) {
        console.error("Error:", error);
        responseHandlier.errorResponse(false, error.message || error, res);
    }
};


/**
 * @get
 * @param {*} req
 * @param {*} res
 * @returns to add all getAllHrEmployeeKycDoc details in db
 */

module.exports.getAllHrEmployeeKycDoc = async (req, res) => {
    try {

        console.log(req.body)
        const filterObj = commonFunction.filterObject(req);
      
        const employmentTypeDetails = await employee.find(filterObj, commonVariable.unSelect.common);

        let employeFinalRes = employmentTypeDetails.map(employee => ({
            _id: employee._id,
            isPassport: employee.isPassport,
            passportNo: employee.passportNo,
            passportValidUpto: employee.passportValidUpto,
            isDrivingLicence: employee.isDrivingLicence,
            DrivingLicenceNo: employee.DrivingLicenceNo,
            DrivingLicenceValidUpto: employee.DrivingLicenceValidUpto,
            isAadharCard: employee.isAadharCard,
            aadharCardNo: employee.aadharCardNo
        }));

        responseHandlier.successResponse(true, employeFinalRes, res);
    } catch (error) {
        responseHandlier.errorResponse(false, error, res);
    }
};

/**
 * @update
 * @param {*} req
 * @param {*} res
 * @returns to add all updateHrEmployeeKycDoc details in db
 */
module.exports.updateHrEmployeeKycDoc = async function (req, res) {
    try {
        if (!req.body._id) {
            return responseHandlier.errorResponse(false, "_id is required.", res);
        }

        const employmentTypeId = {
            _id: req.body._id
        };

        let trackingData = {
            trackingId: employmentTypeId,
            module: 'employeeofficial',
            mode: 'update',
            postData: req.body,
            createdBy: req.userId,
            createdOn: new Date(),
        };

        req.body.updatedBy = req.userId;
        req.body.updatedOn = new Date();
        const requestData = req.body;

        const updatedPositionDetails = await employee.findByIdAndUpdate(
            employmentTypeId,
            requestData,
            { new: true }
        );

        trackingData.status = 'success';
        trackingData.message = " updated successfully..";
        const newTrackingModel = new emptracking(trackingData);
        await newTrackingModel.save();

        responseHandlier.successResponse(true, updatedPositionDetails, res);
    } catch (error) {
        console.log(error);
        responseHandlier.errorResponse(false, error, res);
    }
};

/**
 * @add
 * @param {*} req
 * @param {*} res
 * @returns to add all addHrEmployeeEmgContact details in db
 */

// module.exports.addHrEmployeeEmgContact = async (req, res) => {
//     try {
//         const {
//             empId,
//             emgContact1,
//             emgContact2,
//             emgContact3,
//             emgContact4
//         } = req.body;

//         const updatedEmployee = await employee.findOneAndUpdate(
//             { "_id": empId },
//             {
//                 "$set": {
//                     emgContact1,
//                     emgContact2,
//                     emgContact3,
//                     emgContact4,

//                 }
//             },
//             { new: true }
//         );

//         if (!updatedEmployee) {
//             return responseHandlier.errorResponse(false, "Employee not found", res);
//         }

//         responseHandlier.successResponse(true, updatedEmployee, res);
//     } catch (error) {
//         console.error("Error:", error);
//         responseHandlier.errorResponse(false, error.message || error, res); 
//     }
// };

module.exports.addHrEmployeeEmgContact = async (req, res) => {
    try {
        const {
            empId,
            emgContact1,
            emgContact2,
            emgContact3,
            emgContact4
        } = req.body;

        const updatedEmployee = await employee.findOneAndUpdate(
            { "_id": empId },
            {
                "$set": {
                    emgContact1,
                    emgContact2,
                    emgContact3,
                    emgContact4,
                }
            },
            { new: true }
        );

        if (!updatedEmployee) {
            return responseHandlier.errorResponse(false, "Employee not found", res);
        }

        // Tracking
        let trackingData = {
            trackingId: updatedEmployee._id,
            module: 'employee',
            mode: 'update_emergency_contacts',
            postData: req.body,
            createdBy: req.userId,
            createdOn: new Date(),
            status: "success",
            message: "Employee emergency contacts updated successfully."
        };

        const newTrackingModel = new emptracking(trackingData);
        await newTrackingModel.save();

        responseHandlier.successResponse(true, updatedEmployee, res);
    } catch (error) {
        console.error("Error:", error);
        responseHandlier.errorResponse(false, error.message || error, res);
    }
};


/**
 * @get
 * @param {*} req
 * @param {*} res
 * @returns to add all getAllHrEmployeeEmgContact details in db
 */

module.exports.getAllHrEmployeeEmgContact = async (req, res) => {
    try {
        const filterObj = commonFunction.filterObject(req);

        const employmentTypeDetails = await employee.find(filterObj, commonVariable.unSelect.common);

        let employeFinalRes = employmentTypeDetails.map(employee => ({
            _id: employee._id,
            emgContact1: employee.emgContact1,
            emgContact2: employee.emgContact2,
            emgContact3: employee.emgContact3,
            emgContact4: employee.emgContact4
        }));

        responseHandlier.successResponse(true, employeFinalRes, res);
    } catch (error) {
        responseHandlier.errorResponse(false, error, res);
    }
};

/**
 * @update
 * @param {*} req
 * @param {*} res
 * @returns to add all updateHrEmployeeEmgContact details in db
 */

module.exports.updateHrEmployeeEmgContact = async function (req, res) {
    try {
        if (!req.body._id) {
            return responseHandlier.errorResponse(false, "_id is required.", res);
        }

        const employmentTypeId = {
            _id: req.body._id
        };

        let trackingData = {
            trackingId: employmentTypeId,
            module: 'employeeemgcontact',
            mode: 'update',
            postData: req.body,
            createdBy: req.userId,
            createdOn: new Date(),
        };

        req.body.updatedBy = req.userId;
        req.body.updatedOn = new Date();
        const requestData = req.body;

        const updatedPositionDetails = await employee.findByIdAndUpdate(
            employmentTypeId,
            requestData,
            { new: true }
        );

        trackingData.status = 'success';
        trackingData.message = " updated successfully..";
        const newTrackingModel = new emptracking(trackingData);
        await newTrackingModel.save();

        responseHandlier.successResponse(true, updatedPositionDetails, res);
    } catch (error) {
        console.log(error);
        responseHandlier.errorResponse(false, error, res);
    }
};