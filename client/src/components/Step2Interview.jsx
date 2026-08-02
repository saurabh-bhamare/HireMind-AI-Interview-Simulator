import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Webcam from "react-webcam";
import toast from "react-hot-toast";
import {
  loadFaceLandmarker,
  getLandmarker,
} from "../utils/faceDetection";


function Step2Interview({
  interviewData,
  onComplete,
  speakQuestion,
}) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [answers, setAnswers] = useState([]);
  const [answer, setAnswer] = useState("");
  const [faceDetected, setFaceDetected] = useState(true);
  const [eyeAlert, setEyeAlert] = useState("");

  const webcamRef = useRef(null);

  const [cameraOn, setCameraOn] = useState(true);

  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);

  const questions =
    interviewData?.questions?.length > 0
      ? interviewData.questions.map((q) => q.question)
      : ["Tell me about yourself."];

  // ===============================
  // Speak Question Automatically
  // ===============================
 useEffect(() => {
  speakQuestion(questions[currentQuestion]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [currentQuestion]);

  // ===============================
  // Timer
  // ===============================
  useEffect(() => {
    if (timeLeft <= 0) {
      handleNextQuestion();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  // ===============================
  // Reset Timer
  // ===============================
  useEffect(() => {
    setTimeLeft(60);
  }, [currentQuestion]);


  const [detectorReady, setDetectorReady] = useState(false);

useEffect(() => {
  const loadModel = async () => {
    await loadFaceLandmarker();
    setDetectorReady(true);
    console.log("✅ Face Landmarker Loaded");
  };

  loadModel();
}, []);

useEffect(() => {
  if (!cameraOn || !detectorReady) return;

  const interval = setInterval(() => {
    detectFace();
  }, 800);

  return () => clearInterval(interval);
}, [cameraOn, detectorReady]);

useEffect(() => {
  loadFaceLandmarker();
}, []);

useEffect(() => {
  const interval = setInterval(() => {
    detectEyes();
  }, 1000);

  return () => clearInterval(interval);
}, []);

   // =========================
  // SPEECH RECOGNITION
  // =========================
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognitionInstance = new SpeechRecognition();

    recognitionInstance.lang = "en-US";
    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = true;

    recognitionInstance.onstart = () => {
      setIsListening(true);
    };

    recognitionInstance.onend = () => {
      setIsListening(false);
    };

    recognitionInstance.onresult = (event) => {
      let transcript = "";

      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript + " ";
      }

      setAnswer(transcript);
    };

    setRecognition(recognitionInstance);
  }, []);

  // =========================
  // START LISTENING
  // =========================
  const startListening = () => {
    if (recognition) {
      recognition.start();
    }
  };

  // =========================
  // STOP LISTENING
  // =========================
  const stopListening = () => {
    if (recognition) {
      recognition.stop();
    }
  };


  const detectFace = async () => {
  try {
    const detector = getDetector();

    if (!detector) return;

    const video = webcamRef.current?.video;

    if (!video) return;

    if (video.readyState !== 4) return;

    const detections = detector.detectForVideo(
      video,
      performance.now()
    );

    if (detections.detections.length === 0) {

      if (faceDetected) {
        setFaceDetected(false);

        toast.error("⚠ Face not detected!");
      }

    } else {

      if (!faceDetected) {
        setFaceDetected(true);

        toast.success("✅ Face detected");
      }

    }

  } catch (err) {
    console.log(err);
  }
};


const detectEyes = () => {
  const landmarker = getLandmarker();

  if (!landmarker) return;

  if (!webcamRef.current?.video) return;

  const video = webcamRef.current.video;

  if (video.readyState !== 4) return;

  const result = landmarker.detectForVideo(
    video,
    performance.now()
  );

  if (result.faceLandmarks.length === 0) return;

  const landmarks = result.faceLandmarks[0];

  // Nose tip landmark
  const nose = landmarks[1];

  if (nose.x < 0.35) {
    setEyeAlert("👀 Looking Left");
  }
  else if (nose.x > 0.65) {
    setEyeAlert("👀 Looking Right");
  }
  else {
    setEyeAlert("✅ Looking Forward");
  }
};

  // ===============================
  // Next Question
  // ===============================
  const handleNextQuestion = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `https://hiremind-server-syni.onrender.com/api/interview/answer/${interviewData._id}`,
        {
          questionIndex: currentQuestion,
          answer: answer || "No Answer",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedAnswers = [
        ...answers,
        {
          question: questions[currentQuestion],
          answer: answer || "No Answer",
        },
      ];

      setAnswers(updatedAnswers);
      setAnswer("");

      if (currentQuestion === questions.length - 1) {
  window.speechSynthesis.cancel();
  onComplete();
  return;
}

      setCurrentQuestion((prev) => prev + 1);
    } catch (error) {
      console.log(error);
      alert("Failed to submit answer.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 py-10">

      {eyeAlert && (
  <div className="fixed top-5 left-1/2 -translate-x-1/2 bg-yellow-500 text-black px-6 py-3 rounded-xl shadow-lg z-50">
    {eyeAlert}
  </div>
)}
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-block px-5 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm font-semibold mb-5">
            STEP 2
          </div>

          <h1 className="text-4xl md:text-5xl font-bold">
            Smart AI Interview
          </h1>

          <p className="text-gray-400 mt-4 text-lg">
            Real-time AI powered interview simulation
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">

          {/* Left */}
          <div className="bg-[#111111] border border-gray-800 rounded-[32px] p-8">

            <div className="bg-black border border-gray-800 rounded-3xl overflow-hidden h-[300px]">
  {cameraOn ? (
    <Webcam
      ref={webcamRef}
      audio={false}
      mirrored
      className="w-full h-full object-cover"
      videoConstraints={{
        width: 1280,
        height: 720,
        facingMode: "user",
      }}
    />
  ) : (
    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xl">
      📷 Camera Off
    </div>
  )}
</div>



<button
  onClick={() => setCameraOn(!cameraOn)}
  className="mt-5 w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-semibold"
>
  {cameraOn ? "Turn Camera Off" : "Turn Camera On"}
</button>

            <div className="mt-6 flex flex-wrap gap-4">

              <div className="bg-black border border-gray-800 px-5 py-3 rounded-2xl">
                <p className="text-gray-500 text-sm">Role</p>
                <p className="font-semibold">
                  {interviewData.jobRole}
                </p>
              </div>

              <div className="bg-black border border-gray-800 px-5 py-3 rounded-2xl">
                <p className="text-gray-500 text-sm">Experience</p>
                <p className="font-semibold">
                  {interviewData.experience}
                </p>
              </div>

              <div className="bg-black border border-gray-800 px-5 py-3 rounded-2xl">
                <p className="text-gray-500 text-sm">Difficulty</p>
                <p className="font-semibold">
                  {interviewData.difficulty}
                </p>
              </div>

            </div>

          </div>

          {/* Right */}
          <div className="bg-[#111111] border border-gray-800 rounded-[32px] p-8">

            <div className="flex justify-between items-center mb-8">

              <div>
                <p className="text-gray-400">Question</p>

                <h2 className="text-2xl font-bold text-blue-400">
                  {currentQuestion + 1}/{questions.length}
                </h2>
              </div>

              <div className="w-20 h-20 rounded-full border-4 border-blue-500 flex items-center justify-center text-2xl font-bold">
                {timeLeft}
              </div>

            </div>

            <div className="bg-black border border-gray-800 rounded-3xl p-6">

              <h3 className="text-xl leading-9">
                {questions[currentQuestion]}
              </h3>

            </div>

            {isListening && (
  <p className="text-green-400 mt-3 animate-pulse">
    🎤 Listening...
  </p>
)}

            <textarea
              rows="8"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full mt-6 bg-black border border-gray-700 rounded-3xl px-5 py-5 text-white outline-none focus:border-blue-500 resize-none"
              placeholder="Write your answer here..."
            />

            <div className="flex gap-4 mt-4">
  <button
    onClick={startListening}
    className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-xl"
  >
    🎤 Start Speaking
  </button>

  <button
    onClick={stopListening}
    className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-xl"
  >
    ⏹ Stop
  </button>
</div>

            <button
              onClick={handleNextQuestion}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 py-4 rounded-2xl font-semibold text-lg"
            >
              {currentQuestion === questions.length - 1
                ? "Finish Interview"
                : "Next Question"}
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}

export default Step2Interview;