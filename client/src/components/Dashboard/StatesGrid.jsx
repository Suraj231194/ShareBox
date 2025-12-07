import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../../redux/slice/auth/authThunk";
import WelcomeSection from "./WelcomeSection";

const StatsGrid = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const hasFetched = useRef(false);

  useEffect(() => {
    if (user?.id && !hasFetched.current) {
      dispatch(getUser(user.id));
      hasFetched.current = true;
    }
  }, [user, dispatch]);

  // ---------------- STAT CARDS DATA ----------------
  const cards = [
    { title: "Total Uploads", value: user?.totalUploads ?? 0, icon: "📤", color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "Total Downloads", value: user?.totalDownloads ?? 0, icon: "📥", color: "text-green-500", bg: "bg-green-500/10" },
    { title: "Videos Uploaded", value: user?.videoCount ?? 0, icon: "🎬", color: "text-red-500", bg: "bg-red-500/10" },
    { title: "Images Uploaded", value: user?.imageCount ?? 0, icon: "🖼️", color: "text-purple-500", bg: "bg-purple-500/10" },
    { title: "Documents Uploaded", value: user?.documentCount ?? 0, icon: "📄", color: "text-orange-500", bg: "bg-orange-500/10" },
    { title: "Last Login", value: user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : "N/A", icon: "⏰", color: "text-gray-500", bg: "bg-gray-500/10" },
  ]; // Removed filter to show 0 values

  return (
    <div className="space-y-6">
      {/* ---------------- WELCOME SECTION ---------------- */}
      <WelcomeSection user={user} />

      {/* ---------------- STAT CARDS GRID ---------------- */}
      <section
        aria-label="User Statistics"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {cards.map((card, index) => (
          <article
            key={index}
            className="relative p-4 rounded-xl bg-card text-card-foreground shadow-sm border border-border/50
                       hover:shadow-lg transition-all duration-300 group hover:-translate-y-1"
          >
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-lg ${card.bg} ${card.color} group-hover:scale-110 transition-transform duration-300`}>
                <span className="text-2xl">{card.icon}</span>
              </div>
              <div>
                <h3 className="text-xl font-bold tracking-tight">
                  {typeof card.value === 'number' ? card.value.toLocaleString() : card.value}
                </h3>
                <p className="text-xs font-medium text-muted-foreground">
                  {card.title}
                </p>
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
};

export default StatsGrid;
