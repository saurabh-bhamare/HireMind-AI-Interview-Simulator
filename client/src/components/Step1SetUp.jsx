import React, { useState } from "react";
import {
  Brain,
  Mic,
  BarChart3,
  FileCheck,
  ChevronRight,
  Briefcase,
  Gauge,
  ListChecks,
  Sparkles,
} from "lucide-react";

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
/* IMPORTANT: these values must match the Mongoose schema exactly,    */
/* or Interview.create()/save() will throw a validation error.        */
/*   interviewType: ["Technical", "HR", "Behavioral", "Mixed"]        */
/*   difficulty:    ["Easy", "Medium", "Hard"]                        */
/* ------------------------------------------------------------------ */
const EXPERIENCE_OPTIONS = ["Fresher", "0-1 Years", "1-3 Years", "3+ Years"];
const DIFFICULTY_OPTIONS = ["Easy", "Medium", "Hard"];
const INTERVIEW_TYPES = ["Technical", "HR", "Behavioral", "Mixed"];

const FEATURES = [
  {
    icon: <Brain size={18} />,
    label: "Smart AI Questions",
    accent: "#5B6EFF",
  },
  {
    icon: <Mic size={18} />,
    label: "Voice Simulation",
    accent: "#35D399",
  },
  {
    icon: <BarChart3 size={18} />,
    label: "Confidence Analysis",
    accent: "#FFB454",
  },
  {
    icon: <FileCheck size={18} />,
    label: "Performance Report",
    accent: "#B98CFF",
  },
];

function FieldLabel({ icon, children }) {
  return (
    <label className="flex items-center gap-2 text-[#C7CBD4] mb-2 text-sm font-medium">
      <span className="text-[#5B6EFF]">{icon}</span>
      {children}
    </label>
  );
}

function Step1SetUp({ onNext, submitting = false }) {
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [difficulty, setDifficulty] = useState("Medium");
  const [interviewType, setInterviewType] = useState("Technical");
  const [touched, setTouched] = useState(false);

  const roleInvalid = touched && !role.trim();
  const experienceInvalid = touched && !experience;

  const handleContinue = () => {
    setTouched(true);

    if (!role.trim() || !experience) {
      return;
    }

    onNext({
      role: role.trim(),
      experience,
      difficulty,
      interviewType,
    });
  };

  return (
    <div className="min-h-screen bg-[#06070A] relative flex items-center justify-center px-4 md:px-6 py-16">
      <GlobalStyle />

      {/* ambient glow, consistent with rest of app */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#5B6EFF]/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#35D399]/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative w-full max-w-4xl bg-[#0B0D12]/90 backdrop-blur-xl border border-[#1F2430] rounded-3xl shadow-2xl p-8 md:p-12">
        {/* HEADER */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-[#111318] border border-[#1F2430] px-5 py-2 rounded-full text-[#5B6EFF] text-xs font-mono-data tracking-widest mb-6">
            <Sparkles size={14} />
            STEP 1 · SESSION CONFIG
          </div>

          <h1 className="font-display text-4xl md:text-5xl font-bold text-[#EDEFF3]">
            Interview Setup
          </h1>

          <p className="text-[#8891A0] mt-3 leading-6 max-w-lg mx-auto">
            Tell HireMind what role you're prepping for, and it'll build the
            session around it.
          </p>
        </div>

        {/* FORM */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Role */}
          <div>
            <FieldLabel icon={<Briefcase size={15} />}>Target Role</FieldLabel>
            <input
              type="text"
              placeholder="e.g. Full Stack Developer"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className={`w-full bg-[#111318] border rounded-xl px-5 py-4 text-[#EDEFF3] outline-none transition placeholder:text-[#8891A0]/60 ${
                roleInvalid
                  ? "border-[#FF5C5C] focus:border-[#FF5C5C]"
                  : "border-[#1F2430] focus:border-[#5B6EFF]"
              }`}
            />
            {roleInvalid && (
              <p className="text-[#FF9C9C] text-xs mt-2 font-mono-data">
                Target role is required.
              </p>
            )}
          </div>

          {/* Experience */}
          <div>
            <FieldLabel icon={<ListChecks size={15} />}>Experience</FieldLabel>
            <select
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className={`w-full bg-[#111318] border rounded-xl px-5 py-4 text-[#EDEFF3] outline-none transition ${
                experienceInvalid
                  ? "border-[#FF5C5C] focus:border-[#FF5C5C]"
                  : "border-[#1F2430] focus:border-[#5B6EFF]"
              }`}
            >
              <option value="">Select Experience</option>
              {EXPERIENCE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            {experienceInvalid && (
              <p className="text-[#FF9C9C] text-xs mt-2 font-mono-data">
                Please select your experience level.
              </p>
            )}
          </div>

          {/* Difficulty */}
          <div>
            <FieldLabel icon={<Gauge size={15} />}>Difficulty</FieldLabel>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full bg-[#111318] border border-[#1F2430] rounded-xl px-5 py-4 text-[#EDEFF3] outline-none focus:border-[#5B6EFF] transition"
            >
              {DIFFICULTY_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Interview Type — matches schema enum exactly */}
          <div>
            <FieldLabel icon={<Brain size={15} />}>Interview Type</FieldLabel>
            <select
              value={interviewType}
              onChange={(e) => setInterviewType(e.target.value)}
              className="w-full bg-[#111318] border border-[#1F2430] rounded-xl px-5 py-4 text-[#EDEFF3] outline-none focus:border-[#5B6EFF] transition"
            >
              {INTERVIEW_TYPES.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* FEATURES — reflects the config that's actually going live */}
        <div className="mt-10 bg-[#111318] border border-[#1F2430] rounded-2xl p-6">
          <h2 className="font-mono-data text-xs uppercase tracking-[0.2em] text-[#8891A0] mb-5">
            Active for this session
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="flex items-center gap-3 bg-[#0B0D12] border border-[#1F2430] rounded-xl p-4"
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${f.accent}1A`, color: f.accent }}
                >
                  {f.icon}
                </div>
                <span className="text-[#EDEFF3] text-sm font-medium">
                  {f.label}
                </span>
              </div>
            ))}
          </div>

          {/* live summary chips */}
          <div className="flex flex-wrap gap-2 mt-6">
            <span className="font-mono-data text-xs bg-[#5B6EFF]/10 border border-[#5B6EFF]/30 text-[#5B6EFF] px-3 py-1.5 rounded-full">
              {interviewType} round
            </span>
            <span className="font-mono-data text-xs bg-[#FFB454]/10 border border-[#FFB454]/30 text-[#FFB454] px-3 py-1.5 rounded-full">
              {difficulty} difficulty
            </span>
            {experience && (
              <span className="font-mono-data text-xs bg-[#35D399]/10 border border-[#35D399]/30 text-[#35D399] px-3 py-1.5 rounded-full">
                {experience}
              </span>
            )}
          </div>
        </div>

        {/* SUBMIT */}
        <button
          onClick={handleContinue}
          disabled={submitting}
          className="w-full mt-10 bg-[#5B6EFF] hover:bg-[#4759e6] disabled:opacity-60 transition rounded-2xl py-4 text-lg font-semibold text-white flex justify-center items-center gap-3"
        >
          {submitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span className="font-mono-data text-sm tracking-wide">
                Starting session…
              </span>
            </>
          ) : (
            <>
              Continue to AI Interview
              <ChevronRight size={20} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default Step1SetUp;