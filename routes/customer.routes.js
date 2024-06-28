const router = require("express").Router();
const CustomerController = require("../controllers/customer-controllers");

router.post("/create", CustomerController.addCustomer);
router.post("/all", CustomerController.getAllCustomers);
router.post("/branch", CustomerController.getBranchCustomers);
router.patch("/update", CustomerController.UpdateCustomer);
router.delete("/delete", CustomerController.deleteCustomer);

module.exports = router;
