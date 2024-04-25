const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const investmentSchema = new Schema({
    section: {
        type: String,
        required: true
    },
    exemptionValue :{
        type: Number,
        required: false
    },
    exemptionPercentage : {
        type: Number,
        required : false
    },
    description :{
        type: String,
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

module.exports = mongoose.model("hrinvestmentsection", investmentSchema);