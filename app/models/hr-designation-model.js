const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const designationSchema = new Schema({
    designationName: { 
        type: String,
        required: true
    },
    departmentId :{
        type: Schema.Types.ObjectId,
        ref: "department",
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

module.exports = mongoose.model("designation", designationSchema);