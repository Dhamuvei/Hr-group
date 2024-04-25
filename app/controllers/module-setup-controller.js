const ObjectId = require('mongodb').ObjectId;
const responseHandlier = require('../libs/response/status');
const commonVariable  = require('../libs/static/common');
const commonFunction = require('../libs/util/commonFunctions');
const moduleSetup = require("../models/module-setup-model")
const tracking = require("../models/tracking-model")


/**
 * @POST
 * @param {*} req
 * @param {*} res
 * @returns to add department details in db
 */

module.exports.addModuleSetup = async (req, res) => {
    try {
        let newModule = new moduleSetup({
            moduleName: req.body.moduleName,
            status: commonVariable.status.ACTIVE,
            createdBy:   req.userId,
            createdOn: new Date()
        });

        await newModule.save();

        let getmoduleSetup = newModule._id

        let trackingData ={
            trackingId : getmoduleSetup,
            module : 'moduleSetup',
            mode :'add',
            postData : req.body,
            createdBy:  req.userId,
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

module.exports.getAllModuleSetup = async (req, res) => {
    try {
        const filterObj = commonFunction.filterObject(req);

        const moduleSetupDetails = await moduleSetup.find(filterObj, commonVariable.unSelect.common);

        responseHandlier.successResponse(true, moduleSetupDetails, res);
    } catch (error) {
        responseHandlier.errorResponse(false, error, res);
    }
};