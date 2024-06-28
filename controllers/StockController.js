const Joi = require("joi");
const { createError, successMessage } = require("../utils/ResponseMessage");
const Stock = require("../Models/Stock");
const Item = require("../Models/Item");
const Company = require("../Models/Company");

const AddStock = async (req, res) => {
  console.log(req.body);
  const stockValidationSchema = Joi.object({
    itemId: Joi.string().required(),
    companyId: Joi.string().required(),
    qty: Joi.number().required(),
    purchase: Joi.number().required(),
    invoice_no: Joi.string().required(),
    truck_no: Joi.string().required(),
    date: Joi.number().required(), // You might want to adjust validation for the date type
    branch: Joi.number().required(), // You might want to adjust validation for the date type
    desc: Joi.string().required(),
  });

  const { error } = stockValidationSchema.validate(req.body);
  if (error) return createError(res, 422, error.message);

  const {
    itemId,
    companyId,
    qty,
    purchase,
    invoice_no,
    truck_no,
    date,
    desc,
    branch,
  } = req.body;
  try {
    // Create a new Stock document
    const newStock = await new Stock({
      itemId,
      companyId,
      qty,
      purchase,
      total_amount: purchase * qty,
      invoice_no,
      truck_no,
      date,
      desc,
      branch,
    }).save();
    if (!newStock) return createError(res, 400, "Unable to add new Stock!");
    const item = await Item.findById(itemId);
    if (!item) return createError(res, 404, "Item not found!");
    console.log("=======================================");
    console.log(item);
    console.log("=======================================");

    const updatedItem = await Item.findByIdAndUpdate(
      itemId,
      {
        qty: Number(item.qty) + Number(qty),
        in_qty: item.in_qty ? Number(item.in_qty) + Number(qty) : Number(qty),
      },
      { new: true }
    );
    if (!updatedItem)
      return createError(res, 400, "Unable to update item Quantity!");

    const updateValue = {
      $inc: { total: qty * purchase, remaining: qty * purchase },
    };
    const updatedCompany = await Company.findByIdAndUpdate(
      companyId,
      updateValue,
      { new: true }
    );
    if (!updatedCompany)
      return createError(res, 400, "Unable to update Company Accounts!");

    return successMessage(res, newStock, "Stock Successfully Added!");
  } catch (err) {
    console.error("Error adding stock:", err);
    return createError(res, 500, err.message || err);
  }
};
const GetStockByAdmin = async (req, res) => {
  const { startDate = 0, endDate = Math.floor(Date.now() / 1000) } = req.body;
  try {
    const StockStats = await Stock.find({
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    })
      .populate("itemId")
      .populate("companyId");
    console.log("stats amdin:", StockStats);
    if (!StockStats) return createError(res, 404, "No record found!");
    return successMessage(res, StockStats, null);
  } catch (err) {
    console.log("Error while getting Stock Stats: ", err);
    return createError(res, 500, err.message || err);
  }
};
const GetStockByBranch = async (req, res) => {
  const {
    companyId,
    branch,
    startDate = 0,
    endDate = Math.floor(Date.now() / 1000),
  } = req.body;
  if (!branch) return createError(res, 422, "Invalid Branch #!");

  const reqBody = companyId
    ? {
        companyId,
        branch,
        date: {
          $gte: startDate,
          $lte: endDate,
        },
      }
    : {
        branch,
        date: {
          $gte: startDate,
          $lte: endDate,
        },
      };

  reqBody;
  try {
    const StockStats = await Stock.find(reqBody)
      .populate("itemId")
      .populate("companyId");

    if (!StockStats)
      return createError(res, 404, `No record found of Branch ${branch}!`);
    const UpdateStockStats = StockStats.map((dat) => {
      return {
        name: dat.itemId.name,
        qty: dat.qty,
        purchase: dat.purchase,
        total_amount: dat.total_amount,
        invoice_no: dat.invoice_no,
        truck_no: dat.truck_no,
        date: dat.date,
        desc: dat.desc,
        branch: dat.branch,
      };
    });
    return successMessage(res, UpdateStockStats, null);
  } catch (err) {
    console.log("Error while getting Stock Stats: ", err);
    return createError(res, 500, err.message || err);
  }
};

module.exports = {
  AddStock,
  GetStockByAdmin,
  GetStockByBranch,
};
