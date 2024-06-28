const router = require("express").Router();
const {
  VerifyUserCookie,
  VerifyBranch,
  VerifyBranchId,
  VerifyAdmin,
} = require("../Middleware/auth");
const CompanyController = require("../controllers/company-controller");

router.post("/create", CompanyController.CreateCompany);
router.get("/all", CompanyController.getAllCompanies);
router.post("/branch", CompanyController.getBranchCompanies);
router.patch("/update", CompanyController.updateCompany);
router.delete("/delete/:id", CompanyController.deleteCompany);

module.exports = router;
