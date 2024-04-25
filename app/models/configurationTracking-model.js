const mongoose = require("mongoose");
const validModes = ["add", "update", "delete"];

const Schema = mongoose.Schema;

const TrackingSchema = new Schema({
    trackingId: {
        type: [Schema.Types.ObjectId],  
        required: true
    },
    module: {
        type: String,
        required: true
    },
    mode: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    postData: {
        type: Object,
        required: false
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        required: true
    },
    createdByName: {
        type: String,
        required: false
    },
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model("configurationTracking", TrackingSchema);