const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const overtimeSchema = new Schema({
   overTimeName: {
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
    timestamps: false,
    versionKey: false
});

module.exports = mongoose.model("overtime", overtimeSchema);