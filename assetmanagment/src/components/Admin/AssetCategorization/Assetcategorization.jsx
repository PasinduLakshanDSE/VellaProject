import React, { useState } from "react";
import "./assetCategorization.css";
import axios from "axios";

const Categorization = () => {
  const [category, setCategory] = useState(""); // State for selected category

  const [types, setTypes] = useState(""); // State for selected type
  const [customType, setCustomType] = useState(""); // Custom type input


  const categories = ["Electronic items",
    "Laundry & Linen",
    "Housekeeping Supplies",
    "Electrical items",
    "Security & Safety",
    "Furniture",
    "Outdoor & Garden Equipment",
    "Stationery"];

  // Define types based on the selected category
  const getTypesByCategory = (category) => {
    switch (category) {
      case "Electronic items":
        return ["Computer", "Laptop", "Mobile Phone", "UPS", "Other"];
      case "Furniture":
        return ["Table", "Chair", "Sofa", "Cupboard", "Other"];
      case "Stationery":
        return ["Pen", "Notebook", "Marker", "Stapler", "Other"];
        case "Laundry & Linen":
          return ["towels", "bed sheets", "pillow covers"];
          case "Electrical items":
            return ["Breaker", "Wall Socket", "Holders", "Voltage Tester", "Bell Switch","Fuse","Other"];
            case "Outdoor & Garden Equipment":
              return ["Garden Hose", "Watering Can", "Chainsaw", "Grass Trimmer", "Other"];
              case "Security & Safety":
                return ["fire extinguisher", "door locks",  "Other"];
                case "Housekeeping Supplies":
                return ["cleaning chemicals", "vacuum cleaners", "Other"];
      default:
        return [];
    }
  };

  const typesList = getTypesByCategory(category);






  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Construct payload
    const payload = {
      category,

      types: types === "Other" ? customType : types,
      customType: customType || "",

    };

    try {
      const response = await axios.post("http://localhost:8000/api/categories", payload);
      alert(response.data.message); // Success message
      // Reset form
      setCategory("");

      setTypes("");
      setCustomType("");

    } catch (error) {
      console.error("Error submitting data:", error);
      alert("Error creating category. Please try again.");
    }
  };

  return (
    <div className="body">
      <div className="asset-categorization">
        <div className="form-container">
          <h2>Asset Categorization</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-box">
              {/* Category Dropdown */}
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value); // Update category
                  setTypes(""); // Reset types when category changes


                  setCustomType(""); // Reset custom type
                }}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              {/* Input for custom category */}


              {/* Type Input or Dropdown */}
              {category && (
                <select
                  value={types}
                  onChange={(e) => {
                    setTypes(e.target.value);
                    setCustomType(""); // Reset custom type when type changes
                  }}
                >
                  <option value="">Select Type</option>
                  {typesList.map((typ) => (
                    <option key={typ} value={typ}>
                      {typ}
                    </option>
                  ))}
                </select>
              )}



              {/* Input for custom type if "Other" is selected in the dropdown */}
              {types === "Other" && (
                <input
                  type="text"
                  value={customType}
                  onChange={(e) => setCustomType(e.target.value)}
                  placeholder="Enter Type"
                />
              )}


            </div>

            {/* Create Category Button */}
            <button type="submit" className="create-category-btn">
              Create Category
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Categorization;
