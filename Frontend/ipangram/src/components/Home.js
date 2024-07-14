import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card mt-5">
            <div className="card-body text-center">
              <h1 className="card-title">
                Welcome to Employee Management Application
              </h1>
              {isAuthenticated ? (
                <p className="card-text">You are already logged in.</p>
              ) : (
                <p className="card-text">
                  Please login or sign up to continue.
                </p>
              )}
              <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                {!isAuthenticated && (
                  <>
                    <Link to="/login" className="btn btn-primary me-md-2">
                      Login
                    </Link>
                    <Link to="/signup" className="btn btn-secondary">
                      Sign Up
                    </Link>
                  </>
                )}
                {isAuthenticated && (
                  <Link to="/departments" className="btn btn-primary">
                    Go to Departments
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
