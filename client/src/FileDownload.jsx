import { useEffect, useState } from "react";
import axiosInstance from "./config/axiosInstance";
import { useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { FaDownload, FaFileAlt, FaFileImage, FaFileVideo, FaFileAudio, FaLock, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { MdOutlineShield } from "react-icons/md";
import CommonHeader from "./components/CommonHeader"; // Assuming this exists or using a new one

const FileDownload = () => {
  const { code } = useParams();
  const [fileData, setFileData] = useState(null);
  const [password, setPassword] = useState('');
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`files/resolveShareLink/${code}`);
        setFileData(res.data);
        if (res.data.isPasswordProtected) {
          setShowPasswordPrompt(true);
        }
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || 'Invalid or expired link.');
        setLoading(false);
      }
    };
    fetchDetails();
  }, [code]);

  const handlePasswordSubmit = async () => {
    try {
      await axiosInstance.post(`files/verifyFilePassword`, {
        shortCode: code,
        password,
      });
      setShowPasswordPrompt(false);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Incorrect password');
    }
  };

  const handleDownload = async () => {
    try {
      setDownloading(true);
      const res = await axiosInstance.post(`files/download/${fileData.fileId}`, {
        password,
      });

      // Force download in same tab using signed URL with Content-Disposition attachment
      window.location.assign(res.data.downloadUrl);

      setDownloading(false);

    } catch (err) {
      setDownloading(false);
      setError(err.response?.data?.error || 'Download failed. Please try again.');
    }
  };

  const getFileIcon = (type) => {
    if (type.startsWith("image")) return <FaFileImage className="text-blue-500 text-6xl" />;
    if (type.startsWith("video")) return <FaFileVideo className="text-purple-500 text-6xl" />;
    if (type.startsWith("audio")) return <FaFileAudio className="text-green-500 text-6xl" />;
    return <FaFileAlt className="text-gray-500 text-6xl" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error && !fileData) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
        <CommonHeader />
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <FaExclamationCircle className="text-red-500 text-6xl mb-4" />
          <h2 className="text-2xl font-bold mb-2">Oops! Link Expired or Invalid</h2>
          <p className="text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 font-sans">

      {/* Navbar hidden as per request */}
      {/* <CommonHeader /> */}
      <div className="w-full flex justify-between items-center p-6 sm:px-8 absolute top-0 left-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg">S</div>
          <span className="text-xl font-bold text-gray-800 dark:text-white tracking-tight">ShareBox</span>
        </div>
      </div>

      <main className="flex-1 flex items-center justify-center p-4 sm:p-8 pt-20">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row min-h-[500px]">

          {/* Left Side: Preview / Icon */}
          <div className="w-full md:w-1/2 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-gray-700 dark:to-gray-800 flex flex-col items-center justify-center p-10 border-b md:border-b-0 md:border-r border-gray-100 dark:border-gray-700 relative overflow-hidden group">

            {/* Ambient Background Effect */}
            <div className="absolute top-0 left-0 w-full h-full bg-grid-slate-200/[0.04] mask-image-gradient-b-transparent"></div>

            {!showPasswordPrompt && fileData?.type.startsWith("image") ? (
              <div className="relative z-10 w-full h-full flex items-center justify-center">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-gray-600 transform group-hover:scale-105 transition-transform duration-500">
                  <img
                    src={fileData.path}
                    alt={fileData.name}
                    className="max-h-[300px] w-auto object-contain bg-gray-100 dark:bg-gray-900"
                  />
                </div>
              </div>
            ) : (
              <div className="relative z-10 p-10 bg-white dark:bg-gray-700 rounded-full shadow-xl ring-8 ring-white/50 dark:ring-gray-600/30 animate-pulse-slow">
                {getFileIcon(fileData?.type || 'file')}
              </div>
            )}

            <h3 className="mt-8 text-2xl font-bold text-gray-800 dark:text-gray-100 text-center break-all px-4 relative z-10 tracking-tight">
              {fileData?.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {(fileData?.size / 1024 / 1024).toFixed(2)} MB • {fileData?.type}
            </p>
          </div>

          {/* Right Side: Actions */}
          <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">

            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Ready to Download?</h1>
              <p className="text-gray-500 dark:text-gray-400">
                This file was shared using ShareBox. verify and download securely.
              </p>
            </div>

            {showPasswordPrompt ? (
              <div className="animate-fade-in-up">
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl p-4 mb-6 flex items-start gap-3">
                  <MdOutlineShield className="text-yellow-600 dark:text-yellow-500 text-xl mt-1 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-yellow-800 dark:text-yellow-500">Password Protected</h4>
                    <p className="text-sm text-yellow-700 dark:text-yellow-400">The sender has secured this file. Please enter the password.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <input
                    type="password"
                    placeholder="Enter file password"
                    className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    onClick={handlePasswordSubmit}
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-200 dark:shadow-none flex justify-center items-center gap-2"
                  >
                    <FaLock /> Unlock File
                  </button>
                </div>
                {error && <p className="text-red-500 text-center mt-3 text-sm">{error}</p>}
              </div>
            ) : (
              <div className="animate-fade-in-up space-y-6">
                {/* Metadata */}
                <div className="space-y-3">
                  <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-2">
                    <span className="text-gray-500">Uploaded</span>
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      {fileData?.createdAt ? formatDistanceToNow(new Date(fileData.createdAt), { addSuffix: true }) : 'Recently'}
                    </span>
                  </div>
                  {fileData?.expiresAt && (
                    <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-2">
                      <span className="text-gray-500">Expires</span>
                      <span className="font-medium text-red-500">
                        {formatDistanceToNow(new Date(fileData.expiresAt), { addSuffix: true })}
                      </span>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleDownload}
                  disabled={downloading}
                  className={`w-full py-4 text-white font-bold rounded-xl transition-all shadow-xl flex justify-center items-center gap-3 text-lg
                     ${downloading ? 'bg-indigo-400 cursor-wait' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200 dark:shadow-none hover:scale-[1.02]'}
                   `}
                >
                  {downloading ? (
                    <>Downloading...</>
                  ) : (
                    <><FaDownload /> Download File</>
                  )}
                </button>

                {error && <p className="text-red-500 text-center text-sm bg-red-50 p-2 rounded">{error}</p>}
              </div>
            )}

          </div>
        </div>
      </main>

      <footer className="p-6 text-center text-gray-400 text-sm">
        © 2024 ShareBox Inc. Secure File Sharing.
      </footer>
    </div>
  );
};

export default FileDownload;