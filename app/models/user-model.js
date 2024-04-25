const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validModes = ["M","W"];



const Schema = mongoose.Schema;

const UserSchema = new Schema({
    employeeId: {
        type: Schema.Types.ObjectId,
        ref: 'employeeprofile',
        required: false,
    },
    type: {
        type: String,
        required: true,
        enum: validModes
    },
    userCode :{
        type: String,
        required: false
    },
    roleId : {
        type: Schema.Types.ObjectId,
        ref: 'Role',
        required: false, 
    },
    roleName :{
        type: String,
        required: false, 
    },
    designationId : {
        type: Schema.Types.ObjectId,
        ref: 'designation',
        required: false, 
    },
    designationName :{
        type: String,
        required: false, 
    },
    username: {
        type: String,
        required: true
    },
    companyId: [{
        type: Schema.Types.ObjectId,
        ref: 'company',
        required: false,
    }],
    branchId: [{
        type: Schema.Types.ObjectId,
        ref: 'branch',
        required: false,
    }],
    age: {
        type: Number,
        required: true
    },
    mobileNumber: { 
        type: Number, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    isLogin: {
        type: Boolean,
        required: true
    },
    password: { 
        type: String, 
        required: true 
    },
    verified: {
        type: Boolean,
        default: false,
    },
    sessionToken: {
        type: String, 
        required: false 
    },
    latitude: {
        type: Number,
        required: false
    },
    longitude: {
        type: Number,
        required: false
    },
    lastLoginDate: {
        type: Date,
        required: false
    },
    loginAttempt: {
        type: Number,
        required: false
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        required: false,
    },
}, {
    timestamps: true,
    versionKey: false
});

UserSchema.pre("save", function (next) {
    var user = this;
    user.updatedAt = new Date();
  
    if (this.isModified("password") || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }

            bcrypt.hash(
                user.password ? user.password : "",
                salt,
                function (err, hash) {
                    if (err) {
                        return next(err);
                    }

                    user.password = hash;
                    next();
                }
            );
        });
    } else {
      return next();
    }
});

module.exports = mongoose.model("User", UserSchema);