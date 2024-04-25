/**
 * @param {*} router 
 * @Desc  Router for getting 'General' resources
 */

// const userModel = require('../models/user-model');
// const financialYearSlap = require('../validations/financialYearSlap');

module.exports = function(router) {
    const middleware = require('../libs/util/token-validator-middleware');
    const LRController = require('../controllers/leaveRequest-controller')
    const overtimeController =require('../controllers/over-time-category-controller');
    const LERController =require('../controllers/leaveEncashment-controller');
    const hierarchylevelController =require('../controllers/hierarchylevel-controller');
    const levelmodulesController =require('../controllers/level-modules-controller');
    const levelApprovalsController =require('../controllers/level-approval-setting-controller');
    const bonusController =require('../controllers/employee/bouns-controller');
    const costCenterController = require('../controllers//costCenter-controller');
    const incentiveController =require('../controllers/employee/incentive-controller');
    const allownceController =require('../controllers/employee/allowance-controller');
    // const employeeSetupTemplateController =require('../controllers/employee-setup-template-controller');

    //Leave Request api
    router.post("/addLeaveRequest",middleware.checkAuth , LRController.addLeaveRequest);
    router.post("/getLeaveRequest",middleware.checkAuth , LRController.getLeaveRequest);
    router.post("/updateLeaveRequest",middleware.checkAuth , LRController.updateLeaveRequest);
    router.post("/deleteLeaveRequest",middleware.checkAuth , LRController.deleteLeaveRequest);
    router.post("/leave_request_list",middleware.checkAuth , LRController.leaveRequestList);
    router.post("/leave_get_emp",middleware.checkAuth , LRController.leaveGetEmployee);

    // leave Approval
    router.post("/leave_approval",middleware.checkAuth , LRController.updateLeaveApproval);
    router.post("/get_apply_leave_requset",middleware.checkAuth , LRController.getApplyLeaveRequest);

    //overtime apis
    router.post("/add_over_time",middleware.checkAuth , overtimeController.addOverTime);
    router.post("/get_over_time",middleware.checkAuth , overtimeController.getAllOverTime);
    router.post("/update_over_time",middleware.checkAuth , overtimeController.updateOverTime);
    router.post("/delete_over_time",middleware.checkAuth , overtimeController.deleteOverTime);

    //leave Encashment api
    router.post("/addLeaveEncashment",middleware.checkAuth , LERController.addLeaveEncashment);
    router.post("/getLeaveEncashment",middleware.checkAuth , LERController.getLeaveEncashment);
    router.post("/updateLeaveEncashment",middleware.checkAuth , LERController.updateLeaveEncashment);
    router.post("/deleteLeaveEncashment",middleware.checkAuth , LERController.deleteLeaveEncashment);

    router.post("/leaveEncashmentRequestList",middleware.checkAuth , LERController.leaveEncashmentRequestList);
    router.post("/leaveEncashmentGetEmployee",middleware.checkAuth , LERController.leaveEncashmentGetEmployee);
    router.post("/getApplyLeaveEncashmentRequest",middleware.checkAuth , LERController.getApplyLeaveEncashmentRequest);
    router.post("/updateLeaveEncashmentApproval",middleware.checkAuth , LERController.updateLeaveEncashmentApproval);


    //hierarchylevelController
    router.post("/add_hierarchy_level",middleware.checkAuth , hierarchylevelController.addHierarchyLevel);
    router.post("/get_hierarchy_level",middleware.checkAuth , hierarchylevelController.getAllHierarchyLevel);

    //levelmodulesController
    router.post("/add_modules_level",middleware.checkAuth , levelmodulesController.addLevelModules);
    router.post("/get_modules_level",middleware.checkAuth , levelmodulesController.getLevelModules);
    router.post("/update_modules_level",middleware.checkAuth , levelmodulesController.updateLevelModules);
    router.post("/delete_modules_level",middleware.checkAuth , levelmodulesController.deleteLevelModules);

    //levelApprovalsController
    router.post("/add_approvals_level",middleware.checkAuth , levelApprovalsController.addLevelApprovals);
    router.post("/get_approvals_level",middleware.checkAuth , levelApprovalsController.getLevelApprovals);
    router.post("/update_approvals_level",middleware.checkAuth , levelApprovalsController.updateLevelApprovals);
    router.post("/delete_approvals_level",middleware.checkAuth , levelApprovalsController.deleteLevelApprovals);

    //bonusController
    router.post("/add_bonus",middleware.checkAuth , bonusController.addBouns);
    router.post("/get_bonus",middleware.checkAuth , bonusController.getBouns);
    router.post("/update_bonus",middleware.checkAuth , bonusController.updateBouns);
    router.post("/delete_bonus",middleware.checkAuth , bonusController.deleteBouns);
    //get employe bonus
    router.post("/bouns_get_employee",middleware.checkAuth , bonusController.bounsGetEmployee);
    //response details 
    router.post("/update_responce_details",middleware.checkAuth , bonusController.updaateResponseDetails);
    //bonus req list
    router.post("/bonus_requset_list",middleware.checkAuth , bonusController.BonusRequestList);
    //update bonus request
    router.post("/update_bonus_approvl",middleware.checkAuth , bonusController.updateBonusApproval);
    router.post("/get_apply_bonus_req",middleware.checkAuth , bonusController.getApplyBonusRequest);

    //costCenter Api
    router.post("/addCostCenter",middleware.checkAuth , costCenterController.addCostCenter);
    router.post("/getCostCenter",middleware.checkAuth , costCenterController.getCostCenter);
    router.post("/updateCostCenter",middleware.checkAuth , costCenterController.updateCostCenter);
    router.post("/deleteCostCenter",middleware.checkAuth , costCenterController.deleteCostCenter);

    //incentiveController
    router.post("/add_incentive",middleware.checkAuth , incentiveController.addIncentive);
    router.post("/get_incentive",middleware.checkAuth , incentiveController.getIncentive);
    router.post("/updaate_incentive",middleware.checkAuth , incentiveController.updateIncentive);
    router.post("/delete_incentive",middleware.checkAuth , incentiveController.deleteIncentive);
    //incentive emp
    router.post("/incentive_Get_Employee",middleware.checkAuth , incentiveController.incentiveGetEmployee);
    router.post("/get_incentive_orderbydec",middleware.checkAuth , incentiveController.incentiveRequestList);
    //responce array
    router.post("/getapply_incentive_res",middleware.checkAuth , incentiveController.getApplyIncentiveRequest);
    router.post("/update_incentive_res",middleware.checkAuth , incentiveController.updaateIncentiveResponseDetails);
    router.post("/update_incentive_approval",middleware.checkAuth , incentiveController.updateIncentiveApproval);

    //allownceController
    router.post("/add_allownce",middleware.checkAuth , allownceController.addAllowance);
    router.post("/get_allownce",middleware.checkAuth , allownceController.getAllowance);
    router.post("/update_allownce",middleware.checkAuth , allownceController.updateAllowance);
    router.post("/delete_allownce",middleware.checkAuth , allownceController.deleteAllowance);
    //allwance emp 
    router.post("/get_emp_allownce",middleware.checkAuth , allownceController.allownceGetEmployee);
    //responce array
    router.post("/update_allowance_res",middleware.checkAuth , allownceController.updaateAllowanceResponseDetails);
    router.post("/update_allowance_approval",middleware.checkAuth , allownceController.updateAllowanceApproval);
    router.post("/get_allowance_orderbydec_list",middleware.checkAuth , allownceController.allowanceRequestList);
    router.post("/get_allowance_apply_list",middleware.checkAuth , allownceController.getApplyAllowanceRequest);

    //employeeSetupTemplateController
    // router.post("/add_emp_setup_template",middleware.checkAuth , employeeSetupTemplateController.addEmployeeSetupTemplate);
    // router.post("/get_emp_setup_template",middleware.checkAuth , employeeSetupTemplateController.getEmployeeSetupTemplate);
    // router.post("/update_emp_setup_template",middleware.checkAuth , employeeSetupTemplateController.updateEmployeeSetupTemplate);
    // router.post("/get_payroll_salary_parameter",middleware.checkAuth , employeeSetupTemplateController.getPayRollSalaryParameter);

}