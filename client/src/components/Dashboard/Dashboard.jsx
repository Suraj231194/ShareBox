import React, { useState, useEffect } from "react";
import Header from "./Header";
import Sidebar from "./SideBar"
import StatsGrid from "./StatesGrid";
import UserProfile from "./UserProfile";
import UploadPage from "./FileUpload/UploadPage";
import FileShow from "./FileShow";
import Logout from "./Logout";
import Footer from "../Footer";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Main navigation state
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timeout);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <h1 className="text-3xl font-bold text-primary animate-pulse">
          Loading...
        </h1>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen flex bg-muted/20">

        {/* SIDEBAR */}
        <Sidebar
          activeMode={activeTab}
          onModeChange={setActiveTab}
          sidebarVisible={sidebarOpen}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* MOBILE OVERLAY */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* MAIN CONTENT */}
        <div className="flex flex-col flex-1 md:ml-64 transition-all duration-300 min-w-0">

          {/* HEADER */}
          <Header
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />

          {/* PAGE CONTENT */}
          <main className="flex-1 p-6 mt-20">

            {activeTab === "dashboard" && (
              <>
                <h2 className="text-2xl font-bold mb-4">Dashboard Overview</h2>
                <StatsGrid />
                <FileShow />
              </>
            )}

            {activeTab === "upload" && <UploadPage />}

            {activeTab === "profile" && <UserProfile />}

            {activeTab === "logout" && <Logout />}

            {activeTab === "files" && <FileShow />}
            {/* {activeTab === "files" && <FileShow />} */}
          </main>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
