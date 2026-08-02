import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import html2pdf from "html2pdf.js";
import { useNavigate, useParams } from "react-router-dom";

import {
  FaUserGraduate,
  FaDownload,
  FaRedo,
  FaBrain,
  FaCheckCircle,
  FaTimesCircle,
  FaLightbulb,
  FaChartLine,
  FaRegClock,
  FaCalendarAlt,
  FaArrowRight,
  FaPlus,
  FaMinus,
  FaChevronDown,
  FaShareAlt,
} from "react-icons/fa";

import { motion, AnimatePresence } from "framer-motion";

import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const ServerUrl = "https://hiremind-server-syni.onrender.com";

/* ---------------------------------------------------------
   DESIGN TOKENS
   ink #101019  panel #1A1B26  panel2 #21222F
   paper #EDEDF2  dim #9296A8  rule #2C2E40
   gold #D9B15C  teal #4FAE9E  rose #D9636B  violet #8C87D8
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
.pdf-hide {
  display: flex;
}

/* Stop html2pdf from slicing a card in half across a page boundary —
   the whole block is pushed to the next page instead of being cut. */
.pdf-avoid-break {
  page-break-inside: avoid;
  break-inside: avoid;
  -webkit-column-break-inside: avoid;
}

/* While the report is being captured for PDF export, force the
   desktop-width grid/flex layout regardless of the real viewport,
   so mobile screens don't collapse into a single stacked column
   (which changes card heights and breaks pagination). */
.pdf-capturing .pdf-force-row {
  display: flex !important;
  flex-direction: row !important;
}
.pdf-capturing .pdf-force-grid-3 {
  display: grid !important;
  grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
}
.pdf-capturing .pdf-force-grid-scores {
  display: grid !important;
  grid-template-columns: auto 1fr !important;
}
`;

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.5, ease: "easeOut" },
  }),
};

/* ---------------------------------------------------------
   SAMPLE DATA — used until the API responds, or if the
   backend doesn't send every field (component degrades
   gracefully either way).
--------------------------------------------------------- */
const sampleReport = {
  candidate: {
    name: "Priya Nair",
    role: "Senior Frontend Engineer",
    date: "July 24, 2026",
    duration: "38 min",
  },
  overallScore: 82,
  confidence: 78,
  communication: 74,
  technical: 88,
  problemSolving: 80,
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
      candidateAnswer:
        "I'd start by profiling with the React DevTools flamegraph, then look at memoization, windowing for long lists, and whether state is scoped too high in the tree.",
      score: 9,
      keywords: ["memoization", "windowing", "profiling"],
    },
    {
      question: "Describe a time you disagreed with a technical decision.",
      answer:
        "I raised concerns about a client-side caching approach in a design review, proposed an alternative with cache invalidation rules, and we ran a short spike to compare both.",
      score: 7,
      keywords: ["conflict resolution", "caching"],
    },
    {
      question: "How would you design a rate limiter for a public API?",
      answer:
        "I'd use a token bucket per API key, backed by Redis for shared state across instances, with a sliding window fallback for burst traffic.",
      score: 5,
      keywords: ["rate limiting", "Redis", "scalability"],
    },
  ],
};

/* ---------------------------------------------------------
   PRIMITIVES
--------------------------------------------------------- */

function SectionLabel({ n, icon, children }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <span
        className="text-xs tracking-widest"
        style={{ fontFamily: "'JetBrains Mono', monospace", color: tokens.gold }}
      >
        {n}
      </span>
      <span className="h-px flex-1" style={{ background: tokens.rule }} />
      {icon}
      <span
        className="text-xs uppercase tracking-[0.2em]"
        style={{ fontFamily: "'JetBrains Mono', monospace", color: tokens.dim }}
      >
        {children}
      </span>
    </div>
  );
}

function ReadoutBar({ label, value, color }) {
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
          {value}%
        </span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: tokens.panel2 }}>
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${value}%`, background: color }}
        />
      </div>
    </div>
  );
}

