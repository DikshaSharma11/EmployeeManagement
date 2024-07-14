import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import { format } from "date-fns";

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newDepartmentName, setNewDepartmentName] = useState("");
  const [editingDepartmentId, setEditingDepartmentId] = useState(null);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:5000/api/departments",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setDepartments(response.data);
      } catch (error) {
        setError("Failed to fetch departments");
      } finally {
        setLoading(false);
      }
    };

    const fetchUserRole = () => {
      const userData = JSON.parse(localStorage.getItem("user"));
      if (userData) {
        setUserRole(userData.role);
      }
    };

    fetchDepartments();
    fetchUserRole();
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleAddDepartment = async () => {
    // Only allow if not an Employee
    if (userRole === "Employee") return;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/departments",
        { name: newDepartmentName },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setDepartments([...departments, response.data]);
      setNewDepartmentName("");
    } catch (error) {
      setError("Failed to add department");
    }
  };

  const handleUpdateDepartment = async (id) => {
    // Only allow if not an Employee
    if (userRole === "Employee") return;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:5000/api/departments/${id}`,
        { name: newDepartmentName },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setDepartments(
        departments.map((department) =>
          department._id === id ? response.data : department
        )
      );
      setNewDepartmentName("");
      setEditingDepartmentId(null);
    } catch (error) {
      setError("Failed to update department");
    }
  };

  const handleDeleteDepartment = async (id) => {
    // Only allow if not an Employee
    if (userRole === "Employee") return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/departments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDepartments(departments.filter((department) => department._id !== id));
    } catch (error) {
      setError("Failed to delete department");
    }
  };

  if (loading) {
    return (
      <div className="text-center">
        <div className="loader"></div>
        <h3>Loading...</h3>
      </div>
    );
  }
  const handleCloseError = () => {
    setError("");
  };
  return (
    <>
      <Navbar />
      <div className="container">
        <h3 className="mt-5">Departments List</h3>
        {error && (
          <div
            className="alert alert-danger alert-dismissible fade show"
            role="alert"
          >
            {" "}
            {error}{" "}
            <button
              type="button"
              className="btn-close"
              onClick={handleCloseError}
              aria-label="Close"
            ></button>
          </div>
        )}
        {userRole !== "Employee" && (
          <>
            <input
              type="text"
              value={newDepartmentName}
              onChange={(e) => setNewDepartmentName(e.target.value)}
              placeholder="Department Name"
              className="form-control mt-3"
            />
            <button
              className="btn btn-primary mt-2"
              onClick={
                editingDepartmentId
                  ? () => handleUpdateDepartment(editingDepartmentId)
                  : handleAddDepartment
              }
            >
              {editingDepartmentId ? "Update Department" : "Add Department"}
            </button>
          </>
        )}
        <table className="table table-bordered mt-3">
          <thead>
            <tr>
              <th>Name</th>
              <th>Created At</th>
              <th>Modified At</th>
              {userRole !== "Employee" && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {departments.map((department) => (
              <tr key={department._id}>
                <td>{department.name}</td>
                <td>
                  {format(new Date(department.createdAt), "d MMM yyyy h:mm a")}
                </td>
                <td>
                  {format(new Date(department.updatedAt), "d MMM yyyy h:mm a")}
                </td>
                {userRole !== "Employee" && (
                  <td>
                    <button
                      className="btn btn-warning me-2"
                      onClick={() => {
                        setEditingDepartmentId(department._id);
                        setNewDepartmentName(department.name);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDeleteDepartment(department._id)}
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Departments;
