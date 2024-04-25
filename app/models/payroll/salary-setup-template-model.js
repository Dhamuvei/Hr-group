const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const salarySetupTemplateSchema = new Schema({
    gradeId: {
        type: Schema.Types.ObjectId,
        required: false
    },
    gradeName :{
        type: String,
        required: false
    },
    CTC: {
        type: Number,
        required: false
    },
    salaryDetails: [
        {
            salaryParameterId: {
                type: Schema.Types.ObjectId,
                required: true
            },
            salaryParameterName: {
                type: String,
                required: true
            },
            parameterType: {
                type: String,
                enum:["Percentage","Value"],
                required: true
            },
            parameterPercentageValue: {
                type: Number,
                required: true
            },
            parameterOf: {
                type: String,
                enum:["CTC","Basic","None"],
                required: true
            },
            type : {
                type: String,
                enum:["Earnings","Deductions"],
                required: true           
            },
            monthYear :{
                type: String,
                enum:["Month","Year"],
                required: true              
            },
            monthlyAmount :{
                type: Number,
                required: true
            },
            yearlyAmount :{
                type: Number,
                required: true
            }
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
    updatedBy: {
        type: Schema.Types.ObjectId,
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
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model("salarysetuptemplate", salarySetupTemplateSchema);
