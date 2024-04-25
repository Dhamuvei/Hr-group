const menuModel = require('../models/menu-model');
const responseHandlier = require('../libs/response/status');
const commonVariable  = require('../libs/static/common.js');
const commonFunction = require('../libs/util/commonFunctions.js');
const trackingModel = require('../models/tracking-model.js');



// module.exports.addHrMenu = async (req, res) => {
//     try {
//         if (!req.body.menuName) {
//             return responseHandlier.errorResponse(false, "Menu name is required.", res);
//         }

//         let query = {
//             menuName: req.body.menuName,
//             menuType: req.body.menuType
//         };

//         const menuDetails = await menuModel.findOne(query).exec();

//         if (menuDetails) {
//             return responseHandlier.errorResponse(false, "This menu name has already been registered.", res);
//         }

//         // Find the maximum sequence number for the specific menuType
//         const maxSequenceResult = await menuModel.findOne({ menuType: req.body.menuType })
//             .sort('-sequence')
//             .exec();

//         // Calculate the next sequence number
//         let nextSequenceNo = 1;
//         if (maxSequenceResult) {
//             nextSequenceNo = maxSequenceResult.sequence + 1;
//         }

//         let newMenu = new menuModel({
//             menuName: req.body.menuName,
//             menukey: req.body.menukey,
//             menuType: req.body.menuType,
//             menuReferenceId: req.body.menuReferenceId,
//             access: req.body.access,
//             isNew: req.body.isNew,
//             labelName: req.body.labelName,
//             menuMode: req.body.menuMode,
//             status: commonVariable.status.ACTIVE,
//             createdBy: req.userId,
//             createdOn: new Date(),
//             sequence: nextSequenceNo, // Assign the calculated sequence number
//         });

//         const savedMenu = await newMenu.save();

//         responseHandlier.successResponse(true, 'Successfully Inserted', res);
//     } catch (error) {
//         console.error("error", error);
//         return responseHandlier.errorResponse(false, error, res);
//     }
// };




module.exports.addHrMenu = async (req, res) => {
    try {
        if (!req.body.menuName) {
            return responseHandlier.errorResponse(false, "Menu name is required.", res);
        }

        let query = {
            menuName: req.body.menuName,
            menuType: req.body.menuType
        };

        const menuDetails = await menuModel.findOne(query).exec();

        if (menuDetails) {
            return responseHandlier.errorResponse(false, "This menu name has already been registered.", res);
        }

        // Find the maximum sequence number for the specific menuType
        const maxSequenceResult = await menuModel.findOne({ menuType: req.body.menuType })
            .sort('-sequence')
            .exec();

        // Calculate the next sequence number
        let nextSequenceNo = 1;
        if (maxSequenceResult) {
            nextSequenceNo = maxSequenceResult.sequence + 1;
        }

        let newMenu = new menuModel({
            menuName: req.body.menuName,
            menukey: req.body.menukey,
            menuType: req.body.menuType,
            menuReferenceId: req.body.menuReferenceId,
            access: req.body.access,
            isNew: req.body.isNew,
            labelName: req.body.labelName,
            menuMode: req.body.menuMode,
            status: commonVariable.status.ACTIVE,
            createdBy: req.userId,
            createdOn: new Date(),
            sequence: nextSequenceNo, 
        });

        const existingObject = await menuModel.findOne({ menuName: req.body.menuName });

        if (existingObject) {
            if (existingObject.status !== 3) {
                return responseHandlier.errorResponse(
                    false,
                    `Cannot insert. An existing object exists with a status other than 3.`,
                    res
                );
            } else {
                return responseHandlier.errorResponse(
                    false,
                    `Menu with the same name already exists.`,
                    res
                );
            }
        }

        const existingObjectStatus1 = await menuModel.findOne({ menuName: req.body.menuName, status: 1 });

        if (existingObjectStatus1) {
            return responseHandlier.errorResponse(
                false,
                `Menu with the same name already exists with status 1.`,
                res
            );
        }

        const savedMenu = await newMenu.save();

        responseHandlier.successResponse(true, 'Successfully Inserted', res);
    } catch (error) {
        console.error("error", error);
        return responseHandlier.errorResponse(false, error, res);
    }
};



