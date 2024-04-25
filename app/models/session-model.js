const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const sessionSchema = new Schema({
    sessionId: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isLogin: {
        type: Boolean,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    status: {
        type: Number,
        required: true
    }
}, {
    timestamps: true,
    versionKey: false

});

module.exports = mongoose.model("hrsession", sessionSchema);