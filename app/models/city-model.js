const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const citySchema = new Schema({
   cityName: {
        type: String,
        required: true
    },
    countryId :{
        type: Schema.Types.ObjectId,
        ref :"hrcountries"
    },
    stateId : {
        type: Schema.Types.ObjectId,
        ref :"hrstates"
    },
    shortCode:{
        type: String,
        required: true
    },
    fileName :{
        type: String,
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

module.exports = mongoose.model("hrcities", citySchema);