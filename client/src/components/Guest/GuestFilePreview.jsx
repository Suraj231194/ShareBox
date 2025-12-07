import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { formatDistanceToNowStrict, differenceInDays } from "date-fns";
import {
  FaWhatsapp,
  FaTelegramPlane,
  FaInstagram,
  FaEnvelope,
  FaHeadset,
  FaDownload,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { FaEye, FaShare, FaTrashAlt } from "react-icons/fa";

const GuestFilePreview = ({ guestFiles }) => {
  const dispatch = useDispatch();
  const [files, setFiles] = useState(guestFiles || []);
  const [previewFile, setPreviewFile] = useState(null);
  const [shareFile, setShareFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const sortFileName = (filename) => {
    // Sort the file name to ensure consistent display
    return filename.length > 20 ? `${filename.slice(0, 20)}...` : filename;
  };

  function handleShare(shortUrl) {
    const frontendBaseUrl = window.location.origin;
    const fullUrl = `${frontendBaseUrl}${shortUrl}`;

    return {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(
        "Download file: " + fullUrl
      )}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        fullUrl
      )}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        fullUrl
      )}&text=Check this out!`,
      email: `mailto:?subject=Shared File&body=${encodeURIComponent(
        "Here’s your file: " + fullUrl
      )}`,
      copy: fullUrl,
      qr: `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
        fullUrl
      )}&size=150x150`,
    };
  }

  const deleteFile = (fileId) => {
    if (!fileId) {
      toast.error("File ID is invalid.");
      return;
    }

    const updatedFiles = files.filter((file) => file.id !== fileId);

    setFiles(updatedFiles);
    localStorage.setItem("guestFiles", JSON.stringify(updatedFiles));

    // Re-sync from localStorage (if that's your source of truth)
    const refreshedFiles = JSON.parse(localStorage.getItem("guestFiles")) || [];
    setFiles(refreshedFiles);

    toast.success("File deleted successfully!");
  };

  useEffect(() => {
    setFiles(guestFiles);
  }, [guestFiles]);



  const filteredFiles = files?.filter((file) => {
    const nameMatch = file.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const typeMatch = filterType ? file.type === filterType : true;

    const statusMatch = filterStatus
      ? filterStatus === "expired"
        ? differenceInDays(new Date(file.expiresAt), new Date()) <= 0
        : differenceInDays(new Date(file.expiresAt), new Date()) > 0
      : true;

    return nameMatch && typeMatch && statusMatch;
  });

  const totalPages = Math.ceil((filteredFiles?.length || 0) / itemsPerPage);
  const paginatedFiles = filteredFiles?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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

      // Clean up the blob URL
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("QR code download failed:", error);
      alert("Failed to download QR code. Please try again.");
    }
  };


  return (
    <div className="flex flex-col mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-primary mb-4">📁 Your Uploaded Files</h2>
        <p className="text-sm text-muted-foreground">
          Showing {filteredFiles.length} file{filteredFiles.length !== 1 && "s"}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 w-full lg:items-center mb-4">
        <div className="relative flex-1">
          <span className="absolute left-3 top-2.5 text-muted-foreground">🔍</span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
            placeholder="Search by file name"
            aria-label="Search"
          />
        </div>

        <select
          className="px-3 py-2 bg-background border border-input rounded-lg text-foreground focus:ring-2 focus:ring-primary"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="">All Types</option>
          {[...new Set(files?.map((f) => f.type))].map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <select
          className="px-3 py-2 bg-background border border-input rounded-lg text-foreground focus:ring-2 focus:ring-primary"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="expired">Expired</option>
        </select>

        {(filterType || filterStatus || searchTerm) && (
          <button
            onClick={() => {
              setSearchTerm("");
              setFilterType("");
              setFilterStatus("");
            }}
            className="px-3 py-2 bg-red-100 text-red-500 rounded hover:bg-red-200"
          >
            Reset
          </button>
        )}
      </div>

      {!files || files.length === 0 ? (
        <p className="text-muted-foreground">No files uploaded yet.</p>
      ) : (
        <div className="-my-2 overflow-x-auto">
          <div className="inline-block min-w-full py-2 align-middle">
            <div className="overflow-hidden border border-border rounded-md shadow-sm">
              <table className="min-w-full divide-y divide-border text-foreground">
                <thead className="bg-muted text-muted-foreground hidden md:table-header-group">
                  <tr>
                    {[
                      "File Name",
                      "Size",
                      "Type",
                      "Download",
                      "Status",
                      "Actions",
                      "Expiry At",
                      "Uploaded At",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="bg-background divide-y divide-border">
                  {paginatedFiles?.map((file) => {
                    const shareLinks = handleShare(file.shortUrl);
                    const formattedSize =
                      file.size > 1024 * 1024
                        ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
                        : file.size > 1024
                          ? `${(file.size / 1024).toFixed(2)} KB`
                          : `${file.size} Bytes`;

                    const isExpired =
                      differenceInDays(new Date(file.expiresAt), new Date()) <=
                      0;

                    return (
                      <>
                        {/* Desktop Row */}
                        <tr
                          key={file._id}
                          className="hover:bg-muted/50 transition-colors hidden md:table-row border-b border-border"
                        >
                          <td className="px-6 py-4 text-sm font-medium">
                            {sortFileName(file.name)}
                          </td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">
                            {formattedSize}
                          </td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">
                            {file.type}
                          </td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">
                            {file.downloadedContent}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <span
                              className={`font-medium px-2 py-1 rounded-full text-xs ${file.status === "active"
                                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                  : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                }`}
                            >
                              {file.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 flex gap-2 mt-2 text-sm">
                            <button
                              onClick={() => setPreviewFile(file)}
                              className="inline-flex items-center justify-center p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
                              title="Preview"
                            >
                              <FaEye size={16} />
                            </button>

                            {/* Share */}
                            <button
                              onClick={() => setShareFile(file)}
                              className="inline-flex items-center justify-center p-2 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-md transition-colors"
                              title="Share"
                            >
                              <FaShare size={16} />
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => deleteFile(file.id)}
                              className="inline-flex items-center justify-center p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                              title="Delete"
                            >
                              <FaTrashAlt size={16} />
                            </button>
                          </td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">
                            {isExpired
                              ? <span className="text-destructive">Expired</span>
                              : `Expires in ${differenceInDays(
                                new Date(file.expiresAt),
                                new Date()
                              )} days`}
                          </td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">
                            {formatDistanceToNowStrict(
                              new Date(file.createdAt),
                              {
                                addSuffix: true,
                              }
                            )}
                          </td>
                        </tr>

                        {/* Mobile Card */}
                        <tr
                          key={`mobile-${file._id}`}
                          className="block md:hidden border-b border-border p-4 bg-card"
                        >
                          <td className="block">
                            <div className="mb-2">
                              <strong className="text-foreground text-base">
                                📄 {sortFileName(file.name)}
                              </strong>
                              <div className="text-xs text-muted-foreground">
                                {file.type} | {formattedSize}
                              </div>
                            </div>
                            <div className="text-sm text-muted-foreground mb-1">
                              <span className="font-medium text-foreground">Status: </span>
                              <span
                                className={
                                  file.status === "active"
                                    ? "text-green-600"
                                    : "text-red-500"
                                }
                              >
                                {file.status}
                              </span>
                            </div>
                            <div className="text-sm text-muted-foreground mb-1">
                              <span className="font-medium text-foreground">Downloaded:</span>{" "}
                              {file.downloadedContent}
                            </div>
                            <div className="text-sm text-muted-foreground mb-1">
                              <span className="font-medium text-foreground">Expiry:</span>{" "}
                              {isExpired
                                ? "Expired"
                                : `Expires in ${differenceInDays(
                                  new Date(file.expiresAt),
                                  new Date()
                                )} days`}
                            </div>
                            <div className="text-sm text-muted-foreground mb-1">
                              <span className="font-medium text-foreground">Uploaded:</span>{" "}
                              {formatDistanceToNowStrict(
                                new Date(file.createdAt),
                                {
                                  addSuffix: true,
                                }
                              )}
                            </div>

                            <div className="flex flex-wrap gap-4 mt-3">
                              <button
                                onClick={() => setPreviewFile(file)}
                                className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 border border-blue-500 rounded hover:bg-blue-50 transition"
                              >
                                <FaEye /> Preview
                              </button>

                              {/* Share */}
                              <button
                                onClick={() => setShareFile(file)}
                                className="flex items-center gap-1 px-3 py-1 text-sm text-purple-600 border border-purple-500 rounded hover:bg-purple-50 transition"
                              >
                                <FaShare /> Share
                              </button>

                              {/* Delete */}
                              <button
                                onClick={() => deleteFile(file.id)}
                                className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 border border-red-500 rounded hover:bg-red-50 transition"
                              >
                                <FaTrashAlt /> Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      </>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-4 px-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded text-secondary-foreground bg-secondary hover:bg-secondary/80 disabled:opacity-50 transition-colors"
                >
                  Previous
                </button>
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded text-secondary-foreground bg-secondary hover:bg-secondary/80 disabled:opacity-50 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </div>
          <p className="text-muted-foreground mt-6 text-center text-sm">
            Want to save your progress?{" "}
            <Link
              to="/login"
              className="text-primary font-medium hover:underline transition-colors duration-200"
            >
              Log in
            </Link>{" "}
            or{" "}
            <Link
              to="/signup"
              className="text-primary font-medium hover:underline transition-colors duration-200"
            >
              Create an account
            </Link>
          </p>

        </div>
      )}

      {/* Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-card p-6 rounded-lg shadow-lg border border-border max-w-2xl w-full mx-4">
            <h3 className="text-lg font-bold mb-2 text-foreground">{previewFile.name}</h3>
            {/* File Preview */}
            {previewFile.type.startsWith("image/") && (
              <img
                src={previewFile.path}
                alt={previewFile.name}
                className="w-full h-auto rounded mb-4 max-h-[60vh] object-contain"
              />
            )}
            {previewFile.type.startsWith("video/") && (
              <video controls className="w-full h-auto rounded mb-4 max-h-[60vh]">
                <source src={previewFile.path} type={previewFile.type} />
                Your browser does not support the video tag.
              </video>
            )}
            {previewFile.type.startsWith("audio/") && (
              <audio controls className="w-full h-auto rounded mb-4">
                <source src={previewFile.path} type={previewFile.type} />
                Your browser does not support the audio element.
              </audio>
            )}
            {previewFile.type === "application/pdf" && (
              <iframe
                src={previewFile.path}
                title="PDF Preview"
                className="w-full h-[400px] rounded mb-4 border border-input"
              ></iframe>
            )}
            <div className="mt-4 text-right">
              <button
                onClick={() => setPreviewFile(null)}
                className="px-4 py-2 text-primary-foreground bg-primary rounded hover:bg-primary/90 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {shareFile && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-card p-6 rounded-lg shadow-lg border border-border w-full max-w-md md:max-w-2xl mx-4">
            <h3 className="text-lg font-bold mb-4 text-center text-foreground">
              Share "{shareFile?.name}"
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a
                href={handleShare(shareFile.shortUrl).whatsapp}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 p-4 border border-input rounded hover:bg-muted transition"
              >
                <FaWhatsapp className="text-green-500 text-2xl" />
                <span className="font-semibold text-foreground">WhatsApp</span>
              </a>

              <a
                href={handleShare(shareFile.shortUrl).instagram || "#"}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 p-4 border border-input rounded hover:bg-muted transition"
              >
                <FaInstagram className="text-pink-500 text-2xl" />
                <span className="font-semibold text-foreground">Instagram</span>
              </a>

              <a
                href={handleShare(shareFile.shortUrl).telegram}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 p-4 border border-input rounded hover:bg-muted transition"
              >
                <FaTelegramPlane className="text-blue-500 text-2xl" />
                <span className="font-semibold text-foreground">Telegram</span>
              </a>

              <a
                href={handleShare(shareFile.shortUrl).email}
                className="flex items-center gap-3 p-4 border border-input rounded hover:bg-muted transition"
              >
                <FaEnvelope className="text-red-500 text-2xl" />
                <span className="font-semibold text-foreground">Email</span>
              </a>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm font-medium text-muted-foreground mb-2">
                QR Code:
              </p>
              <img
                src={handleShare(shareFile.shortUrl).qr}
                alt="QR Code"
                className="mx-auto border border-input rounded w-32 h-32"
              />
              <div className="flex flex-col items-center mt-4 gap-2">
                <button
                  onClick={() => downloadQRCode(shareFile.shortUrl)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/80 transition"
                >
                  <FaDownload className="text-lg" />
                  <span className="font-semibold">Download QR Code</span>
                </button>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      handleShare(shareFile.shortUrl).copy
                    );
                    toast.success("Link copied to clipboard!");
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/80 transition"
                >
                  <FaDownload className="text-lg" />
                  <span className="font-semibold">Copy Link</span>
                </button>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={() => setShareFile(null)}
                className="px-4 py-2 bg-muted text-muted-foreground rounded hover:bg-muted/80"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuestFilePreview;
