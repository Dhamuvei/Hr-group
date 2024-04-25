const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const leavetypeSchema = new Schema({
    leaveType: { 
        type: String,
        required: true
    },
    shortCode: { 
        type: String,
        required: true
    },
    description: { 
        type: String,
        required: true
    },
    isEligibleEncashment : {
        type : Boolean,
        default : false,
        required : false
    },
    minimumHoldingDays : {
        type : Number,
        required : false
    } ,
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

module.exports = mongoose.model("leavetype", leavetypeSchema);