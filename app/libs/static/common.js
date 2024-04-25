/**
 * @COMMON_CONST
 */

const status = {
    IN_PROGRESS: 0,
    ACTIVE: 1,
    IN_ACTIVE: 2,
    DELETE: 3,
    BOTH: [1, 2]
};

const leaveStatus = {
    APPROVED: 1,
    REJECTED: 2,
    INPROGRESS: 3,
    CANCELLED: 4,
    BOTH: [1, 2, 3]
};

const permissionStatus = {
    APPROVED: 1,
    REJECTED: 2,
    INPROGRESS: 3,
    CANCELLED: 4,
    BOTH: [1, 2, 3]
};

const delegationStatus = {
    APPROVED: 1,
    REJECTED: 2,
    INPROGRESS: 3,
    CANCELLED: 4,
    BOTH: [1, 2, 3]
};

const wfhStatus = {
    APPROVED: 1,
    REJECTED: 2,
    INPROGRESS: 3,
    CANCELLED: 4,
    BOTH: [1, 2, 3]
};

const nightShiftStatus = {
    APPROVED: 1,
    REJECTED: 2,
    INPROGRESS: 3,
    CANCELLED: 4,
    BOTH: [1, 2, 3]
};

const errorMsg = {
    SWW: 'something went wrong!'
};

const select = {

    MENU_AG: [
        'menuName',
        'menukey',
        'menuType',
        'isNew',
        'menuReferenceId',
        'sequence',
        'menuMode'
    ],

    ACCESS_AG: [
        'accessName',
        'accessDescription'
    ],

    SESSION_COMPANY: [
        'name',
        'logo'
    ],

    name: {
        name: 1
    },

    branchNameAndCompanyId: {
        name: 1,
        companyId: 1
    },

    overallLeadStatus: {
        overallStatus: 1,
        leadId: 1,
        createdAt: 1,
        updatedAt: 1
    },

    overallLeadClientRemarks: {
        remarks: 1,
        leadId: 1,
        createdAt: 1,
        updatedAt: 1
    }

};


const unSelect = {

    common: {
        insertedBy: 0,
        updatedBy: 0,
        createdAt: 0,
        updatedAt: 0
    },

    commonWithInsertedBy: {
        updatedBy: 0,
        createdAt: 0,
        updatedAt: 0
    },

    common_AG: [
        'insertedBy',
        'updatedBy',
        'createdAt',
        'updatedAt'
    ]

};

const leadOperation = {
    INSERT: 'INSERT',
    UPDATE: 'UPDATE',
    ASSIGN: 'ASSIGN',
    UPDATE_ASSIGN: 'UPDATE_ASSIGN',
    RE_ASSIGN: 'RE_ASSIGN',
    DELETE_ASSIGN: 'DELETE_ASSIGN',
    STATUS: 'STATUS',
    PROCESS_STATUS_UPDATE: 'PROCESS_STATUS_UPDATE',
    PS10: 'PROCESS_STATUS_UPDATE_PS10',
    CLIENT_PROFILE_ADD: 'CLIENT_PROFILE_ADD',
    CLIENT_PROFILE_UPDATE: 'CLIENT_PROFILE_UPDATE',
    CLIENT_PROFILE_DELETE: 'CLIENT_PROFILE_DELETE',
    EVENT_ADD: 'EVENT_ADD',
    EVENT_UPDATE: 'EVENT_UPDATE',
    EVENT_DELETE: 'EVENT_DELETE',
    DELETE: 'DELETE'
};

const countMode = {
    ALL: 'all',
    BY_COMPANY: 'company',
    BY_BRANCH: 'branch',
    BY_SALES_URGE: 'salesUrge',
    BY_PS_1: 'ps1',
    BY_PS_2: 'ps2',
    BY_REJECT_USER: 'rejectByUser',
    BY_REJECT_ALL: 'rejectByAll'
};

