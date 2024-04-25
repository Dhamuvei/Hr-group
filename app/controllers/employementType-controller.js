const ObjectId = require('mongodb').ObjectId;
const responseHandlier = require('../libs/response/status');
const commonVariable  = require('../libs/static/common.js');
const commonFunction = require('../libs/util/commonFunctions.js');
const employmentTypeModel = require("../models/employementType-model.js");
const trackingModel = require('../models/tracking-model.js');

/**
 * @post
 * @param {*} req
 * @param {*} res
 * @returns to get all addEmployementType details in db
 */

module.exports.addHrEmploymentType = async (req, res) => {
    try {
        let newEmploymentType = new employmentTypeModel({
            employmentType: req.body.employmentType,
            shortCode: req.body.shortCode,
            description: req.body.description,
            status: commonVariable.status.ACTIVE,
            createdBy: req.userId,
            createdOn: new Date(),
        });
        await newEmploymentType.save();
        let trackingId = newEmploymentType._id
            
        
        let trackingData ={
            trackingId : trackingId,
            module : 'employmentType',
            mode :'add',
            postData : req.body,
            createdBy: req.userId,
            createdOn: new Date(),
        }
        trackingData.status = 'success',
        trackingData.message ="new employment type added  successfully..";
        const newTrackingModel = new trackingModel(trackingData)
        newTrackingModel.save();
        responseHandlier.successResponse(true, 'Successfully Inserted', res);
    } catch (error) {
        responseHandlier.errorResponse(false, error, res);
    }
};




module.exports.getHrEmploymentType = async (req, res) => {
    try {
        const filterObj = commonFunction.filterObject(req);

        const employmentTypeDetails = await employmentTypeModel.find(filterObj, commonVariable.unSelect.common);

        responseHandlier.successResponse(true, employmentTypeDetails, res);
    } catch (error) {
        responseHandlier.errorResponse(false, error, res);
    }
};

// module.exports.getHrEmploymentType = (req, res) => {
//     try {
//         const filterObj = commonFunction.filterObject(req);

//         employmentTypeModel.find(filterObj, commonVariable.unSelect.common, (error, employmentTypeDetails) => {
//             if (error) {
//                 responseHandlier.errorResponse(false, error, res)
//             } else {
//                 responseHandlier.successResponse(true, employmentTypeDetails, res);
//             }
//         });
//     } catch (error) {
//         console.log("error",error)
//         return responseHandlier.errorResponse(false, error, res);
//     }
// }

// module.exports.updateHrEmploymentType = function (req, res) {
//     try {
//         if (!req.body._id) {
//             return responseHandlier.errorResponse(false, "employmentType _id  is required.", res);
//         }

//         const employmentTypeId = {
//             _id: req.body._id
//         };
//         let trackingData ={
//             trackingId : employmentTypeId,
//             module : 'employmentType',
//             mode :'update',
//             postData : req.body,
//             createdBy: req.userId,
//             createdOn: new Date(),
//         }
//         req.body.updatedBy = req.userId;
//         req.body.updatedOn = new Date();
//         const requestData = req.body;

//         employmentTypeModel.findByIdAndUpdate(employmentTypeId, requestData, { new: true }, function (err, PositionDetails) {
//             if (err) {
//                 trackingData.status = 'failure',
//                 trackingData.message ="updated failed..!..";
//                 const newTrackingModel = new trackingModel(trackingData)
//                 newTrackingModel.save();
//                 responseHandlier.errorResponse(false, err, res)
//             } else {
//                 trackingData.status = 'success',
//                 trackingData.message ="employment type updated successfully..";
//                 const newTrackingModel = new trackingModel(trackingData)
//                 newTrackingModel.save();
//                 responseHandlier.successResponse(true, PositionDetails, res);
//             }
//         });
//     } catch (error) {
//         console.log(error)
//         return responseHandlier.errorResponse(false, error, res);
//     }
// }


