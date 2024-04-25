const ObjectId = require('mongodb').ObjectId;
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const commonVariable = require('../../libs/static/common');
// const LeadActivity = require('../../models/lead/lead-activity-model');
const responseHandlier = require('../../libs/response/status');
const config = require('../../config');
// const moment = require('moment');
const readXlsxFile = require('read-excel-file/node')

/**
 * @param {*} arr1 
 * @param {*} arr2 
 * @param {*} returnObjName 
 * @returns Formatted menu 
 */

module.exports.formatArrayOfObj = (arr1, arr2, returnObjName, countObj) => {

    try {

        const resultArr1 = Object.entries(arr1).map(([key, value]) => {

            const resultArr2 = arr2 && arr2.map(item => {

                let temp = JSON.parse(JSON.stringify(item));

                if(countObj && countObj.myworksPending) {


                    value && value.map(valueitems => {


                        if(valueitems.menuId.menukey === "/my-works"){
    
                            let menuItem = valueitems.menuId.menuItem;
    
    
                            const valueMenuitems = menuItem && menuItem.map(menuitems => {
    
                                var obj = menuitems.menuId;
    
                                
                                if(obj && obj.menukey === "/myworks-pending" ){ obj.count = countObj.myworksPending;
                                }
                                
                                if(obj && obj.menukey === "/myworks-completed" ){ obj.count = countObj.myworksCompleted }
    
                                if(obj && obj.menukey === "/qc-completed-list" ){ obj.count = countObj.qcCompletedList }
    
                                if(obj && obj.menukey === "/my-works-pending-reworks" ){ obj.count = countObj.myWorksPendingReworks }

                                if(obj && obj.menukey === "/my-works-pending-changes" ){ obj.count = countObj.myWorksPendingChanges }
    
                                menuitems.menuId = obj
    
                                
                                return menuitems;
    
    
                            });
    
                            valueitems.menuId.menuItem = valueMenuitems
                        }
    
                    });

                }
                if (key.toString() == temp.menuId._id.toString()) {

                    if (temp.menuId[returnObjName] && temp.menuId[returnObjName].length) {

                        temp.menuId[returnObjName].push(value);

                    } else {

                        temp.menuId[returnObjName] = value;

                    }
                }

                return temp;

            });

            arr2 = resultArr2;

            return resultArr2;
        });

        arr1 = resultArr1;

        return resultArr1;


    } catch (error) {
        console.log("\n\n Common Function Error", error);
        return responseHandlier.errorResponse(false, error, res);
    }

}



module.exports.findObjectArrHaveChild = (arr) => {

    try {

        let lengthFlag = true;

        arr && arr.forEach((object) => {
            const lengthOfObj = Object.keys(object).length;

            if (lengthOfObj < 1) {

                lengthFlag = false;

            }

        })

        return lengthFlag;

    } catch (error) {

        return console.log("\n\n\n\n error", error)

    }

}


/**
 * @_Upload_FN
 */

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (!fs.existsSync('./uploads')) {
            fs.mkdir('./uploads', { recursive: true }, err => { })
        }
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '_' + file.originalname);
    },
});

module.exports.upload = multer({
    storage: storage
});

/**
 * @_filterObj
 * @param {*} reqData 
 * @returns 
 */

module.exports.filterObject = (req) => {
    try {

        let filterObj = {};

        if (req.body.status) {

            const statusVal = findStatusVal(req.body.status);
            filterObj = { status: statusVal };

        }

        if (req.body.id) {

            filterObj._id = ObjectId(req.body.id);

        }
       console.log("filterObj",filterObj) 

        return filterObj;

    } catch (error) {
        console.log("\n\n Common Function Error", error);
        return commonVariable.errorMsg.SWW;;
    }
}

// page and limit based seqNo calculate
function calculateSeqNo(page, limit, indexWithinPage) {
    try {
        return (page - 1) * limit + indexWithinPage + 1;
    } catch (error) {
        console.log("\n\n Common Function Error", error);
        // You might want to define a specific error message or return an error code here
        return commonVariable.errorMsg.SWW;
    }
}

