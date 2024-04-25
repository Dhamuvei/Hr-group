const ObjectId = require('mongodb').ObjectId;
const responseHandlier = require('../libs/response/status');
const commonVariable  = require('../libs/static/common.js');
const commonFunction = require('../libs/util/commonFunctions.js');
const roleModel = require("../models/role-model.js")
const trackingModel = require('../models/tracking-model.js');


module.exports.addHrRole= async(req,res)=>{
    try {
        let newrole = new roleModel({
            name : req.body.name,
            shortCode :req.body.shortCode,
            description : req.body.description,
            mode : req.body.mode,
            permission: req.body.permission.map((permission) => ({
                menuId: permission.menuId,
                access: permission.access,
              })),
                status: commonVariable.status.ACTIVE,
                createdBy: req.userId,
                createdOn: new Date(),
            })

        await newrole.save();
        let trackingId = newrole._id
            
        
        let trackingData ={
            trackingId : trackingId,
            module : 'role',
            mode :'add',
            postData : req.body,
            createdBy: req.userId,
            createdOn: new Date(),
        }
        trackingData.status = 'success',
        trackingData.message ="added  successfully..";
        const newTrackingModel = new trackingModel(trackingData)
        newTrackingModel.save();
        responseHandlier,responseHandlier.successResponse(true," inserted successfully",res)
    } catch (error) {
        console.error("error", error);
        responseHandlier.errorResponse(false, error, res);   
    }
}


module.exports.getHrRole= async (req, res) => {
    try {
        const filterObj = commonFunction.filterObject(req);

        const stateDetails = await roleModel.find(filterObj, commonVariable.unSelect.common);

        responseHandlier.successResponse(true, stateDetails, res);
    } catch (error) {
        responseHandlier.errorResponse(false, error, res);
    }
};



module.exports.updateHrRole = async function (req, res) {
    try {
        if (!req.body._id) {
            return responseHandlier.errorResponse(false, " _id is required.", res);
        }

        const roleId = {
            _id: req.body._id
        };

        let trackingData = {
            trackingId: roleId,
            module: 'role',
            mode: 'update',
            postData: req.body,
            createdBy: req.userId,
            createdOn: new Date(),
        };

        req.body.updatedBy = req.userId;
        req.body.updatedOn = new Date();
        const requestData = req.body;

        const updatedPositionDetails = await roleModel.findByIdAndUpdate(
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



module.exports.deleteHrRole= async function (req, res) {
    try {
        if (!req.body._id || !Array.isArray(req.body._id)) {
            return responseHandlier.errorResponse(false, "_id array is required.", res);
        }

        const roleIds = req.body._id;

        let trackingData = {
            trackingId: roleIds,
            module: 'PT Tax',
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

        const updatedPositionDetails = await roleModel.updateMany(
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




// module.exports.getHrRoleById = async (req, res) => {
//     try {
//         const filterObj = commonFunction.filterObject(req);

//         const roleDetails = await roleModel.find(filterObj).select(commonVariable.unSelect.common).exec();

//         const formattedRoles = roleDetails.map(role => {
//             return {
//                 _id: role._id,
//                 name: role.name,
//                 shortName: role.shortName,
//                 description: role.description,
//                 mode: role.mode,
//                 permission: role.permission,
//                 status: role.status,
//                 createdBy: role.createdBy,
//                 createdOn: role.createdOn,
//                 // Add any other properties you want to include
//             };
//         });

//         responseHandlier.successResponse(true, formattedRoles, res);
//     } catch (error) {
//         responseHandlier.errorResponse(false, error, res);
//     }
// };




module.exports.getHrRoleById = async (req, res) => {
    try {
        if (!req.query.roleId) {
            return responseHandlier.errorResponse(false, "Role Id is required.", res);
        }

        const roleId = {
            _id: req.query.roleId  // Use req.query.roleId instead of req.body.roleId
        };

        const roleDetails = await roleModel.findOne(roleId)
            .select(commonVariable.unSelect.common)
            .exec();

        if (!roleDetails) {
            return responseHandlier.errorResponse(true, 'Please provide a valid Role Id', res);
        }

        const formattedRole = {
            _id: roleDetails._id,
            name: roleDetails.name,
            shortName: roleDetails.shortName,
            description: roleDetails.description,
            mode: roleDetails.mode,
            permission: roleDetails.permission,
            status: roleDetails.status,
            createdBy: roleDetails.createdBy,
            createdOn: roleDetails.createdOn,
            // Add any other properties you want to include
        };

        responseHandlier.successResponse(true, formattedRole, res);
    } catch (error) {
        console.log(error);
        responseHandlier.errorResponse(false, error, res);
    }
};