module.exports.getHrMenu = async(req,res)=>{
    try {

        const query = [{
            $match: {
                status: commonFunction.findStatusVal(req.body.status)
            }
        },
        {
            $sort: { sequence: 1 }
        },
        {
            $group: {
                _id: "$menuType",
                count: {
                    $sum: 1,
                },
                menu: { "$push": "$$ROOT" }
            }
        }
        ];

        if (req.body.id) {
            query[0].$match['_id'] = ObjectId(req.body.id)
        }

        return getMenuList(query, res);

    } catch (error) {
        return responseHandlier.errorResponse(false, error, res);
    }
}


async function getMenuList(query, res) {
    try {
        const menuList = await menuModel.aggregate(query).exec();

        if (menuList) {
            responseHandlier.successResponse(true, menuList, res);
        } else {
            responseHandlier.errorResponse(false, "No menu found", res);
        }
    } catch (error) {
        responseHandlier.errorResponse(false, error, res);
    }
}


module.exports.updateHrMenu = async function (req, res) {
    try {
        if (!req.body._id) {
            return responseHandlier.errorResponse(false, "Menu _id is required.", res);
        }

        const menuId = {
            _id: req.body._id
        };

        let trackingData = {
            trackingId: menuId,
            module: 'menu',
            mode: 'update',
            postData: req.body,
            createdBy: req.userId,
            createdOn: new Date(),
        };

        req.body.updatedBy = req.userId;
        req.body.updatedOn = new Date();
        const requestData = req.body;

        const updatedPositionDetails = await menuModel.findByIdAndUpdate(
            menuId,
            requestData,
            { new: true }
        );

        trackingData.status = 'success';
        trackingData.message = "menu updated successfully..";
        const newTrackingModel = new trackingModel(trackingData);
        await newTrackingModel.save();

        responseHandlier.successResponse(true, updatedPositionDetails, res);
    } catch (error) {
        console.log(error);
        responseHandlier.errorResponse(false, error, res);
    }
};


module.exports.deleteHrMenu = async function (req, res) {
    try {
        if (!req.body._id || !Array.isArray(req.body._id)) {
            return responseHandlier.errorResponse(false, "menu _id array is required.", res);
        }

        const menuIds = req.body._id;

        let trackingData = {
            trackingId: menuIds,
            module: 'menu',
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

        const updatedPositionDetails = await menuModel.updateMany(
            { _id: { $in: menuIds } },
            requestData,
            { new: true }
        );

        trackingData.status = 'success';
        trackingData.message = "menu Deleted successfully..";
        const newTrackingModel = new trackingModel(trackingData);
        await newTrackingModel.save();

        responseHandlier.successResponse(true, updatedPositionDetails, res);
    } catch (error) {
        console.log(error);
        responseHandlier.errorResponse(false, error, res);
    }
};





module.exports.updateMenuSequance = function (req, res) {
    try {
        const sequanceArr = req.body.menuSequanceList;

        console.log(sequanceArr);

        if (sequanceArr.length === 0) {
            return responseHandlier.errorResponse(false, "Menu Sequance List is required.", res);
        }

        const updateObject = sequanceArr.map(item => ({
            updateMany: {
                filter: { _id: item._id },
                update: { sequence: item.sequence }
            }
        }));

        menuModel.bulkWrite(updateObject, { new: true })
            .then(menuDetails => {
                // console.log(menuDetails.modifiedCount);
                responseHandlier.successResponse(true, "sucecssfully updated..", res);
            })
            .catch(error => {
                console.error("error", error);
                responseHandlier.errorResponse(false, error, res);
            });
    } catch (error) {
        console.error("error", error);
        responseHandlier.errorResponse(false, error, res);
    }
};



