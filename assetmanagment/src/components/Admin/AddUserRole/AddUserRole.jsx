import './adduserrole.css';
import React, { useState } from 'react';
import axios from 'axios';

const AddUsersRole = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [designation, setDesignation] = useState("");
    const [contact, setContact] = useState("");
    const [username, setUsername] = useState("");
    const [selectedOption, setSelectedOption] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [companyName, setCompanyName] = useState("");
    const [errors, setErrors] = useState({});
    const [passwordStrength, setPasswordStrength] = useState("");

    const validateForm = () => {
        let formErrors = {};
        if (!firstName) formErrors.firstName = "First Name is required.";
        if (!lastName) formErrors.lastName = "Last Name is required.";
        if (!designation) formErrors.designation = "Designation is required.";
        if (!contact) formErrors.contact = "Contact is required.";
        if (!username) formErrors.username = "Username is required.";
        if (!password) formErrors.password = "Password is required.";
        if (!confirmPassword) formErrors.confirmPassword = "Confirm Password is required.";
        if (!companyName) formErrors.companyName = "Company Name is required.";
        if (password && !validatePasswordStrength(password)) {
            formErrors.passwordStrength = "Password must be at least 8 characters, include uppercase, lowercase, and a number.";
        }
        if (password !== confirmPassword) {
            formErrors.passwordMatch = "Passwords do not match.";
        }
        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const validatePasswordStrength = (password) => {
        const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        return strongPasswordRegex.test(password);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const userData = {
            firstName,
            lastName,
            designation,
            contact,
            username,
            selectedOption,
            password,
            companyName
        };

        try {
            const response = await axios.post('http://localhost:8000/api/users', userData);
            alert("User created successfully");
            handleReset();
        } catch (error) {
            console.error("Error creating user:", error);
            alert("Error creating user. Please try again.");
        }
    };

    const handleReset = () => {
        setFirstName("");
        setLastName("");
        setDesignation("");
        setContact("");
        setUsername("");
        setSelectedOption("");
        setPassword("");
        setConfirmPassword("");
        setShowPassword(false);
        setCompanyName("");
        setErrors({});
        setPasswordStrength("");
    };

    return (
        <div className="Users">
            <h1>User Registration</h1>
            <fieldset>
                <form onSubmit={handleSubmit}>
                    <label>First Name*</label>
                    <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                    {errors.firstName && <span className="error">{errors.firstName}</span>}

                    <label>Last Name*</label>
                    <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                    {errors.lastName && <span className="error">{errors.lastName}</span>}

                    <label>Designation*</label>
                    <input type="text" value={designation} onChange={(e) => setDesignation(e.target.value)} />
                    {errors.designation && <span className="error">{errors.designation}</span>}

                    <label>Contact*</label>
                    <input type="text" value={contact} onChange={(e) => setContact(e.target.value)} />
                    {errors.contact && <span className="error">{errors.contact}</span>}

                    <label>Username*</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                    {errors.username && <span className="error">{errors.username}</span>}

                    <label>Password*</label>
                    <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setPasswordStrength(validatePasswordStrength(e.target.value) ? "Strong" : "Weak");
                        }}
                    />
                    {errors.password && <span className="error">{errors.password}</span>}
                    <span className={passwordStrength === "Strong" ? "strong" : "weak"}>{passwordStrength}</span>

                    <label>Confirm Password*</label>
                    <input
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
                    <label>
                        <input type="checkbox" checked={showPassword} onChange={() => setShowPassword(!showPassword)} />
                        Show Password
                    </label>

                    <label>Company Name*</label>
                    <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                    {errors.companyName && <span className="error">{errors.companyName}</span>}

                    <label>User Role*</label>
                    <select value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)}>
                        <option value="">Select Role</option>
                        <option value="Admin">Admin</option>
                        <option value="CompanyAdmin">Company Admin</option>
                    </select>

                   

                    <button type="button" onClick={handleReset}>Reset</button>
                    <button type="submit">Submit</button>
                </form>
            </fieldset>
        </div>
    );
};

export default AddUsersRole;
