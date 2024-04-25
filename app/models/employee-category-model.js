const { string } = require("joi");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const employecategorySchema = new Schema({
    categoryName: {
        type : String,
        required: true
    },
    shortCode:{
        type: String,
        required: false
    },
    description: {
        type : String,
        required: false
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

module.exports = mongoose.model("employecategory", employecategorySchema);