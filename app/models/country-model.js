const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const projectSchema = new Schema({
    countryName: {
        type: String,
        required: true
    },

   shortCode:{
        type: String,
        required: false
    },
    dialCode : {
        type : String,
        required: false
    },
    flagIcon : {
        type :String,
        required: false
    },
    flagImage : {
        type : String,
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

module.exports = mongoose.model("hrcountries", projectSchema);