// src/pages/Home.jsx

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import InterviewHistory from "../components/InterviewHistory";

import {
  Brain,
  Mic,
  TimerReset,
  Sparkles,
  ArrowRight,
  PlayCircle,
  FileText,
  FileCheck,
  LineChart,
  ChevronDown,
  Quote,
  BarChart3,
  X,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Fonts — a single characterful display face, a quiet body face.     */
/* ------------------------------------------------------------------ */
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Inter:wght@400;500;600&display=swap');

    .font-display { font-family: 'Plus Jakarta Sans', sans-serif; }
    .font-body { font-family: 'Inter', sans-serif; }

    html { scroll-behavior: smooth; }

    a:focus-visible, button:focus-visible {
      outline: 2px solid #818CF8;
      outline-offset: 2px;
      border-radius: 8px;
    }

    @keyframes rise-in {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .rise-in { animation: rise-in 0.4s ease-out both; }

    @media (prefers-reduced-motion: reduce) {
      * { animation-duration: 0.001ms !important; animation-iteration-count: 1 !important; transition-duration: 0.001ms !important; }
    }
  `}</style>
);

/* ------------------------------------------------------------------ */
/* Small reusable bits                                                */
/* ------------------------------------------------------------------ */

function SectionEyebrow({ icon, children }) {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium text-[#A5B4FC] bg-[#1E1B2E] border border-[#312C4D]">
      {icon}
      {children}
    </div>
  );
}

function StepCard({ number, title, desc, icon }) {
  return (
    <div className="bg-[#15161C] border border-[#26272F] rounded-2xl p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-11 h-11 rounded-xl bg-[#1E1B2E] flex items-center justify-center text-[#A5B4FC]">
          {icon}
        </div>
        <span className="font-display text-sm font-bold text-[#5B5F6E]">
          Step {number}
        </span>
      </div>
      <h3 className="font-display text-xl font-bold text-[#F2F3F7]">{title}</h3>
      <p className="font-body text-[#9195A3] mt-3 leading-7">{desc}</p>
    </div>
  );
}

function CapabilityCard({ icon, accent, title, desc }) {
  return (
    <div className="bg-[#15161C] border border-[#26272F] rounded-2xl p-8">
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
        style={{ backgroundColor: `${accent}1F`, color: accent }}
      >
        {icon}
      </div>
      <h3 className="font-display text-lg font-bold text-[#F2F3F7]">{title}</h3>
      <p className="font-body text-[#9195A3] mt-2 leading-7">{desc}</p>
    </div>
  );
}

function TestimonialCard({ initials, role, track, quote }) {
  return (
    <div className="bg-[#15161C] border border-[#26272F] rounded-2xl p-8 flex flex-col h-full">
      <Quote size={20} className="text-[#A5B4FC] mb-4" />
      <p className="font-body text-[#C7CAD4] leading-7 flex-1">"{quote}"</p>
      <div className="flex items-center gap-3 mt-8 pt-6 border-t border-[#26272F]">
        <div className="w-10 h-10 rounded-full bg-[#1E1B2E] text-[#A5B4FC] flex items-center justify-center font-display font-bold text-sm">
          {initials}
        </div>
        <div>
          <p className="font-body text-sm font-semibold text-[#F2F3F7]">{role}</p>
          <p className="font-body text-xs text-[#6B6F80]">{track}</p>
        </div>
      </div>
    </div>
  );
}

function FaqItem({ q, a, open, onToggle }) {
  return (
    <div className="border-b border-[#26272F] py-6">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-6 text-left"
        aria-expanded={open}
      >
        <span className="font-display text-lg font-bold text-[#F2F3F7]">{q}</span>
        <ChevronDown
          size={20}
          className="shrink-0 text-[#6B6F80] transition-transform duration-300"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>
      <div
        className="grid transition-all duration-300 ease-in-out"
        style={{ gridTemplateRows: open ? "1fr" : "0fr", opacity: open ? 1 : 0 }}
      >
        <div className="overflow-hidden">
          <p className="font-body text-[#9195A3] leading-7 mt-4 max-w-2xl">{a}</p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Home() {
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();
  const [showDemo, setShowDemo] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  const handleStartInterview = () => {
  if (!user) {
    navigate("/auth", {
      state: {
        message: "Please login to start an interview.",
      },
    });
    return;
  }

  navigate("/upload");
};

  const steps = [
    {
      title: "Role & experience",
      desc: "Choose your role, company level, and experience so every question fits the interview you're actually walking into.",
      icon: <Brain size={20} />,
    },
    {
      title: "Smart voice interview",
      desc: "The AI asks real technical and HR questions and follows up on your answers, the way a live interviewer would.",
      icon: <Mic size={20} />,
    },
    {
      title: "Timer-based simulation",
      desc: "Coding and HR rounds run against a live countdown, so you feel the same pressure you'll feel in the real room.",
      icon: <TimerReset size={20} />,
    },
  ];

  const capabilities = [
    {
      icon: <Brain size={20} />,
      accent: "#818CF8",
      title: "AI answer evaluation",
      desc: "Every answer is scored live for communication, technical accuracy, and confidence — no waiting for a human reviewer.",
    },
    {
      icon: <FileText size={20} />,
      accent: "#34D399",
      title: "Resume-based interview",
      desc: "Questions are generated from the projects on your resume, so the round stays relevant to what you actually built.",
    },
    {
      icon: <FileCheck size={20} />,
      accent: "#C084FC",
      title: "Downloadable PDF report",
      desc: "Strengths, gaps, and next steps are compiled into a clean report you can keep and share.",
    },
    {
      icon: <LineChart size={20} />,
      accent: "#FBBF24",
      title: "History & analytics",
      desc: "Every session is logged, so you can track score trends and see which topics still need work.",
    },
  ];

  const tracks = [
    "Backend & Systems",
    "Frontend & UI Engineering",
    "Product & Case Rounds",
    "Data & ML",
    "HR & Behavioral",
  ];

  const testimonials = [
    {
      initials: "AS",
      role: "Frontend Engineer",
      track: "Hired · Series B startup",
      quote: "The follow-up questions caught the same gaps a real panel did. I walked into the actual onsite already used to the pressure.",
    },
    {
      initials: "RK",
      role: "New Grad SWE",
      track: "Backend track · 5 sessions",
      quote: "Seeing the timer run out on my first try was uncomfortable — exactly what I needed before it happened for real.",
    },
    {
      initials: "MT",
      role: "Staff Engineer candidate",
      track: "Systems design track",
      quote: "The report broke down exactly where my answers got vague. That's the part no other prep tool gave me.",
    },
  ];

  const faqs = [
    {
      q: "How are the questions generated?",
      a: "Once you upload a resume, HireMind reads the skills and projects on it and builds a question set from your selected role and level — mixed with core questions from that track's bank so the round still covers the fundamentals.",
    },
    {
      q: "Do I need to enable my microphone?",
      a: "Voice rounds use your mic for a natural back-and-forth, but every round also works with typed answers if you'd rather not talk out loud — you can switch anytime before you start.",
    },
    {
      q: "What happens to my resume after the interview?",
      a: "Your resume is used only to generate that session's questions and is tied to your account, not shared or used to train anything outside your own reports.",
    },
    {
      q: "How is the score actually calculated?",
      a: "Each answer is scored on communication, technical accuracy, and confidence signals like pacing and hesitation, then combined into the overall score you see on your report.",
    },
    {
      q: "Can I retry a round if it goes badly?",
      a: "Yes — every session is saved to your history independently, so a rough round doesn't overwrite a good one, and you can start a fresh attempt anytime you have credits.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-[#F2F3F7] font-body">
      <GlobalStyle />

      <Navbar />

      {/* ===================================== */}
      {/* HERO */}
      {/* ===================================== */}
      <section className="px-6 md:px-20 pt-16 pb-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
          {/* LEFT CONTENT */}
          <div>
            <SectionEyebrow icon={<Sparkles size={15} />}>
              AI Interview Simulator
            </SectionEyebrow>

            <h1 className="font-display text-4xl md:text-6xl font-extrabold leading-tight mt-6">
              Practice the interview
              <span className="text-[#818CF8]"> before it counts</span>
            </h1>

            <p className="font-body text-[#9195A3] text-lg leading-8 mt-6 max-w-xl">
              HireMind runs a live, voice-driven interview built from your own resume —
              real technical and HR questions, scored as you answer, with a timer that
              keeps the pressure honest.
            </p>

            <div className="flex flex-wrap gap-4 mt-8">
              <button
                onClick={handleStartInterview}
                className="bg-[#6366F1] hover:bg-[#4F46E5] transition text-white px-7 py-3.5 rounded-xl font-semibold flex items-center gap-2"
              >
                Start interview
                <ArrowRight size={18} />
              </button>

              <button
                onClick={() => setShowDemo(true)}
                className="border border-[#2E303A] hover:border-[#6366F1] hover:bg-[#15161C] transition px-7 py-3.5 rounded-xl font-semibold flex items-center gap-2 text-[#F2F3F7]"
              >
                <PlayCircle size={18} />
                Watch demo
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mt-8">
              {tracks.map((t) => (
                <span
                  key={t}
                  className="text-xs font-medium text-[#9195A3] border border-[#26272F] bg-[#15161C] rounded-full px-3 py-1.5"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* RIGHT — USER DASHBOARD CARD */}
          <div className="bg-[#15161C] border border-[#26272F] rounded-2xl p-7 shadow-2xl shadow-black/40">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-display text-xl font-bold">Welcome back</h3>
                <p className="font-body text-[#9195A3] text-sm mt-1">
                  Your interview dashboard
                </p>
              </div>

              <div className="w-12 h-12 rounded-xl bg-[#6366F1] text-white flex items-center justify-center text-lg font-bold shrink-0">
                {user?.name
                  ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
                  : "GU"}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#0F0F14] border border-[#26272F] rounded-xl p-4">
                <p className="text-[#6B6F80] text-xs font-medium">Candidate</p>
                <p className="font-body text-base font-semibold mt-1 truncate">
                  {user?.name || "Guest User"}
                </p>
              </div>

              <div className="bg-[#0F0F14] border border-[#26272F] rounded-xl p-4">
                <p className="text-[#6B6F80] text-xs font-medium">Credits</p>
                <p className="font-body text-base font-semibold mt-1 text-[#34D399]">
                  {user?.credits || 0}
                </p>
              </div>
            </div>

            {user ? (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <BarChart3 size={18} className="text-[#818CF8]" />
                    <h3 className="font-display text-base font-bold">Recent interviews</h3>
                  </div>

                  <button
                    onClick={() => navigate("/history")}
                    className="text-sm text-[#A5B4FC] hover:underline font-medium"
                  >
                    View all
                  </button>
                </div>

                <InterviewHistory limit={3} />
              </div>
            ) : (
              <div className="mt-6 border border-dashed border-[#2E303A] rounded-xl p-4 flex items-center justify-between gap-4">
                <p className="font-body text-sm text-[#9195A3]">
                  Sign in to see your session history and score trends here.
                </p>
                <button
                  onClick={() => navigate("/auth")}
                  className="text-xs text-[#A5B4FC] hover:underline whitespace-nowrap font-medium"
                >
                  Sign in
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===================================== */}
      {/* INTERVIEW PROCESS */}
      {/* ===================================== */}
      <section className="px-6 md:px-20 py-20 bg-[#0E0E13] border-y border-[#1D1E25]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <SectionEyebrow icon={<Brain size={14} />}>How it works</SectionEyebrow>

            <h2 className="font-display text-3xl md:text-5xl font-extrabold mt-5">
              Your interview journey
            </h2>

            <p className="font-body text-[#9195A3] text-lg mt-4 max-w-2xl mx-auto">
              A complete interview simulation designed to prepare you for real company
              hiring rounds.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((step, index) => (
              <StepCard key={index} number={index + 1} {...step} />
            ))}
          </div>
        </div>
      </section>

      {/* ===================================== */}
      {/* CAPABILITIES */}
      {/* ===================================== */}
      <section className="px-6 md:px-20 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <SectionEyebrow icon={<Sparkles size={14} />}>Powered by AI</SectionEyebrow>

            <h2 className="font-display text-3xl md:text-5xl font-extrabold mt-5">
              Built for the live round
            </h2>

            <p className="font-body text-[#9195A3] text-lg mt-4 max-w-2xl mx-auto">
              Every feature exists to make the simulation feel real — and the feedback
              afterward feel earned.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {capabilities.map((card, i) => (
              <CapabilityCard key={i} {...card} />
            ))}
          </div>

          <div className="mt-8 bg-gradient-to-br from-[#1E1B2E] to-[#15161C] border border-[#26272F] rounded-2xl p-8 flex flex-col lg:flex-row items-center justify-between gap-6">
            <p className="font-body text-lg text-[#E4E5EC]">
              HireMind runs the session live, scores it live, and hands you a report the
              moment it ends.
            </p>

            <button
              onClick={handleStartInterview}
              className="bg-[#6366F1] hover:bg-[#4F46E5] text-white px-7 py-3.5 rounded-xl font-semibold whitespace-nowrap flex items-center gap-2 transition"
            >
              Start your interview <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* ===================================== */}
      {/* SOCIAL PROOF */}
      {/* ===================================== */}
      <section className="px-6 md:px-20 py-20 bg-[#0E0E13] border-y border-[#1D1E25]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <SectionEyebrow icon={<Quote size={14} />}>Session history</SectionEyebrow>

            <h2 className="font-display text-3xl md:text-5xl font-extrabold mt-5">
              What candidates walk away with
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <TestimonialCard key={t.initials} {...t} />
            ))}
          </div>
        </div>
      </section>

      {/* ===================================== */}
      {/* FAQ */}
      {/* ===================================== */}
      <section className="px-6 md:px-20 py-20">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_1.4fr] gap-12">
          <div>
            <SectionEyebrow icon={<Sparkles size={14} />}>Good to know</SectionEyebrow>
            <h2 className="font-display text-3xl md:text-4xl font-extrabold mt-5">
              Frequently asked
            </h2>
            <p className="font-body text-[#9195A3] text-lg mt-4 max-w-sm">
              Everything about how a session runs, what happens to your data, and how
              scoring works.
            </p>
          </div>

          <div>
            {faqs.map((f, i) => (
              <FaqItem
                key={f.q}
                q={f.q}
                a={f.a}
                open={openFaq === i}
                onToggle={() => setOpenFaq(openFaq === i ? -1 : i)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ===================================== */}
      {/* DEMO MODAL */}
      {/* ===================================== */}
      {showDemo && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-5"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-3xl bg-[#15161C] border border-[#26272F] rounded-2xl p-8 shadow-2xl rise-in">
            <button
              onClick={() => setShowDemo(false)}
              aria-label="Close demo"
              className="absolute right-5 top-5 text-[#6B6F80] hover:text-white p-1"
            >
              <X size={22} />
            </button>

            <div className="text-center">
              <div className="mx-auto w-14 h-14 rounded-2xl bg-[#1E1B2E] flex items-center justify-center text-[#A5B4FC] mb-6">
                <PlayCircle size={30} />
              </div>

              <h2 className="font-display text-3xl font-bold mb-4">How HireMind works</h2>

              <p className="font-body text-[#9195A3] text-lg mb-8">
                Experience an AI-powered mock interview with real-time voice interaction,
                AI evaluation, and performance analytics.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-[#0F0F14] border border-[#26272F] rounded-xl p-5">
                <Brain className="text-[#818CF8] mb-3" size={22} />
                <h3 className="font-display font-bold text-base">1. AI interview</h3>
                <p className="font-body text-[#9195A3] mt-2 text-sm">
                  AI generates role-based questions from your resume.
                </p>
              </div>

              <div className="bg-[#0F0F14] border border-[#26272F] rounded-xl p-5">
                <Mic className="text-[#34D399] mb-3" size={22} />
                <h3 className="font-display font-bold text-base">2. Voice round</h3>
                <p className="font-body text-[#9195A3] mt-2 text-sm">
                  Answer naturally using voice recognition.
                </p>
              </div>

              <div className="bg-[#0F0F14] border border-[#26272F] rounded-xl p-5">
                <LineChart className="text-[#FBBF24] mb-3" size={22} />
                <h3 className="font-display font-bold text-base">3. AI report</h3>
                <p className="font-body text-[#9195A3] mt-2 text-sm">
                  Get scores, weaknesses, and improvement tips.
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate("/upload")}
              className="mt-8 w-full bg-[#6366F1] hover:bg-[#4F46E5] text-white py-3.5 rounded-xl font-semibold flex justify-center items-center gap-2 transition"
            >
              Start real interview
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default Home;