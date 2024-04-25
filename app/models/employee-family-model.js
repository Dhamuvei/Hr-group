const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const employefamilySchema = new Schema({
    empId: {
        type: Schema.Types.ObjectId,
        ref:"employeeprofile",
        required: true
    },
    name:{
        type: String,
        required: false
    },
    dob: {
        type :Date,
        required: false
    },
    age : {
        type :Number,
        required: false
    },
    gender : {
        type : String,
        enum:["male","female","others"],
        required : false
    },
    relationship :{
        type : String,
        enum:["Father","Mother","Sister","Son","Spouse","Brother","Daughter"],
        required: false
    },
    qualification :{
        type : Schema.Types.ObjectId,
        required: false
    },
    isNominee :{
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

module.exports = mongoose.model("employefamily", employefamilySchema);