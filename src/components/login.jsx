/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { auth, db } from "../firebase";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Briefcase, ArrowLeft } from "lucide-react";

export default function App() {
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [name, setName] = useState("");
const [step, setStep] = useState("split");
const [role, setRole] = useState(null);
const [authMode, setAuthMode] = useState("login");
const handleAuth = async () => {
  try {
    if (authMode === "signup") {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      const uid = res.user.uid;

await fetch("http://localhost:5000/api/user/create", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    uid,
    name,
    email,
    role
  })
});
      

      alert("Signup successful!");
    } else {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login successful!");
    }
  } catch (err) {
    alert(err.message);
  }
};
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl relative min-h-[400px] flex items-center justify-center">
        <AnimatePresence mode="wait">
         

          {step === "split" && (
            <motion.div
              key="split-step"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="w-full grid md:grid-cols-2 gap-6"
            >
              {/* COMPANY CARD */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white rounded-2xl shadow-xl p-8 text-center relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-300 to-yellow-500"></div>
                <div className="mx-auto bg-gray-100 text-black w-16 h-16 rounded-full flex items-center justify-center mb-6">
                  <Briefcase size={28} />
                </div>
                
                <div className="bg-black text-white px-3 py-1 rounded-full text-xs font-medium inline-block mb-4">
                  BUSINESS
                </div>

                <h2 className="text-2xl font-bold mb-3 text-gray-900">
                  For Companies
                </h2>

                <p className="text-gray-500 mb-8 max-w-[250px] mx-auto text-sm">
                  Manage bookings, staff, and grow your business easily.
                </p>

                <button
                  onClick={() => {
                    setRole("provider");
                    setAuthMode("login");
                    setStep("form");
                  }}
                  className="w-full bg-black text-white py-3.5 rounded-xl border-2 border-transparent hover:border-yellow-400 
                  transition-all font-medium"
                >
                  Business Login
                </button>

                <p className="mt-6 text-sm text-gray-500">
                  Don't have an account?{" "}
                  <button 
                    onClick={() => {
                      setRole("provider");
                      setAuthMode("signup");
                      setStep("form");
                    }}
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
                className="bg-white rounded-2xl shadow-xl p-8 text-center relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-blue-600"></div>
                <div className="mx-auto bg-gray-100 text-black w-16 h-16 rounded-full flex items-center justify-center mb-6">
                  <User size={28} />
                </div>

                <h2 className="text-2xl font-bold mb-3 text-gray-900">
                  For Users
                </h2>

                <p className="text-gray-500 mb-8 max-w-[250px] mx-auto text-sm">
                  Book and manage your services effortlessly.
                </p>

                <button
                  onClick={() => {
                    setRole("user");
                    setAuthMode("login");
                    setStep("form");
                  }}
                  className="w-full bg-black text-white py-3.5 rounded-xl border-2 border-transparent hover:border-blue-500 
                  transition-all font-medium"
                >
                  User Login
                </button>

                <p className="mt-6 text-sm text-gray-500">
                  Don't have an account?{" "}
                  <button 
                    onClick={() => {
                      setRole("user");
                      setAuthMode("signup");
                      setStep("form");
                    }}
                    className="text-blue-600 font-semibold cursor-pointer hover:underline"
                  >
                    Sign up
                  </button>
                </p>
              </motion.div>
            </motion.div>
          )}

          {step === "form" && (
            <motion.div
              key="form-step"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className={`w-full max-w-md mx-auto bg-white p-8 rounded-2xl shadow-2xl relative overflow-hidden ${
                role === "user" ? "border-t-4 border-blue-500" : "border-t-4 border-yellow-400"
              }`}
            >
               <button
                  onClick={() => setStep("split")}
                  className="absolute top-6 left-6 text-gray-400 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeft size={20} />
               </button>

              <div className="text-center mb-8 mt-2">
                <div className="mx-auto bg-gray-100 text-black w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  {role === "user" ? <User size={20} /> : <Briefcase size={20} />}
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {authMode === "login" ? "Sign In" : "Create Account"}
                  <span className="block text-base font-medium text-gray-500 mt-1">
                    {role === "user" ? "User Portal" : "Business Portal"}
                  </span>
                </h2>
                <p className="text-gray-500 text-sm mt-3">
                  {authMode === "login" 
                    ? "Welcome back, enter your credentials" 
                    : "Fill in your details to get started"}
                </p>
              </div>

              <form className="flex flex-col gap-4" onSubmit={(e) => {
  e.preventDefault();
  handleAuth();
}}>
                <AnimatePresence>
                  {authMode === "signup" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                      animate={{ opacity: 1, height: "auto", marginBottom: 4 }}
                      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                      className="overflow-hidden"
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        placeholder="Pandu ranga"
                        value={name}
                        onChange={(e) => setName(e.target.value)}

                        className={`w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:bg-white transition-all ${
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

                    className={`w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:bg-white transition-all ${
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

                    className={`w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:bg-white transition-all ${
                      role === "user" ? "focus:ring-blue-500 focus:border-blue-500" : "focus:ring-yellow-400 focus:border-yellow-400"
                    }`}
                  />
                </div>
                
                {authMode === "login" && (
                  <div className="flex justify-end">
                    <button type="button" className={`text-sm font-medium ${role === 'user' ? 'text-blue-600 hover:text-blue-800' : 'text-yellow-600 hover:text-yellow-800'}`}>
                      Forgot password?
                    </button>
                  </div>
                )}

                <button 
                  type="submit" 
                  className={`w-full mt-2 py-3.5 rounded-xl font-semibold transition-all shadow-md
                    ${role === "user" ? "text-white bg-blue-600 hover:bg-blue-700 hover:shadow-blue-600/20" : "text-black bg-yellow-400 hover:bg-yellow-500 hover:shadow-yellow-400/20"}`
                  }
                >
                  {authMode === "login" ? "Sign in to" : "Create"} {role === "user" ? "Account" : "Dashboard"}
                </button>

                <div className="text-center mt-4">
                  <p className="text-sm text-gray-600">
                    {authMode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
                    <button 
                      type="button"
                      onClick={() => setAuthMode(authMode === "login" ? "signup" : "login")}
                      className={`font-semibold hover:underline ${role === 'user' ? 'text-blue-600 hover:text-blue-800' : 'text-yellow-600 hover:text-yellow-800'}`}
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

