const router = require("express").Router();
const StockController = require("../controllers/StockController");

router.post("/add", StockController.AddStock);
router.post("/all", StockController.GetStockByAdmin);
router.post("/branch", StockController.GetStockByBranch);
// router.patch("/update", StockController.UpdateSales);
// router.delete("/delete", StockController.DeleteSale);

module.exports = router;
