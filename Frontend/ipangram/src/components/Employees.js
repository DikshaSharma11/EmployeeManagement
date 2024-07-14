import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import ClipLoader from "react-spinners/ClipLoader";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [departments, setDepartments] = useState([]); // Ensure departments is initialized as an array
  const [userRole, setUserRole] = useState("");
  const [selectedDepartmentId, setSelectedDepartmentId] = useState("");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [filter, setFilter] = useState({ name: "", location: "", sort: "asc" });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    fetchEmployees();
    fetchUserRole();
    fetchDepartments();
  }, [currentPage]);

  useEffect(() => {
    fetchEmployees();
  }, [filter]);

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
      setDepartments(response.data.departments);
    } catch (error) {
      console.error("Error fetching departments:", error);
      setError("Failed to fetch departments");
    }
  };

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/employees", {
        headers: { Authorization: `Bearer ${token}` },
        params: { ...filter, page: currentPage, limit: 5 },
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
  };

  const handleAddEmployee = async (data) => {
    const employeeData = {
      name: data.name,
      location: data.location,
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

      if (currentPage === totalPages) {
        setEmployees((prev) => [response.data, ...prev]);
      } else {
        fetchEmployees();
      }

      reset();
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
          <form onSubmit={handleSubmit(handleAddEmployee)}>
            <input
              type="text"
              {...register("name", { required: "Employee Name is required" })}
              placeholder="Employee Name"
              className="form-control mt-3"
            />
            {errors.name && (
              <span className="text-danger">{errors.name.message}</span>
            )}
            <input
              type="text"
              {...register("location", {
                required: "Employee Location is required",
              })}
              placeholder="Employee Location"
              className="form-control mt-3"
            />
            {errors.location && (
              <span className="text-danger">{errors.location.message}</span>
            )}
            <div className="btn-group mt-3">
              <button type="submit" className="btn btn-primary me-2">
                Add Employee
              </button>
            </div>
          </form>
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
        {filteredEmployees.length === 0 && !loading ? (
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
                {loading ? (
                  <tr>
                    <td
                      colSpan={userRole === "Manager" ? 6 : 5}
                      className="text-center"
                    >
                      <ClipLoader color="#007bff" loading={loading} size={20} />
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map((employee) => (
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
                  ))
                )}
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
              <span>
                Page {currentPage} of {totalPages}
              </span>
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
        {userRole === "Manager" && (
          <>
            <h3 className="mt-5">Assign Department</h3>
            <div className="d-flex gap-3 mt-3">
              <select
                value={selectedEmployeeId}
                onChange={(e) => setSelectedEmployeeId(e.target.value)}
                className="form-select"
              >
                <option value="">Select Employee</option>
                {employees.map((employee) => (
                  <option key={employee._id} value={employee._id}>
                    {employee.name}
                  </option>
                ))}
              </select>

              <select
                value={selectedDepartmentId}
                onChange={(e) => setSelectedDepartmentId(e.target.value)}
                className="form-select"
              >
                <option value="">Select Department</option>
                {Array.isArray(departments) &&
                  departments.map((department) => (
                    <option key={department._id} value={department._id}>
                      {department.name}
                    </option>
                  ))}
              </select>

              <button
                className="btn btn-primary"
                onClick={handleAssignDepartment}
                disabled={!selectedEmployeeId || !selectedDepartmentId}
              >
                Assign Department
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Employees;
