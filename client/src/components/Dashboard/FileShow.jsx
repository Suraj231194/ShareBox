import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserFiles, verifyFilePassword } from "../../redux/slice/file/fileThunk";
import axiosInstance from "../../config/axiosInstance";
import { formatDistanceToNowStrict, differenceInDays } from "date-fns";
import { ToastContainer, toast } from "react-toastify";
import { FaWhatsapp, FaTelegramPlane, FaInstagram, FaEnvelope, FaDownload, FaLock } from "react-icons/fa";
import {
  Eye,
  Share2,
  Download,
  Trash2,
  Copy,
  FileText,
  Image as ImageIcon,
  Video,
  Music,
  File,
  Search,
  Filter,
  X
} from "lucide-react";

const FileShow = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { files } = useSelector((state) => state.file);
  const [previewFile, setPreviewFile] = useState(null);
  const [shareFile, setShareFile] = useState(null);
  const [downloadingFiles, setDownloadingFiles] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // Verification State
  const [passwordPrompt, setPasswordPrompt] = useState(false);
  const [fileToVerify, setFileToVerify] = useState(null);
  const [verifyPasswordInput, setVerifyPasswordInput] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (user && user._id) {
      dispatch(getUserFiles(user._id));
    }
  }, [user, dispatch]);

  const handlePreview = (file) => {
    if (file.isPassword) {
      setFileToVerify(file);
      setPasswordPrompt(true);
    } else {
      setPreviewFile(file);
    }
  };

  const handleVerifySubmit = async () => {
    try {
      if (!verifyPasswordInput) return toast.error("Please enter password");

      await dispatch(verifyFilePassword({ fileId: fileToVerify._id, password: verifyPasswordInput })).unwrap();

      // If success, verifyFilePassword usually returns the file object or success message.
      // Assuming success means auth is good.
      setPasswordPrompt(false);
      setPreviewFile(fileToVerify);
      setVerifyPasswordInput("");
      setFileToVerify(null);
    } catch (error) {
      toast.error(error?.error || "Incorrect password");
    }
  };

  const sortFileName = (filename) => {
    return filename.length > 30 ? `${filename.slice(0, 30)}...` : filename;
  }
  // ... (rest of helper functions)

  // ... (in return statement)
  /*
     Replace: onClick={() => setPreviewFile(file)}
     With: onClick={() => handlePreview(file)}
  */
  // ... (rest of code)

  const getFileIcon = (mimeType) => {
    if (mimeType.startsWith("image/")) return <ImageIcon className="text-blue-500" size={20} />;
    if (mimeType.startsWith("video/")) return <Video className="text-purple-500" size={20} />;
    if (mimeType.startsWith("audio/")) return <Music className="text-pink-500" size={20} />;
    if (mimeType === "application/pdf") return <FileText className="text-red-500" size={20} />;
    return <File className="text-gray-500" size={20} />;
  };

  function handleShare(shortUrl) {
    const frontendBaseUrl = window.location.origin;
    const fullUrl = `${frontendBaseUrl}${shortUrl}`;

    return {
      whatsapp: `https://wa.me/?text=${encodeURIComponent("Download file: " + fullUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(fullUrl)}&text=Check this out!`,
      email: `mailto:?subject=Shared File&body=${encodeURIComponent("Here’s your file: " + fullUrl)}`,
      copy: fullUrl,
      qr: `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(fullUrl)}&size=150x150`
    };
  }

  const downloadQRCode = async (shortUrl) => {
    const qrUrl = handleShare(shortUrl).qr;
    try {
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = "qr-code.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("QR code download failed:", error);
      alert("Failed to download QR code. Please try again.");
    }
  };

  // Filter logic
  const filteredFiles = files?.filter((file) => {
    const nameMatch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    const typeMatch = filterType ? file.type === filterType : true;
    const statusMatch = filterStatus
      ? filterStatus === "expired"
        ? differenceInDays(new Date(file.expiresAt), new Date()) <= 0
        : differenceInDays(new Date(file.expiresAt), new Date()) > 0
      : true;

    return nameMatch && typeMatch && statusMatch;
  });

  // Pagination logic
  const totalPages = Math.ceil((filteredFiles?.length || 0) / itemsPerPage);
  const paginatedFiles = filteredFiles?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex flex-col mt-8 space-y-6">

      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Your Uploads</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Manage and share your {filteredFiles?.length || 0} files securely.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full sm:w-64 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
              placeholder="Search files..."
            />
          </div>

          <div className="flex gap-3">
            <div className="relative">
              <select
                className="appearance-none pl-4 pr-10 py-2 w-full bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer shadow-sm"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="">All Types</option>
                {[...new Set(files?.map((f) => f.type))].map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>

            <div className="relative">
              <select
                className="appearance-none pl-4 pr-10 py-2 w-full bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer shadow-sm"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">Status</option>
                <option value="active">Active</option>
                <option value="expired">Expired</option>
              </select>
              <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>
          </div>

          {(filterType || filterStatus || searchTerm) && (
            <button
              onClick={() => {
                setSearchTerm("");
                setFilterType("");
                setFilterStatus("");
              }}
              className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center"
              title="Reset Filters"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* File List */}
      {!files || files.length === 0 ? (
        <div className="text-center py-20 bg-muted/30 rounded-xl border border-dashed border-gray-300">
          <div className="inline-flex p-4 rounded-full bg-gray-100 mb-4">
            <File className="text-gray-400" size={48} />
          </div>
          <h3 className="text-lg font-medium text-gray-900">No files uploaded</h3>
          <p className="text-gray-500 mt-1">Upload files to get started sharing.</p>
        </div>
      ) : (
        <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 border-b">
                <tr>
                  {[
                    "File Name",
                    "Type",
                    "Size",
                    "Downloads",
                    "Status",
                    "Expiry",
                    "Uploaded",
                    "Actions",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className={`px-6 py-4 font-medium text-muted-foreground uppercase text-xs tracking-wider ${heading === "Actions" ? "text-right" : ""}`}
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                {paginatedFiles?.map((file) => {
                  const formattedSize =
                    file.size > 1024 * 1024
                      ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
                      : file.size > 1024
                        ? `${(file.size / 1024).toFixed(2)} KB`
                        : `${file.size} Bytes`;

                  const isExpired = differenceInDays(new Date(file.expiresAt), new Date()) <= 0;

                  return (
                    <React.Fragment key={file._id}>
                      {/* Desktop Row */}
                      <tr className="hover:bg-muted/30 transition-colors hidden md:table-row group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-muted/50 rounded-lg">
                              {getFileIcon(file.type)}
                            </div>
                            <div className="font-medium text-foreground">
                              {sortFileName(file.name)}
                              <div className="text-xs text-muted-foreground font-normal mt-0.5 md:hidden">
                                {file.type}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground text-sm max-w-[150px] truncate" title={file.type}>
                          {file.type}
                        </td>
                        <td className="px-6 py-4 text-muted-foreground font-medium">{formattedSize}</td>
                        <td className="px-6 py-4 text-muted-foreground">
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-secondary/50 text-secondary-foreground text-xs font-medium">
                            <Download size={12} />
                            {file.downloadedContent}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${file.status === "active"
                              ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30"
                              : "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30"
                              }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${file.status === "active" ? "bg-green-500" : "bg-red-500"}`}></span>
                            {file.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {isExpired ? (
                            <span className="text-red-500 flex items-center gap-1">
                              Expired
                            </span>
                          ) : (
                            <span className="flex flex-col">
                              <span className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                                {differenceInDays(new Date(file.expiresAt), new Date())} days left
                              </span>
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-muted-foreground text-xs">
                          {formatDistanceToNowStrict(new Date(file.createdAt), { addSuffix: true })}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handlePreview(file)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100 dark:hover:bg-blue-900/20"
                              title="Preview File"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => setShareFile(file)}
                              className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors border border-transparent hover:border-purple-100 dark:hover:bg-purple-900/20"
                              title="Share File"
                            >
                              <Share2 size={16} />
                            </button>
                            <button
                              onClick={async () => {
                                setDownloadingFiles(prev => ({ ...prev, [file._id]: true }));
                                try {
                                  // Call backend to get signed download URL
                                  const res = await axiosInstance.post(`files/download/${file._id}`);
                                  // Navigate to the URL (triggers download due to Content-Disposition attachment)
                                  window.location.assign(res.data.downloadUrl);
                                } catch (error) {
                                  console.error("Download error:", error);
                                  if (error.response?.status === 401 || error.response?.status === 403) {
                                    toast.info("Password protected. Redirecting...");
                                    window.open(file.shortUrl ? file.shortUrl : file.path, '_blank');
                                  } else {
                                    toast.error("Download failed.");
                                  }
                                } finally {
                                  setDownloadingFiles(prev => ({ ...prev, [file._id]: false }));
                                }
                              }}
                              disabled={downloadingFiles[file._id]}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors border border-transparent hover:border-green-100 dark:hover:bg-green-900/20 disabled:opacity-50"
                              title="Direct Download"
                            >
                              {downloadingFiles[file._id] ? (
                                <div className="animate-spin h-4 w-4 border-2 border-green-600 border-t-transparent rounded-full" />
                              ) : (
                                <Download size={16} />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Mobile Card View */}
                      <tr className="block md:hidden border-b last:border-0 bg-card">
                        <td className="block p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="p-3 bg-muted/50 rounded-xl">
                                {getFileIcon(file.type)}
                              </div>
                              <div>
                                <div className="font-semibold text-foreground text-base mb-0.5">{sortFileName(file.name)}</div>
                                <div className="text-xs text-muted-foreground">{file.type} • {formattedSize}</div>
                              </div>
                            </div>
                            <button onClick={() => setShareFile(file)} className="p-2 hover:bg-muted rounded-full text-gray-500">
                              <Share2 size={18} />
                            </button>
                          </div>

                          <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm mt-3 bg-muted/20 p-3 rounded-lg">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Status</span>
                              <span className={file.status === "active" ? "text-green-600 font-medium" : "text-red-500 font-medium"}>
                                {file.status}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Downloads</span>
                              <span className="font-medium text-foreground">{file.downloadedContent}</span>
                            </div>
                            <div className="flex justify-between col-span-2 border-t pt-2 mt-1 border-gray-200 dark:border-gray-700">
                              <span className="text-muted-foreground">Expires</span>
                              <span className="font-medium text-orange-600 dark:text-orange-400">
                                {isExpired ? "Expired" : `${differenceInDays(new Date(file.expiresAt), new Date())} days`}
                              </span>
                            </div>
                          </div>

                          <div className="flex gap-2 mt-4">
                            <button
                              onClick={() => handlePreview(file)}
                              className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-blue-50 text-blue-600 font-medium text-sm hover:bg-blue-100 transition-colors"
                            >
                              <Eye size={16} /> Preview
                            </button>
                            <button
                              onClick={async () => {
                                setDownloadingFiles(prev => ({ ...prev, [file._id]: true }));
                                try {
                                  // Call backend to get signed download URL
                                  const res = await axiosInstance.post(`files/download/${file._id}`);
                                  // Navigate to the URL (triggers download due to Content-Disposition attachment)
                                  window.location.assign(res.data.downloadUrl);
                                } catch (error) {
                                  console.error("Download error:", error);
                                  if (error.response?.status === 401 || error.response?.status === 403) {
                                    toast.info("Password protected. Redirecting...");
                                    window.open(file.shortUrl ? file.shortUrl : file.path, '_blank');
                                  } else {
                                    toast.error("Download failed.");
                                  }
                                } finally {
                                  setDownloadingFiles(prev => ({ ...prev, [file._id]: false }));
                                }
                              }}
                              disabled={downloadingFiles[file._id]}
                              className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-green-50 text-green-600 font-medium text-sm hover:bg-green-100 transition-colors disabled:opacity-50"
                            >
                              {downloadingFiles[file._id] ? (
                                <div className="animate-spin h-4 w-4 border-2 border-green-600 border-t-transparent rounded-full" />
                              ) : (
                                <Download size={16} />
                              )}
                              Download
                            </button>
                          </div>
                        </td>
                      </tr>
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center py-4 px-6 border-t bg-muted/20">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg text-sm font-medium border bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 shadow-sm transition-all"
              >
                Previous
              </button>
              <span className="text-sm font-medium text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg text-sm font-medium border bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 shadow-sm transition-all"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {/* Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full border border-gray-200 dark:border-gray-800 flex flex-col max-h-[90vh]">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50 dark:bg-gray-800/50 rounded-t-2xl">
              <h3 className="font-semibold text-lg truncate pr-4">{previewFile.name}</h3>
              <button onClick={() => setPreviewFile(null)} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                <X size={24} className="text-gray-500" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto bg-gray-100 dark:bg-black/20 flex items-center justify-center min-h-[300px]">
              {previewFile.type.startsWith("image/") && (
                <img src={previewFile.path} alt={previewFile.name} className="max-w-full h-auto rounded-lg shadow-lg" />
              )}
              {previewFile.type.startsWith("video/") && (
                <video controls className="w-full max-h-[60vh] rounded-lg shadow-lg">
                  <source src={previewFile.path} type={previewFile.type} />
                </video>
              )}
              {previewFile.type.startsWith("audio/") && (
                <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border text-center">
                  <div className="w-20 h-20 bg-pink-100 text-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Music size={40} />
                  </div>
                  <audio controls className="w-full">
                    <source src={previewFile.path} type={previewFile.type} />
                  </audio>
                </div>
              )}
              {previewFile.type === "application/pdf" && (
                <iframe src={previewFile.path} title="PDF Preview" className="w-full h-[60vh] rounded-lg shadow-lg border"></iframe>
              )}
              {!previewFile.type.startsWith("image/") && !previewFile.type.startsWith("video/") && !previewFile.type.startsWith("audio/") && previewFile.type !== "application/pdf" && (
                <div className="text-center py-10">
                  <File size={64} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">Preview not available for this file type.</p>
                  <a href={previewFile.path} download className="inline-block mt-4 text-blue-600 font-medium hover:underline">Download to view</a>
                </div>
              )}
            </div>

            <div className="p-4 border-t bg-white dark:bg-gray-900 rounded-b-2xl flex justify-end">
              <button
                onClick={() => setPreviewFile(null)}
                className="px-6 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Password Verification Modal */}
      {passwordPrompt && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full border border-gray-200 dark:border-gray-800 p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaLock size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">File Protected</h3>
              <p className="text-gray-500 text-sm mt-1">Enter the password to preview this file.</p>
            </div>

            <input
              type="password"
              placeholder="Enter password..."
              value={verifyPasswordInput}
              onChange={(e) => setVerifyPasswordInput(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent outline-none mb-4"
            />

            <div className="flex gap-3">
              <button
                onClick={() => { setPasswordPrompt(false); setFileToVerify(null); setVerifyPasswordInput(""); }}
                className="flex-1 py-2.5 rounded-lg border border-gray-300 hover:bg-gray-50 font-medium text-gray-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleVerifySubmit}
                className="flex-1 py-2.5 rounded-lg bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition shadow-lg"
              >
                Unlock
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {shareFile && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white dark:bg-gray-900 p-0 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-800 overflow-hidden transform scale-100 transition-all">
            <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
              <h3 className="text-xl font-bold relative z-10">Share File</h3>
              <p className="text-blue-100 text-sm mt-1 truncate relative z-10 px-4">{shareFile.name}</p>
              <button onClick={() => setShareFile(null)} className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-1 transition">
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <div className="flex justify-center mb-6">
                <div className="p-3 bg-white rounded-xl shadow-sm border">
                  <img
                    src={handleShare(shareFile.shortUrl).qr}
                    alt="QR Code"
                    className="w-32 h-32 object-contain"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 mb-6">
                {[
                  { icon: <FaWhatsapp className="text-xl" />, label: "Whatsapp", color: "bg-green-100 text-green-600 hover:bg-green-200", link: handleShare(shareFile.shortUrl).whatsapp },
                  { icon: <FaTelegramPlane className="text-xl" />, label: "Telegram", color: "bg-blue-100 text-blue-500 hover:bg-blue-200", link: handleShare(shareFile.shortUrl).telegram },
                  { icon: <FaEnvelope className="text-xl" />, label: "Email", color: "bg-orange-100 text-orange-500 hover:bg-orange-200", link: handleShare(shareFile.shortUrl).email },
                  {
                    icon: <Copy className="text-xl" />, label: "Copy", color: "bg-gray-100 text-gray-600 hover:bg-gray-200", action: () => {
                      navigator.clipboard.writeText(handleShare(shareFile.shortUrl).copy);
                      toast.success("Link copied!");
                    }
                  },
                ].map((item, i) => (
                  <a
                    key={i}
                    href={item.link}
                    target={item.link ? "_blank" : undefined}
                    onClick={item.action}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all cursor-pointer ${item.color}`}
                  >
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm">
                      {item.icon}
                    </div>
                    <span className="text-xs font-medium">{item.label}</span>
                  </a>
                ))}
              </div>

              <div className="relative">
                <input
                  type="text"
                  readOnly
                  value={handleShare(shareFile.shortUrl).copy}
                  className="w-full bg-gray-50 border rounded-lg py-3 pl-3 pr-24 text-sm text-gray-600 focus:outline-none"
                />
                <button
                  onClick={() => downloadQRCode(shareFile.shortUrl)}
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-blue-600 text-white text-xs font-bold rounded-md hover:bg-blue-700 transition"
                >
                  Save QR
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileShow;
