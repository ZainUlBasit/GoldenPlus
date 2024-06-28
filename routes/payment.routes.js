const router = require("express").Router();
const PaymentController = require("../controllers/payment-controller");

router.post("/create", PaymentController.addPayment);
router.post("/all", PaymentController.getAllPayments);
router.post("/branch", PaymentController.getBranchPayments);
router.post("/update", PaymentController.updatePayment);
router.post("/delete", PaymentController.deletePayment);

module.exports = router;
