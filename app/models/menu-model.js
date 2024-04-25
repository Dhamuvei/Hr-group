const mongoose = require("mongoose");
// const Counter = require("../models/counter-model");

const Schema = mongoose.Schema;

const menuSchema = new Schema({
    menuName: {
        type: String,
        required: true
    },
    menukey: {
        type: String,
        required: true
    },
    menuType: {
        type: String,
        enum: ['menuHeader', 'menuSubHeader', 'menuItem'],
        default: 'menuHeader',
        required: true
    },
    menuReferenceId: {
        type: Schema.Types.ObjectId,
        ref: 'hrmenu'
    },
    sequence: {
        type: Number,
        required: false
    },
    access: [{
        type: Schema.Types.ObjectId,
        ref: 'hraccess',
        required: true
    }],
    isNew: {
        type: Boolean,
        default: false,
        required: true
    },
    labelName: {
        type: String,
        required: false
    },
    menuMode: {
        type: String,
        enum: ['Menu', 'Page'],
        default: 'Menu',
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
    timestamps: true,
    versionKey: false
});


module.exports = mongoose.model("hrmenu", menuSchema);
