const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const stateSchema = new Schema({
    stateName: {
        type: String,
        required: true
    },
    countryId :{
        type: Schema.Types.ObjectId,
        ref :"hrcountries",
        required: true
    },
    shortCode:{
        type: String,
        required: true
    },
    fileName :{
        type: String,
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

module.exports = mongoose.model("hrstates", stateSchema);