const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const leaveEncashtSchema = new Schema({
    encashmentRequestNo: { 
        type: String,
        required: true
    },
    employeeId : {
        type: Schema.Types.ObjectId,
        ref:"employeeprofile",
        required: true 
    },
    employeeName: { 
        type: String,
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
    leaveEncashmentStatus: {   
        type: String,
        enum : ["Pending", "Approved", "Rejected"],
        required: false,
        default: "Pending"
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
    dayCount: { 
        type: Number,
        required: true
    },
    grossSalary: { 
        type: Number,
        required: true
    },
    encashmentAmount: { 
        type: Number,
        required: true
    },
    isAmountPartOfNetPay: { 
        type: Boolean,
        required: true
    },
    
    status: {
        type: Number,
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

module.exports = mongoose.model("leaveEncashment", leaveEncashtSchema);