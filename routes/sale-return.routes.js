const router = require("express").Router();
const SaleReturnController = require("../controllers/sale-return-controller");

router.post("/create", SaleReturnController.CreateTransaction);
router.post("/delete", SaleReturnController.DeleteInvoice);
router.post("/branch", SaleReturnController.GetReturns);
// router.get("/branch", SaleReturnController.GetBranchSales);
// router.patch("/update", SaleReturnController.UpdateSales);
// router.delete("/delete", SaleReturnController.DeleteSale);

module.exports = router;
