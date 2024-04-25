const ObjectId = require('mongodb').ObjectId;
const responseHandlier = require('../libs/response/status');
const commonVariable  = require('../libs/static/common.js');
const commonFunction = require('../libs/util/commonFunctions.js');
const calendarModel = require('../models/calender-model.js');
const trackingModel = require('../models/tracking-model.js');


/**
 * @post
 * @param {*} req
 * @param {*} res
 * @returns to get all addState details in db
 */


module.exports.addHrCalender = async(req,res)=>{
    try {
        let newCalender = new calendarModel({
            calenderName : req.body.calenderName,
            startDate :req.body.startDate,
            endDate : req.body.endDate,
            defaultNonWorkingId : req.body.defaultNonWorkingId,
            workingTimeFrom : req.body.workingTimeFrom,
            workingTimeTo : req.body.workingTimeTo,
            holidayDetail: req.body.holidayDetail.map((holidayDetails) => {
                // Calculate holidayDuration based on holidayStartDate and holidayEndDate
                const startDate = new Date(holidayDetails.holidayStartDate);
                const endDate = new Date(holidayDetails.holidayEndDate);
                const holidayDuration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1; 

                return {
                    holidayType: holidayDetails.holidayType,
                    holidayTitle: holidayDetails.holidayTitle,
                    holidayStartDate :holidayDetails.holidayStartDate,
                    holidayEndDate : holidayDetails.holidayEndDate,
                    holidayWorkingTimeFrom : holidayDetails.holidayWorkingTimeFrom,
                    holidayWorkingTimeTo : holidayDetails.holidayWorkingTimeTo,
                    holidayDuration: holidayDuration  
                };
            }),
            description : req.body.description,
            status: commonVariable.status.ACTIVE,
            createdBy: req.userId,
            createdOn: new Date(),

        })

        await newCalender.save();
        let trackingId = newCalender._id
            
        
        let trackingData ={
            trackingId : trackingId,
            module : 'Calender',
            mode :'add',
            postData : req.body,
            createdBy: req.userId,
            createdOn: new Date(),
        }
        trackingData.status = 'success',
        trackingData.message ="new Calender added  successfully..";
        const newTrackingModel = new trackingModel(trackingData)
        newTrackingModel.save();
        responseHandlier,responseHandlier.successResponse(true,"Calender inserted successfully",res)
    } catch (error) {
        console.error("error", error);
        responseHandlier.errorResponse(false, error, res);   
    }
}




module.exports.getHrCalender = async (req, res) => {
    try {
        const filterObj = commonFunction.filterObject(req);

        const calenderDetails = await calendarModel.find(filterObj, commonVariable.unSelect.common);

        responseHandlier.successResponse(true, calenderDetails, res);
    } catch (error) {
        responseHandlier.errorResponse(false, error, res);
    }
};


module.exports.updateHrCalender = async function (req, res) {
    try {
        if (!req.body._id) {
            return responseHandlier.errorResponse(false, "calendar _id is required.", res);
        }

        const calenderId = {
            _id: req.body._id
        };

        let trackingData = {
            trackingId: calenderId,
            module: 'Calendar',
            mode: 'update',
            postData: req.body,
            createdBy: req.userId,
            createdOn: new Date(),
        };

        req.body.updatedBy = req.userId;
        req.body.updatedOn = new Date();
        const requestData = req.body;

        const updatedPositionDetails = await calendarModel.findByIdAndUpdate(
            calenderId,
            requestData,
            { new: true }
        );

        trackingData.status = 'success';
        trackingData.message = "Calendar updated successfully..";
        const newTrackingModel = new trackingModel(trackingData);
        await newTrackingModel.save();

        responseHandlier.successResponse(true, updatedPositionDetails, res);
    } catch (error) {
        console.log(error);
        responseHandlier.errorResponse(false, error, res);
    }
};

module.exports.deleteHrCalender = async function (req, res) {
    try {
        if (!req.body._id || !Array.isArray(req.body._id)) {
            return responseHandlier.errorResponse(false, "calendar _id array is required.", res);
        }

        const calenderIds = req.body._id;

        let trackingData = {
            trackingId: calenderIds,
            module: 'Calendar',
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

        const updatedPositionDetails = await calendarModel.updateMany(
            { _id: { $in: calenderIds } },
            requestData,
            { new: true }
        );

        trackingData.status = 'success';
        trackingData.message = "Calender deleted successfully..";
        const newTrackingModel = new trackingModel(trackingData);
        await newTrackingModel.save();

        responseHandlier.successResponse(true, updatedPositionDetails, res);
    } catch (error) {
        console.log(error);
        responseHandlier.errorResponse(false, error, res);
    }
};

