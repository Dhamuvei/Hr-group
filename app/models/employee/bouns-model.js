const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const bounsSchema = new Schema({
    bonusRequestNo: {
        type: String,
        required: false
    },
    bonusRequestDate: {
        type: Date,
        required: false
    },
    isIncludePayslip: {
        type: Boolean,
        default:false,
        required: false
    },
    payslipIncludeMonth: {
        type: String,
        required: false
    },
    payslipIncludeYear: {
        type: String,
        required: false
    },
    companyId : {
        type: Schema.Types.ObjectId,
        required: false 
    },
    branchId : {
        type: Schema.Types.ObjectId,
        required: false 
    },
    bonusStatus: {   
        type: String,
        enum : ["Pending", "Approved", "Rejected"],
        required: false,
        default: "Pending"
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
    bonusDetails: [
        {
            employeeId: {
                type: Schema.Types.ObjectId,
                ref: 'menu'
            },
            employeename: {
                type: String,
                required: false
            },
            employeeCode: {
                type: String,
                required: false
            },
            departmentId: {
                type: Schema.Types.ObjectId,
                required: false
            },
            projectId: {
                type: Schema.Types.ObjectId,
                required: false
            },
            projectName: {
                type: String,
                required: false
            },
            departmentName: {
                type: String,
                required: false
            },
            bonusamount: {
                type: Number,
                required: false
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
            }

        }
    ],
    responseDetails : [
     {
     levelapprovalId :{
        type: Schema.Types.ObjectId,
        required: false
    },
    levelapprovalDetailId :{
        type: Schema.Types.ObjectId,
        required: false
    },
    responsedBy :{
        type: Schema.Types.ObjectId,
        required: false
    },
    responsedOn :{
        type: Date,
        required: false
    },
    responseStatus :{
        type: String,
        required: true
    },
    remarks :{
        type: String,
        required: true
    },
    status: {
        type: Number,
        required: true
    },
    }
],
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
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model("bonus", bounsSchema);