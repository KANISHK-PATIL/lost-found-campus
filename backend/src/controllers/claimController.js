const Claim = require("../models/Claim");
const Item = require("../models/Item");

const createClaim = async (req, res) => {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        message: "Claim message is required",
      });
    }

    const item = await Item.findById(req.params.itemId);

    if (!item) {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    if (item.reportedBy.toString() === req.user._id.toString()) {
      return res.status(400).json({
        message: "You cannot claim your own item",
      });
    }

    const existingClaim = await Claim.findOne({
      item: item._id,
      claimant: req.user._id,
      status: "pending",
    });

    if (existingClaim) {
      return res.status(400).json({
        message: "You already have a pending claim",
      });
    }

    const claim = await Claim.create({
      item: item._id,
      claimant: req.user._id,
      message,
    });

    res.status(201).json({
      message: "Claim submitted successfully",
      claim,
    });
};

const getClaims = async (req, res) => {
    const item = await Item.findById(req.params.itemId);

    if (!item) {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    if (
      item.reportedBy.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "You are not allowed to view these claims",
      });
    }

    const claims = await Claim.find({
      item: item._id,
    })
      .populate("claimer", "name email")
      .populate("item", "title");

    res.json(claims);
};

const updateClaim = async (req, res) => {
    const { status } = req.body;
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({
        message: "Invalid claim status",
      });
    }
    const claim = await Claim.findById(req.params.id)
      .populate("item");
    if (!claim) {
      return res.status(404).json({
        message: "Claim not found",
      });
    }
  


    if (claim.item.reportedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You cannot manage this claim",
      });
    }

    claim.status = status;
    await claim.save();

    if (status === "approved") {
      await Item.findByIdAndUpdate(
        claim.item._id,
        {
          status: "recovered",
        }
      );
    }

    res.json({
      message: `Claim ${status}`,
      claim,
    });
};

module.exports = {getClaims, updateClaim, createClaim}