const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const leaveRequestSchema = new Schema({
    employeeId : {
        type: Schema.Types.ObjectId,
        ref:"employeeprofile",
        required: true 
    },
    companyId : {
        type: Schema.Types.ObjectId,
        required: false 
    },
    branchId : {
        type: Schema.Types.ObjectId,
        required: false 
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
    fromDate: { 
        type: Date,
        required: true
    },
    toDate: { 
        type: Date,
        required: true
    },
    leaveType: { 
        type: String,
        required: true
    },
    leaveTypeName: { 
        type: String,
        required: true
    },
    fromOption: { 
        type: String,
        required: true
    },
    toOption: { 
        type: String,
        required: true
    },
    numberOfDays: { 
        type: Number,
        required: true
    },
    uploadDocument: { 
        type: String,
        required: true
    },
    reason: { 
        type: String,
        required: true
    },
    reportingToId :{
        type: Schema.Types.ObjectId,
        ref:"Role",
        required: false 
    },
    levelModuleApproval: [{
        levelPosition: {
            type: Number,
            required: false
        },
        approvalRole: {
            type: Schema.Types.ObjectId,
            required: false,
        },
        approvalEmployeesId: [{
            type: Schema.Types.ObjectId,
            required: false
        }],
        isDirectReporter: {
            type: Boolean,
            required: false,
            default: false
        },
        status: {
            type: Number,
            required: false
        },
        reason: {
            type: String,
            required: false
        },
        approvalStatus: {
            type: String,
            enum : ["Pending","Approved","Rejected"],
            required: false
        },
        createdOn: {
            type: Date,
            required: false
        },
        updatedOn: {
            type: Date,
            required: false
        }
    }],
    approvalStatus: {
        type: String,
        enum : ["Pending", "Approved", "Rejected"],
        required: false,
        default: "Pending"
    },
    reason: {
        type: String,
        required: false
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

module.exports = mongoose.model("leaveRequest", leaveRequestSchema);