module.exports.calculateSeqNo = calculateSeqNo;


/**
 * @_findStatusVal
 * @param {status string} reqStatus 
 * @returns 
 */


function findStatusVal(reqStatus) {

    try {

        switch (reqStatus) {
            case 'active':
                reqStatus = { "$in": [commonVariable.status.ACTIVE] };
                break;
            case 'inActive':
                reqStatus = { "$in": [commonVariable.status.IN_ACTIVE] };
                break;
            case 'both':
                reqStatus = { "$in": commonVariable.status.BOTH };
                break;
            case 'delete':
                reqStatus = { "$in": [commonVariable.status.DELETE] };
                break;
            default:
                reqStatus = {};

        }

        return reqStatus;

    } catch (error) {
        console.log("\n\n Common Function Error", error);
        return commonVariable.errorMsg.SWW;
    }

}

// For use to find status value in external

module.exports.findStatusVal = findStatusVal;

module.exports.incrementString = function incrementString(string) {
    var number = string.match(/\d+/) === null ? 0 : string.match(/\d+/)[0];
    var numberLength = number.length
    number = (parseInt(number) + 1).toString();

    while (number.length < numberLength) {
        number = "0" + number;
    }
    return string.replace(/[0-9]/g, '').concat(number);
}


module.exports.addLeadActivity = (req) => {

    try {

        return new Promise((resolve, reject) => {

            if (req.mode === commonVariable.leadOperation.INSERT) {

                const newLeadActivity = new LeadActivity({
                    leadId: req.leadId,
                    leadActivitys: [{
                        mode: req.status,
                        doneBy: req.doneBy
                    }]
                });

                newLeadActivity.save((error, leadActivity) => {
                    if (error) {
                        console.log("\n 1. Lead activity update failed", error);
                        return reject('Something went wrong');
                    } else {
                        return resolve(leadActivity);
                    }
                });

            } else {

                let leadActivityObj = {
                    mode: req.status,
                    doneBy: req.doneBy
                }

                if (req && req.assignedTo) {
                    leadActivityObj.assignedTo = req.assignedTo;
                }

                const requestData = {
                    $push: { leadActivitys: leadActivityObj }
                };


                const reqId = {
                    _id: ObjectId(req.leadId.toString())
                }
                
                
                LeadActivity.findByIdAndUpdate(reqId, requestData, { new: true }, function (err, leadDetails) {
                    if (err) {
                        return reject('Something went wrong');
                    } else {
                        return resolve(leadDetails);
                    }
                });

            }

        });

    } catch (error) {
        return responseHandlier.errorResponse(false, error, res);
    }

}

/**
 * @_filterObj
 * @param {*} reqData 
 * @returns 
 */

module.exports.getPort = (req) => {
    try {
        var urlArray = {
            "3000": "http://localhost:3000"
        };

        let port = req.socket.localPort;

        return urlArray[port];

    } catch (error) {
        console.log("\n\n Common Function Error", error);
        return commonVariable.errorMsg.SWW;;
    }
}

/**
 * @_base64
 * @param {*} reqData 
 * @returns 
 */

module.exports.base64Password = (passwordString, mode) => {
    try {
        let bufferObj = '';
        let password = '';
        if(passwordString){
            if(mode  == 'decrypt') {
                bufferObj = Buffer.from(passwordString, "base64");
                password = bufferObj.toString("utf8"); 
            } else {
                bufferObj = Buffer.from(passwordString, "utf8");
                password = bufferObj.toString("base64");
            }
        }

        return password;
    } catch (error) {
        console.log("\n\n Common Function Error", error);
        return 'none';
    }
}

/**
 * @_randomPasswordGenerate
 * @param {*} reqData 
 * @returns 
 */

