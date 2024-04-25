const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const timeZoneSchema = new Schema({
   timezoneName: {
        type: String,
        required: true
    },
    UST :{
        type: String,
        required: true
    },
    diffDuration : {
        type: Number,
        required : true
    },
    countryId :{
        type: Schema.Types.ObjectId,
        ref :"hrcountries",
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

module.exports = mongoose.model("hrtimezone", timeZoneSchema);