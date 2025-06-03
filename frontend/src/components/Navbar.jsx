import React, { useContext } from "react";
import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router-dom";
import { userContext } from "@/contexts/UserContext";
import axiosInstance from "@/lib/axios";
import toast from "react-hot-toast";

const Navbar = () => {
  const { user, setUser, setIsLoading, loading } = useContext(userContext);

  const navigate = useNavigate();
  const handleLogut = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance("/users/logout");
      if (response.data.success) {
        setUser(null);
        setIsLoading(false);
        navigate("/login");
        toast.success(response.data.message);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.message || "Logout failed");
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <header className="w-full bg-white shadow-sm">
      <div className="max-w-7xl px-4 py-3 mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl md:text-3xl font-extrabold text-gray-800"
        >
          Event{" "}
          <span className="bg-gradient-to-r from-blue-500 to-green-400 text-transparent bg-clip-text">
            Management
          </span>
        </Link>

        {/* Navigation */}
        <div className="flex items-center space-x-6">
          {user?.email && (
            <>
              <h1 className="text-xl font-bold text-gray-800">
                {user?.userName}
              </h1>
              <Link
                to="/my-events"
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                Dashboard
              </Link>
              <Link
                to="/create"
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                Create New Event
              </Link>
              <Link
                to="/all-event"
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                All Events
              </Link>
            </>
          )}
          {user?.email ? (
            <Button
              onClick={handleLogut}
              variant="ghost"
              className="text-gray-700 hover:text-red-500 transition-colors font-medium text-md"
            >
              Logout
            </Button>
          ) : (
            <>
              <Link
                to={"/login"}
                className="text-gray-700 hover:text-red-500 transition-colors font-medium text-md"
              >
                Login
              </Link>
              <Link
                to={"/sign-up"}
                className="text-gray-700 hover:text-red-500 transition-colors font-medium text-md"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
