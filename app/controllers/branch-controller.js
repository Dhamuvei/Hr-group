const ObjectId = require('mongodb').ObjectId;
const responseHandlier = require('../libs/response/status');
const commonVariable  = require('../libs/static/common');
const commonFunction = require('../libs/util/commonFunctions');
const branchModel = require("../models/branch-model");
const companyModel = require('../models/company-model')
const company = require("../models/company-model")
const tracking = require("../models/tracking-model");

/**
 * @POST
 * @param {*} req
 * @param {*} res
 * @returns to add department details in db
 */
module.exports.addHrBranch = async (req, res) => {
    try {

        

        if (!req.body.companyId) {
            throw new Error('companyId is required in the request body');
        }

        const companyInfo = await company.findById(req.body.companyId);

        console.log("companyInfo",companyInfo);

        if (!companyInfo) {
            throw new Error('Company not found with the given companyId');
        }
        
        

        let newBranch = new branchModel({
            companyId: req.body.companyId,
            companyName : companyInfo.companyName,
            branchName: req.body.branchName,
            shortCode: req.body.shortCode,
            address1: req.body.address1,
            address2: req.body.address2,
            cityId: req.body.cityId,
            stateId: req.body.stateId,
            countryId: req.body.countryId,
            zipcode: req.body.zipcode,
            mobileNo: req.body.mobileNo,
            alternateMobileNo : req.body.alternateMobileNo,
            emailId: req.body.emailId,
            alternateEmailId: req.body.alternateEmailId,
            phoneNo: req.body.phoneNo,
            status: commonVariable.status.ACTIVE,
            createdBy: req.userId,
            createdOn: new Date(),
            updatedBy: req.userId,
            updatedOn: new Date(),
        });


        await newBranch.save();

        let getBranchId = newBranch._id;

        let trackingData = {
            trackingId: getBranchId,
            module: 'branch',
            mode: 'add',
            postData: req.body,
            createdBy: req.userId,
            createdOn: new Date(),
        };

        trackingData.status = "success";
        trackingData.message = "insert successfully..";
        let newtrackingmodel = new tracking(trackingData);
        newtrackingmodel.save();

        responseHandlier.successResponse(true, 'Successfully Inserted', res);
    } catch (error) {
        console.error("error", error);
        responseHandlier.errorResponse(false, error.message || error, res);
    }
};


module.exports.getAllHrBranches = async (req, res) => {
    try {
    
        const companyId = req.body.companyId;

        if (!companyId) {
            responseHandlier.errorResponse(false, "CompanyId is required in the request.", res);
            return;
        }

        const filterObj = { companyId, ...commonFunction.filterObject(req) };

        const branchDetails = await branchModel.find(filterObj)
            .populate({
                path: 'cityId',
                select: 'cityName'
            })
            .populate({
                path: 'stateId',
                select: 'stateName'
            })
            .populate({
                path: 'countryId',
                select: 'countryName'
            })
            .select(commonVariable.unSelect.common)
            .exec();

        responseHandlier.successResponse(true, branchDetails, res);

    } catch (error) {
        console.error("Error:", error);
        responseHandlier.errorResponse(false, error, res);
    }
}



// module.exports.getAllHrBranches = async(req,res)=>{
//     try {

//         const filterObj = commonFunction.filterObject(req);

//         const branchDetails = await branchModel.find(filterObj)
   
//         .populate({
//             path : 'cityId',
//             select : 'cityName'
//         })
//         .populate({
//             path : 'stateId',
//             select : 'stateName'
//         })
//         .populate({
//             path : 'countryId',
//             select : 'countryName'
//         })
//         .select(commonVariable.unSelect.common)
//         .exec();

//         responseHandlier.successResponse(true,branchDetails,res);
      
//     } catch (error) {
//         console.error("Error:", error);
//         responseHandlier.errorResponse(false, error, res); 
//     }
// }


module.exports.updateHrBranch = async function (req, res) {
    try {
        console.log(req.body._id)
        if (!req.body._id) {
            return responseHandlier.errorResponse(false, "branch _id is required.", res);
        }

        const branchId = {
            _id: req.body._id
        };
        console.log(branchId);
        
        let trackingData = {
            trackingId: branchId,
            module: 'branch',
            mode: 'update',
            postData: req.body,
            createdBy: req.userId,
            createdOn: new Date(),
        };

        req.body.updatedBy = req.userId;
        req.body.updatedOn = new Date();
        const requestData = req.body;

        const updatedPositionDetails = await branchModel.findByIdAndUpdate(
            branchId,
            requestData,
            { new: true }
        );

        trackingData.status = 'success';
        trackingData.message = "  updated successfully..";
        const newTrackingModel = new tracking(trackingData);
        await newTrackingModel.save();

        responseHandlier.successResponse(true, updatedPositionDetails, res);
    } catch (error) {
        console.log(error);
        responseHandlier.errorResponse(false, error, res);
    }
};


module.exports.deleteHrBranch = async function (req, res) {
    try {
        if (!req.body._id || !Array.isArray(req.body._id)) {
            return responseHandlier.errorResponse(false, " _id array is required.", res);
        }

        const branchIds = req.body._id;

        let trackingData = {
            trackingId: branchIds,
            module: 'branch',
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

        const updatedPositionDetails = await branchModel.updateMany(
            { _id: { $in: branchIds } },
            requestData,
            { new: true }
        );

        trackingData.status = 'success';
        trackingData.message = " deleted successfully..";
        const newTrackingModel = new tracking(trackingData);
        await newTrackingModel.save();

        responseHandlier.successResponse(true, updatedPositionDetails, res);
    } catch (error) {
        console.log(error);
        responseHandlier.errorResponse(false, error, res);
    }
};