const processStatus = {
    UNASSIGN_LEAD: "PS1",
    ASSIGN_LEAD: "PS2",
    QUOTATION_CREATED: "PS3",
    FOLLOW_UP: "PS4",
    QUOTE_SENT: "PS5",
    QC_APPROVED_QUOTE: "PS6",
    QC_RECHECK_QUOTE: "PS7",
    QC_REQUEST_SENT: "PS8",
    BOOKING_COMPLETE: "PS9",
    REJECTED_LEAD: "PS10",
    LEAD_APPROVAL: 'PS13',
    LEAD_CLEARANCE: 'PS15',
    QUOTE_UNDER_ALTERATION: 'PS17',
    ALTER_QUOTE_REJECT: 'PS18',
    REQUEST_FOR_QUOTE_ALTERATION: 'PS19',
    REQUEST_PENDING: 'PS11',
    REQUEST_ACCEPTED: 'PS12',
    OBS_PENDING:'PS21',
    OBS_PENDING:'PS26',
    OBS_FOLLOWUP:'PS27',
    OBS_REJECT:'PS28',
    OBS_LEAD_CONVERTED : 'PS29',
    EC_FOLLOWUP : 'PS30',
    CLIENT_CHECKLIST : 'PS31',
    TEAM_SCHEDULING : 'PS32',
    EQUIPMENT_SCHEDULING : 'PS33'
};

const processStatusName = {
    PS1: "Unassigned",
    PS2: "Assigned",
    PS3: "Quotation",
    PS4: "Follow-up",
    PS5: "Quote Sent",
    PS6: "QC Approved Quote",
    PS7: "QC Recheck Quote",
    PS8: "QC Request Sent",
    PS9: "Booking Complete",
    PS10: "Rejected",
    PS17: "QUOTE UNDER ALTERATION",
    PS18: "ALTER QUOTE REJECT",
    PS19: "REQUEST FOR QUOTE ALTERATION",
    PS11: "Request Pending",
    PS12: "Request Accepted",
    PS21: "Obs Pending",
    PS26: "OBS PENDING",
    PS27: "OBS FOLLOW-UP",
    PS28: "OBS REJECT",
    PS29: "OBS LEAD CONVERTED",
    PS30: "EC FOLLOWUP",
    PS31: "CLIENT CHECKLIST",
    PS32: "TEAM SCHEDULING",
    PS33: "EQUIPMENT SCHEDULING"
};

const ecProcessStatus = {
    EC_COMPLETED : 'PS37',
    Event_Cancelled : 'PS47'
};
const ecClearanceStatus  = {
    AWAITNG_FOR_CLEARANCE : 'PS21',
    MOVE_TO_CLEARENCE : 'PS34',
    LEVEL_1_APPROVED : 'PS22',
    LEVEL_2_APPROVED : 'PS24',
    LEVEL_1_RECHECK : 'PS23',
    LEVEL_2_RECHECK : 'PS25',

};
const ecClearanceStatusName   = {
    PS21: "AWAITNG FOR CLEARANCE",
    PS34: "MOVE TO CLEARENCE",
    PS22: "LEVEL 1 APPROVED",
    PS24: "LEVEL 2 APPROVED",
    PS25: "LEVEL 2 RECHECK",
    PS23: "LEVEL 1 RECHECK",
};

const ecProcessStatusName = {
    PS37: "EC COMPLETED",
    PS47: "Event Cancelled",
};

const leadStatusCount = {
    GENERAL: "GENERAL",
    MY_LEAD: "MY_LEAD"
};

const companyBanchListType = {
    TYPE: "default",
    RoleId: ["61bcb7ed0e04359342e992f6", "622f0d5c246a442107c8158e", "61bcb7ed0e04359342e992f62", "6394779685898637927c8f5b", "63935d9852419c76411178ec", "63935e38e570e370811427d7" ]
}

const leadQuotation = {
    EXPIRY_DAY: 30
};

const profile = {
    DEFAULT_IMAGE: "https://api.alphaone.app/uploads/1673336612295_alpha.png"
};

const yesNo = {
    YES: 'Yes',
    NO: 'No'
};

const cronJobEmployeeReportingTo = {
    leaveRequest: 'leaveRequest',
    nightShift: 'nightShift',
    delegation: 'delegation',
    permissionRequest: 'permissionRequest'
};

const equipmentMode = [
	{label: "ADMIN", value:"AD"},
	{label: "PHOTOGRAPHY", value:"PHT"},
	{label: "IT", value:"IT"},
	{label: "VERMILION", value:"VER"},
	{label: "DIVINE", value:"DIV"},
	{label: "HR", value:"HR"},
    {label: "ZG OPERATIONS", value:"ZGO"},
];

const server = {
    zgworklife: 'zgworklife',
    demoalphaone: 'demoalphaone',
    alphaone: 'alphaone'
};

