const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const gradeSchema = new Schema({
    name: { 
        type: String,
        required: false
    },
    description: { 
        type: String,
        required: false
    },
    ipAddress : { 
        type: String,
        required: false
    },
    status: {
        type: String,
        required: false
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

module.exports = mongoose.model("ipaddress", gradeSchema);