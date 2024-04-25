/**
 * @param {*} router 
 * @Desc  Router for getting 'General' resources
 */

// const userModel = require('../models/user-model');
// const financialYearSlap = require('../validations/financialYearSlap');

module.exports = function(router) {
    
    const middleware = require('../libs/util/token-validator-middleware');
    const employeeSetupTemplateController =require('../controllers/payroll/employee-setup-template-controller');
    const salarySetupTemplateController = require('../controllers/payroll/salary-setup-template-controller')

    //employeeSetupTemplateController
    router.post("/add_emp_setup_template",middleware.checkAuth , employeeSetupTemplateController.addEmployeeSetupTemplate);
    router.post("/get_emp_setup_template",middleware.checkAuth , employeeSetupTemplateController.getEmployeeSetupTemplate);
    router.post("/update_emp_setup_template",middleware.checkAuth , employeeSetupTemplateController.updateEmployeeSetupTemplate);
    router.post("/get_payroll_salary_parameter",middleware.checkAuth , employeeSetupTemplateController.getPayRollSalaryParameter);

    //salarySetupTemplateController
    router.post("/add_salary_setup_template",middleware.checkAuth , salarySetupTemplateController.addSalarySetupTemplate);
    router.post("/get_salary_setup_template",middleware.checkAuth , salarySetupTemplateController.getSalarySetupTemplate);
    router.post("/update_salary_setup_template",middleware.checkAuth , salarySetupTemplateController.updateSalarySetupTemplate);
    router.post("/delete_salary_setup_template",middleware.checkAuth , salarySetupTemplateController.deleteSalarySetupTemplate);

}