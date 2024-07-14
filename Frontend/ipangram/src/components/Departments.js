import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import ClipLoader from "react-spinners/ClipLoader";

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingDepartmentId, setEditingDepartmentId] = useState(null);
  const [userRole, setUserRole] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const fetchDepartments = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:5000/api/departments",
          {
            headers: { Authorization: `Bearer ${token}` },
            params: { page: currentPage, limit: 5 },
          }
        );

        setDepartments(response.data.departments);
        setTotalPages(response.data.totalPages);
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
  }, [currentPage]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleCloseError = () => {
    setError("");
  };

  const onSubmit = async (data) => {
    const { name } = data;

    // Only allow if not an Employee
    if (userRole === "Employee") return;

    try {
      const token = localStorage.getItem("token");
      if (editingDepartmentId) {
        const response = await axios.put(
          `http://localhost:5000/api/departments/${editingDepartmentId}`,
          { name },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setDepartments(
          departments.map((department) =>
            department._id === editingDepartmentId ? response.data : department
          )
        );
        setEditingDepartmentId(null);
      } else {
        const response = await axios.post(
          "http://localhost:5000/api/departments",
          { name },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setDepartments([...departments, response.data]);
      }
      setValue("name", "");
    } catch (error) {
      setError("Failed to add/update department");
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
          <form onSubmit={handleSubmit(onSubmit)}>
            <input
              type="text"
              {...register("name", { required: "Department name is required" })}
              placeholder="Department Name"
              className="form-control mt-3"
            />
            {errors.name && (
              <div className="text-danger">{errors.name.message}</div>
            )}
            <button className="btn btn-primary mt-2" type="submit">
              {editingDepartmentId ? "Update Department" : "Add Department"}
            </button>
          </form>
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
            {loading ? (
              <tr>
                <td
                  colSpan={userRole !== "Employee" ? 4 : 3}
                  className="text-center"
                >
                  <ClipLoader color="#007bff" loading={loading} size={30} />
                </td>
              </tr>
            ) : departments.length === 0 ? (
              <tr>
                <td
                  colSpan={userRole !== "Employee" ? 4 : 3}
                  className="text-center"
                >
                  No departments found.
                </td>
              </tr>
            ) : (
              departments.map((department) => (
                <tr key={department._id}>
                  <td>{department.name}</td>
                  <td>
                    {format(
                      new Date(department.createdAt),
                      "d MMM yyyy h:mm a"
                    )}
                  </td>
                  <td>
                    {format(
                      new Date(department.updatedAt),
                      "d MMM yyyy h:mm a"
                    )}
                  </td>
                  {userRole !== "Employee" && (
                    <td>
                      <button
                        className="btn btn-warning me-2"
                        onClick={() => {
                          setEditingDepartmentId(department._id);
                          setValue("name", department.name);
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
          <span>{`Page ${currentPage} of ${totalPages}`}</span>
          <button
            className="btn btn-primary"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default Departments;
