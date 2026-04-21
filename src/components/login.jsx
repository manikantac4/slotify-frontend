/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { auth, db } from "../firebase";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from "firebase/auth";
import API from "../api/axios";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Briefcase, ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";


export default function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [step, setStep] = useState("split");
  const [role, setRole] = useState(null);
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState("login");
  const [toast, setToast] = useState(null); // { type: "success" | "error", message: string }
  const [loading, setLoading] = useState(false);
  useEffect(() => {
  const uid = localStorage.getItem("userId");

  if (uid) {
    API.get(`/user/${uid}`)
      .then(async (res) => {
        const user = res.data;

        if (user.role === "provider") {
          const shopRes = await API.get(`/shop/my-shop/${uid}`);
          const shop = shopRes.data;

          if (shop) {
            localStorage.setItem("shopId", shop._id);
            navigate("/providerdashboard");
          } else {
            navigate("/details");
          }

        } else {
          navigate("/customer-dashboard");
        }
      })
      .catch(() => {
        localStorage.removeItem("userId");
      });
  }
}, []);
  const showToast = (type, message) => {
    setToast({ type, message });
    if (type === "error") {
      setTimeout(() => setToast(null), 4000);
    }
  };

  const handleAuth = async () => {
    setLoading(true);
    setToast(null);
    try {
      if (authMode === "signup") {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const uid = res.user.uid;

        await API.post("/user/create", { uid, name, email, role });

        localStorage.setItem("userId", uid);
        showToast("success", "Account created! Redirecting to dashboard...");

        setTimeout(() => {
          if (role === "provider") {
            navigate("/details");
          } else {
            navigate("/customer-dashboard");
          }
        }, 1500);

      } else {
        const res = await signInWithEmailAndPassword(auth, email, password);
        const uid = res.user.uid;

        const userRes = await API.get(`/user/${uid}`);
        const user = userRes.data;

        localStorage.setItem("userId", uid);
        showToast("success", "Login successful! Redirecting to dashboard...");

        setTimeout(async () => {
          if (user.role === "provider") {
            const shopRes = await API.get(`/shop/my-shop/${uid}`);
            const shop = shopRes.data;
           if (shop) {
  localStorage.setItem("shopId", shop._id); // ✅ correct
  navigate("/providerdashboard");
}else {
              navigate("/details");
            }
          } else {
            navigate("/customer-dashboard");
          }
        }, 1500);
      }
    } catch (err) {
      const friendlyError = err.code
        ? err.code.replace("auth/", "").replace(/-/g, " ")
        : err.message;
      showToast("error", friendlyError.charAt(0).toUpperCase() + friendlyError.slice(1));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6">

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-sm font-medium max-w-xs w-full
              ${toast.type === "success" 
                ? "bg-green-50 border border-green-200 text-green-800" 
                : "bg-red-50 border border-red-200 text-red-800"}`}
          >
            {toast.type === "success" 
              ? <CheckCircle size={18} className="text-green-500 shrink-0" /> 
              : <XCircle size={18} className="text-red-500 shrink-0" />}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-4xl relative min-h-[400px] flex items-center justify-center">
        <AnimatePresence mode="wait">

          {/* SPLIT SCREEN */}
          {step === "split" && (
            <motion.div
              key="split-step"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="w-full grid grid-cols-1 md:grid-cols-2 gap-5"
            >
              {/* COMPANY CARD */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 text-center relative overflow-hidden hover:-translate-y-1 transition-transform duration-300"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-300 to-yellow-500" />
                <div className="mx-auto bg-gray-100 text-black w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-5">
                  <Briefcase size={26} />
                </div>
                <div className="bg-black text-white px-3 py-1 rounded-full text-xs font-medium inline-block mb-3">
                  BUSINESS
                </div>
                <h2 className="text-xl sm:text-2xl font-bold mb-2 text-gray-900">For Companies</h2>
                <p className="text-gray-500 mb-6 max-w-[240px] mx-auto text-sm">
                  Manage bookings, staff, and grow your business easily.
                </p>
                <button
                  onClick={() => { setRole("provider"); setAuthMode("login"); setStep("form"); }}
                  className="w-full bg-black text-white py-3 sm:py-3.5 rounded-xl border-2 border-transparent hover:border-yellow-400 transition-all font-medium text-sm sm:text-base"
                >
                  Business Login
                </button>
                <p className="mt-5 text-sm text-gray-500">
                  Don't have an account?{" "}
                  <button
                    onClick={() => { setRole("provider"); setAuthMode("signup"); setStep("form"); }}
                    className="text-yellow-600 font-semibold cursor-pointer hover:underline"
                  >
                    Sign up
                  </button>
                </p>
              </motion.div>

              {/* USER CARD */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 text-center relative overflow-hidden hover:-translate-y-1 transition-transform duration-300"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-blue-600" />
                <div className="mx-auto bg-gray-100 text-black w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-5">
                  <User size={26} />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold mb-2 text-gray-900">For Users</h2>
                <p className="text-gray-500 mb-6 max-w-[240px] mx-auto text-sm">
                  Book and manage your services effortlessly.
                </p>
                <button
                  onClick={() => { setRole("user"); setAuthMode("login"); setStep("form"); }}
                  className="w-full bg-black text-white py-3 sm:py-3.5 rounded-xl border-2 border-transparent hover:border-blue-500 transition-all font-medium text-sm sm:text-base"
                >
                  User Login
                </button>
                <p className="mt-5 text-sm text-gray-500">
                  Don't have an account?{" "}
                  <button
                    onClick={() => { setRole("user"); setAuthMode("signup"); setStep("form"); }}
                    className="text-blue-600 font-semibold cursor-pointer hover:underline"
                  >
                    Sign up
                  </button>
                </p>
              </motion.div>
            </motion.div>
          )}

          {/* FORM */}
          {step === "form" && (
            <motion.div
              key="form-step"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className={`w-full max-w-md mx-auto bg-white p-6 sm:p-8 rounded-2xl shadow-2xl relative overflow-hidden ${
                role === "user" ? "border-t-4 border-blue-500" : "border-t-4 border-yellow-400"
              }`}
            >
              <button
                onClick={() => { setToast(null); setStep("split"); }}
                className="absolute top-5 left-5 text-gray-400 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft size={20} />
              </button>

              <div className="text-center mb-6 mt-2">
                <div className="mx-auto bg-gray-100 text-black w-11 h-11 rounded-full flex items-center justify-center mb-3">
                  {role === "user" ? <User size={18} /> : <Briefcase size={18} />}
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  {authMode === "login" ? "Sign In" : "Create Account"}
                  <span className="block text-sm font-medium text-gray-500 mt-1">
                    {role === "user" ? "User Portal" : "Business Portal"}
                  </span>
                </h2>
                <p className="text-gray-500 text-sm mt-2">
                  {authMode === "login"
                    ? "Welcome back, enter your credentials"
                    : "Fill in your details to get started"}
                </p>
              </div>

              <form
                className="flex flex-col gap-4"
                onSubmit={(e) => { e.preventDefault(); handleAuth(); }}
              >
                <AnimatePresence>
                  {authMode === "signup" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        placeholder="Pandu ranga"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={`w-full p-3 sm:p-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:bg-white transition-all text-sm sm:text-base ${
                          role === "user" ? "focus:ring-blue-500 focus:border-blue-500" : "focus:ring-yellow-400 focus:border-yellow-400"
                        }`}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full p-3 sm:p-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:bg-white transition-all text-sm sm:text-base ${
                      role === "user" ? "focus:ring-blue-500 focus:border-blue-500" : "focus:ring-yellow-400 focus:border-yellow-400"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full p-3 sm:p-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:bg-white transition-all text-sm sm:text-base ${
                      role === "user" ? "focus:ring-blue-500 focus:border-blue-500" : "focus:ring-yellow-400 focus:border-yellow-400"
                    }`}
                  />
                </div>

                {authMode === "login" && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className={`text-sm font-medium ${role === "user" ? "text-blue-600 hover:text-blue-800" : "text-yellow-600 hover:text-yellow-800"}`}
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full mt-1 py-3 sm:py-3.5 rounded-xl font-semibold transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed
                    ${role === "user"
                      ? "text-white bg-blue-600 hover:bg-blue-700"
                      : "text-black bg-yellow-400 hover:bg-yellow-500"}`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Processing...
                    </>
                  ) : (
                    `${authMode === "login" ? "Sign in to" : "Create"} ${role === "user" ? "Account" : "Dashboard"}`
                  )}
                </button>

                <div className="text-center mt-2">
                  <p className="text-sm text-gray-600">
                    {authMode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
                    <button
                      type="button"
                      onClick={() => { setToast(null); setAuthMode(authMode === "login" ? "signup" : "login"); }}
                      className={`font-semibold hover:underline ${role === "user" ? "text-blue-600 hover:text-blue-800" : "text-yellow-600 hover:text-yellow-800"}`}
                    >
                      {authMode === "login" ? "Sign up" : "Sign in"}
                    </button>
                  </p>
                </div>
              </form>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}