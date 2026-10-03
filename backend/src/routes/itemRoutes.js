const express = require("express");
const {createItem,getItems,getItem,updateItem,deleteItem} = require("../controllers/itemController");
const protect = require("../middleware/auth.middleware");
const router = express.Router();

router.get("/:id", getItem);

router.post("/", protect, createItem);
router.put("/:id", protect, updateItem);
router.delete("/:id", protect, deleteItem);

module.exports = router;