const { string } = require("joi");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const employedocumentSchema = new Schema({
    empId: {
        type: Schema.Types.ObjectId,
        ref:"employeeprofile",
        required: true
    },
    mode:{
        type: String,
        enum:["fromEmployee"],
        required: false
    },
    docType: {
        type : Schema.Types.ObjectId,
        required: false
    },
    docNature :{
        type : String,
        required : false
    },
    docNo : {
        type : String,
        required : false
    },
    docDate :{
        type : Date,
        required: false
    },
    document :{
        type : String,
        required: false
    },
    status: {
        type: Number,
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        required: true
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        required: false
    },
    createdOn: {
        type : Date,
        required: true
        },
    updatedon: {
        type : Date,
        required: false
    },
}, {
    timestamps: false,
    versionKey: false
});

module.exports = mongoose.model("employedocument", employedocumentSchema);