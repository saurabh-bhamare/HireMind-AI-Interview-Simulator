import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FiUploadCloud,
  FiFileText,
  FiCheckCircle,
  FiX,
  FiLock,
  FiAlertTriangle,
} from "react-icons/fi";

const SERVER_URL = "https://hiremind-server-syni.onrender.com";

/* ------------------------------------------------------------------ */
/* Same control-room tokens as the rest of the app                    */
/* ------------------------------------------------------------------ */
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700;900&family=JetBrains+Mono:wght@400;500;600&display=swap');
    .font-display { font-family: 'Space Grotesk', sans-serif; }
    .font-mono-data { font-family: 'JetBrains Mono', monospace; }
  `}</style>
);

function ResumeUploadPage() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // ==========================
  // FILE SELECT
  // ==========================
  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) return;
    setErrorMsg("");

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      setErrorMsg("Please upload PDF, DOC or DOCX only.");
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setErrorMsg("Resume must be less than 5 MB.");
      return;
    }

    setFile(selectedFile);
  };

  // ==========================
  // DRAG & DROP
  // ==========================
  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);

    if (e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  // ==========================
  // UPLOAD
  // ==========================
  const handleUpload = async () => {
    if (!file) {
      setErrorMsg("Please select your resume.");
      return;
    }

    if (!token) {
      setErrorMsg("Please login first.");
      navigate("/auth");
      return;
    }

    try {
      setLoading(true);
      setErrorMsg("");

      const formData = new FormData();
      formData.append("resume", file);

      const res = await axios.post(
        `${SERVER_URL}/api/interview/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(res.data);
      console.log("Interview ID:", res.data.interview._id);

      navigate("/resume-analysis", {
        state: {
          interviewId: res.data.interview._id,
        },
      });
    } catch (err) {
      console.log(err);

      setErrorMsg(
        err.response?.data?.message || "Resume upload failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#06070A] relative flex justify-center items-center px-4 py-16">
      <GlobalStyle />

      {/* ambient glow, consistent with rest of app */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#5B6EFF]/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#35D399]/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative w-full max-w-xl bg-[#0B0D12]/90 backdrop-blur-xl border border-[#1F2430] rounded-3xl shadow-2xl p-10">
        {/* HEADER */}
        <div className="text-center">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-[#5B6EFF]/15 border border-[#5B6EFF]/30 flex items-center justify-center">
            <FiUploadCloud size={36} className="text-[#5B6EFF]" />
          </div>

          <h1 className="font-display text-3xl md:text-4xl font-bold text-[#EDEFF3] mt-6">
            Upload Resume
          </h1>

          <p className="text-[#8891A0] mt-3 leading-6">
            HireMind reads your resume before the interview starts, so
            questions match the projects you've actually built.
          </p>
        </div>

        {/* UPLOAD BOX */}
        <label
          className="block mt-10 cursor-pointer"
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          <div
            className={`border-2 border-dashed rounded-3xl transition-all duration-300 p-12 text-center ${
              dragging
                ? "border-[#5B6EFF] bg-[#5B6EFF]/10"
                : "border-[#1F2430] bg-[#111318] hover:border-[#5B6EFF]"
            }`}
          >
            <FiFileText size={48} className="mx-auto text-[#5B6EFF]" />

            <h3 className="font-display text-xl text-[#EDEFF3] font-semibold mt-5">
              Drag & Drop Resume
            </h3>

            <p className="text-[#8891A0] mt-2">or click to browse</p>

            <p className="font-mono-data text-xs text-[#8891A0]/80 mt-4 tracking-wide">
              PDF · DOC · DOCX · MAX 5MB
            </p>

            <input
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx"
              onChange={(e) => handleFileSelect(e.target.files[0])}
            />
          </div>
        </label>

        {/* ERROR */}
        {errorMsg && (
          <div className="mt-6 flex items-start gap-3 bg-[#FF5C5C]/10 border border-[#FF5C5C]/30 rounded-2xl p-4">
            <FiAlertTriangle size={18} className="text-[#FF5C5C] mt-0.5 shrink-0" />
            <p className="text-sm text-[#FF9C9C]">{errorMsg}</p>
          </div>
        )}

        {/* FILE PREVIEW */}
        {file && (
          <div className="mt-6 bg-[#111318] border border-[#35D399]/30 rounded-2xl p-5 flex justify-between items-center">
            <div className="flex items-center gap-4 min-w-0">
              <FiCheckCircle size={28} className="text-[#35D399] shrink-0" />
              <div className="min-w-0">
                <h4 className="text-[#EDEFF3] font-semibold truncate">
                  {file.name}
                </h4>
                <p className="font-mono-data text-xs text-[#8891A0] mt-1">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>

            <button
              onClick={() => setFile(null)}
              className="text-[#8891A0] hover:text-[#FF5C5C] transition p-2 shrink-0"
              aria-label="Remove file"
            >
              <FiX size={20} />
            </button>
          </div>
        )}

        {/* BUTTON */}
        <button
          onClick={handleUpload}
          disabled={loading}
          className="w-full mt-8 bg-[#5B6EFF] hover:bg-[#4759e6] disabled:opacity-60 transition rounded-2xl py-4 text-lg font-semibold text-white flex justify-center items-center gap-3"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span className="font-mono-data text-sm tracking-wide">
                Uploading &amp; analyzing…
              </span>
            </>
          ) : (
            "Upload & Analyze Resume"
          )}
        </button>

        {/* FOOTER */}
        <p className="flex items-center justify-center gap-2 text-center text-[#8891A0] text-sm mt-6">
          <FiLock size={13} />
          Your resume is encrypted and securely processed.
        </p>
      </div>
    </div>
  );
}

export default ResumeUploadPage;