function InsightCard({ title, items, accent, icon }) {
  return (
    <div
      className="rounded-2xl p-6 pdf-avoid-break"
      style={{ background: tokens.panel, border: `1px solid ${tokens.rule}` }}
    >
      <div className="flex items-center gap-2 mb-5">
        <span style={{ color: accent }}>{icon}</span>
        <h3
          className="text-sm uppercase tracking-[0.15em]"
          style={{ fontFamily: "'JetBrains Mono', monospace", color: accent }}
        >
          {title}
        </h3>
      </div>
      <ul className="space-y-3">
        {(!items || items.length === 0) && (
          <li className="text-sm" style={{ color: tokens.dim }}>
            Nothing recorded.
          </li>
        )}
        {(items || []).map((item, i) => (
          <li key={i} className="flex gap-3 text-sm leading-relaxed" style={{ color: tokens.paper }}>
            <FaArrowRight className="shrink-0 mt-1" size={10} style={{ color: accent }} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AnswerCard({ index, answer, forceOpen }) {
  const [manualOpen, setManualOpen] = useState(index === 0);
  // While forceOpen is true (e.g. during PDF export) the card is shown
  // fully expanded regardless of the user's manual toggle state, so the
  // full answer text is always present in the exported PDF.
  const open = forceOpen || manualOpen;
  const num = (index + 1).toString().padStart(2, "0");
  const score = typeof answer.score === "number" ? answer.score : null;
  const strong = score !== null && score >= 6;

  return (
    <div
      className="rounded-2xl overflow-hidden pdf-avoid-break"
      style={{ background: tokens.panel, border: `1px solid ${tokens.rule}` }}
    >
      <button
        onClick={() => setManualOpen(!manualOpen)}
        className="w-full flex items-center gap-4 p-5 text-left"
      >
        <span
          className="text-sm shrink-0"
          style={{ fontFamily: "'JetBrains Mono', monospace", color: tokens.gold }}
        >
          Q{num}
        </span>
        <span className="flex-1 text-sm md:text-base font-medium" style={{ color: tokens.paper }}>
          {answer.question}
        </span>
        {score !== null && (
          <span className="flex items-center gap-1.5 shrink-0">
            {strong ? (
              <FaCheckCircle style={{ color: tokens.teal }} />
            ) : (
              <FaTimesCircle style={{ color: tokens.rose }} />
            )}
            <span
              className="text-xs"
              style={{ fontFamily: "'JetBrains Mono', monospace", color: tokens.dim }}
            >
              {score}/10
            </span>
          </span>
        )}
        <motion.span animate={{ rotate: open ? 180 : 0 }} style={{ color: tokens.dim }}>
          <FaChevronDown size={12} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <div className="px-5 pb-5 pl-[3.25rem]">
              <p className="text-sm leading-7" style={{ color: tokens.dim }}>
  {answer.candidateAnswer || answer.answer || "No Answer Provided"}
</p>
              {answer.keywords && answer.keywords.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {answer.keywords.map((kw, i) => (
                    <span
                      key={i}
                      className="text-xs px-2.5 py-1 rounded-full"
                      style={{
                        background: tokens.panel2,
                        color: tokens.dim,
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------------------------------------------------------
   MAIN REPORT
--------------------------------------------------------- */

function Step3Report({ onRestart }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const interviewId = id;

  // Ref around the WHOLE page (used for on-screen display only)
  const reportRef = useRef();
  // Ref around ONLY the sections that should appear in the PDF:
  // Candidate, Scores, Verdict, Insights, AI Feedback, Question-wise Analysis
  const pdfContentRef = useRef();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  // When true, every AnswerCard renders fully expanded so the PDF
  // always contains the complete text of every user answer.
  const [expandAllForPdf, setExpandAllForPdf] = useState(false);

  useEffect(() => {
    const generateReport = async () => {
      console.log("REPORT INTERVIEW ID:", interviewId);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.post(
          `${ServerUrl}/api/interview/report/${interviewId}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setReport(res.data.report);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    generateReport();
  }, [interviewId]);

  const handleDownload = async () => {
    const el = pdfContentRef.current;
    if (!el) return;

    setDownloading(true);
    // Force every question's answer open so the exported PDF always
    // contains the full text, not just whatever was expanded on screen.
    setExpandAllForPdf(true);
    // Switches on the .pdf-force-row / .pdf-force-grid-* CSS overrides so
    // the layout used for capture is always the desktop layout, even if
    // the user is on a narrow/mobile screen — keeps card shapes consistent
    // so pagination doesn't cut through them unpredictably.
    el.classList.add("pdf-capturing");

    // Wait for React to re-render with everything expanded (and for the
    // accordion open animation to finish) before html2canvas takes its
    // snapshot, otherwise it will capture the mid-animation/collapsed state.
    await new Promise((resolve) => setTimeout(resolve, 400));

    try {
      await html2pdf()
        .from(el)
        .set({
          margin: 0.4,
          filename: `interview-report-${interviewId}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: {
            scale: 2,
            backgroundColor: "#101019",
            // Render as if the browser window were desktop-width so the
            // md: Tailwind breakpoints apply during capture regardless of
            // the device the user is actually downloading from.
            windowWidth: 1024,
          },
          // Respect .pdf-avoid-break: never slice a card in half between
          // two pages — push the whole block onto the next page instead.
          pagebreak: { mode: ["css", "legacy"], avoid: ".pdf-avoid-break" },
          jsPDF: {
            unit: "in",
            format: "a4",
            orientation: "portrait",
          },
        })
        .save();
    } finally {
      el.classList.remove("pdf-capturing");
      setExpandAllForPdf(false);
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: "Interview Report", url });
      } else {
        await navigator.clipboard.writeText(url);
      }
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-4"
        style={{ background: tokens.ink, color: tokens.paper }}
      >
        <style>{fontImports}</style>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2.2, ease: "linear" }}
        >
          <FaBrain size={34} style={{ color: tokens.gold }} />
        </motion.div>
        <p
          className="text-sm uppercase tracking-[0.2em]"
          style={{ fontFamily: "'JetBrains Mono', monospace", color: tokens.dim }}
        >
          Generating AI Report…
        </p>
      </div>
    );
  }

  const data = report || sampleReport;
  const candidate = data.candidate || {};
  const initials = (candidate.name || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div style={{ background: tokens.ink, minHeight: "100vh", color: tokens.paper }}>
      <style>{fontImports}</style>
      <div
        ref={reportRef}
        className="max-w-4xl mx-auto py-14 px-6"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {/* ================= HEADER (screen only, excluded from PDF) ================= */}
        <motion.div
          className="mb-12"
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0}
        >
          <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
            <div
              className="flex items-center gap-2 text-xs uppercase tracking-[0.25em]"
              style={{ fontFamily: "'JetBrains Mono', monospace", color: tokens.gold }}
            >
              <FaUserGraduate />
              Assessment Report · AI Interview
            </div>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-full"
              style={{ border: `1px solid ${tokens.rule}`, color: tokens.dim }}
            >
              <FaShareAlt size={11} />
              Share
            </button>
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
        </motion.div>

        {/* ============================================================
            EVERYTHING INSIDE pdfContentRef IS WHAT GETS EXPORTED TO PDF
           ============================================================ */}
        <div ref={pdfContentRef}>
          {/* ================= CANDIDATE ================= */}
          <motion.div
            className="mb-12"
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={1}
          >
            <SectionLabel n="01" icon={<FaUserGraduate style={{ color: tokens.dim }} />}>
              Candidate
            </SectionLabel>
            <div
              className="rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-6 pdf-avoid-break pdf-force-row"
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
                  {candidate.name || "Candidate"}
                </h2>
                <p className="text-sm mt-1" style={{ color: tokens.dim }}>
                  {candidate.role || "Role not specified"}
                </p>
              </div>
              <div className="flex gap-6 text-sm">
                <div>
                  <div
                    className="flex items-center gap-1.5 text-xs uppercase tracking-widest mb-1"
                    style={{ color: tokens.dim }}
                  >
                    <FaCalendarAlt size={10} /> Date
                  </div>
                  <div
                    style={{ color: tokens.paper, fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    {candidate.date || "—"}
                  </div>
                </div>
                <div>
                  <div
                    className="flex items-center gap-1.5 text-xs uppercase tracking-widest mb-1"
                    style={{ color: tokens.dim }}
                  >
                    <FaRegClock size={10} /> Duration
                  </div>
                  <div
                    style={{ color: tokens.paper, fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    {candidate.duration || "—"}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ================= SCORES ================= */}
          <motion.div
            className="mb-12"
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={2}
          >
            <SectionLabel n="02" icon={<FaChartLine style={{ color: tokens.dim }} />}>
              Scores
            </SectionLabel>
            <div
              className="rounded-2xl p-8 grid md:grid-cols-[auto_1fr] gap-10 items-center pdf-avoid-break pdf-force-grid-scores"
              style={{ background: tokens.panel, border: `1px solid ${tokens.rule}` }}
            >
              <div className="w-44 mx-auto">
                <CircularProgressbar
                  value={data.overallScore || 0}
                  text={`${data.overallScore || 0}%`}
                  styles={buildStyles({
                    pathColor: tokens.gold,
                    trailColor: tokens.panel2,
                    textColor: tokens.paper,
                    textSize: "18px",
                  })}
                />
                <p
                  className="text-center text-xs uppercase tracking-[0.2em] mt-4"
                  style={{ fontFamily: "'JetBrains Mono', monospace", color: tokens.dim }}
                >
                  Overall Score
                </p>
              </div>

              <div className="space-y-5 w-full">
                <ReadoutBar label="Confidence" value={data.confidence || 0} color={tokens.teal} />
                <ReadoutBar label="Communication" value={data.communication || 0} color={tokens.violet} />
                <ReadoutBar label="Technical" value={data.technical || 0} color={tokens.rose} />
                {typeof data.problemSolving === "number" && (
                  <ReadoutBar label="Problem Solving" value={data.problemSolving} color={tokens.gold} />
                )}
              </div>
            </div>
          </motion.div>

          {/* ================= VERDICT ================= */}
          {data.performanceLevel && (
            <motion.div
              className="mb-12"
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={3}
            >
              <SectionLabel n="03" icon={<FaCheckCircle style={{ color: tokens.dim }} />}>
                Verdict
              </SectionLabel>
              <div
                className="rounded-2xl p-8 flex items-center justify-between gap-6 pdf-avoid-break"
                style={{ background: tokens.panel2, border: `1px solid ${tokens.gold}55` }}
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
                    {data.performanceLevel}
                  </h2>
                </div>
                <div
                  className="hidden sm:flex w-16 h-16 rounded-full items-center justify-center shrink-0 text-2xl"
                  style={{ border: `2px solid ${tokens.gold}`, color: tokens.gold, fontFamily: "'Fraunces', serif" }}
                >
                  ✓
                </div>
              </div>
            </motion.div>
          )}

          {/* ================= INSIGHTS ================= */}
          <motion.div
            className="mb-12"
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={4}
          >
            <SectionLabel n="04" icon={<FaLightbulb style={{ color: tokens.dim }} />}>
              Insights
            </SectionLabel>
            <div className="grid md:grid-cols-3 gap-5 pdf-force-grid-3">
              <InsightCard
                title="Strengths"
                items={data.strengths}
                accent={tokens.teal}
                icon={<FaPlus size={12} />}
              />
              <InsightCard
                title="Weaknesses"
                items={data.weaknesses}
                accent={tokens.rose}
                icon={<FaMinus size={12} />}
              />
              <InsightCard
                title="Recommendations"
                items={data.recommendations}
                accent={tokens.violet}
                icon={<FaArrowRight size={12} />}
              />
            </div>
          </motion.div>

          {/* ================= AI FEEDBACK ================= */}
          <motion.div
            className="mb-12"
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={5}
          >
            <SectionLabel n="05" icon={<FaBrain style={{ color: tokens.dim }} />}>
              AI Feedback
            </SectionLabel>
            <div
              className="rounded-2xl p-8 pdf-avoid-break"
              style={{ background: tokens.panel, border: `1px solid ${tokens.rule}` }}
            >
              <p
                className="text-lg leading-8"
                style={{ fontFamily: "'Fraunces', serif", fontWeight: 300, color: tokens.paper }}
              >
                {data.feedback}
              </p>
            </div>
          </motion.div>

          {/* ================= ANSWERS ================= */}
          <motion.div
            className="mb-16"
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={6}
          >
            <SectionLabel n="06" icon={<FaChartLine style={{ color: tokens.dim }} />}>
              Question-Wise Analysis
            </SectionLabel>
            <div className="space-y-3">
              {(data.answers || []).map((a, i) => (
                <AnswerCard key={i} index={i} answer={a} forceOpen={expandAllForPdf} />
              ))}
            </div>
          </motion.div>
        </div>
        {/* ============== END OF pdfContentRef WRAPPER ============== */}

        {/* ================= ACTIONS (screen only, excluded from PDF) ================= */}
        <motion.div
          className="pdf-hide flex flex-col sm:flex-row justify-center gap-4"
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={7}
        >
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-medium text-sm transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ background: tokens.gold, color: tokens.ink }}
          >
            <FaDownload />
            {downloading ? "Preparing PDF…" : "Download PDF"}
          </button>

          <button
  onClick={() => {
    console.log("Starting new interview...");
    navigate("/upload", { replace: true });
  }}
  className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-medium text-sm"
  style={{
    background: "transparent",
    color: tokens.paper,
    border: `1px solid ${tokens.rule}`,
  }}
>
  <FaRedo />
  New Interview
</button>
        </motion.div>
      </div>
    </div>
  );
}

export default Step3Report;