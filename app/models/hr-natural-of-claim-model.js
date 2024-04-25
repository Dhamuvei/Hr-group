const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const naturalofclaimSchema = new Schema({
    claimName: { 
        type: String,
        required: true
    },
    shortCode: { 
        type: String,
        required: true
    },
    claimPercentage :{
        type: Number,
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

module.exports = mongoose.model("naturalofclaim", naturalofclaimSchema);