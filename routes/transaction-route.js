const router = require("express").Router();
const TransactionController = require("../controllers/transaction-controllers");

router.post("/create", TransactionController.CreateTransaction);
router.post("/all", TransactionController.GetTransactions);
router.post("/summary", TransactionController.GetItemSummary);
router.post("/delete", TransactionController.DeleteInvoice);
router.post("/check-invoice-no", TransactionController.CheckBillNumber);
router.post("/update-invoice-item", TransactionController.UpdateInvoiceItem);

module.exports = router;
