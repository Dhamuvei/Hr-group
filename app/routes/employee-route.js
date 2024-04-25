/**
 * @param {*} router 
 * @Desc  Router for getting 'General' resources
 */

// const userModel = require('../models/user-model');
// const financialYearSlap = require('../validations/financialYearSlap');

module.exports = function(router) {
    const employeeController = require("../controllers/employee-controller");
    const middleware = require('../libs/util/token-validator-middleware');
    const employeFamilyController = require('../controllers/emloyee-family-controller');
    const employeDocumentController = require('../controllers/employe-document-controller');
    const employeCategoryController = require('../controllers/employe-category-controller');


    const { loginValidator, registerValidator,employementTypeValidator,projectValidator,qualificationValidator,countryValidator,stateValidator,cityValidator,timezoneValidator,languageValidator,investmentSectionValidator,processStatusValidator,taxValidator ,financialYearSlapValidator} = require("../validations");



    //employee apis
    router.post("/add_hr_employee",middleware.checkAuth , employeeController.addHrEmployee);
    router.post("/get_hr_employee",middleware.checkAuth , employeeController.getAllHrEmployee);
    router.post("/get_all_hr_employee",middleware.checkAuth , employeeController.getHrEmployee);
    router.post("/update_hr_employee",middleware.checkAuth , employeeController.updateHrEmployee);
    router.post("/delete_hr_employee",middleware.checkAuth , employeeController.deleteHrEmployee);

    //official
    router.post("/add_official_employee",middleware.checkAuth , employeeController.addHrEmployeeOfficial);
    router.post("/get_official_employee",middleware.checkAuth , employeeController.getAllHrEmployeeOfficial);
    router.post("/update_official_employee",middleware.checkAuth , employeeController.updateHrEmployeeOfficial);

    //emp bank
    router.post("/add_bank_employee",middleware.checkAuth , employeeController.addHrEmployeeBank);
    router.post("/get_bank_employee",middleware.checkAuth , employeeController.getAllHrEmployeeBank);
    router.post("/update_bank_employee",middleware.checkAuth , employeeController.updateHrEmployeeBank);

    //emp address
    router.post("/add_address_employee",middleware.checkAuth , employeeController.addHrEmployeeAddress);
    router.post("/get_address_employee",middleware.checkAuth , employeeController.getAllHrEmployeeAddress);
    router.post("/update_address_employee",middleware.checkAuth , employeeController.updateHrEmployeeAddress);

    //emp kyc 
    router.post("/add_kyc_employee",middleware.checkAuth , employeeController.addHrEmployeeKycDoc);
    router.post("/get_kyc_employee",middleware.checkAuth , employeeController.getAllHrEmployeeKycDoc);
    router.post("/update_kyc_employee",middleware.checkAuth , employeeController.updateHrEmployeeKycDoc);

    //emp emgcontact
    router.post("/add_contact_employee",middleware.checkAuth , employeeController.addHrEmployeeEmgContact);
    router.post("/get_contact_employee",middleware.checkAuth , employeeController.getAllHrEmployeeEmgContact);
    router.post("/update_contact_employee",middleware.checkAuth , employeeController.updateHrEmployeeEmgContact);

    //employeFamily api's
    router.post("/add_employe_family",middleware.checkAuth , employeFamilyController.addHrEmployeFamily);
    router.post("/get_employe_family",middleware.checkAuth , employeFamilyController.getHrEmployeFamily);
    router.post("/update_employe_family",middleware.checkAuth , employeFamilyController.updateHrEmployeFamily);
    router.post("/delete_employe_family",middleware.checkAuth , employeFamilyController.deleteHrEmployeFamily);

    //employeDocument api's
    router.post("/add_employe_document",middleware.checkAuth , employeDocumentController.addHrEmployeDocument);
    router.post("/get_employe_document",middleware.checkAuth , employeDocumentController.getHrEmployeDocument);
    router.post("/update_employe_document",middleware.checkAuth , employeDocumentController.updateHrEmployeDocument);
    router.post("/delete_employe_document",middleware.checkAuth , employeDocumentController.deleteHrEmployeDocument);

    //employeCategory  
    router.post("/add_employe_category",middleware.checkAuth , employeCategoryController.addHrEmployeCategory);
    router.post("/get_employe_category",middleware.checkAuth , employeCategoryController.getHrEmployeCategory);
    router.post("/update_employe_category",middleware.checkAuth , employeCategoryController.updateHrEmployeCategory);
    router.post("/delete_employe_category",middleware.checkAuth , employeCategoryController.deleteHrEmployeCategory);

}