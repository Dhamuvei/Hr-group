const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const projectSchema = new Schema({
    accessName: {
        type: String,
        required: true
    },

    isDefault:{
        type: Boolean,
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

module.exports = mongoose.model("hraccess", projectSchema);