import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Step2Interview from "../components/Step2Interview";

export default function InterviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [interviewData, setInterviewData] = useState(null);

  useEffect(() => {
    fetchInterview();
  }, [id]);

  const fetchInterview = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `http://localhost:8000/api/interview/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Interview Data:", res.data.interview);

      setInterviewData(res.data.interview);
    } catch (err) {
      console.log(err);
      alert("Failed to load interview.");
    }
  };

  // ==========================
  // AI Voice
  // ==========================
  const speakQuestion = (text) => {
  if (!text) return;

  window.speechSynthesis.cancel();

  const speech = new SpeechSynthesisUtterance(text);

  speech.lang = "en-US";
  speech.rate = 0.9;
  speech.pitch = 1;
  speech.volume = 1;

  const voices = window.speechSynthesis.getVoices();

  const englishVoice =
    voices.find((voice) => voice.lang === "en-US") ||
    voices.find((voice) => voice.lang.startsWith("en"));

  if (englishVoice) {
    speech.voice = englishVoice;
  }

  speech.onstart = () => console.log("Speaking...");
  speech.onend = () => console.log("Finished");
  speech.onerror = (e) => console.log(e);

  window.speechSynthesis.speak(speech);
};

window.speechSynthesis.onvoiceschanged = () => {
  window.speechSynthesis.getVoices();
};

  const handleComplete = () => {
  navigate(`/interview/report/${id}`);
};

  if (!interviewData) {
    return (
      <div className="min-h-screen bg-black flex justify-center items-center text-white text-2xl">
        Loading Interview...
      </div>
    );
  }

  return (
    <Step2Interview
      interviewData={interviewData}
      onComplete={handleComplete}
      speakQuestion={speakQuestion}
    />
  );
}