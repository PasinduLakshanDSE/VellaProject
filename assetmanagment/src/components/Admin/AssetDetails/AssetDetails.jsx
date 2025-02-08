import React, { useEffect, useState } from "react";
import axios from "axios";

const AssetDetails = () => {
    const [AssetRegisterDetails, setAssetRegisterDetails] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");  // First search field
    const [searchQuery1, setSearchQuery1] = useState(""); // Second search field

    useEffect(() => {
        axios.get("http://localhost:8000/api/AssetRegisterDetails/getAssetDetails")
            .then(response => setAssetRegisterDetails(response.data))
            .catch(error => console.error("Error fetching asset details:", error));
    }, []);

    // Filter assets based on searchQuery (first input field)
    const filteredAssets = AssetRegisterDetails.filter(asset =>
        (asset.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
        (asset.company?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
        (asset.mainCategory?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
        (asset.department?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
        (asset.type?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
        (asset.assetName?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
        (asset.serialNumber?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
        (asset.trackingId?.toLowerCase() || "").includes(searchQuery.toLowerCase())
    );

    return (
        <div className="row">
            <div className="col-md-12">
                {/* First Search Input */}
                <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Search assets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />

                {/* Second Search Input */}
                <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Search by another parameter..."
                    value={searchQuery1}
                    onChange={(e) => setSearchQuery1(e.target.value)}
                />

                <table className="table table-bordered table-light">
                    <thead className="thead-dark">
                        <tr>
                            <th>Registered Name</th>
                            <th>Company</th>
                            <th>Department</th>
                            <th>Category</th>
                            <th>Type</th>
                            <th>Asset Name</th>
                            <th>Asset Register Date</th>
                            <th>Serial Number</th>
                            <th>Tracking ID</th>
                            <th>Special Note</th>
                            <th>Computer Components</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAssets.length > 0 ? (
                            filteredAssets.map((asset) => (
                                <tr key={asset._id}>
                                    <td>{asset.name}</td>
                                    <td>{asset.company}</td>
                                    <td>{asset.department}</td>
                                    <td>{asset.mainCategory}</td>
                                    <td>{asset.type}</td>
                                    <td>{asset.assetName}</td>
                                    <td>{asset.assetUpdateDate}</td>
                                    <td>{asset.serialNumber}</td>
                                    <td>{asset.trackingId}</td>
                                    <td>{asset.specialNote}</td>
                                    <td>
                                        {asset.computerComponents
                                            ? Object.entries(asset.computerComponents)
                                                .filter(([key, value]) => value === true)
                                                .map(([key]) => key)
                                                .join(", ") || "No Components"
                                            : "No Components"}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="11" className="text-center">
                                    No matching asset data available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AssetDetails;
