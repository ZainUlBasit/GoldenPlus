const router = require("express").Router();
const ReportController = require("../controllers/expenseController");

router.post("/create", ReportController.addExpense);
router.post("/sale-detail-branch", ReportController.SaleDetail);
router.post("/sale-detail-all", ReportController.AllSaleDetail);
router.post("/all", ReportController.getAllExpenses);
router.post("/branch", ReportController.getBranchExpenses);
router.delete("/delete", ReportController.deleteExpense);

module.exports = router;
