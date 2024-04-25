/**
 * @param {*} router 
 * @Desc  Router for getting 'General' resources
 */

// const userModel = require('../models/user-model');
// const financialYearSlap = require('../validations/financialYearSlap');

module.exports = function(router) {
    const middleware = require('../libs/util/token-validator-middleware');
    const commonController = require('../controllers/common-controller');
    const commonFunctions = require('../libs/util/commonFunctions');
    const employementTypeController = require('../controllers/employementType-controller');
    const projectController = require('../controllers/project-controller')
    const qualificationController = require('../controllers/qualification-controller')
    const countryController = require('../controllers/country-controller')
    const stateController = require('../controllers/state-controller')
    const cityController = require('../controllers/city-controller')
    const timezoneController = require('../controllers/timezone-controller')
    const languageController = require('../controllers/language-controller')
    const investmentSectionController =require('../controllers/investmentSection-controller');
    const investmentSectionItemController = require('../controllers/investmentSectionItem-controller')
    const processStatusController =require('../controllers/processStatus-controller')
    const taxController = require('../controllers/tax-controller')
    const accessController = require('../controllers/access-controller')
    const financailYearSlapController = require('../controllers/financialYearSlap-controller')
    const ptTaxController = require('../controllers/ptTax-controller')
    const departmentController = require("../controllers/hr-department-controller")
    const designationController = require("../controllers/hr-designation-controller")
    const gradeController = require("../controllers/hr-grade-controller")
    const naturalController = require("../controllers/hr-natural-of-claim-controller")
    const bankController = require("../controllers/hr-bank-controller")
    const companyBankController = require("../controllers/hr-company-bank-controller")
    const incomeTaxSlapController = require("../controllers/hr-income-tax-slab-controller")
    const companyController = require("../controllers/company-controller")
    const salaryParameterController = require("../controllers/hr-salary-parameter-constroller")
    const documentController = require("../controllers/hr-document-controller")
    const menuController = require('../controllers/menu-controller');
    const roleController = require('../controllers/role-controller');
    const leaveTypeController = require('../controllers/hr-leave-type-controller');
    const nonWorkingController = require('../controllers/non-working-controller');
    const employeLearingController = require('../controllers/employee-learning-controller');
    const employeBondController = require('../controllers/employee-bond-controller');
    const branchController = require('../controllers/branch-controller')
    const userController = require('../controllers/user-controller');
    const ipAddressController = require('../controllers/ipAddress-controller');
    const shiftController = require('../controllers/shift-controller');
    const calenderController = require('../controllers/calender-controller')
    const moduleSetupController = require('../controllers/module-setup-controller')

    const { loginValidator, registerValidator,employementTypeValidator,projectValidator,qualificationValidator,countryValidator,stateValidator,cityValidator,timezoneValidator,languageValidator,investmentSectionValidator,processStatusValidator,taxValidator ,financialYearSlapValidator} = require("../validations");


      router.post("/login", loginValidator, commonController.login);
      // router.post("/login", commonController.login);
      router.post("/register", registerValidator, commonController.register);
      router.post("/getUserSessionInfo", middleware.checkAuth, commonController.getSessionUserInfo);
      router.post("/addUserEmployee", middleware.checkAuth, userController.addEmployeeUser);
      router.post("/updateUserEmployee", middleware.checkAuth, userController.updateEmployeeUser);


      router.post("/imageUpload", commonFunctions.upload.single('file'), commonController.imageUpload);

      //EmploymentType Api"s
      router.post("/addEmployementType",[middleware.checkAuth,employementTypeValidator], employementTypeController.addHrEmploymentType);
      router.post("/getEmployementType", middleware.checkAuth,employementTypeController.getHrEmploymentType);
      router.post("/updateEmployementType",middleware.checkAuth, employementTypeController.updateHrEmploymentType);
      router.post("/deleteEmployementType",middleware.checkAuth, employementTypeController.deleteHrEmploymentType);

      //Project Api's
      router.post("/addProject",[middleware.checkAuth,projectValidator], projectController.addHrProject);
      router.post("/getProject",middleware.checkAuth, projectController.getHrProject);
      router.post("/updateProject", middleware.checkAuth,projectController.updateHrProject);
      router.post("/deleteProject",middleware.checkAuth, projectController.deleteHrProject);

      //Qulification Api's
      router.post("/addQualification",[middleware.checkAuth,qualificationValidator], qualificationController.addHrQualification);
      router.post("/getQualification",middleware.checkAuth, qualificationController.getHrQualification);
      router.post("/updateQualification",middleware.checkAuth, qualificationController.updateHrQualification);
      router.post("/deleteQualification",middleware.checkAuth, qualificationController.deleteHrQualification);

      //Country Api's
      router.post("/addCountry",[middleware.checkAuth,countryValidator], countryController.addHrCountries);
      router.post("/getCountry",middleware.checkAuth, countryController.getHrCountry);
      router.post("/updateCountry",middleware.checkAuth, countryController.updateHrCountry);
      router.post("/deleteCountry",middleware.checkAuth, countryController.deleteHrCountry);

      //state Api's
      router.post("/addState",[middleware.checkAuth,stateValidator], stateController.addHrState);
      router.post("/getState",middleware.checkAuth, stateController.getHrState);
      router.post("/updateState",middleware.checkAuth, stateController.updateHrState);
      router.post("/deleteState",middleware.checkAuth, stateController.deleteHrState);
      
      //City Api's
      router.post("/addCity",[middleware.checkAuth,cityValidator], cityController.addHrCity);
      router.post("/getCity",middleware.checkAuth, cityController.getHrCity);
      router.post("/updateCity",middleware.checkAuth, cityController.updateHrCity);
      router.post("/deleteCity",middleware.checkAuth, cityController.deleteHrCity);

      //timeZone Api's
      router.post("/addTimezone",[middleware.checkAuth,timezoneValidator], timezoneController.addHrTimezone);
      router.post("/getTimezone",middleware.checkAuth, timezoneController.getHrTimeZone);
      router.post("/updateTimezone",middleware.checkAuth, timezoneController.updateHrTimezone);
      router.post("/deleteTimezone",middleware.checkAuth ,timezoneController.deleteHrTimezone);

      //language Api's
      router.post("/addLanguage",middleware.checkAuth, languageController.addHrLanguage);
      router.post("/getLanguage",middleware.checkAuth, languageController.getHrLanguage);
      router.post("/updateLanguage",middleware.checkAuth, languageController.updateHrLanguage);
      router.post("/deleteLanguage",middleware.checkAuth, languageController.deleteHrLanguage);

      //Investment Section Api's
      router.post("/addInvestmentSection",[middleware.checkAuth,investmentSectionValidator],investmentSectionController.addHrInvestmentSection);
      router.post("/getInvestmentSection",middleware.checkAuth, investmentSectionController.getHrInvestmentSection);
      router.post("/updateInvestmentSection",middleware.checkAuth, investmentSectionController.updateHrInvestmentSection);
      router.post("/deleteInvestmentSection",middleware.checkAuth, investmentSectionController.deleteHrInvestmentSection);

      //Investment Section Item Api's
      router.post("/addInvestmentSectionItem",middleware.checkAuth,investmentSectionItemController.addHrInvestmentSectionItem);
      router.post("/getInvestmentSectionItem",middleware.checkAuth, investmentSectionItemController.getHrInvestmentSectionItem);
      router.post("/updateInvestmentSectionItem",middleware.checkAuth, investmentSectionItemController.updateHrInvestmentSectionItem);
      router.post("/deleteInvestmentSectionItem",middleware.checkAuth, investmentSectionItemController.deleteHrInvestemntSectionItem);

      //processStatus Api's
      router.post("/addProcessStatus",[middleware.checkAuth,processStatusValidator],processStatusController.addHrProcessStatus);
      router.post("/getProcessStatus",middleware.checkAuth, processStatusController.getHrProcessStatus);
      router.post("/updateProcessStatus",middleware.checkAuth, processStatusController.updateHrProcessStatus);
      router.post("/deleteProcessStatus",middleware.checkAuth, processStatusController.deleteHrProcessStatus);

      //Tax Api's
      router.post("/addTax",[middleware.checkAuth,taxValidator], taxController.addHrTax);
      router.post("/getTax",middleware.checkAuth, taxController.getHrTax);
      router.post("/updateTax",middleware.checkAuth, taxController.updateHrTax);
      router.post("/deleteTax",middleware.checkAuth, taxController.deleteHrTax);

      //Acceess Api's
      router.post("/addAccess",middleware.checkAuth, accessController.addHrAceess);
      router.post("/getAccess",middleware.checkAuth, accessController.getHrAccess);
      router.post("/updateAccess",middleware.checkAuth, accessController.updateHrAccess);
      router.post("/deleteAccess",middleware.checkAuth, accessController.deleteHrAccess);

      //financialYearSlap Api's
      router.post("/addFinancialYearSlap",[middleware.checkAuth,financialYearSlapValidator], financailYearSlapController.addHrFinancialYearSlap);
      router.post("/getFinancialYearSlap",middleware.checkAuth, financailYearSlapController.getHrFinancialYearSlap);
      router.post("/updateFinancialYearSlap",middleware.checkAuth, financailYearSlapController.updateHrFinancialYearSlap);
      router.post("/deleteFinancialYearSlap",middleware.checkAuth, financailYearSlapController.deleteHrFinancialYearSlap);
    
      //PT Tax master Api
      router.post("/addPTTax",middleware.checkAuth, ptTaxController.addHrPtTax);
      router.post("/getPTTax",middleware.checkAuth, ptTaxController.getHrPtTax);
      router.post("/updatePTTax",middleware.checkAuth, ptTaxController.updateHrPtTax);
      router.post("/deletePTTax",middleware.checkAuth, ptTaxController.deleteHrPtTax);

     //hrdepartment apis
        router.post("/add_hr_department",middleware.checkAuth , departmentController.addHrDepartment);
        router.post("/get_hr_department",middleware.checkAuth , departmentController.getAllHrDepartment);
        router.post("/update_hr_department",middleware.checkAuth , departmentController.updateHrDepartment);
        router.post("/delete_hr_department",middleware.checkAuth , departmentController.deleteHrDepartment);
    
        //designation apis
        router.post("/add_hr_designation",middleware.checkAuth , designationController.addHrDesignation);
        router.post("/get_all_hr_designation",middleware.checkAuth , designationController.getAllHrDesignation);
        router.post("/update_hr_designation",middleware.checkAuth , designationController.updateHrDesignation);
        router.post("/delete_hr_designation",middleware.checkAuth , designationController.deleteHrDesignation);
    
        //grade apis
        router.post("/add_hr_grade",middleware.checkAuth,  gradeController.addHrGrade);
        router.post("/get_all_hr_grade",middleware.checkAuth , gradeController.getAllHrGrade);
        router.post("/update_hr_grade",middleware.checkAuth , gradeController.updateHrGrade);
        router.post("/delete_hr_grade",middleware.checkAuth , gradeController.deleteHrGrade);
    
        // natural of claim apis
        router.post("/add_natural_of_claim",middleware.checkAuth , naturalController.addNaturalOfClaim);
        router.post("/get_natural_of_claim",middleware.checkAuth , naturalController.getAllNaturalOfClaim);
        router.post("/update_natural_of_claim",middleware.checkAuth , naturalController.updateNaturalOfClaim);
        router.post("/delete_natural_of_claim",middleware.checkAuth,middleware.checkAuth , naturalController.deleteNaturalOfClaim);
    
    
        //bank apis
        router.post("/add_hr_bank",middleware.checkAuth , bankController.addHrBank);
        router.post("/get_hr_bank",middleware.checkAuth , bankController.getAllHrBank);
        router.post("/update_hr_bank",middleware.checkAuth , bankController.updateHrBank);
        router.post("/delete_hr_bank",middleware.checkAuth , bankController.deleteHrBank);
    
        //companyBank apis
        router.post("/add_hr_company_bank",[middleware.checkAuth ], companyBankController.addHrCompanyBank);
        router.post("/get_hr_company_bank",middleware.checkAuth , companyBankController.getAllHrCompanyBank);
        router.post("/update_hr_company_bank",middleware.checkAuth , companyBankController.updateHrCompanyBank);
        router.post("/delete_hr_company_bank",middleware.checkAuth , companyBankController.deleteHrCompanyBank);
    
        //incomeTaxSlap apis
        router.post("/add_hr_income_tax_slap",middleware.checkAuth , incomeTaxSlapController.addHrIncomeTaxSlap);
        router.post("/get_hr_income_tax_slap",middleware.checkAuth , incomeTaxSlapController.getAllHrIncomeTaxSlapMaster);
        router.post("/update_hr_income_tax_slap",middleware.checkAuth , incomeTaxSlapController.updateHrIncometaxSlapMater);
        router.post("/delete_hr_income_tax_slap",middleware.checkAuth , incomeTaxSlapController.deleteHrIncomeTaxSlapMaster);
    
        // company apis
        router.post("/add_company",middleware.checkAuth , companyController.addHrCompany);
        router.post("/get_all_company",middleware.checkAuth , companyController.getAllHrCompany);
        router.post("/update_company",middleware.checkAuth , companyController.updateHrCompany);
        router.post("/delete_company",middleware.checkAuth , companyController.deleteHrCompany);

        //comp configuration api's
        router.post("/getConfiguration",middleware.checkAuth , companyController.getAllHrConfiguration);
        router.post("/updateConfiguration",middleware.checkAuth , companyController.updateConfiguration);


       //salaryParameter apis
       router.post("/add_salary_parameter",middleware.checkAuth , salaryParameterController.addHrSalaryParameter);
       router.post("/get_salary_parameter",middleware.checkAuth , salaryParameterController.getAllHrSalaryParameter);
       router.post("/update_salary_parameter",middleware.checkAuth , salaryParameterController.updateHrSalaryParameter);
       router.post("/delete_salary_parameter",middleware.checkAuth , salaryParameterController.deleteHrSalaryParameter);

       //document apis
       router.post("/add_document",middleware.checkAuth , documentController.addHrDocument);
       router.post("/get_document",middleware.checkAuth , documentController.getAllHrDocument);
       router.post("/update_document",middleware.checkAuth , documentController.updateHrDocument);
       router.post("/delete_document",middleware.checkAuth , documentController.deleteHrDocument);
      
       //emp Bond
       router.post("/add_employe_bond",middleware.checkAuth , employeBondController.addEmployeBond);
       router.post("/get_employe_bond",middleware.checkAuth , employeBondController.getHrEmployeBond);
       router.post("/update_employe_bond",middleware.checkAuth , employeBondController.updateHrEmployeBond);
       router.post("/delete_employe_bond",middleware.checkAuth , employeBondController.deleteHrEmployeBond);


       //menu api's
       router.post("/addMenu",middleware.checkAuth , menuController.addHrMenu);
       router.post("/getMenu",middleware.checkAuth , menuController.getHrMenu);
       router.post("/updateMenu",middleware.checkAuth , menuController.updateHrMenu);
       router.post("/deleteMenu",middleware.checkAuth , menuController.deleteHrMenu);
       router.post("/updateSequence",middleware.checkAuth , menuController.updateMenuSequance);

       //role
       router.post("/add_hr_role",middleware.checkAuth , roleController.addHrRole);
       router.post("/get_hr_role",middleware.checkAuth , roleController.getHrRole);
       router.post("/update_hr_role",middleware.checkAuth , roleController.updateHrRole);
       router.post("/delete_hr_role",middleware.checkAuth , roleController.deleteHrRole);
       router.post("/get_id_hr_role",middleware.checkAuth , roleController.getHrRoleById);

       //leaveType
       router.post("/add_hr_leave_type",middleware.checkAuth , leaveTypeController.addHrLeaveType);
       router.post("/get_hr_leave_type",middleware.checkAuth , leaveTypeController.getAllHrLeaveType);
       router.post("/update_hr_leave_type",middleware.checkAuth , leaveTypeController.updateHrLeaveType);
       router.post("/delete_hr_leave_type",middleware.checkAuth , leaveTypeController.deleteHrLeaveType);

       //nonWorking
       router.post("/add_hr_non_working",middleware.checkAuth , nonWorkingController.addHrNonWorking);
       router.post("/get_hr_non_working",middleware.checkAuth , nonWorkingController.getAllHrNonWorking);
       router.post("/update_hr_non_working",middleware.checkAuth , nonWorkingController.updateHrNonWorking);
       router.post("/delete_hr_non_working",middleware.checkAuth , nonWorkingController.deleteHrNonWorking);


       //employeLearing api's
       router.post("/add_employe_learning",middleware.checkAuth , employeLearingController.addHrEmployeLearning);
       router.post("/get_employe_learning",middleware.checkAuth , employeLearingController.getAllHrEmployeLearning);
       router.post("/update_employe_learning",middleware.checkAuth , employeLearingController.updateHrEmployeLearning);
       router.post("/delete_employe_learning",middleware.checkAuth , employeLearingController.deleteHrEmployeLearning);


       //branch 
       router.post("/addBranch",middleware.checkAuth , branchController.addHrBranch);
       router.post("/getBranch",middleware.checkAuth , branchController.getAllHrBranches);
       router.post("/updateBranch",middleware.checkAuth , branchController.updateHrBranch);
       router.post("/deleteBranch",middleware.checkAuth , branchController.deleteHrBranch);


      //ipAddress api's
      router.post("/add_ipaddress",middleware.checkAuth , ipAddressController.addIpAddress);
      router.post("/get_ipaddress",middleware.checkAuth , ipAddressController.getIpAddress);

    //shiftController
    router.post("/add_shift",middleware.checkAuth , shiftController.addShift);
    router.post("/get_shift",middleware.checkAuth , shiftController.getAllShift);
    router.post("/update_shift",middleware.checkAuth , shiftController.updateShift);
    router.post("/delete_shift",middleware.checkAuth , shiftController.deleteShift);

    //Calneder api
    router.post("/addCalender",middleware.checkAuth , calenderController.addHrCalender);
    router.post("/getCalender",middleware.checkAuth , calenderController.getHrCalender);
    router.post("/updateCalender",middleware.checkAuth , calenderController.updateHrCalender);
    router.post("/deleteCalender",middleware.checkAuth , calenderController.deleteHrCalender);

    //moduleSetupController
    router.post("/add_module_setup",middleware.checkAuth , moduleSetupController.addModuleSetup);
    router.post("/get_module_setup",middleware.checkAuth , moduleSetupController.getAllModuleSetup);
}