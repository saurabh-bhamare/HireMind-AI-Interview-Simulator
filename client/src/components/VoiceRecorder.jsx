import React, { useRef, useState } from "react";

function VoiceRecorder({ onResult }) {
  const recognitionRef = useRef(null);

  const [listening, setListening] = useState(false);

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = true;

    recognitionRef.current = recognition;

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onresult = (event) => {
      let transcript = "";

      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {
        transcript += event.results[i][0].transcript;
      }

      onResult(transcript);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
  };

  return (
    <div className="flex gap-4">
      {!listening ? (
        <button
          onClick={startListening}
          className="bg-green-600 px-5 py-3 rounded-xl"
        >
          🎤 Start Speaking
        </button>
      ) : (
        <button
          onClick={stopListening}
          className="bg-red-600 px-5 py-3 rounded-xl"
        >
          Stop
        </button>
      )}
    </div>
  );
}

export default VoiceRecorder;