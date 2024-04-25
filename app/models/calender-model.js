const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const calendarSchema = new Schema({
    calenderName: { 
        type: String,
        required: true
    },
    startDate: { 
        type: Date,
        required: true,
        validate: {
            validator: function (value) {
            
                const currentYear = new Date().getFullYear();
                return value.getFullYear() === currentYear;
            },
            message: "Start date must be in the current year."
        }
    },
    endDate: { 
        type: Date,
        required: true,
        validate: {
            validator: function (value) {
                const currentYear = new Date().getFullYear();
                return value.getFullYear() === currentYear;
            },
            message: "End date must be in the current year."
        }
    },
    // defaultNonWorking: { 
    //     type: String,
    //     enum: ['All Saturday', '2nd Saturday', '2nd and 4th Saturday', '1st and 3rd Saturday', '1st and 4th Saturday'],
    //     required: true
    // },
    defaultNonWorkingId: { 
        type: Schema.Types.ObjectId,
        ref : 'nonworking',
        required: true
    },
    workingTimeFrom: { 
        type: String, 
        validate: {
            validator: function (value) {
                return /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(value);
            },
            message: "Invalid time format. Use HH:mm format."
        },
        required: true
    },
    workingTimeTo: { 
        type: String, 
        validate: {
            validator: function (value) {
                return /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(value);
            },
            message: "Invalid time format. Use HH:mm format."
        },
        required: true
    },
    holidayDetail: [{
        holidayType: {
            type: String,
            enum: ['Non Working', 'Special Working', 'General Holiday'],
            required: true
        },
        holidayTitle: {
            type: String,
            required: true
        },
        holidayStartDate: {
            type: Date,
            required: true
        },
        holidayEndDate: {
            type: Date,
            required: true
        },
        holidayWorkingTimeFrom: {
            type: String, 
            validate: {
                validator: function (value) {
                    return /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(value);
                },
                message: "Invalid time format. Use HH:mm format."
            },
            required: true
        },
        holidayWorkingTimeTo: {
            type: String, 
            validate: {
                validator: function (value) {
                    return /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(value);
                },
                message: "Invalid time format. Use HH:mm format."
            },
            required: true
        },
        holidayDuration: {
            type: Number,
            required: true
        }
    }],
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

module.exports = mongoose.model("calendar", calendarSchema);
