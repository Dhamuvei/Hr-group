const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const employementTypeSchema = new Schema({
    employmentType: {
        type: String,
        required: true
    },

    shortCode:{
        type: String,
        required: false
    },
    description :{
        type: String,
        required : false
    },
    status: {
        type: Number,
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        required: true
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        required: false
    },
    createdOn: {
        type : Date,
        required: true
        },
    updatedon: {
        type : Date,
        required: false
    },
}, {
    timestamps: false,
    versionKey: false
});

module.exports = mongoose.model("hremployementtype", employementTypeSchema);