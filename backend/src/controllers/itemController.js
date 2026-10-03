const Item = require("../models/Item");

const createItem = async (req, res) => {
    const {title,description,type,category,location,date,image} = req.body;

    if (!title || !description || !type || !category || !location || !date) {
      return res.status(400).json({
        message: "All fields required",
      });
    }

    const item = await Item.create({title, description, type, category, location, date, image: image || "",
      reportedBy: req.user._id,
    });

    res.status(201).json({
      message: "Item reported successfully",
      item,
    });
};

const getItem = async (req, res) => {
    const item = await Item.findById(req.params.id)
      .populate("reportedBy", "name email");
    if (!item) {
      return res.status(404).json({
        message: "Item not found",
      });
    }
    res.json(item);
};

const updateItem = async (req, res) => {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({
        message: "Item not found",
      });
    }
    if (
      item.reportedBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "You can only edit your own reports",
      });
    }



    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );


    res.json({
      message: "Item updated successfully",
      item: updatedItem,
    });
};

const deleteItem = async (req, res) => {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    if (item.reportedBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "You can only delete your own reports",
      });
    }

    await item.deleteOne();
    res.json({
      message: "Item deleted successfully",
    });
};

module.exports = {getItem, createItem, updateItem, deleteItem}