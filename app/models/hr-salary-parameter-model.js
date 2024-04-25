const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const salaryParameterSchema = new Schema({
    salaryParameterName: { 
        type: String,
        required: true
    },
    shortCode: { 
        type: String,
        required: true
    },
    type: { 
        type: String,
        enum : ["Percentage","Value"],
        required: true
    },
    seqNo: { 
        type: String,
        required: true
    },
    additionDeduction: { 
        type: String,
        enum : ["Addition","Deduction"],
        required: true
    },
    paymentIn : {
        type: Number,
        required: false
    },
    percentageValue: { 
        type: Number,
        required: true
    },
    monthYear: { 
        type: String,
        enum : ["Month","Year"],
        required: true
    },
    percentageOf: { 
        type: String,
        enum : ["CTC","Basic","None"],
        required: true
    },
    isDisplay: { 
        type: Boolean,
        default :false,
        required: true
    },
    isDisplayPayRegister: { 
        type: Boolean,
        default:false,
        required: true
    },
    isDisplayonAdditionalAllowance: { 
        type: Boolean,
        default : false,
        required: true
    },
    isDisplayOnPayslip: { 
        type: Boolean,
        default:false,
        required: true
    },
    description: { 
        type: String,
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

module.exports = mongoose.model("salaryparameter", salaryParameterSchema);