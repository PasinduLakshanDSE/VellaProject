const express = require("express");
const AssetDetails = require("../Module/AssetRegisterModule.jsx"); // Updated path

const router = express.Router();

router.post("/", async (req, res) => {
  const { name,
    company,
    department,
    mainCategory,
    type,
    assetName,
    assetUpdateDate,
    serialNumber,
    trackingId,
    specialNote, } = req.body;

  
  try {
    const newDetails = new AssetDetails({name,
        company,
        department,
        mainCategory,
        type,
        assetName,
        assetUpdateDate,
        serialNumber,
        trackingId,
        specialNote});
    const savedAssetDetails = await newDetails.save();
    res.status(201).json({ message: "Asset Details save successfully!", AssetDetails: savedAssetDetails });
  } catch (error) {
    console.error("Error Asset Details save:", error);
    res.status(500).json({ error: "Server error. Unable to save Asset Detailsy." });
  }
});











module.exports = router;
