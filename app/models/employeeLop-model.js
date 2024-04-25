const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const employeeLopSchema = new Schema({
   
    employeeId : {
        type: Schema.Types.ObjectId,
        ref:"employeeprofile",
        required: true 
    },
    employeeName: { 
        type: String,
        required: true
    },
    requestNo: { 
        type: String,
        required: true
    },
    requestDate: { 
        type: Date,
        required: true
    },
    noOfLop: { 
        type: Number,
        required: true
    },
    selectMonth: { 
        type: Number,
        required: true
    },
    selectYear: { 
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        required: false
    },
    createdOn: {
        type: Date,
        required: false
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        required: false
    },
    updatedOn: {
        type: Date,
        required: false
    },
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model("employeeLop", employeeLopSchema);