module.exports.updateHrEmploymentType = async function (req, res) {
    try {
        if (!req.body._id) {
            return responseHandlier.errorResponse(false, "employmentType _id is required.", res);
        }

        const employmentTypeId = {
            _id: req.body._id
        };

        let trackingData = {
            trackingId: employmentTypeId,
            module: 'employmentType',
            mode: 'update',
            postData: req.body,
            createdBy: req.userId,
            createdOn: new Date(),
        };

        req.body.updatedBy = req.userId;
        req.body.updatedOn = new Date();
        const requestData = req.body;

        const updatedPositionDetails = await employmentTypeModel.findByIdAndUpdate(
            employmentTypeId,
            requestData,
            { new: true }
        );

        trackingData.status = 'success';
        trackingData.message = "employment type updated successfully..";
        const newTrackingModel = new trackingModel(trackingData);
        await newTrackingModel.save();

        responseHandlier.successResponse(true, updatedPositionDetails, res);
    } catch (error) {
        console.log(error);
        responseHandlier.errorResponse(false, error, res);
    }
};


// module.exports.deleteHrEmploymentType = async(req,res)=>{
//     try {
//         if (!req.body._id || !Array.isArray(req.body._id)) {
//             return responseHandlier.errorResponse(false, "employmentType IDs are required.", res);
//         }

//         const employementTypeIds = req.body._id;

//         let trackingData ={
//             trackingId : employementTypeIds,
//             module : 'employmentType',
//             mode :'delete',
//             postData : req.body,
//             createdBy:  req.userId,
//             createdOn: new Date(),
//         }

//         const requestData ={
//             $set:{
//                 status : req.body.status,
//                 updatedBy : req.userId
//             }
//         };
//         employmentTypeModel.updateMany({_id:{ $in : employementTypeIds}},requestData,function(error,result){
//             if(error){
//                 trackingData.status = 'failure',
//                 trackingData.message ="deleted failed..!..";
//                 const newTrackingModel = new trackingModel(trackingData)
//                 newTrackingModel.save();
//                 responseHandlier.errorResponse(false,error,res);
//             }
//             else{
//                 trackingData.status = 'success',
//                 trackingData.message ="employment type deleted  successfully..";
//                 const newTrackingModel = new trackingModel(trackingData)
//                 newTrackingModel.save();
//                 responseHandlier.successResponse(true,"successFully deleted..",res);
//             }
//         })
//     } catch (error) {
//         console.log(error)
//         return responseHandlier.errorResponse(false, error, res);   
//     }
// }



// module.exports.deleteHrEmploymentType = async function (req, res) {
//     try {
//         if (!req.body._id) {
//             return responseHandlier.errorResponse(false, "employmentType _id is required.", res);
//         }

//         const employmentTypeId = {
//             _id: req.body._id
//         };

//         let trackingData = {
//             trackingId: employmentTypeId,
//             module: 'employmentType',
//             mode: 'update',
//             postData: req.body,
//             createdBy: req.userId,
//             createdOn: new Date(),
//         };

//         req.body.updatedBy = req.userId;
//         req.body.updatedOn = new Date();

//         const requestData ={
//                 $set:{
//                     status : req.body.status,
//                     updatedBy : req.userId
//                 }
//             };

//         const updatedPositionDetails = await employmentTypeModel.findByIdAndUpdate(
//             employmentTypeId,
//             requestData,
//             { new: true }
//         );

//         trackingData.status = 'success';
//         trackingData.message = "employment type updated successfully..";
//         const newTrackingModel = new trackingModel(trackingData);
//         await newTrackingModel.save();

//         responseHandlier.successResponse(true, updatedPositionDetails, res);
//     } catch (error) {
//         console.log(error);
//         responseHandlier.errorResponse(false, error, res);
//     }
// };



module.exports.deleteHrEmploymentType = async function (req, res) {
    try {
        if (!req.body._id || !Array.isArray(req.body._id)) {
            return responseHandlier.errorResponse(false, "employmentType _id array is required.", res);
        }

        const employmentTypeIds = req.body._id;

        let trackingData = {
            trackingId: employmentTypeIds,
            module: 'employmentType',
            mode: 'update',
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

        const updatedPositionDetails = await employmentTypeModel.updateMany(
            { _id: { $in: employmentTypeIds } },
            requestData,
            { new: true }
        );

        trackingData.status = 'success';
        trackingData.message = "employment types updated successfully..";
        const newTrackingModel = new trackingModel(trackingData);
        await newTrackingModel.save();

        responseHandlier.successResponse(true, updatedPositionDetails, res);
    } catch (error) {
        console.log(error);
        responseHandlier.errorResponse(false, error, res);
    }
};
