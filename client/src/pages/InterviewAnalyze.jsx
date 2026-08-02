import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FiCpu,
  FiUser,
  FiBookOpen,
  FiBriefcase,
  FiCode,
  FiArrowRight,
  FiAward,
  FiAlertTriangle,
  FiRefreshCw,
  FiUploadCloud,
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

/* small reusable section card */
function Card({ icon, iconColor, title, children, className = "" }) {
  return (
    <div className={`bg-[#0B0D12] border border-[#1F2430] rounded-3xl p-6 ${className}`}>
      <div className="flex items-center gap-3 mb-5">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${iconColor}1A`, color: iconColor }}
        >
          {icon}
        </div>
        <h2 className="font-display text-xl font-bold text-[#EDEFF3]">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function InterviewAnalyze() {
  const navigate = useNavigate();
  const location = useLocation();

  const interviewId = location.state?.interviewId;

  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const analyzeCalled = useRef(false);

  useEffect(() => {

  if (analyzeCalled.current) return;

  analyzeCalled.current = true;


  if (interviewId) {

    analyzeResume();

  } else {

    setLoading(false);

  }


}, []);

  const analyzeResume = async () => {
    try {
      setLoading(true);
      setErrorMsg("");

      const res = await axios.post(
        `${SERVER_URL}/api/interview/analyze/${interviewId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAnalysis(res.data.interview.analysis);
    } catch (err) {
      console.log(err);
      setErrorMsg("Resume analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // NO INTERVIEW ID
  // ==========================
  if (!interviewId) {
    return (
      <div className="min-h-screen bg-[#06070A] flex justify-center items-center px-4">
        <GlobalStyle />
        <div className="w-full max-w-sm rounded-[24px] border border-[#1F2430] bg-[#0B0D12] shadow-2xl p-8 text-center">
          <div className="w-12 h-12 rounded-xl bg-[#FF5C5C]/15 border border-[#FF5C5C]/30 flex items-center justify-center text-[#FF5C5C] mx-auto mb-5">
            <FiAlertTriangle size={22} />
          </div>
          <p className="font-display text-xl font-bold text-[#EDEFF3]">
            Interview ID not found
          </p>
          <p className="font-mono-data text-xs text-[#8891A0] mt-2 leading-5">
            Upload your resume again to start a new session.
          </p>
          <button
            onClick={() => navigate("/upload")}
            className="mt-6 inline-flex items-center gap-2 bg-[#5B6EFF] hover:bg-[#4759e6] transition px-6 py-3 rounded-xl font-semibold text-white"
          >
            <FiUploadCloud size={16} />
            Upload Resume
          </button>
        </div>
      </div>
    );
  }

  // ==========================
  // LOADING
  // ==========================
  if (loading) {
    return (
      <div className="min-h-screen bg-[#06070A] flex flex-col justify-center items-center text-[#EDEFF3] px-6">
        <GlobalStyle />
        <div className="w-full max-w-sm rounded-[24px] border border-[#1F2430] bg-[#0B0D12] shadow-2xl p-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5B6EFF] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#5B6EFF]" />
            </span>
            <span className="font-mono-data text-xs tracking-[0.2em] text-[#5B6EFF]">
              ANALYZING
            </span>
          </div>

          <div className="w-16 h-16 mx-auto border-4 border-[#5B6EFF] border-t-transparent rounded-full animate-spin" />

          <h2 className="font-display text-xl font-bold mt-6">
            AI is analyzing your resume…
          </h2>

          <p className="font-mono-data text-xs text-[#8891A0] mt-2">
            Extracting skills, projects, and experience
          </p>
        </div>
      </div>
    );
  }

  // ==========================
  // ANALYSIS FAILED
  // ==========================
  if (errorMsg) {
    return (
      <div className="min-h-screen bg-[#06070A] flex justify-center items-center px-4">
        <GlobalStyle />
        <div className="w-full max-w-sm rounded-[24px] border border-[#1F2430] bg-[#0B0D12] shadow-2xl p-8 text-center">
          <div className="w-12 h-12 rounded-xl bg-[#FF5C5C]/15 border border-[#FF5C5C]/30 flex items-center justify-center text-[#FF5C5C] mx-auto mb-5">
            <FiAlertTriangle size={22} />
          </div>
          <p className="font-display text-xl font-bold text-[#EDEFF3]">
            Analysis failed
          </p>
          <p className="font-mono-data text-xs text-[#8891A0] mt-2 leading-5">
            {errorMsg}
          </p>
          <button
            onClick={analyzeResume}
            className="mt-6 inline-flex items-center gap-2 bg-[#5B6EFF] hover:bg-[#4759e6] transition px-6 py-3 rounded-xl font-semibold text-white"
          >
            <FiRefreshCw size={16} />
            Retry
          </button>
        </div>
      </div>
    );
  }

  // ==========================
  // RESULTS
  // ==========================
  return (
    <div className="min-h-screen bg-[#06070A] relative text-[#EDEFF3] px-6 py-16">
      <GlobalStyle />

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[32rem] h-72 bg-[#5B6EFF]/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-[#5B6EFF]/15 border border-[#5B6EFF]/30 flex justify-center items-center">
            <FiCpu className="text-[#5B6EFF]" size={36} />
          </div>

          <h1 className="font-display text-4xl md:text-5xl font-bold mt-6">
            Resume Analysis
          </h1>

          <p className="text-[#8891A0] mt-3">
            HireMind read your resume — here's what it found before your
            interview.
          </p>
        </div>

        {/* INFO GRID */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card icon={<FiUser size={16} />} iconColor="#5B6EFF" title="Candidate">
            <div className="space-y-2 text-[#C7CBD4]">
              <p>
                <span className="text-[#8891A0]">Name:</span>{" "}
                {analysis?.name || "N/A"}
              </p>
              <p>
                <span className="text-[#8891A0]">Email:</span>{" "}
                {analysis?.email || "N/A"}
              </p>
              <p>
                <span className="text-[#8891A0]">Phone:</span>{" "}
                {analysis?.phone || "N/A"}
              </p>
            </div>
          </Card>

          <Card icon={<FiCode size={16} />} iconColor="#35D399" title="Skills">
            {(analysis?.skills || []).length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {analysis.skills.map((item, index) => (
                  <span
                    key={index}
                    className="bg-[#111318] border border-[#1F2430] text-[#C7CBD4] px-3 py-1.5 rounded-full text-sm"
                  >
                    {item}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-[#8891A0]">No skills found.</p>
            )}
          </Card>

          <Card icon={<FiBriefcase size={16} />} iconColor="#FFB454" title="Experience">
            <div className="space-y-3">
              {(analysis?.experience || []).length > 0 ? (
                analysis.experience.map((exp, index) => (
                  <div
                    key={index}
                    className="border border-[#1F2430] rounded-xl p-4"
                  >
                    <h3 className="font-semibold text-[#EDEFF3]">{exp.role}</h3>
                    <p className="text-[#5B6EFF] text-sm mt-1">{exp.company}</p>
                    <p className="font-mono-data text-xs text-[#8891A0] mt-1">
                      {exp.duration}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-[#8891A0]">No experience found.</p>
              )}
            </div>
          </Card>

          <Card icon={<FiBookOpen size={16} />} iconColor="#B98CFF" title="Education">
            <div className="space-y-3">
              {(analysis?.education || []).length > 0 ? (
                analysis.education.map((edu, index) => (
                  <div
                    key={index}
                    className="border border-[#1F2430] rounded-xl p-4"
                  >
                    <h3 className="font-semibold text-[#EDEFF3]">{edu.degree}</h3>
                    <p className="text-[#C7CBD4] text-sm mt-1">{edu.institution}</p>
                    {edu.cgpa && (
                      <p className="font-mono-data text-xs text-[#35D399] mt-1">
                        CGPA: {edu.cgpa}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-[#8891A0]">No education found.</p>
              )}
            </div>
          </Card>

          <Card
            icon={<FiCode size={16} />}
            iconColor="#5B6EFF"
            title="Projects"
            className="md:col-span-2"
          >
            <div className="grid md:grid-cols-2 gap-4">
              {(analysis?.projects || []).length > 0 ? (
                analysis.projects.map((project, index) => (
                  <div
                    key={index}
                    className="border border-[#1F2430] rounded-xl p-4"
                  >
                    <h3 className="font-semibold text-[#EDEFF3]">
                      {project.title}
                    </h3>
                    <p className="mt-2 text-[#8891A0] text-sm leading-6">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {(project.technologies || []).map((tech, i) => (
                        <span
                          key={i}
                          className="bg-[#5B6EFF]/15 border border-[#5B6EFF]/30 text-[#5B6EFF] px-3 py-1 rounded-full text-xs"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-[#8891A0]">No projects found.</p>
              )}
            </div>
          </Card>

          <Card
            icon={<FiAward size={16} />}
            iconColor="#FFB454"
            title="Certifications"
            className="md:col-span-2"
          >
            {(analysis?.certifications || []).length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {analysis.certifications.map((cert, index) => (
                  <span
                    key={index}
                    className="bg-[#111318] border border-[#1F2430] text-[#C7CBD4] px-3 py-1.5 rounded-full text-sm"
                  >
                    {cert}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-[#8891A0]">No certifications found.</p>
            )}
          </Card>
        </div>

        <button
          onClick={() =>
            navigate("/interview/setup", {
              state: { interviewId },
            })
          }
          className="w-full mt-10 bg-[#5B6EFF] hover:bg-[#4759e6] transition rounded-2xl py-4 text-lg font-semibold flex justify-center items-center gap-3 text-white"
        >
          Continue to Interview Setup
          <FiArrowRight />
        </button>
      </div>
    </div>
  );
}

export default InterviewAnalyze;