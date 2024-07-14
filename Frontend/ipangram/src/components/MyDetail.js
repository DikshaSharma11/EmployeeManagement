import React from "react";
import Navbar from "./Navbar";

const MyDetails = () => {
  const userData = JSON.parse(localStorage.getItem("user"));

  if (!userData) {
    return (
      <div className="text-center alert alert-danger">
        No user data found in local storage.
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <h3 className="mt-5">My Details</h3>
        <table className="table table-bordered mt-3">
          <tbody>
            <tr>
              <th>Name</th>
              <td>{userData.name}</td>
            </tr>
            <tr>
              <th>Email</th>
              <td>{userData.email}</td>
            </tr>
            <tr>
              <th>Role</th>
              <td>{userData.role}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default MyDetails;
