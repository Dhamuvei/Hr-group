const { json } = require("express");
const { string } = require("joi");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const employeSchema = new Schema({
    branchId : {
        type: Schema.Types.ObjectId,
        ref:"branch",
        required: false 
    },
    companyId :{
        type: Schema.Types.ObjectId,
        ref:"company",
        required: false 
    },
    reportingToId :{
        type: Schema.Types.ObjectId,
        ref:"Role",
        required: false 
    },
    empCode: { 
        type: String,
        required: true
    },
    personalEmailId: { 
        type: String,
        required: true
    },
    officialEmailId :{
        type: String,
        required: true
    },
    gender: { 
        type: String,
        enum :["male","female","others"],
        required: true
    },
    maritalStatus: { 
        type: String,
        required: true
    },
    uploadPhoto: { 
        type: String,
        required: false
    },
    firstName: { 
        type: String,
        required: true
    },
    phoneNo :{
        type: String,
        required: true
    },
    bloodGroup :{
        type: String,
        required: true
    },
    weddingDate :{
        type: Date,
        required: false
    },
    lastName :{
        type: String,
        required: true
    },
    dateOfBirth :{
        type: Date,
        required: true
    },
    mobileNo :{
        type: String,
        required: true
    },
    panNo :{
        type: String,
        required: true
    },
    employeeFamily :[{
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
            ref:"hrqualification",
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
    }],
    employeeDocument : [{
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
            ref:"document",
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
        }
    }],
    roleId :{
        type: Schema.Types.ObjectId,
        ref:"role",
        required: false
    },
    roleName :{
        type : String,
        required: false
    },
    userId :{
        type: Schema.Types.ObjectId,
        ref:"user",
        required: false
    },
    qualificationId :{
        type: String,
        required: false
    },
    panCardAttachment :{
        type: String,
        required: false
    },
    departmentId :{
        type: Schema.Types.ObjectId,
        ref:"department",
        required: false
    },
    designationId :{
        type: Schema.Types.ObjectId,
        required: false
    },
    projectId :{
        type: Schema.Types.ObjectId,
        ref:"hrproject",
        required: false
    },
    employeeGradeId :{
        type: Schema.Types.ObjectId,
        required: false
    },
    employeeTypeId :{
        type: Schema.Types.ObjectId,
        required: false
    },
    employeeCategoryId :{
        type: Schema.Types.ObjectId,
        required: false
    },
    employeeShiftId :{
        type: Schema.Types.ObjectId,
        required: false
    },
    dateOfJoin :{
            type : Date,
            required : false
    },
   confirmationDate :{
        type : Date,
        required : false
   },
    reportingManager :{
        type: Schema.Types.ObjectId,
        required: false
    },
    workLocation :{
        type: Schema.Types.ObjectId,
        required: false
    },
    metroNonMetro :{
        type: String,
        enum :["Metro","NonMetro "],
        required: false
    },
    costCenter :{
        type: String,
        required: false
    },
    isBankAccount :{
        type: Boolean,
        default :false,
        required: false
    },
    bankId :{
        type: Schema.Types.ObjectId,
        required: false
    },
    bankAccountNo :{
        type: String,
        required: false
    },
    bankAccountHolderName :{
        type: String,
        required: false
    },
    ifsc :{
        type: String,
        required: false
    },
    bankBranch :{
        type: String,
        required: false
    },
    accountType :{
        type: String,
        required: false
    },
    paymentMethod :{
        type: String,
        enum:["Cash","DD/Cheque"],
        required: false
    },
    uanNo :{
        type: String,
        required: false
    },
    isPF :{
        type: Boolean,
        default:false,
        required: false
    },
    pfNo :{
        type: String,
        required: false
    },
    isEsi :{
        type: Boolean,
        default : false,
        required: false
    },
    esiNo :{
        type: String,
        required: false
    },
    isOvertimeApplicable :{
        type: Boolean,
        default : false,
        required: false
    },
    overTimeCategoryId :{
        type: Schema.Types.ObjectId,
        required: false
    },
    permanentAddress1 :{
        type: String,
        required: false
    },
    permanentAddress2 :{
        type: String,
        required: false
    },
    pCityId :{
        type: Schema.Types.ObjectId,
        required: false
    },
    pStateId :{
        type: Schema.Types.ObjectId,
        required: false
    },
    pCountryId :{
        type: Schema.Types.ObjectId,
        required: false
    },
    pzipcode :{
        type: String,
        required: false
    },
    plandlineNo :{
        type: String,
        required: false
    },
    issameas :{
        type: Boolean,
        default:false,
        required: false
    },
    communicationAddress1 :{
        type: String,
        required: false
    },
    communicationAddress2 :{
        type: String,
        required: false
    },
    cCityId :{
        type: Schema.Types.ObjectId,
        required: false
    },
    cStateId :{
        type: Schema.Types.ObjectId,
        required: false
    },
    cCountryId :{
        type: Schema.Types.ObjectId,
        required: false
    },
    czipcode :{
        type: String,
        required: false
    },
    clandlineNo :{
        type: String,
        required: false
    },
    employeeBond :[{
        bondType :{
            type: String,
            required: false
        },
        bondStartDate :{
            type: Date,
            required: false
        },
        bondEndDate :{
            type: Date,
            required: false
        },
        bondDocument :{
            type: String,
            required: false
        },
        noOfMonths :{
            type: String,
            required: false
        },
        bondSignDate :{
            type: Date,
            required: false
        },
        bondAckBy :{
            type: Schema.Types.ObjectId,
            required: false
        },
        bondAckOn :{
            type: Date,
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
    }],
    isPassport : {
        type: Boolean,
        default : false,
        required: false
    },
    passportNo: {
        type: String,
        required: false
    },
    passportValidUpto :{
        type: Date,
        required: false
    },
    isDrivingLicence :{
        type: Boolean,
        default : false,
        required: false
    },
    DrivingLicenceNo: {
        type: String,
        required: false
    },
    DrivingLicenceValidUpto :{
        type: Date,
        required: false
    },
    isAadharCard :{
        type: Boolean,
        default : false,
        required: false
    },
    aadharCardNo: {
        type: String,
        required: false
    },
    emgContact1: {
        type: String,
        required: false
    },
    emgContact2: {
        type: String,
        required: false
    },
    emgContact3: {
        type: String,
        required: false
    },
    emgContact4: {
        type: String,
        required: false
    },
    empStatus :{
        type: Number,
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

module.exports = mongoose.model("employeeprofile", employeSchema);