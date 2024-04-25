const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const loginTrackingSchema = new Schema({
    loginAutomTime: {
        type: Date,
        required: false
    },
    ipAddress:{
        type: String,
        required: false
    },
    latitude:{
        type: String, 
        required: false
    },
    longitude:{
        type: String, 
        required: false
    },
    trackingId: {
        type: Schema.Types.ObjectId,  
        required: false
    },
    module: {
        type: String,
        required: false
    },
    mode: {
        type: String,
        required: false,
    },
    message: {
        type: String,
        required: false
    },
    postData: {
        type: Object,
        required: false
    },
    status: {
        type: String,
        required: false
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        required: false
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        required: false
    },
    createdOn: {
        type : Date,
        required: false           
    },
    updatedOn: {
        type : Date,
        required: false
    },
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model("logintracking", loginTrackingSchema);