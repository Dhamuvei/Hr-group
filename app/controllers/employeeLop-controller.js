const employeeModel =require('../models/employee-model.js')
const responseHandlier = require('../libs/response/status');
const commonVariable  = require('../libs/static/common.js');
const commonFunction = require('../libs/util/commonFunctions.js');
const trackingModel = require('../models/tracking-model.js');
const employeeLopModel = require('../models/employeeLop-model.js');




module.exports.addEmployeeLop = async (req, res) => {
    try {
      
        const employeeDetails = await employeeModel.findById(req.body.employeeId);
        
        
        if (!employeeDetails) {
            return responseHandlier.errorResponse(false, 'Employee not found', res);
        }

        const { firstName, lastName } = employeeDetails;
        const employeeName = `${firstName} ${lastName}`;

        const lrCount = await employeeLopModel.countDocuments();
         
        const startNumber = 10000;
        
        const lrInc = lrCount + startNumber;
        const requestNo = `ELOP-${lrInc}`;

        
     
  
        let newEmployeeLop = new employeeLopModel({
            
            employeeId: req.body.employeeId,
            employeeName: employeeName ,
            requestNo: requestNo,
            requestDate: new Date(),
            noOfLop: req.body.noOfLop,  
            selectMonth: req.body.selectMonth,
            selectYear: req.body.selectYear,
            status: commonVariable.status.ACTIVE,
            createdBy: req.userId,
            createdOn: new Date()
        });

        await newEmployeeLop.save();

        let empLopId = newEmployeeLop._id;

        let trackingData = {
            trackingId: empLopId,
            module: 'Employee LOP',
            mode: 'add',
            postData: req.body,
            createdBy: req.userId,
            createdOn: new Date(),
        };
        trackingData.status = "success";
        trackingData.message = " employeeLop insert successfully..";
        let newtrackingmodel = new trackingModel(trackingData);
        newtrackingmodel.save();

        responseHandlier.successResponse(true, 'employeeLop Insert Successfully', res);
    } catch (error) {
        console.error("error", error);
        responseHandlier.errorResponse(false, error, res);
    }
};


module.exports.getEmployeeLop = async (req, res) => {
    try {
        // Get the filter parameters from the request query
        const year = req.body.selectYear;
        const month = req.body.selectMonth;
       

        // Create an empty filter object
        const filterObj = {};

        // Add conditions to the filter based on the provided parameters
        if (year) {
            // Filter by year
            filterObj.selectYear = parseInt(year);
        }

        if (month) {
            // Filter by month
            filterObj.selectMonth = parseInt(month);
        }

       
        // Fetch employeeLopDatails based on the filterObj
        const employeeLopDatails = await employeeLopModel.find(filterObj, commonVariable.unSelect.common);

        responseHandlier.successResponse(true, employeeLopDatails, res);
    } catch (error) {
        responseHandlier.errorResponse(false, error, res);
    }
};



module.exports.updateEmployeeLop = async function (req, res) {
    try {
        if (!req.body._id) {
            return responseHandlier.errorResponse(false, "employeeLop _id is required.", res);
        }

        const empLopId = {
            _id: req.body._id
        };

        let trackingData = {
            trackingId: empLopId,
            module: 'Employee LOP',
            mode: 'update',
            postData: req.body,
            createdBy: req.userId,
            createdOn: new Date(),
        };

        req.body.updatedBy = req.userId;
        req.body.updatedOn = new Date();
        const requestData = req.body;

        const updatedPositionDetails = await employeeLopModel.findByIdAndUpdate(
            empLopId,
            requestData,
            { new: true }
        );

        trackingData.status = 'success';
        trackingData.message = "employeeLop updated successfully..";
        const newTrackingModel = new trackingModel(trackingData);
        await newTrackingModel.save();

        responseHandlier.successResponse(true, updatedPositionDetails, res);
    } catch (error) {
        console.log(error);
        responseHandlier.errorResponse(false, error, res);
    }
};

module.exports.deleteEmployeeLop = async function (req, res) {
    try {
        if (!req.body._id || !Array.isArray(req.body._id)) {
            return responseHandlier.errorResponse(false, "employeeLop _id array is required.", res);
        }

        const empLopId = req.body._id;

        let trackingData = {
            trackingId: empLopId,
            module: 'Employee LOP',
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

        const updatedPositionDetails = await employeeLopModel.updateMany(
            { _id: { $in: empLopId } },
            requestData,
            { new: true }
        );

        trackingData.status = 'success';
        trackingData.message = "employeeLOP deleted successfully..";
        const newTrackingModel = new trackingModel(trackingData);
        await newTrackingModel.save();

        responseHandlier.successResponse(true, updatedPositionDetails, res);
    } catch (error) {
        console.log(error);
        responseHandlier.errorResponse(false, error, res);
    }
};