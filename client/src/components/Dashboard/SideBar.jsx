import React from "react";

const Sidebar = ({ activeMode, onModeChange, sidebarVisible, toggleSidebar }) => {
  const handleTabClick = (mode) => {
    onModeChange(mode);
    toggleSidebar(); // Close on mobile
  };

  const tabs = [
    { name: "Dashboard", icon: "🏠", id: "dashboard" },
    { name: "Files", icon: "📁", id: "files" },
    { name: "Upload", icon: "📤", id: "upload" },
    { name: "Profile", icon: "👤", id: "profile" },
    { name: "Logout", icon: "🚪", id: "logout" },
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 transform ${sidebarVisible ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out w-64 z-50 md:translate-x-0 md:fixed md:inset-y-0 bg-card/95 backdrop-blur-md border-r border-border shadow-lg flex flex-col`}
    >
      <div className="flex items-center gap-2 px-6 h-16 border-b border-border/50">
        <img src="/src/assets/logo.png" alt="Logo" className="w-8 h-8" />
        <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">ShareBox</span>
      </div>

      <div className="flex-1 px-4 py-6 space-y-1">
        {tabs.map((tab) => {
          const isActive = activeMode === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left w-full font-medium transition-all duration-200 ${isActive
                ? "bg-primary text-primary-foreground shadow-md translate-x-1"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* Optional User Summary or Logout at bottom can go here */}
      <div className="p-4 border-t border-border text-xs text-muted-foreground text-center">
        &copy; 2024 ShareBox Inc.
      </div>
    </aside>
  );
};

export default Sidebar;
