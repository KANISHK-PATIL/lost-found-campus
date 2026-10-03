const Claim = require("../models/Claim");
const Item = require("../models/Item");
const User = require("../models/User");

const createClaim = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Claim message is required" });
    }

    const item = await Item.findById(req.params.itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (item.reportedBy.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot claim your own item" });
    }

    const existingClaim = await Claim.findOne({
      item: item._id,
      claimant: req.user._id,
      status: "pending",
    });

    if (existingClaim) {
      return res.status(400).json({ message: "You already have a pending claim" });
    }

    const claim = await Claim.create({
      item: item._id,
      claimant: req.user._id,
      message,
    });

    res.status(201).json({ message: "Claim submitted successfully", claim });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getClaims = async (req, res) => {
  try {
    const item = await Item.findById(req.params.itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (item.reportedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You are not allowed to view these claims" });
    }

    const claims = await Claim.find({ item: item._id })
      .populate({ path: "claimant", select: "name email", model: User })
      .populate({ path: "item", select: "title", model: Item })
      .sort({ createdAt: -1 });

    res.json(claims);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateClaim = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid claim status" });
    }

    const claim = await Claim.findById(req.params.id).populate({ path: "item", model: Item });
    if (!claim) {
      return res.status(404).json({ message: "Claim not found" });
    }

    if (claim.item.reportedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You cannot manage this claim" });
    }

    claim.status = status;
    await claim.save();

    if (status === "approved") {
      await Item.findByIdAndUpdate(claim.item._id, { status: "recovered" });
    }

    res.json({ message: `Claim ${status}`, claim });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getClaims, updateClaim, createClaim };