import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { deleteUser, updateUser } from "../../redux/slice/auth/authThunk";
import { FaUserEdit, FaTrashAlt, FaEnvelope, FaIdCard, FaCamera } from "react-icons/fa";

const UserProfile = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [newUsername, setNewUsername] = useState(user.username);

  const handleUpdate = () => {
    dispatch(updateUser({ userId: user._id, username: newUsername }));
    setEditModalOpen(false);
  };

  const handleDelete = () => {
    dispatch(deleteUser(user._id));
    setDeleteModalOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto mt-6 animate-fade-in space-y-6">
      <div className="bg-card text-card-foreground rounded-xl shadow-sm border border-border overflow-hidden">
        {/* Banner/Header */}
        <div className="h-32 bg-gradient-to-r from-primary/80 to-purple-600/80 w-full relative">
          <div className="absolute inset-0 bg-grid-white/[0.2] bg-[length:20px_20px]" />
        </div>

        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-12 mb-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-background bg-muted shadow-md overflow-hidden relative group">
                {user.profilePic ? (
                  <img src={user.profilePic} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary text-primary-foreground text-4xl font-bold">
                    {user.fullname?.charAt(0).toUpperCase()}
                  </div>
                )}
                {/* Hover Overlay for potential image upload feature */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                  <FaCamera className="text-white text-xl" />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setEditModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors font-medium text-sm"
              >
                <FaUserEdit /> Edit
              </button>
              <button
                onClick={() => setDeleteModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 transition-colors font-medium text-sm border border-destructive/20"
              >
                <FaTrashAlt /> Delete
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">{user.fullname}</h1>
            <p className="text-muted-foreground font-medium">@{user.username}</p>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border border-border bg-muted/30 flex items-center gap-4">
              <div className="p-3 rounded-full bg-blue-500/10 text-blue-500">
                <FaEnvelope size={20} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email Address</p>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>

            <div className="p-4 rounded-lg border border-border bg-muted/30 flex items-center gap-4">
              <div className="p-3 rounded-full bg-purple-500/10 text-purple-500">
                <FaIdCard size={20} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">User ID</p>
                <p className="font-medium font-mono text-sm">{user._id}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------ EDIT MODAL ------------------ */}
      {editModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50 p-4">
          <div className="bg-card border border-border rounded-xl shadow-lg w-full max-w-sm p-6 space-y-4 animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-semibold text-foreground">Update Username</h3>
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-input rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
              placeholder="Enter new username"
            />
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setEditModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------ DELETE MODAL ------------------ */}
      {deleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50 p-4">
          <div className="bg-card border border-border rounded-xl shadow-lg w-full max-w-sm p-6 space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-destructive">Delete Account</h3>
              <p className="text-muted-foreground text-sm">
                Are you sure you want to delete your account? This action cannot be undone.
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-medium bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
