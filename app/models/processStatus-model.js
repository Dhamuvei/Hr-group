const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const processstatusSchema = new Schema({
    processStatus: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    shortCode :{
        type: String,
        required: true
    },
    colorCode:{
        type: String,
        required: true
    },
    mode: {
        type: String,
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

module.exports = mongoose.model("hrprocessstatus", processstatusSchema);