import React from "react";

import { Link } from "react-router-dom";

import { Mail, MapPin, Rocket, Zap } from "lucide-react";

/* ------------------------------------------------------------------ */
/* Same control-room tokens as Home.jsx / Navbar.jsx                  */
/* ------------------------------------------------------------------ */
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700;900&family=JetBrains+Mono:wght@400;500;600&display=swap');
    .font-display { font-family: 'Space Grotesk', sans-serif; }
    .font-mono-data { font-family: 'JetBrains Mono', monospace; }
  `}</style>
);

function Footer() {
  return (
    <footer className="relative bg-[#06070A] border-t border-[#1F2430] text-[#EDEFF3] px-6 md:px-8 py-14">
      <GlobalStyle />

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-40 bg-[#5B6EFF]/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto grid md:grid-cols-3 gap-12">
        {/* Brand */}
        <div>
          <Link to="/" className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-[#5B6EFF]/15 border border-[#5B6EFF]/30 flex items-center justify-center text-[#5B6EFF]">
              <Zap size={16} />
            </div>
            <h1 className="font-display text-2xl font-bold">
              Hire<span className="text-[#5B6EFF]">Mind</span>
            </h1>
          </Link>

          <p className="text-[#8891A0] leading-7">
            A real-time AI interview simulator helping students practice
            coding rounds, HR interviews, and placement prep with live,
            adaptive AI.
          </p>

          <div className="inline-flex items-center gap-2 mt-6 bg-[#111318] border border-[#1F2430] px-3 py-1.5 rounded-full">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#35D399] opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#35D399]" />
            </span>
            <span className="font-mono-data text-[10px] tracking-widest text-[#35D399]">
              ALL SYSTEMS LIVE
            </span>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="font-display text-sm uppercase tracking-widest text-[#8891A0] mb-5">
            Quick Links
          </h2>

          <div className="flex flex-col gap-3 text-[#C7CBD4]">
            <Link to="/" className="hover:text-[#5B6EFF] transition">
              Home
            </Link>

            <Link to="/auth" className="hover:text-[#5B6EFF] transition">
              Login
            </Link>

            <Link to="/" className="hover:text-[#5B6EFF] transition">
              Dashboard
            </Link>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h2 className="font-display text-sm uppercase tracking-widest text-[#8891A0] mb-5">
            Contact
          </h2>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-[#C7CBD4]">
              <div className="w-8 h-8 rounded-lg bg-[#111318] border border-[#1F2430] flex items-center justify-center text-[#5B6EFF] shrink-0">
                <Mail size={14} />
              </div>
              <span className="font-mono-data text-sm break-all">
                bhamaresaurabh982@gmail.com
              </span>
            </div>

            <div className="flex items-center gap-3 text-[#C7CBD4]">
              <div className="w-8 h-8 rounded-lg bg-[#111318] border border-[#1F2430] flex items-center justify-center text-[#35D399] shrink-0">
                <MapPin size={14} />
              </div>
              <span className="text-sm">Maharashtra, India</span>
            </div>

            <div className="flex items-center gap-3 text-[#C7CBD4]">
              <div className="w-8 h-8 rounded-lg bg-[#111318] border border-[#1F2430] flex items-center justify-center text-[#FFB454] shrink-0">
                <Rocket size={14} />
              </div>
              <span className="text-sm">MERN Stack Developer</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="relative border-t border-[#1F2430] mt-12 pt-6 text-center">
        <p className="font-mono-data text-xs text-[#8891A0]">
          © 2026 HireMind. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;