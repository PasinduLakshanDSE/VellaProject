import React, { useEffect, useState } from "react";
import axios from "axios";

const AssetDetails = () => {
    const [AssetRegisterDetails, setAssetRegisterDetails] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8000/api/AssetRegisterDetails/getAssetDetails")
            .then(response => setAssetRegisterDetails(response.data))
            .catch(error => console.error("Error fetching asset details:", error));
    }, []);

    return (
        <div className="row">
            <div className="col-md-12">
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
                        {AssetRegisterDetails.length > 0 ? (
                            AssetRegisterDetails.map((asset) => (
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
                                    <td>{JSON.stringify(asset.computerComponents)}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="11" className="text-center">
                                    No asset data available
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
