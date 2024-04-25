const { boolean } = require("joi");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const financialYearSchema = new Schema({
    financialYear :{
        type: String,
        ref :"hrinvestmentsection",
        required: true
    },
    fromYear :{
        type: Number,
        required: true
    },
    toYear :{
        type: Number,
        required: true
    },
    startDate :{
        type : Date  ,
        required:true
    },
    endDate :{
        type : Date,
        required:true
    },
    isCurrentYear : {
        type: Boolean  ,
        required : true
    },
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
        type : Date,
        required: false
    },
    updatedon: {
        type : Date,
        required: false
    },
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model("hrfinancialyearslap", financialYearSchema);