const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const incometaxslapSchema = new Schema({
    slabYear: { 
        type: String,
        required: true
    },
    category: { 
        type: String,
        required: true
    },
    fromValue: { 
        type: Number,
        required: true
    },
    toValue: { 
        type: Number,
        required: true
    },
    percentage: { 
        type: Number,
        required: true
    },
    description: { 
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        required: false
    },
    createdOn: {
        type: Date,
        required: false
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        required: false
    },
    updatedOn: {
        type: Date,
        required: false
    },
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model("incometaxslapmaster", incometaxslapSchema);