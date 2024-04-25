const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const employefamilySchema = new Schema({
    empId: {
        type: Schema.Types.ObjectId,
        ref:"employeeprofile",
        required: true
    },
    learningCategory:{
        type: String,
        required: false
    },
    learningTopics: {
        type: String,
        required: false
    },
    duration : {
        type: String,
        required: false
    },
    consideredStatus : {
        type : String,
        required : false
    },
    comments :{
        type : String,
        required: false
    },
    remarks :{
        type : String,
        required: false
    },
    isVerified :{
        type : Boolean,
        default:false,
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

module.exports = mongoose.model("employeelearning", employefamilySchema);