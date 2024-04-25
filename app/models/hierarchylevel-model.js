const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const hierarchylevelSchema = new Schema({
    levelName: {  // reporter and hr
        type: String,
        required: true
    },
    levelPosition :{
        type: Number,
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

module.exports = mongoose.model("hierarchylevel", hierarchylevelSchema);