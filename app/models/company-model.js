const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const companySchema = new Schema({
    companyName: { 
        type: String,
        required: true
    },
    shortCode: { 
        type: String,
        required: false
    },
    address1: { 
        type: String,
        required: true
    },
    address2: { 
        type: String,
        required: true
    },
    cityId : { 
        type: Schema.Types.ObjectId,
        ref :"hrcities",
        required: true
    },
    stateId: { 
        type: Schema.Types.ObjectId,
        ref:"hrstates",
        required: true
    },
    countryId: { 
        type: Schema.Types.ObjectId,
        ref :"hrcountries",
        required: true
    },
    zipcode: { 
        type: String,
        required: true
    },
    panNo: { 
        type: String,
        required: true
    },
    gstNo: { 
        type: String,
        required: true
    },
    gstType : { 
        type: String,
        required: true
    },
    cstNo : { 
        type: String,
        required: true
    },
    serviceTaxNo : { 
        type: String,
        required: true
    },
    tanNo  : { 
        type: String,
        required: true
    },
    vatNo  : { 
        type: String,
        required: true
    },
    logo  : { 
        type: String,
        required: true
    },
    mobileNo   : { 
        type: String,
        required: true
    },
    emailId  : { 
        type: String,
        required: true
    },
    phoneNo   : { 
        type: String,
        required: true
    },
    documents : [{
        type: String,
        required: true
    }],
    webLink   : { 
        type: String,
        required: true
    },
    sendPaySlipEmail : {
        type : Boolean,
        default : false
    },
    sendBankAdviceEmail : {
        type : Boolean,
        default : false
    },
    bankEmailId : {
        type : String,
        required : false
    },
    leaveYear : { 
        type: String,
        enum :["calenderYear","financialYear"],
        required : false
    },
    leaveEncashment : {
        type : String,
        enum :["grossAmount","basicAmount"],
        require : false
    },
    leaveEncashmentDays   : { 
        type: String,
        enum :["fixed30Days","NumberOfDaysInMonth"],
        required: false
    },
    leaveRoundOff : {
        type : Boolean,
        default : false 
    },
    displayYTDinPaySlip : {
        type : Boolean,
        default : false  
    },
    halfDayLeaveHours   : { 
        type: Number,
        required: false
    },
    fullDayLeaveHours   : { 
        type: Number,
        required: false
    },

    status: {
        type: Number,
        required: false
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

module.exports = mongoose.model("company",companySchema);