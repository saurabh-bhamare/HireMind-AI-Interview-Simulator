import React, { useState } from "react";

import { FcGoogle } from "react-icons/fc";

import { signInWithPopup } from "firebase/auth";

import { auth, provider } from "../utils/firebase";

import axios from "axios";

// REDUX
import { useDispatch } from "react-redux";

import { setUser } from "../redux/userSlice";

// ROUTER
import { useNavigate } from "react-router-dom";

// BACKEND URL
const ServerUrl = "https://hiremind-server-syni.onrender.com";

function Auth() {

  // ==========================================
  // STATES
  // ==========================================
  const [isLogin, setIsLogin] = useState(true);

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  const navigate = useNavigate();

  // ==========================================
  // GOOGLE LOGIN
  // ==========================================
  const handleGoogleLogin = async () => {
  try {

    // FIREBASE LOGIN
    const result = await signInWithPopup(
      auth,
      provider
    );

    const user = result.user;

    // SEND USER DATA TO BACKEND
    const response = await axios.post(
      ServerUrl + "/api/auth/google",
      {
        name: user.displayName,
        email: user.email,
      }
    );

    // SAVE TOKEN
    localStorage.setItem(
      "token",
      response.data.token
    );

    // SAVE USER
    localStorage.setItem(
      "user",
      JSON.stringify(response.data.user)
    );

    // REDUX
    dispatch(
      setUser({
        user: response.data.user,
        token: response.data.token,
      })
    );

    alert("Google Login Successful");

    navigate("/");

  } catch (error) {

    console.log(error);

    alert(
      error.response?.data?.message ||
      "Google Login Failed"
    );
  }
};

  // ==========================================
  // LOGIN / SIGNUP
  // ==========================================
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      // API ENDPOINT
      const endpoint = isLogin
        ? "/api/auth/login"
        : "/api/auth/signup";

      // SEND DATA
      const response = await axios.post(
        ServerUrl + endpoint,
        {
          name,
          email,
          password,
        }
      );

      // SAVE TOKEN
      localStorage.setItem(
        "token",
        response.data.token
      );

      // SAVE USER TO REDUX
      dispatch(
        setUser({
          user: response.data.user,
          token: response.data.token,
        })
      );

      alert(
        isLogin
          ? "Login Successful"
          : "Signup Successful"
      );

      // REDIRECT
      navigate("/");

    } catch (error) {
  console.log("ERROR:", error);
  console.log("STATUS:", error.response?.status);
  console.log("DATA:", error.response?.data);

  alert(
    error.response?.data?.message ||
    "Authentication Failed"
  );
}
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-[#111111] border border-gray-800 rounded-2xl p-8 shadow-2xl">

        {/* Logo */}
        <div className="text-center mb-8">

          <h1 className="text-4xl font-bold text-blue-500">
            HireMind
          </h1>

          <p className="text-gray-400 mt-2">
            AI Powered Interview Simulator
          </p>
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-bold text-white mb-6 text-center">

          {isLogin
            ? "Login to your account"
            : "Create new account"}
        </h2>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* NAME */}
          {!isLogin && (
            <div>

              <label className="text-gray-300 text-sm">
                Full Name
              </label>

              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                className="w-full mt-2 px-4 py-3 rounded-xl bg-black border border-gray-700 text-white outline-none focus:border-blue-500"
                required
              />
            </div>
          )}

          {/* EMAIL */}
          <div>

            <label className="text-gray-300 text-sm">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="w-full mt-2 px-4 py-3 rounded-xl bg-black border border-gray-700 text-white outline-none focus:border-blue-500"
              required
            />
          </div>

          {/* PASSWORD */}
          <div>

            <label className="text-gray-300 text-sm">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="w-full mt-2 px-4 py-3 rounded-xl bg-black border border-gray-700 text-white outline-none focus:border-blue-500"
              required
            />
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition py-3 rounded-xl font-semibold text-white"
          >

            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">

          <div className="flex-1 h-[1px] bg-gray-700"></div>

          <span className="text-gray-500 text-sm">
            OR
          </span>

          <div className="flex-1 h-[1px] bg-gray-700"></div>
        </div>

        {/* GOOGLE LOGIN */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white text-black py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
        >

          <FcGoogle size={24} />

          Continue with Google
        </button>

        {/* FOOTER */}
        <p className="text-gray-500 text-sm text-center mt-6">

          {isLogin
            ? "Don’t have an account?"
            : "Already have an account?"}

          <span
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-500 ml-2 cursor-pointer"
          >

            {isLogin ? "Sign Up" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Auth;