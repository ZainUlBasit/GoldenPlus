const Joi = require("joi");
const { createError, successMessage } = require("../utils/ResponseMessage");
const Stock = require("../Models/Stock");
const Item = require("../Models/Item");
const Company = require("../Models/Company");

const AddStock = async (req, res) => {
  console.log(req.body);

  const stockValidationSchema = Joi.object({
    branchId: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required(),
    branch_name: Joi.string().required(),
    branch: Joi.number().required(),
    articleId: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required(),
    article_name: Joi.string().required(),
    sizeId: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required(),
    size: Joi.string().required(),
    qty: Joi.number().required(),
    purchase: Joi.number().required(),
    invoice_no: Joi.string().required(),
    truck_no: Joi.string().required(),
    date: Joi.date().required(),
    desc: Joi.string().required(),
  });

  const { error } = stockValidationSchema.validate(req.body);
  if (error) return createError(res, 422, error.message);

  const {
    branchId,
    branch_name,
    articleId,
    article_name,
    branch,
    sizeId,
    size,
    qty,
    purchase,
    invoice_no,
    truck_no,
    date,
    desc,
  } = req.body;

  try {
    // Create a new Stock document
    const newStock = await new Stock({
      branchId,
      branch_name,
      articleId,
      article_name,
      sizeId,
      size,
      qty,
      purchase,
      total_amount: purchase * qty,
      invoice_no,
      truck_no,
      date: Math.floor(new Date(date) / 1000),
      desc,
      branch,
    }).save();

    if (!newStock) return createError(res, 400, "Unable to add new Stock!");

    const item = await Item.findById(sizeId);
    if (!item) return createError(res, 404, "Item not found!");

    const updatedItem = await Item.findByIdAndUpdate(
      sizeId,
      {
        qty: Number(item.qty) + Number(qty),
        in_qty: item.in_qty ? Number(item.in_qty) + Number(qty) : Number(qty),
      },
      { new: true }
    );

    if (!updatedItem)
      return createError(res, 400, "Unable to update item Quantity!");

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
  let { branchId } = req.body;
  if (!branchId) return createError(res, 422, "Invalid Branch Id!");

  // reqBody;
  try {
    const StockStats = await Stock.find(
      branchId || branchId !== -1
        ? {
            branchId,
          }
        : {}
    )
      .populate("branchId")
      .populate("articleId")
      .populate("sizeId");

    if (!StockStats)
      return createError(
        res,
        404,
        `No record found with Branch Id ${branchId}!`
      );
    // const UpdateStockStats = StockStats.map((dat) => {
    //   return {
    //     branch_name: dat.branch_name,
    //     article_name: dat.article_name,
    //     size: dat.size_name,
    //     qty: dat.qty,
    //     purchase: dat.purchase,
    //     total_amount: dat.total_amount,
    //     invoice_no: dat.invoice_no,
    //     truck_no: dat.truck_no,
    //     date: dat.date,
    //     desc: dat.desc,
    //     branch: dat.branch,
    //   };
    // });
    return successMessage(res, StockStats, "Stock successfully retrieved!");
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
