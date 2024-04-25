const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const investmentSchema = new Schema({
    sectionId :{
        type: Schema.Types.ObjectId,
        ref :"hrinvestmentsection",
        required: true
    },
    itemName :{
        type: String,
        required: true
    },
    description :{
        type: String,
        required: false
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

module.exports = mongoose.model("hrinvestmentsectionItem", investmentSchema);