const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const taxSchema = new Schema({
    taxName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    shortCode :{
        type: String,
        required: false
    },
    cgst: {
        type: Number,
        required: true
    },
    sgst: {
        type: Number,
        required: true
    },
    igst: {
        type: Number,
        required: true
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

module.exports = mongoose.model("hrtax", taxSchema);