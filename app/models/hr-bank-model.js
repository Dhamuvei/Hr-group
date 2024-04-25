const { json } = require("express");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const bankSchema = new Schema({
    bankName: { 
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

module.exports = mongoose.model("bank", bankSchema);