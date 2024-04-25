const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ModuleSetupSchema = new Schema({
    moduleName: {
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
        type: Date,
        required: false
    },
    updatedOn: {
        type: Date,
        required: false
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model("module_setup", ModuleSetupSchema);
