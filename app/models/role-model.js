const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const roleSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    shortCode: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    mode: {
        type: String,
        default: 'secondary',
        enum: ["primery", "secondary"]
    },
    permission: [
        {
            menuId: {
                type: Schema.Types.ObjectId,
                ref: 'hrmenu'
            },
            access: [
                {
                    type: Schema.Types.ObjectId,
                    ref: 'hraccess'
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
        required: true
    },
    createdOn: {
        type: Date,
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model("Role", roleSchema);