const employeeReportDepartmentId = {
    zgworklife: ["629481c15ff152c59fe85fa8","6294823f5ff152c59fe863cf"],
    demoalphaone: ["63935d9752419c764111777a","63935e3ae570e37081142963"],
    alphaone: ["63935d9752419c764111777a","63935e3ae570e37081142963"]
}

const ecListReportCompanyId = {
    zgworklife: ["621095ca22dc209646e5381f", "6283e6f3f73d149b82a6b8ff"],
    demoalphaone: ["621095ca22dc209646e5381f", "6283e6f3f73d149b82a6b8ff"],
    alphaone: ["621095ca22dc209646e5381f", "6283e6f3f73d149b82a6b8ff"]
}

const checkListEventQuestionId = {
    venueQuestionId: "642d6e0b90bad07ff80256aa",
    venueLocationQuestionId: "642d671790bad07ff896793d",
    eventStartQuestionId: "642d711090bad07ff82a68ac",
    eventEndQuestionId: "642d723a90bad07ff83a7fec"
}

const equipmentModeList = [ "ADMIN", "PHOTOGRAPHY", "IT", "VERMILION", "DIVINE", "HR", "ZG OPERATIONS" ];
//const equipmentModeList = [ "AD", "PHT", "IT", "VER", "DIV", "HR" ];

const menuMode = {
    MenuMode1: "Menu1",
    MenuMode2: "Menu2",
    MenuMode3: "Menu3",
    MenuMode4: "Menu4",

};

const ecLeadStatus = {
    yetToStart: "YET TO START",
    pending: "PENDING",
    inprogress: "INPROGRESS",
    completed: "COMPLETED"
};

const ticketStatus  = {
    TICKET_PENDING : 'PS54',
    TICKET_COMPLETED : 'PS55',
    TICKET_CLOSE_REQUEST : 'PS56',
    TICKET_REOPEN : 'PS57',
    TICKET_PROCESSING : 'PS58',

};

const ticketStatusName  =  {
     PS54:"TICKET PENDING",
     PS55:"TICKET COMPLETED",
     PS56:"TICKET CLOSE REQUEST",
     PS57:"TICKET REOPEN",
     PS58:"TICKET PROCESSING" ,

};


const leadSubStatus = [ "Open", "Followup", "Need Time To Think", "Almost Confirm", "Booked", "Non Contactable", "Not Interested & Already Booked", "Not Interested & Not Booked", "Rejected", "Yet To Action" ];

//const leadSubStatus = [ "Open", "Followup", "Need time to think", "Almost confirm", "Booked", "Non Contactable", "Not Interested & Already Booked", "Not Interested & Not Booked", "Rejected", "Yet to action" ];

const employeeHighValueReport = [ "OPERATION DEPARTMENT", "SALES" ];

const constants = {
    "loginAttempt": 5
};

exports.equipmentModeList = equipmentModeList;
exports.countMode = countMode;
exports.leadOperation = leadOperation;
exports.unSelect = unSelect;
exports.select = select;
exports.status = status;
exports.ecClearanceStatus = ecClearanceStatus;
exports.ecClearanceStatusName = ecClearanceStatusName;
exports.leaveStatus = leaveStatus;
exports.permissionStatus = permissionStatus;
exports.delegationStatus = delegationStatus;
exports.nightShiftStatus = nightShiftStatus;
exports.wfhStatus = wfhStatus;
exports.errorMsg = errorMsg;
exports.processStatus = processStatus;
exports.processStatusName = processStatusName;
exports.leadStatusCount = leadStatusCount;
exports.companyBanchListType = companyBanchListType;
exports.leadQuotation = leadQuotation;
exports.profile = profile;
exports.yesNo = yesNo;
exports.cronJobEmployeeReportingTo = cronJobEmployeeReportingTo;
exports.equipmentMode = equipmentMode;
exports.server = server;
exports.employeeReportDepartmentId = employeeReportDepartmentId;
exports.ecListReportCompanyId = ecListReportCompanyId;
exports.menuMode = menuMode;
exports.ecLeadStatus = ecLeadStatus;
exports.ecProcessStatus = ecProcessStatus;
exports.ecProcessStatusName = ecProcessStatusName;
exports.employeeHighValueReport = employeeHighValueReport;
exports.leadSubStatus = leadSubStatus;
exports.checkListEventQuestionId = checkListEventQuestionId;
exports.ticketStatus = ticketStatus;
exports.ticketStatusName = ticketStatusName;
exports.constants = constants;
