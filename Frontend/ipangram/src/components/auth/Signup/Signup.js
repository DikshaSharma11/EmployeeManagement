import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const user = {
      name,
      email,
      password,
      role,
    };

    console.log("Payload being sent to the server:", user);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/signup",
        user,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      navigate("/departments");
    } catch (error) {
      console.error("Error response from server:", error.response?.data);
      setError(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card mt-5">
            <div className="card-body">
              <h3 className="card-title">Signup</h3>
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3 position-relative">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                <div className="mb-3">
                  <label className="form-label">Role</label>
                  <div className="form-check">
                    <input
                      type="radio"
                      className="form-check-input"
                      id="roleEmployee"
                      value="Employee"
                      checked={role === "Employee"}
                      onChange={(e) => setRole(e.target.value)}
                    />
                    <label className="form-check-label" htmlFor="roleEmployee">
                      Employee
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      type="radio"
                      className="form-check-input"
                      id="roleManager"
                      value="Manager"
                      checked={role === "Manager"}
                      onChange={(e) => setRole(e.target.value)}
                    />
                    <label className="form-check-label" htmlFor="roleManager">
                      Manager
                    </label>
                  </div>
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  Signup
                </button>
              </form>
              <div className="mt-4 text-center">
                <p>Already have an account?</p>
                <Link to="/login" className="btn btn-secondary w-100">
                  Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
