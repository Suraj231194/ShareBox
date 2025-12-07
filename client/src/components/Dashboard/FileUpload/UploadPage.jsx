import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadFile } from "../../../redux/slice/file/fileThunk";
import { toast } from "react-toastify";
import { FaCloudUploadAlt, FaFile, FaFileImage, FaFileVideo, FaTimes, FaLock, FaCalendarAlt } from "react-icons/fa";

const FileUploader = () => {
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.file);
  const { user } = useSelector((state) => state.auth);

  const [files, setFiles] = useState([]);
  const [enablePassword, setEnablePassword] = useState(false);
  const [password, setPassword] = useState("");
  const [enableExpiry, setEnableExpiry] = useState(false);
  const [expiryDate, setExpiryDate] = useState("");

  const [uploadProgress, setUploadProgress] = useState(0);

  const handleBrowseClick = () => fileInputRef.current.click();

  const handleFiles = (fileList) => {
    const validFiles = Array.from(fileList).filter((f) => f.size <= 10 * 1024 * 1024);
    if (validFiles.length !== fileList.length) {
      toast.warn("Some files were skipped (Max 10MB limit).");
    }
    setFiles((prev) => [...prev, ...validFiles]);
    if (validFiles.length > 0) toast.success(`${validFiles.length} file(s) added`);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    // Check for Demo User
    if (user?.email === "demo@sharebox.com") {
      toast.error("You should login first then you can upload");
      return;
    }

    if (files.length === 0) return toast.error("Please upload at least one file.");

    const formData = new FormData();
    files.forEach((f) => formData.append("files", f));
    formData.append("userId", user._id || user.id);
    formData.append("hasExpiry", enableExpiry);

    if (enableExpiry && expiryDate) {
      const hours = Math.ceil((new Date(expiryDate) - new Date()) / (1000 * 60 * 60));
      formData.append("expiresAt", hours);
    }

    formData.append("isPassword", enablePassword);
    if (enablePassword && password) formData.append("password", password);

    try {
      setUploadProgress(0);
      await dispatch(uploadFile({ formData, onProgress: setUploadProgress })).unwrap();
      toast.success("Files uploaded successfully!");
      setFiles([]);
      setUploadProgress(0);
      // window.location.reload(); // Consider removing this for better UX, maybe redirect to Files tab
    } catch (err) {
      toast.error(err?.error || "Upload failed");
      setUploadProgress(0);
    }
  };

  return (
    <div className="flex justify-center items-start min-h-[80vh] pt-10 px-4 sm:px-6 lg:px-8 animate-fade-in-up">
      <div className="w-full max-w-4xl bg-white dark:bg-slate-800 shadow-2xl rounded-2xl p-6 sm:p-10 border border-slate-100 dark:border-slate-700 transition-colors duration-300">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight mb-2">
            Upload Files
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg">
            Share files securely & efficiently.
          </p>
        </div>

        {/* Dropzone */}
        <div
          onClick={handleBrowseClick}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="group relative border-2 border-dashed border-indigo-200 dark:border-slate-600 rounded-2xl py-16 px-6 text-center
                     bg-indigo-50/30 dark:bg-slate-700/30 hover:bg-indigo-50 dark:hover:bg-slate-700
                     hover:border-indigo-500 dark:hover:border-indigo-400 transition-all duration-300 cursor-pointer"
        >
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-indigo-100 dark:bg-indigo-900/50 rounded-full text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-300">
              <FaCloudUploadAlt size={48} />
            </div>
          </div>
          <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-1">
            Drag & drop files here
          </h3>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            or <span className="text-indigo-600 dark:text-indigo-400 font-medium border-b border-indigo-600 dark:border-indigo-400">browse</span> to choose from your computer
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold">
            Max 10MB • JPG, PNG, PDF, MP4
          </p>

          <input
            type="file"
            multiple
            ref={fileInputRef}
            className="hidden"
            accept=".jpg,.jpeg,.png,.pdf,.mp4,.mov,.avi,.mkv"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="mt-8 space-y-3">
            <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Ready to Upload ({files.length})
            </h4>
            <div className="grid gap-3 grid-cols-1">
              {files.map((file, index) => (
                <div key={index} className="flex items-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-100 dark:border-slate-600 shadow-sm animate-fade-in">
                  <div className="w-12 h-12 bg-white dark:bg-slate-600 rounded-lg flex items-center justify-center text-indigo-500 dark:text-indigo-300 shadow-sm">
                    {file.type.startsWith("image") ? <FaFileImage size={20} /> :
                      file.type.startsWith("video") ? <FaFileVideo size={20} /> : <FaFile size={20} />}
                  </div>
                  <div className="ml-4 flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); removeFile(index); }}
                    className="p-2 text-slate-400 hover:text-red-500 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-600"
                    title="Remove file"
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settings Area */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Password Toggle */}
          <div className={`p-5 rounded-xl border-2 transition-all duration-200 cursor-pointer ${enablePassword ? 'border-indigo-500 bg-indigo-50/30 dark:bg-indigo-900/20' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/30 hover:border-indigo-300'}`}>
            <div className="flex items-center justify-between" onClick={() => setEnablePassword(!enablePassword)}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${enablePassword ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-200 dark:bg-slate-600 text-slate-500'}`}>
                  <FaLock />
                </div>
                <span className="font-semibold text-slate-700 dark:text-slate-200">Password Protection</span>
              </div>
              <div className={`w-11 h-6 flex items-center rounded-full p-1 duration-300 ${enablePassword ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'}`}>
                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${enablePassword ? 'translate-x-5' : ''}`}></div>
              </div>
            </div>
            {enablePassword && (
              <div className="mt-4 animate-fade-in">
                <input
                  type="password"
                  placeholder="Set a secure password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow"
                />
              </div>
            )}
          </div>

          {/* Expiry Toggle */}
          <div className={`p-5 rounded-xl border-2 transition-all duration-200 cursor-pointer ${enableExpiry ? 'border-indigo-500 bg-indigo-50/30 dark:bg-indigo-900/20' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/30 hover:border-indigo-300'}`}>
            <div className="flex items-center justify-between" onClick={() => setEnableExpiry(!enableExpiry)}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${enableExpiry ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-200 dark:bg-slate-600 text-slate-500'}`}>
                  <FaCalendarAlt />
                </div>
                <span className="font-semibold text-slate-700 dark:text-slate-200">Auto Expiration</span>
              </div>
              <div className={`w-11 h-6 flex items-center rounded-full p-1 duration-300 ${enableExpiry ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'}`}>
                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${enableExpiry ? 'translate-x-5' : ''}`}></div>
              </div>
            </div>
            {enableExpiry && (
              <div className="mt-4 animate-fade-in">
                <input
                  type="datetime-local"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow"
                />
              </div>
            )}
          </div>
        </div>

        {/* Upload Button */}
        <div className="mt-10">
          <button
            onClick={handleUpload}
            disabled={loading || files.length === 0}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <div className="w-full flex flex-col items-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Uploading... {uploadProgress}%</span>
                </div>
                <div className="w-full h-2 bg-indigo-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white/50 transition-all duration-300 ease-out"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            ) : "Start Upload"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default FileUploader;
