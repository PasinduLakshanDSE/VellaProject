import React, { useState, useRef, useEffect } from "react";
import { QRCode } from "react-qrcode-logo";
import html2canvas from "html2canvas";
import "./assetRegister.css";
import axios from "axios";

const AssetRegister = () => {
  const user = JSON.parse(localStorage.getItem("currentUser"));

  const [name, setName] = useState(user?.username || "");
  const [company, setCompany] = useState("");
  const [department, setDepartment] = useState("");
  const [mainCategory, setMainCategory] = useState("");
  const [type, setType] = useState("");
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [assetName, setAssetName] = useState("");
  const [assetUpdateDate, setAssetUpdateDate] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [qrCodeData, setQrCodeData] = useState(null);
  const [trackingId, setTrackingId] = useState("");

  const qrCodeContainerRef = useRef();

  const mainCategories = [
    "Electronic items",
    
    
    "Laundry & Linen",
    "Housekeeping Supplies",
    "Electrical items",
    "Security & Safety",
    "Furniture",
    "Outdoor & Garden Equipment",
    "Stationery",
  ];

  const companies = ["Vella", "98 Acers", "Ravana Pool Club", "Flying Ravana", "Le Maas Tota", "Tea Factory"];
  const departments = ["IT", "HR", "Kitchen", "Front Office"];

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (mainCategory === "Electronic items") {
      fetchTypes();
    } else {
      setTypes([]); // Clear types if another category is selected
    }
  }, [mainCategory]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/categories/getCategory");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchTypes = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/categories/getTypes?category=${mainCategory}`);
      setTypes(response.data.types);
    } catch (error) {
      console.error("Error fetching types:", error);
    }
  };

  const generateTrackingId = () => {
    const randomNum = String(Math.floor(Math.random() * 100000)).padStart(5, "0");
    return `TRK-${randomNum}`;
  };

  const handleSubmit = () => {
    if (!name || !company || !department || !mainCategory || !assetName || !assetUpdateDate || !type) {
      alert("Please fill in all fields before submitting.");
      return;
    }

    if (mainCategory === "Electronic items" && !serialNumber) {
      alert("Please enter a Serial Number for Electronics.");
      return;
    }

    if (!trackingId || !qrCodeData) {
      alert("Please generate a Tracking ID and QR Code before submitting.");
      return;
    }

    const assetData = {
      name,
      company,
      department,
      mainCategory,
      type,
      assetName,
      assetUpdateDate,
      serialNumber: mainCategory === "Electronic items" ? serialNumber : null,
      trackingId,
    };

    console.log("Asset Data: ", assetData);
    alert("Asset Registered Successfully!");

    setCompany("");
    setDepartment("");
    setMainCategory("");
    setType("");
    setAssetName("");
    setAssetUpdateDate("");
    setSerialNumber("");
    setQrCodeData(null);
    setTrackingId("");
  };

  const handleGenerateQR = () => {
    if (!name || !company || !department || !mainCategory || !assetName || !assetUpdateDate || !type) {
      alert("Please fill in all fields before generating the QR code.");
      return;
    }

    if (mainCategory === "Electronic items" && !serialNumber) {
      alert("Please enter a Serial Number for Electronics.");
      return;
    }

    const uniqueTrackingId = trackingId || generateTrackingId();
    setTrackingId(uniqueTrackingId);

    const qrData = JSON.stringify({
      name,
      company,
      department,
      mainCategory,
      assetName,
      type,
      assetUpdateDate,
      serialNumber: mainCategory === "Electronic items" ? serialNumber : null,
      trackingId: uniqueTrackingId,
    });

    setQrCodeData(qrData);
  };

  return (
    <div className="asset-register">
      <div className="form-container">
        <h2>Asset Registration</h2>
        <div className="input-box">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your Name"
            readOnly={Boolean(user)}
          />
          <select value={company} onChange={(e) => setCompany(e.target.value)}>
            <option value="">Select Company</option>
            {companies.map((com) => (
              <option key={com} value={com}>{com}</option>
            ))}
          </select>

          <select value={department} onChange={(e) => setDepartment(e.target.value)}>
            <option value="">Select Department</option>
            {departments.map((dep) => (
              <option key={dep} value={dep}>{dep}</option>
            ))}
          </select>

          <select value={mainCategory} onChange={(e) => setMainCategory(e.target.value)}>
            <option value="">Select Category</option>
            {mainCategories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {mainCategory  && (
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="">Select Type</option>
              {types.map((t) => (
                <option key={t._id} value={t.types}>{t.types}</option>
              ))}
            </select>
          )}

          <input
            type="text"
            value={assetName}
            onChange={(e) => setAssetName(e.target.value)}
            placeholder="Enter Asset Name"
          />

          {mainCategory === "Electronic items" && (
            <input
              type="text"
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
              placeholder="Enter Serial Number"
            />
          )}

          <input
            type="date"
            value={assetUpdateDate}
            onChange={(e) => setAssetUpdateDate(e.target.value)}
          />

          <div className="button-group">
            <button className="button" onClick={handleSubmit}>Submit</button>
            <button className="button generate-btn" onClick={handleGenerateQR}>Generate QR</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetRegister;