module.exports.randomPasswordGenerate = (len) => {
    try {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZZYXWVUTSRQPONMLKJIHGFEDCBAUVWXYZZYXHIJKLMNLKJIHGVUTSR';
        var charactersLength = characters.length;
        for ( var i = 0; i < len; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        return result;
    } catch (error) {
        console.log("\n\n Common Function Error", error);
        return 'none';
    }
}


/**
 * @_currentDataTime
 * @param {*} reqData 
 * @returns 
 */

module.exports.currentDataTime = () => {
    try {
        var formatDate = 'YYYY-MM-DD HH:mm:ss';
        var date = moment().format(formatDate);
        var datestring = date.split(" ");
        datestringFormat = datestring[0]+'T'+datestring[1]+'.000Z';
        return new Date(datestringFormat);

    } catch (error) {
        console.log("\n\n Common Function Error", error);
        return 'none';
    }
}


module.exports.converttDataTime = (date, type) => {
    try {
        var formatDate = 'YYYY-MM-DD HH:mm:ss';

        var incoimgData = new Date(date);

        if(type == "addOneDate"){
            incoimgData.setDate(incoimgData.getDate() + 1);
        }


        var date = moment(incoimgData).format(formatDate);

        

        var datestring = date.split(" ");

        let timevalue = datestring[1];

        if(type == "to"){
            timevalue = "23:59:00"; 
        }

        if(type == "from"){
           // timevalue = datestring[1]; 
           timevalue = "00:00:00"; 
        }

        if(type == "common"){
            timevalue = datestring[1]; 
            //timevalue = "00:00:00"; 
        }

        if(type == "addOneDate"){
             timevalue = datestring[1]; 
            //timevalue = "00:00:00"; 
        }

        if(type == "evening-from"){
            timevalue = "12:01:00"; 
        }

        if(type == "morning-to"){
            timevalue = "12:00:00"; 
        }

        if(type == "timestamp"){
            timevalue = datestring[1]; 
        }
       
        datestringFormat = datestring[0]+'T'+timevalue+'.000Z';

        return new Date(datestringFormat);

    } catch (error) {
        console.log("\n\n Common Function Error", error);
        return 'none';
    }
}

/**
 * @_AM_PM
 * @param {*} reqData 
 * @returns 
 */
module.exports.railwayTimeToNormalTime = (fromTimeValue) => {
    try {
            var H = +fromTimeValue.substr(0, 2);
            var h = (H % 12) || 12;
            h = (h < 10)?("0"+h):h;
            var ampm = H < 12 ? " AM" : " PM";
            fromTimeValue = h + fromTimeValue.substr(2, 3) + ampm;
            return fromTimeValue;

    } catch (error) {
        console.log("\n\n Common Function Error", error);
        return '--';
    }
}

module.exports.normalTimeTorailwayTime = (time12h) => {
    try {
        const [time, modifier] = time12h.split(' ');
                              
        let [hours, minutes] = time.split(':');
      
        if (hours === '12') {
          hours = '00';
        }
      
        if (modifier === 'PM') {
          hours = parseInt(hours, 10) + 12;
        }
      
        return `${hours}:${minutes}`;

    } catch (error) {
        console.log("\n\n Common Function Error", error);
        return '--';
    }
}

module.exports.convertHalfDataTime = (date, type) => {
    try {
        var formatDate = 'YYYY-MM-DD HH:mm:ss';
        var date = moment(date).format(formatDate);
        var datestring = date.split(" ");

        let timevalue = datestring[1];

        if(type == "evening"){
            timevalue = "23:59:00"; 
        }

        if(type == "morning"){
            timevalue = "12:00:00"; 
        }
       
        datestringFormat = datestring[0]+'T'+timevalue+'.000Z';

        return new Date(datestringFormat);

    } catch (error) {
        console.log("\n\n Common Function Error", error);
        return 'none';
    }
}

module.exports.convertLocalTime = (date) => {
    try {
        let formattedData = '';
        if(date != '') {
            let gmtDateTime = moment.utc(new Date(date), "YYYY-MM-DD HH:MM:SS")
            
            let localTime = gmtDateTime.local().format('YYYY-MM-DD HH:MM:SS');
            formattedData = new Date(localTime);
        }
        
        return formattedData;
    } catch (error) {
        console.log("\n\n Common Function Error", error);
        return 'none';
    }
}
