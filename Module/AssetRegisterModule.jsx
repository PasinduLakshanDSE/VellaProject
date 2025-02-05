
const mongoose = require("mongoose");

const AsetRegisterSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    
    company: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: false,
    },
    department: {
        type: String,
        required: false,
      },
      mainCategory: {
        type: String,
        required: false,
      },
      type: {
        type: String,
        required: false,
      },
      assetName: {
        type: String,
        required: false,
      },
      assetUpdateDate: {
        type: String,
        required: false,
      },
      serialNumber: {
        type: String,
        required: false,
      },
      trackingId: {
        type: String,
        required: false,
      },
      specialNote: {
        type: String,
        required: false,
      },
    
  },
  { timestamps: true }
);

const AssetRegisterDetails = mongoose.model("AssetRegisterDetails",AsetRegisterSchema);
module.exports = AssetRegisterDetails;
