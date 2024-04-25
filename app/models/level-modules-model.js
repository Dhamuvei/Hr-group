const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const levelModulesSchema = new Schema({
    companyId: {
        type: Schema.Types.ObjectId,
        ref: "company",
        required: true
    },
    companyName: {
        type: String,
        required: true
    },
    modules: [
        {
            moduleName: {
                type: String,
                required: true
            },
            moduleLevel: [
                {
                    levelId: {
                        type: Schema.Types.ObjectId,
                        ref: 'hierarchylevel'
                    },
                    levelName: {
                        type: String,
                        required: false
                    },
                    levelPosition: {
                        type: Number,
                        required: false
                    }
                }
            ]
        }
    ],
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

module.exports = mongoose.model("level_modules", levelModulesSchema);
