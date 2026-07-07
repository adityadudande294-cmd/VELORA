"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const { login, register, isOnline } = useAuth();
  
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authName, setAuthName] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  if (!isOpen) return null;

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);
    try {
      if (authMode === "login") {
        await login(authEmail, authPassword);
      } else {
        await register(authName, authEmail, authPassword);
      }
      if (onSuccess) onSuccess();
      onClose();
      setAuthName("");
      setAuthEmail("");
      setAuthPassword("");
    } catch (err: any) {
      setAuthError(err.message || "Authentication failed");
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in font-sans">
      <div className="bg-[#0b0c12] border border-white/10 w-full max-w-sm rounded-3xl p-6 relative shadow-2xl space-y-6 text-left">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
        >
          <X size={18} />
        </button>

        <div className="space-y-1">
          <span className="text-[10px] text-[#e5c158] uppercase font-bold tracking-widest block">Secure Connect</span>
          <h3 className="text-xl font-light text-white tracking-wide uppercase" style={{ fontFamily: "Cinzel, serif" }}>
            {authMode === "login" ? "Welcome back" : "Create Account"}
          </h3>
          <p className="text-xs text-zinc-500 font-light">
            {authMode === "login" ? "Sign in to synchronize your reading streaks & notes" : "Register to back up your personal library in the cloud"}
          </p>
        </div>

        {authError && (
          <div className="bg-red-950/40 border border-red-500/30 text-red-400 text-xs px-3 py-2.5 rounded-xl font-light">
            {authError}
          </div>
        )}

        {!isOnline && (
          <div className="bg-amber-950/40 border border-amber-500/30 text-amber-400 text-xs px-3 py-2 rounded-xl font-light">
            ⚠️ Backend server is offline. Falling back to local offline mode.
          </div>
        )}

        <form onSubmit={handleAuthSubmit} className="space-y-4 text-zinc-300">
          {authMode === "register" && (
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-zinc-500">Your Name</label>
              <input
                type="text"
                required
                placeholder="Enter your name"
                value={authName}
                onChange={(e) => setAuthName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 focus:border-[#e5c158]/50 rounded-xl px-3 py-2 text-xs focus:outline-none text-white transition-colors"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-zinc-500">Email Address</label>
            <input
              type="email"
              required
              placeholder="Enter email"
              value={authEmail}
              onChange={(e) => setAuthEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 focus:border-[#e5c158]/50 rounded-xl px-3 py-2 text-xs focus:outline-none text-white transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-zinc-500">Password</label>
            <input
              type="password"
              required
              placeholder="Enter password"
              value={authPassword}
              onChange={(e) => setAuthPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 focus:border-[#e5c158]/50 rounded-xl px-3 py-2 text-xs focus:outline-none text-white transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={authLoading}
            className="w-full bg-[#0088ff] hover:bg-blue-500 disabled:bg-zinc-700 text-white text-xs font-semibold py-3 rounded-xl shadow-lg transition-colors pt-2.5 cursor-pointer"
          >
            {authLoading ? "Synchronizing..." : authMode === "login" ? "Sign In & Sync" : "Create Account & Sync"}
          </button>
        </form>

        <div className="text-center pt-2">
          <button
            onClick={() => {
              setAuthMode(authMode === "login" ? "register" : "login");
              setAuthError("");
            }}
            className="text-[10px] text-zinc-500 hover:text-white uppercase tracking-wider transition-colors cursor-pointer"
          >
            {authMode === "login" ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
}
