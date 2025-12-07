import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
// import "./App.css";
import Home from "./Home/Home";
import { Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard/Dashboard";
import FileDownload from "./FileDownload";
import { useDispatch } from "react-redux";
import { loadUserFromStorage } from "./redux/slice/auth/authSlice";
import RequireAuth from "./components/Auth/RequireAuth";
import NoRequireAuth from "./components/Auth/NotRequireAuth";
import DownloadPage from "./components/DownloadPage";
import Download from "./components/Download";
import GuestHomePage from "./components/Guest/GuestHomePage";
import GuestHome from "./components/Guest/Download/GuestHome";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [count, setCount] = useState(0);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUserFromStorage());
  }, [dispatch]);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>

        <Route path="/f/:code" element={<FileDownload />} />
        <Route element={<RequireAuth />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        {/* Non-auth-only Routes */}
        <Route element={<NoRequireAuth />}>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/f/:shortCode" element={<Download />} />
          <Route path="/g/:shortCode" element={<GuestHome />} />
          <Route path="/DownloadPage" element={<DownloadPage />} />
          {/* <Route path="/g" element={<GuestHomePage />} /> */}
        </Route>
      </Routes>
    </>
  );
}

export default App;
