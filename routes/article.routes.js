const router = require("express").Router();
const ArticleController = require("../controllers/article-controllers");

router.post("/create", ArticleController.addArticle);
router.get("/all", ArticleController.getAllArticles);
router.get("/branch/:id", ArticleController.getBranchArticles);
router.patch("/update", ArticleController.updateArticle);
router.delete("/delete/:id", ArticleController.deleteArticle);

module.exports = router;
