const Item = require("../models/Item");
const User = require("../models/User");

const owner = { path: "reportedBy", select: "name email", model: User };

const buildImageUrl = (req) =>
  `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

const createItem = async (req, res) => {
  try {
    const { title, description, type, category, location, date } = req.body;

    if (!title || !description || !type || !category || !location || !date) {
      return res.status(400).json({ message: "All fields required" });
    }

    const item = await Item.create({
      title,
      description,
      type,
      category,
      location,
      date,
      image: req.file ? buildImageUrl(req) : "",
      reportedBy: req.user._id,
    });

    res.status(201).json({ message: "Item reported successfully", item });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getItems = async (req, res) => {
  try {
    const { search, category, location, type, status } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (location) filter.location = location;
    if (type) filter.type = type;
    if (status) filter.status = status;

    if (search) {
      const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.$or = [
        { title: { $regex: escaped, $options: "i" } },
        { description: { $regex: escaped, $options: "i" } },
      ];
    }

    const items = await Item.find(filter)
      .populate(owner)
      .sort({ createdAt: -1 });

    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate(owner);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (item.reportedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only edit your own reports" });
    }

    const allowed = ["title", "description", "type", "category", "location", "date"];
    const updates = {};
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    if (req.file) {
      updates.image = buildImageUrl(req);
    }

    const updatedItem = await Item.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    res.json({ message: "Item updated successfully", item: updatedItem });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (item.reportedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only delete your own reports" });
    }

    await item.deleteOne();
    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["active", "claimed", "recovered"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (item.reportedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only update your own reports" });
    }

    item.status = status;
    await item.save();

    res.json({ message: "Status updated", item });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getItems, getItem, createItem, updateItem, deleteItem, updateStatus };