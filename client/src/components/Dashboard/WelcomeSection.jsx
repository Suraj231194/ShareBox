import React from "react";

const WelcomeSection = ({ user }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Good morning";
    if (hour >= 12 && hour < 17) return "Good afternoon";
    if (hour >= 17 && hour < 21) return "Good evening";
    return "Good night";
  };

  const greeting = getGreeting();
  // Fallback values
  const displayName = user?.fullname || "User";
  const displayEmail = user?.email || "No email linked";
  const displayUsername = user?.username ? `@${user.username}` : "";

  return (
    <section className="relative overflow-hidden rounded-2xl p-6 mb-6 bg-gradient-to-r from-primary to-purple-600 text-primary-foreground shadow-lg animate-fade-in">
      <div className="relative z-10 flex items-center gap-5 flex-wrap">
        <div className="w-16 h-16 rounded-full border-4 border-white/20 shadow-md flex items-center justify-center bg-white/10 backdrop-blur-sm text-2xl font-bold">
          {user?.profilePic ? (
            <img
              src={user.profilePic}
              alt="Profile"
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            displayName.charAt(0).toUpperCase()
          )}
        </div>

        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">
            {greeting}, {displayName}! ✨
          </h1>
          <p className="font-medium text-primary-foreground/90 text-sm opacity-90">
            Welcome back to your secure workspace.
          </p>
        </div>
      </div>

      {/* Decorative background circles */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 rounded-full bg-black/10 blur-3xl pointer-events-none" />
    </section>
  );
};

export default WelcomeSection;
