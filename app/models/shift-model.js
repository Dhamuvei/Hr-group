const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const shiftSchema = new Schema({
    shiftName: {
        type: String,
        required: true
    },
    fromTiming: {
        type: String,
        required: true
    },
    companyId :{
        type: Schema.Types.ObjectId,
        required: false
    },
    projectId :{
        type: Schema.Types.ObjectId,
        required: false
    },
    toTiming: {
        type: String,
        required: true
    },
    status: {
        type: Number,
        required: true
    },
    insertedBy: {
        type: Schema.Types.ObjectId,
        required: true
    },
    insertedOn :{
        type: Date,
        required: true
    },
    updatedOn :{
        type: Date,
        required: true
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        required: false
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model("Shift", shiftSchema);