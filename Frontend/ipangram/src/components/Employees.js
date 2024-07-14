import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import { format } from "date-fns";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [departments, setDepartments] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [selectedDepartmentId, setSelectedDepartmentId] = useState("");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [newEmployeeName, setNewEmployeeName] = useState("");
  const [newEmployeeLocation, setNewEmployeeLocation] = useState("");
  const [filter, setFilter] = useState({ name: "", location: "", sort: "asc" });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchEmployees();
    fetchUserRole();
    fetchDepartments();
  }, [filter, currentPage]);
 
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

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
    }
  };

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/employees", {
        headers: { Authorization: `Bearer ${token}` },
        params: { ...filter, page: currentPage, limit: 4 },
      });
      setEmployees(response.data.employees);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      setError("Failed to fetch employees");
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

  const handleFilter = (filterType, value) => {
    setFilter((prev) => ({ ...prev, [filterType]: value }));
    fetchEmployees();
  };

  const handleAddEmployee = async () => {
    const employeeData = {
      name: newEmployeeName,
      location: newEmployeeLocation,
    };

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/employees",
        employeeData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEmployees([response.data, ...employees]);
      setNewEmployeeName("");
      setNewEmployeeLocation("");
      setSelectedDepartmentId("");
    } catch (error) {
      setError("Failed to add employee");
    }
  };

  const handleAssignDepartment = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:5000/api/employees/${selectedEmployeeId}`,
        { departmentId: selectedDepartmentId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      fetchEmployees();

      setSelectedEmployeeId("");
      setSelectedDepartmentId("");
      setSelectedEmployee("");
    } catch (error) {
      setError("Failed to assign department");
    }
  };

  const handleSelectEmployee = (employeeId) => {
    setSelectedEmployee(employeeId);
    setSelectedEmployeeId(employeeId);
  };

  const filteredEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <h3 className="mt-5">Employee List</h3>
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
        {userRole === "Manager" && (
          <>
            <input
              type="text"
              value={newEmployeeName}
              onChange={(e) => setNewEmployeeName(e.target.value)}
              placeholder="Employee Name"
              className="form-control mt-3"
            />
            <input
              type="text"
              value={newEmployeeLocation}
              onChange={(e) => setNewEmployeeLocation(e.target.value)}
              placeholder="Employee Location"
              className="form-control mt-3"
            />

            <div className="btn-group mt-3">
              <button
                className="btn btn-primary me-2"
                onClick={handleAddEmployee}
              >
                Add Employee
              </button>
            </div>
          </>
        )}
        <input
          type="text"
          placeholder="Search Employees"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-control mt-3"
        />

        <div className="btn-group mt-3">
          <button
            className="btn btn-primary me-2"
            onClick={() => handleFilter("sort", "asc")}
          >
            Filter by Location Ascending
          </button>
          <button
            className="btn btn-primary me-2"
            onClick={() => handleFilter("sort", "desc")}
          >
            Filter by Location Descending
          </button>
          <button
            className="btn btn-primary me-2"
            onClick={() => handleFilter("sort", "asc")}
          >
            Filter by Name Ascending
          </button>
          <button
            className="btn btn-primary me-2"
            onClick={() => handleFilter("sort", "desc")}
          >
            Filter by Name Descending
          </button>
        </div>

        {filteredEmployees.length === 0 ? (
          <div className="text-center mt-5">
            <h4>No employees found</h4>
          </div>
        ) : (
          <>
            <table className="table table-bordered mt-3">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Location</th>
                  <th>Department</th>
                  <th>Created At</th>
                  <th>Modified At</th>
                  {userRole === "Manager" && <th>Action</th>}
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((employee) => (
                  <tr key={employee._id}>
                    <td>{employee.name}</td>
                    <td>{employee.location}</td>
                    <td>{employee.departmentId?.name || "--"}</td>
                    <td>
                      {format(
                        new Date(employee.createdAt),
                        "d MMM yyyy h:mm a"
                      )}
                    </td>
                    <td>
                      {format(
                        new Date(employee.updatedAt),
                        "d MMM yyyy h:mm a"
                      )}
                    </td>
                    {userRole === "Manager" && (
                      <td>
                        <button
                          className="btn btn-secondary"
                          onClick={() => handleSelectEmployee(employee._id)}
                          disabled={selectedEmployee === employee._id}
                        >
                          {selectedEmployee === employee._id
                            ? "Selected"
                            : "Select"}
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="d-flex justify-content-between mt-3">
              <button
                className="btn btn-primary"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </button>
              <span>{`Page ${currentPage} of ${totalPages}`}</span>
              <button
                className="btn btn-primary"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </button>
            </div>
          </>
        )}

        {userRole === "Manager" && selectedEmployeeId && (
          <div className="mt-3">
            <h5>Assign Department to Employee</h5>
            <select
              value={selectedDepartmentId}
              onChange={(e) => setSelectedDepartmentId(e.target.value)}
              className="form-select"
            >
              <option value="">Select Department</option>
              {departments.map((department) => (
                <option key={department._id} value={department._id}>
                  {department.name}
                </option>
              ))}
            </select>
            <div className="btn-group mt-3">
              <button
                className="btn btn-primary me-2"
                onClick={handleAssignDepartment}
              >
                Assign Department
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Employees;
