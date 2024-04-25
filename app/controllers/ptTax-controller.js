const ObjectId = require('mongodb').ObjectId;
const responseHandlier = require('../libs/response/status');
const commonVariable  = require('../libs/static/common.js');
const commonFunction = require('../libs/util/commonFunctions.js');
const ptTaxModel = require('../models/ptTax-model.js');
const trackingModel = require('../models/tracking-model.js');


/**
 * @post
 * @param {*} req
 * @param {*} res
 * @returns to get all addState details in db
 */


module.exports.addHrPtTax = async(req,res)=>{
    try {
        let newPtTax = new ptTaxModel({
            yearSlapId : req.body.yearSlapId,
            slapYear :req.body.slapYear,
            stateId : req.body.stateId,
            slabValues: req.body.slabValues.map((slabValues) => ({
                fromValue: slabValues.fromValue,
                toValue: slabValues.toValue,
                taxAmount :slabValues.taxAmount,
                status : commonVariable.status.ACTIVE,
              })),
            description : req.body.description,
            status: commonVariable.status.ACTIVE,
            createdBy: req.userId,
            createdOn: new Date(),

        })

        await newPtTax.save();
        let trackingId = newPtTax._id
            
        
        let trackingData ={
            trackingId : trackingId,
            module : 'PT Tax',
            mode :'add',
            postData : req.body,
            createdBy: req.userId,
            createdOn: new Date(),
        }
        trackingData.status = 'success',
        trackingData.message ="new PT tax added  successfully..";
        const newTrackingModel = new trackingModel(trackingData)
        newTrackingModel.save();
        responseHandlier,responseHandlier.successResponse(true,"PT tax inserted successfully",res)
    } catch (error) {
        console.error("error", error);
        responseHandlier.errorResponse(false, error, res);   
    }
}

// module.exports.getHrPtTax = async (req, res) => {
//     try {
//       const filterObj = commonFunction.filterObject(req);
  
//       const productVersionDetails = await ptTaxModel.find(filterObj)
//       .populate({
//         path: 'yearSlapId',
//         select: 'financialYear'
//     })
//     .populate({
//           path: 'stateId',
//           select: 'stateName'
//     })
//     .select(commonVariable.unSelect.common)
//     .exec();
  
//         responseHandlier.successResponse(true, productVersionDetails, res);
//     } catch (error) {
//       console.log("error", error);
//       responseHandlier.errorResponse(false, error, res);
//     }
// };


module.exports.getHrPtTax = async (req, res) => {
    try {
        const filterObj = commonFunction.filterObject(req);

        const requestQuery = [
            {
                $match: filterObj,
            },
            {
                $lookup: {
                    from: "incometaxslapmasters",
                    localField: "yearSlapId",
                    foreignField: "_id",
                    as: "outputArray",
                },
            },
            {
                $lookup: {
                    from: "hrstates",
                    localField: "stateId",
                    foreignField: "_id",
                    as: "output",
                },
            },
            {
                $project: {
                    _id: 1,
                    yearSlapId: 1,
                    slapYear: 1,
                    stateId: 1,
                    slabValues: 1,
                    description: 1,
                    status: 1,
                    createdBy: 1,
                    updatedBy: 1,
                    createdOn: 1,
                    updatedon: 1,
                    yearSlapName: { $arrayElemAt: ["$outputArray.slabYear", 0] }, 
                    stateName: { $arrayElemAt: ["$output.stateName", 0] },
                },
            },
        ];

        const equipment = await ptTaxModel.aggregate(requestQuery);
        responseHandlier.successResponse(true, equipment, res);
    } catch (error) {
        console.log("error", error);
        responseHandlier.errorResponse(false, error, res);
    }
};



module.exports.updateHrPtTax = async function (req, res) {
    try {
        if (!req.body._id) {
            return responseHandlier.errorResponse(false, "yearSlap _id is required.", res);
        }

        const ptTaxId = {
            _id: req.body._id
        };

        let trackingData = {
            trackingId: ptTaxId,
            module: 'PT Tax',
            mode: 'update',
            postData: req.body,
            createdBy: req.userId,
            createdOn: new Date(),
        };

        req.body.updatedBy = req.userId;
        req.body.updatedOn = new Date();
        const requestData = req.body;

        const updatedPositionDetails = await ptTaxModel.findByIdAndUpdate(
            ptTaxId,
            requestData,
            { new: true }
        );

        trackingData.status = 'success';
        trackingData.message = "ptTax updated successfully..";
        const newTrackingModel = new trackingModel(trackingData);
        await newTrackingModel.save();

        responseHandlier.successResponse(true, updatedPositionDetails, res);
    } catch (error) {
        console.log(error);
        responseHandlier.errorResponse(false, error, res);
    }
};

module.exports.deleteHrPtTax = async function (req, res) {
    try {
        if (!req.body._id || !Array.isArray(req.body._id)) {
            return responseHandlier.errorResponse(false, "ptTax_id array is required.", res);
        }

        const ptTaxIds = req.body._id;

        let trackingData = {
            trackingId: ptTaxIds,
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

        const updatedPositionDetails = await ptTaxModel.updateMany(
            { _id: { $in: ptTaxIds } },
            requestData,
            { new: true }
        );

        trackingData.status = 'success';
        trackingData.message = "ptTax deleted successfully..";
        const newTrackingModel = new trackingModel(trackingData);
        await newTrackingModel.save();

        responseHandlier.successResponse(true, updatedPositionDetails, res);
    } catch (error) {
        console.log(error);
        responseHandlier.errorResponse(false, error, res);
    }
};
