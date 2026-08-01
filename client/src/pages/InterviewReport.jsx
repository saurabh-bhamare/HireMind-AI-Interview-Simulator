import React, { useState } from "react";

/* ---------------------------------------------------------
   DESIGN TOKENS
   ink       #101019  page background
   panel     #1A1B26  card surface
   panel-2   #21222F  raised / inset surface
   paper     #EDEDF2  primary text
   dim       #9296A8  secondary text
   rule      #2C2E40  hairlines
   gold      #D9B15C  primary accent — overall score, headline marks
   teal      #4FAE9E  strengths
   rose      #D9636B  weaknesses
   violet    #8C87D8  recommendations
--------------------------------------------------------- */

const tokens = {
  ink: "#101019",
  panel: "#1A1B26",
  panel2: "#21222F",
  paper: "#EDEDF2",
  dim: "#9296A8",
  rule: "#2C2E40",
  gold: "#D9B15C",
  teal: "#4FAE9E",
  rose: "#D9636B",
  violet: "#8C87D8",
};

const fontImports = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,500;9..144,600&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
`;

/* ---------------------------------------------------------
   SAMPLE DATA — used only if no report prop is supplied,
   so the component previews sensibly on its own.
--------------------------------------------------------- */
const sampleReport = {
  candidate: {
    name: "Priya Nair",
    role: "Senior Frontend Engineer",
    date: "July 24, 2026",
    duration: "38 min",
  },
  scores: { overall: 82, technical: 8, communication: 7, confidence: 8 },
  performanceLevel: "Strong Hire",
  strengths: [
    "Clear articulation of trade-offs in system design answers",
    "Strong grasp of React rendering and state model",
    "Handled the follow-up pressure question calmly",
  ],
  weaknesses: [
    "Under-specified edge cases in the algorithm question",
    "Ran long on the first two answers, rushed the last",
  ],
  recommendations: [
    "Probe deeper on distributed systems in the next round",
    "Confirm testing philosophy with a pairing exercise",
  ],
  feedback:
    "The candidate demonstrated solid technical fundamentals and communicated their reasoning clearly throughout most of the session. Time management became a factor in the later questions, which affected the depth of the final two answers. Overall a confident, well-structured performance.",
  answers: [
    {
      question: "Walk me through how you'd optimize a slow React list render.",
      answer:
        "I'd start by profiling with the React DevTools flamegraph, then look at memoization, windowing for long lists, and whether state is scoped too high in the tree.",
      score: 9,
    },
    {
      question: "Describe a time you disagreed with a technical decision.",
      answer:
        "I raised concerns about a client-side caching approach in a design review, proposed an alternative with cache invalidation rules, and we ran a short spike to compare both.",
      score: 7,
    },
    {
      question: "How would you design a rate limiter for a public API?",
      answer:
        "I'd use a token bucket per API key, backed by Redis for shared state across instances, with a sliding window fallback for burst traffic.",
      score: 8,
    },
  ],
};

/* ---------------------------------------------------------
   PRIMITIVES
--------------------------------------------------------- */

function SectionLabel({ n, children }) {
  return (
    <div className="flex items-baseline gap-3 mb-6">
      <span
        className="text-xs tracking-widest"
        style={{ fontFamily: "'JetBrains Mono', monospace", color: tokens.gold }}
      >
        {n}
      </span>
      <span className="h-px flex-1" style={{ background: tokens.rule }} />
      <span
        className="text-xs uppercase tracking-[0.2em]"
        style={{ fontFamily: "'JetBrains Mono', monospace", color: tokens.dim }}
      >
        {children}
      </span>
    </div>
  );
}

/* Instrument-style radial gauge — the report's signature element */
function ScoreDial({ value }) {
  const pct = Math.max(0, Math.min(100, value));
  const r = 78;
  const circumference = Math.PI * r; // semicircle length
  const offset = circumference * (1 - pct / 100);
  const ticks = Array.from({ length: 11 });

  return (
    <div className="relative flex flex-col items-center">
      <svg viewBox="0 0 200 120" className="w-64 h-auto">
        {/* tick marks */}
        {ticks.map((_, i) => {
          const angle = (Math.PI * i) / 10; // 0..PI
          const x1 = 100 - Math.cos(angle) * 92;
          const y1 = 110 - Math.sin(angle) * 92;
          const x2 = 100 - Math.cos(angle) * 84;
          const y2 = 110 - Math.sin(angle) * 84;
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={tokens.rule}
              strokeWidth="2"
            />
          );
        })}
        {/* track */}
        <path
          d="M 22 110 A 78 78 0 0 1 178 110"
          fill="none"
          stroke={tokens.panel2}
          strokeWidth="10"
          strokeLinecap="round"
        />
        {/* value arc */}
        <path
          d="M 22 110 A 78 78 0 0 1 178 110"
          fill="none"
          stroke={tokens.gold}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 900ms ease-out" }}
        />
        {/* needle */}
        {(() => {
          const needleAngle = Math.PI * (1 - pct / 100);
          const nx = 100 - Math.cos(needleAngle) * 58;
          const ny = 110 - Math.sin(needleAngle) * 58;
          return (
            <line
              x1="100"
              y1="110"
              x2={nx}
              y2={ny}
              stroke={tokens.paper}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          );
        })()}
        <circle cx="100" cy="110" r="5" fill={tokens.paper} />
      </svg>
      <div className="-mt-10 flex flex-col items-center">
        <span
          className="text-5xl font-medium"
          style={{ fontFamily: "'Fraunces', serif", color: tokens.paper }}
        >
          {pct}
          <span className="text-xl align-top" style={{ color: tokens.dim }}>
            %
          </span>
        </span>
        <span
          className="text-xs uppercase tracking-[0.2em] mt-1"
          style={{ fontFamily: "'JetBrains Mono', monospace", color: tokens.dim }}
        >
          Overall Score
        </span>
      </div>
    </div>
  );
}

function ReadoutBar({ label, value, max = 10 }) {
  const pct = (value / max) * 100;
  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-sm" style={{ color: tokens.dim }}>
          {label}
        </span>
        <span
          className="text-sm"
          style={{ fontFamily: "'JetBrains Mono', monospace", color: tokens.paper }}
        >
          {value.toString().padStart(2, "0")}
          <span style={{ color: tokens.dim }}>/{max}</span>
        </span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: tokens.panel2 }}>
        <div
          className="h-full rounded-full"
          style={{ width: `${pct}%`, background: tokens.gold }}
        />
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   SECTION COMPONENTS
--------------------------------------------------------- */

function CandidateCard({ report }) {
  const c = report?.candidate || {};
  const initials = (c.name || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className="rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-6"
      style={{ background: tokens.panel, border: `1px solid ${tokens.rule}` }}
    >
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center shrink-0 text-xl font-medium"
        style={{
          background: tokens.panel2,
          color: tokens.gold,
          fontFamily: "'Fraunces', serif",
          border: `1px solid ${tokens.rule}`,
        }}
      >
        {initials}
      </div>
      <div className="flex-1">
        <h2
          className="text-2xl"
          style={{ fontFamily: "'Fraunces', serif", color: tokens.paper }}
        >
          {c.name || "Candidate"}
        </h2>
        <p className="text-sm mt-1" style={{ color: tokens.dim }}>
          {c.role || "Role not specified"}
        </p>
      </div>
      <div
        className="flex gap-6 text-sm"
        style={{ fontFamily: "'JetBrains Mono', monospace", color: tokens.dim }}
      >
        <div>
          <div className="text-xs uppercase tracking-widest mb-1">Date</div>
          <div style={{ color: tokens.paper }}>{c.date || "—"}</div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest mb-1">Duration</div>
          <div style={{ color: tokens.paper }}>{c.duration || "—"}</div>
        </div>
      </div>
    </div>
  );
}

function InsightCard({ title, items, accent, mark }) {
  return (
    <div
      className="rounded-2xl p-6"
      style={{ background: tokens.panel, border: `1px solid ${tokens.rule}` }}
    >
      <h3
        className="text-sm uppercase tracking-[0.15em] mb-5"
        style={{ fontFamily: "'JetBrains Mono', monospace", color: accent }}
      >
        {title}
      </h3>
      <ul className="space-y-3">
        {items.length === 0 && (
          <li className="text-sm" style={{ color: tokens.dim }}>
            Nothing recorded.
          </li>
        )}
        {items.map((item, i) => (
          <li key={i} className="flex gap-3 text-sm leading-relaxed" style={{ color: tokens.paper }}>
            <span
              className="shrink-0 mt-0.5"
              style={{ color: accent, fontFamily: "'JetBrains Mono', monospace" }}
            >
              {mark}
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AnswerCard({ index, answer }) {
  const [open, setOpen] = useState(index === 0);
  const num = (index + 1).toString().padStart(2, "0");

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: tokens.panel, border: `1px solid ${tokens.rule}` }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-4 p-5 text-left"
      >
        <span
          className="text-sm shrink-0"
          style={{ fontFamily: "'JetBrains Mono', monospace", color: tokens.gold }}
        >
          Q{num}
        </span>
        <span className="flex-1 text-sm md:text-base" style={{ color: tokens.paper }}>
          {answer.question}
        </span>
        {typeof answer.score === "number" && (
          <span
            className="text-xs px-2.5 py-1 rounded-full shrink-0"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              background: tokens.panel2,
              color: tokens.gold,
            }}
          >
            {answer.score}/10
          </span>
        )}
        <span
          className="shrink-0 transition-transform duration-200"
          style={{ color: tokens.dim, transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          ▾
        </span>
      </button>
      {open && (
        <div className="px-5 pb-5 pl-[3.25rem]">
          <p className="text-sm leading-7" style={{ color: tokens.dim }}>
            {answer.answer}
          </p>
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------
   MAIN REPORT
--------------------------------------------------------- */

export default function InterviewReport({ report = sampleReport, downloadPDF, startNewInterview }) {
  const handleDownload = downloadPDF || (() => {});
  const handleNew = startNewInterview || (() => {});

  return (
    <div style={{ background: tokens.ink, minHeight: "100vh", color: tokens.paper }}>
      <style>{fontImports}</style>
      <div className="max-w-4xl mx-auto py-14 px-6" style={{ fontFamily: "'Inter', sans-serif" }}>

        {/* ================= HEADER ================= */}
        <div className="mb-14">
          <div
            className="text-xs uppercase tracking-[0.25em] mb-4"
            style={{ fontFamily: "'JetBrains Mono', monospace", color: tokens.gold }}
          >
            Assessment Report · AI Interview
          </div>
          <h1
            className="text-4xl md:text-5xl leading-tight"
            style={{ fontFamily: "'Fraunces', serif", fontWeight: 500 }}
          >
            Candidate Performance Dossier
          </h1>
          <p className="mt-3 text-sm md:text-base" style={{ color: tokens.dim }}>
            A structured readout of technical depth, communication, and interview conduct.
          </p>
        </div>

        {/* ================= CANDIDATE ================= */}
        <div className="mb-12">
          <SectionLabel n="01">Candidate</SectionLabel>
          <CandidateCard report={report} />
        </div>

        {/* ================= SCORES ================= */}
        <div className="mb-12">
          <SectionLabel n="02">Scores</SectionLabel>
          <div
            className="rounded-2xl p-8 grid md:grid-cols-[auto_1fr] gap-10 items-center"
            style={{ background: tokens.panel, border: `1px solid ${tokens.rule}` }}
          >
            <ScoreDial value={report?.scores?.overall || 0} />
            <div className="space-y-5 w-full">
              <ReadoutBar label="Technical" value={report?.scores?.technical || 0} />
              <ReadoutBar label="Communication" value={report?.scores?.communication || 0} />
              <ReadoutBar label="Confidence" value={report?.scores?.confidence || 0} />
            </div>
          </div>
        </div>

        {/* ================= PERFORMANCE VERDICT ================= */}
        <div className="mb-12">
          <SectionLabel n="03">Verdict</SectionLabel>
          <div
            className="rounded-2xl p-8 flex items-center justify-between gap-6"
            style={{
              background: tokens.panel2,
              border: `1px solid ${tokens.gold}55`,
            }}
          >
            <div>
              <div
                className="text-xs uppercase tracking-[0.2em] mb-2"
                style={{ fontFamily: "'JetBrains Mono', monospace", color: tokens.dim }}
              >
                Recommended Outcome
              </div>
              <h2
                className="text-3xl md:text-4xl"
                style={{ fontFamily: "'Fraunces', serif", color: tokens.gold }}
              >
                {report.performanceLevel}
              </h2>
            </div>
            <div
              className="hidden sm:flex w-16 h-16 rounded-full items-center justify-center shrink-0 text-2xl"
              style={{ border: `2px solid ${tokens.gold}`, color: tokens.gold, fontFamily: "'Fraunces', serif" }}
            >
              ✓
            </div>
          </div>
        </div>

        {/* ================= AI INSIGHTS ================= */}
        <div className="mb-12">
          <SectionLabel n="04">Insights</SectionLabel>
          <div className="grid md:grid-cols-3 gap-5">
            <InsightCard title="Strengths" items={report.strengths || []} accent={tokens.teal} mark="+" />
            <InsightCard title="Weaknesses" items={report.weaknesses || []} accent={tokens.rose} mark="–" />
            <InsightCard title="Recommendations" items={report.recommendations || []} accent={tokens.violet} mark="→" />
          </div>
        </div>

        {/* ================= OVERALL FEEDBACK ================= */}
        <div className="mb-12">
          <SectionLabel n="05">Feedback</SectionLabel>
          <div
            className="rounded-2xl p-8"
            style={{ background: tokens.panel, border: `1px solid ${tokens.rule}` }}
          >
            <p
              className="text-lg leading-8"
              style={{ fontFamily: "'Fraunces', serif", fontWeight: 300, color: tokens.paper }}
            >
              {report.feedback}
            </p>
          </div>
        </div>

        {/* ================= ANSWERS ================= */}
        <div className="mb-16">
          <SectionLabel n="06">Question-Wise Analysis</SectionLabel>
          <div className="space-y-3">
            {(report.answers || []).map((answer, index) => (
              <AnswerCard key={index} index={index} answer={answer} />
            ))}
          </div>
        </div>

        {/* ================= ACTIONS ================= */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={handleDownload}
            className="px-8 py-3 rounded-xl font-medium text-sm transition-opacity hover:opacity-90"
            style={{ background: tokens.gold, color: tokens.ink }}
          >
            Download PDF
          </button>
          <button
            onClick={handleNew}
            className="px-8 py-3 rounded-xl font-medium text-sm transition-colors"
            style={{
              background: "transparent",
              color: tokens.paper,
              border: `1px solid ${tokens.rule}`,
            }}
          >
            Start New Interview
          </button>
        </div>

      </div>
    </div>
  );
}