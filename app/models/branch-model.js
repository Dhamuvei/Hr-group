const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const companySchema = new Schema({
    companyId: { 
        type: Schema.Types.ObjectId,
        ref :"company",
        required: true
    },
    companyName: { 
        type: String, 
        required: true
    },

    branchName: { 
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
    mobileNo   : { 
        type: String,
        required: true
    },
    alternateMobileNo :{
        type: String,
        required: false  
    },
    emailId  : { 
        type: String,
        required: true
    },
    alternateEmailId:{
        type: String,
        required: false  
    },
    phoneNo   : { 
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

module.exports = mongoose.model("branch",companySchema);