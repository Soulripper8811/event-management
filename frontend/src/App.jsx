import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import { useContext } from "react";
import { userContext } from "./contexts/UserContext";
import Navbar from "./components/Navbar";
import AllEvent from "./pages/AllEvent";
import SingleEvent from "./pages/SingleEvent";
import CreatePage from "./pages/CreatePage";
import Dashboard from "./pages/Dashboard";

const App = () => {
  const { user, isLoading } = useContext(userContext);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="absolute top-0 z-[-2] h-screen w-screen bg-white bg-[radial-gradient(100%_50%_at_50%_0%,rgba(0,163,255,0.13)_0,rgba(0,163,255,0)_50%,rgba(0,163,255,0)_100%)]" />
      <Navbar />
      <Routes>
        <Route path="/" element={user?.email ? <Home /> : <Login />} />
        <Route
          path="/sign-up"
          element={user?.email ? <Navigate to={"/"} /> : <SignUp />}
        />
        <Route
          path="/login"
          element={user?.email ? <Navigate to={"/"} /> : <Login />}
        />
        <Route
          path="/all-event"
          element={user?.email ? <AllEvent /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/event/:id"
          element={user?.email ? <SingleEvent /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/create"
          element={user?.email ? <CreatePage /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/my-events"
          element={user?.email ? <Dashboard /> : <Navigate to={"/login"} />}
        />
      </Routes>
    </div>
  );
};

export default App;
