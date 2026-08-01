import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { AlertTriangle, UploadCloud, X } from "lucide-react";
import Step1SetUp from "../components/Step1SetUp";

const SERVER_URL = "http://localhost:8000";

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

/* ------------------------------------------------------------------ */
/* Shown when someone lands here without an interviewId — previously  */
/* this was just an alert() followed by a blank screen.                */
/* ------------------------------------------------------------------ */
function MissingInterviewScreen({ onUploadAgain }) {
  return (
    <div className="min-h-screen bg-[#06070A] flex justify-center items-center px-4">
      <GlobalStyle />

      <div className="w-full max-w-sm rounded-[24px] border border-[#1F2430] bg-[#0B0D12] shadow-2xl p-8 text-center">
        <div className="w-12 h-12 rounded-xl bg-[#FF5C5C]/15 border border-[#FF5C5C]/30 flex items-center justify-center text-[#FF5C5C] mx-auto mb-5">
          <AlertTriangle size={22} />
        </div>

        <p className="font-display text-xl font-bold text-[#EDEFF3]">
          No interview found
        </p>
        <p className="font-mono-data text-xs text-[#8891A0] mt-2 leading-5">
          Upload your resume first so HireMind can set up this session.
        </p>

        <button
          onClick={onUploadAgain}
          className="mt-6 inline-flex items-center gap-2 bg-[#5B6EFF] hover:bg-[#4759e6] transition px-6 py-3 rounded-xl font-semibold text-white"
        >
          <UploadCloud size={16} />
          Upload Resume
        </button>
      </div>
    </div>
  );
}

export default function InterviewSetUpPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const interviewId = location.state?.interviewId;

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleNext = async (data) => {
    if (!interviewId) {
      setErrorMsg("Interview ID not found. Please upload your resume again.");
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg("");

      const token = localStorage.getItem("token");

      const body = {
        interviewId,
        role: data.role,
        experience: data.experience,
        difficulty: data.difficulty,
        interviewType: data.interviewType,
      };

      const res = await axios.post(
        `${SERVER_URL}/api/interview/create`,
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate(`/interview/${res.data.interview._id}`);
    } catch (err) {
      console.log(err);
      console.log(err.response?.data);
      setErrorMsg(err.response?.data?.message || "Setup failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (!interviewId) {
    return (
      <MissingInterviewScreen
        onUploadAgain={() => navigate("/upload")}
      />
    );
  }

  return (
    <div className="relative">
      <GlobalStyle />

      <Step1SetUp onNext={handleNext} submitting={submitting} />

      {/* SETUP ERROR — overlays the bottom of Step1SetUp without
          disrupting its own layout/state */}
      {errorMsg && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-md">
          <div className="flex items-start gap-3 bg-[#0B0D12] border border-[#FF5C5C]/30 rounded-2xl p-4 shadow-2xl">
            <AlertTriangle size={18} className="text-[#FF5C5C] mt-0.5 shrink-0" />
            <p className="text-sm text-[#FF9C9C] flex-1">{errorMsg}</p>
            <button
              onClick={() => setErrorMsg("")}
              className="text-[#8891A0] hover:text-[#EDEFF3] transition shrink-0"
              aria-label="Dismiss"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}