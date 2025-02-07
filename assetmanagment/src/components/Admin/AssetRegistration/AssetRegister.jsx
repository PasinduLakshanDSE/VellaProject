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
  const [specialNote, setSpecialNote] = useState("");
  const [customType, setCustomType] = useState("");
  const [computerComponents, setComputerComponents] = useState(/*{
    fullPack: false,
    monitor: false,
    cpu: false,
    mouse: false,
    keyboard: false,
  }*/"");

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
  const departments = ["IT", "HR", "Kitchen", "Front Office", "Store", "Account", "Audit"];

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (mainCategory) filterTypes();
    else setTypes([]);
  }, [mainCategory, categories]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/categories/getCategory");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const filterTypes = () => {
    const filtered = categories
      .filter((category) => category.category === mainCategory)
      .map((category) => category.types)
      .flat();
    setTypes(filtered);
  };

  const generateTrackingId = () => {
    const companyCodes = { Vella: "VE", "98 Acers": "98", "Ravana Pool Club": "RPC", "Flying Ravana": "FR", "Le Maas Tota": "LMT", "Tea Factory": "TF" };
    const departmentCodes = { IT: "IT", HR: "HR", Kitchen: "KT", Store: "ST", "Front Office": "FO", Account: "AC", Audit: "AU" };

    const companyCode = companyCodes[company] || "XX";
    const departmentCode = departmentCodes[department] || "XX";
    const serialSuffix = mainCategory === "Electronic items" && serialNumber ? serialNumber.slice(-4) : "";
    const randomNum = `${new Date().toISOString().slice(2, 10).replace(/-/g, "")}${String(Math.floor(Math.random() * 100)).padStart(2, "0")}`;

    return serialNumber ? `${companyCode}-${departmentCode}-${serialSuffix}` : `${companyCode}-${departmentCode}-${randomNum}`;
  };

  const handleComponentChange = (e) => {
    const { name, checked } = e.target;
    setComputerComponents((prev) => ({ ...prev, [name]: checked }));
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

    setTrackingId(generateTrackingId());
  };

  useEffect(() => {
    if (trackingId) {
      const qrData = JSON.stringify({
        name,
        company,
        department,
        mainCategory,
        assetName,
        type: type === "Other" ? customType : type,
        assetUpdateDate,
        serialNumber: mainCategory === "Electronic items" ? serialNumber : null,
        trackingId,
        computerComponents,
        specialNote,
      });
      setQrCodeData(qrData);
    }
  }, [trackingId]);

  const handleDownloadCombinedImage = async () => {
    try {
      if (!qrCodeContainerRef.current) return;
      const canvas = await html2canvas(qrCodeContainerRef.current);
      const link = document.createElement("a");
      link.download = "QRCodeWithTrackingID.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (error) {
      console.error("Failed to download the QR code image:", error);
      alert("Error occurred while downloading the QR code. Please try again.");
    }
  };

  const handleSubmit = async () => {
    if (!name || !company || !department || !mainCategory || !assetName || !assetUpdateDate || !type) {
      alert("Please fill in all fields before submitting.");
      return;
    }

    try {
      const assetData = {
        name,
        company,
        department,
        mainCategory,
        type: type === "Other" ? customType : type,
        assetName,
        assetUpdateDate,
        serialNumber: mainCategory === "Electronic items" ? serialNumber : null,
        trackingId,
        specialNote,
        computerComponents,
      };

      const response = await axios.post("http://localhost:8000/api/AssetRegisterDetails", assetData);
      alert(response.data.message);
      // Reset form
      setCompany("");
      setDepartment("");
      setMainCategory("");
      setType("");
      setAssetName("");
      setAssetUpdateDate("");
      setSerialNumber("");
      setQrCodeData(null);
      setTrackingId("");
      setSpecialNote("");
      setCustomType("");
      setComputerComponents(/*{ fullPack: false, monitor: false, cpu: false, mouse: false, keyboard: false }*/"");
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("Error creating asset. Please try again.");
    }
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

          {mainCategory && (
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="">Select Type</option>
              {types.map((t, index) => (
                <option key={index} value={t}>{t}</option>
               
              ))}
              <option value="Other">Other</option>
            </select>
          )}
         
 {type === "Other" && (
  <input
    type="text"
    value={customType}
    onChange={(e) => setCustomType(e.target.value)}
    placeholder="Enter Custom Type"
  />
)}

{type === "Computer" && (
            <div className="computer-options">
              <div  className="computer-options1"><div>
              <label className="l"><input type="checkbox" name="fullSet"onChange={handleComponentChange} /> Full Set</label>
              <label className="l"><input type="checkbox" name="monitor"  onChange={handleComponentChange} /> Monitor</label>
             <label className="l"><input type="checkbox" name="cpu"  onChange={handleComponentChange} /> CPU</label>
             </div><div className="computer-options2" ><label className="l"><input type="checkbox" name="mouse" onChange={handleComponentChange} /> Mouse</label>
              <label className="l"><input type="checkbox" name="keyboard"  onChange={handleComponentChange} /> Keyboard</label>
              <label className="l"><input type="checkbox" name="MotherBoard"  onChange={handleComponentChange} /> MotherBoard</label>
              </div><div  className="computer-options3"><label className="l"><input type="checkbox" name="ram"  onChange={handleComponentChange} /> Ram</label>
              <label className="l"><input type="checkbox" name="powersupply"  onChange={handleComponentChange} /> Power Supply</label>
              
              <label className="l"><input type="checkbox" name="processor"  onChange={handleComponentChange} /> Processor</label>
            </div></div></div>
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
          <input
  type="text"
  value={specialNote}
  onChange={(e) => setSpecialNote(e.target.value)}
  placeholder="Enter Special Note (Optional)"
/>


          <div className="button-group">
            <button className="button generate-btn" onClick={handleGenerateQR}>Generate QR</button>
          </div>

          {trackingId && qrCodeData && (
            <div className="qr-container">
              <h3>Generated QR Code</h3>
              <div ref={qrCodeContainerRef} className="combined-qr-container">
                <QRCode
                  value={qrCodeData}
                  size={200} 
                  qrStyle="squares"
                  logoImage="https://via.placeholder.com/30"
                  logoWidth={50}
                   
                />
                <p>ID: {trackingId}</p>
              </div>

              <button className="button2 download-btn" onClick={handleDownloadCombinedImage}>
                Download <i className="fas fa-download"></i>
              </button>
            </div>
          )}

          {trackingId && qrCodeData && (
            <button className="button3" onClick={handleSubmit}>Submit</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssetRegister;
