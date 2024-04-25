const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const financialYearSchema = new Schema({
    yearSlapId : {
        type :  Schema.Types.ObjectId,
        ref : "incometaxslapmasters",
        required  : false
    },
    slapYear :{
        type: String,
        required: true
    },
    stateId: {
        type: Schema.Types.ObjectId,
        ref: "hrstates",
        required: true,
      },
    slabValues :[
        {
            fromValue : {
                type :Number,
                required: true
            },
            toValue : {
                type : Number,
                required : true
            },
            taxAmount : {
                type : Number,
                required:true
            },
            status :{
                type: Number,
                required: true
            } 
        }
       

    ],
    description : {
        type :String,
        required :false
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

module.exports = mongoose.model("hrpttax", financialYearSchema);