import React, { useState } from 'react';
import { Shield, Lock, User, ArrowRight, CheckCircle, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { UserRole } from '../types';

interface LoginProps {
  onLogin: (role: UserRole) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [role, setRole] = useState<UserRole>('operator');
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      onLogin(role);
      setLoading(false);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        
        {/* Left Side - Info Panel */}
        <div className="md:w-1/2 bg-slate-50 p-8 md:p-12 flex flex-col justify-center relative overflow-hidden order-2 md:order-1">
          <div className="relative z-10 space-y-8">
            <div className="flex items-center gap-2 mb-4 md:mb-8">
              <Shield className="w-8 h-8 text-teal-600" />
              <span className="text-xl font-bold text-slate-800">DisasterAI</span>
            </div>
            
            <div className="space-y-6 hidden md:block">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Trusted Protection</h3>
                  <p className="text-sm text-slate-500 mt-1">Secure sign-in for emergency teams and response analysts.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                  <Activity className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Monitoring Access</h3>
                  <p className="text-sm text-slate-500 mt-1">Track zones, maps, alerts, and ML classification in one place.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Role-Based Access</h3>
                  <p className="text-sm text-slate-500 mt-1">Use your account credentials to access authorized workflows.</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Decorative Circles */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-teal-50 rounded-full mix-blend-multiply filter blur-xl opacity-70 hidden md:block"></div>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-blue-50 rounded-full mix-blend-multiply filter blur-xl opacity-70 hidden md:block"></div>
        </div>

        {/* Right Side - Login Form */}
        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white order-1 md:order-2">
          <div className="max-w-md mx-auto w-full">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Welcome Back</h2>
            <p className="text-sm md:text-base text-slate-500 mb-8">Sign in to continue to your flood monitoring dashboard.</p>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                <div className="relative">
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all bg-slate-50 appearance-none"
                  >
                    <option value="admin">Admin</option>
                    <option value="operator">Emergency Operator</option>
                    <option value="viewer">Viewer</option>
                  </select>
                  <User className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all bg-slate-50"
                  placeholder="Enter username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all bg-slate-50"
                    placeholder="••••••••"
                  />
                  <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="remember" className="rounded border-slate-300 text-teal-600 focus:ring-teal-500" />
                  <label htmlFor="remember" className="text-slate-600">Remember me</label>
                </div>
                <a href="#" className="text-teal-600 font-medium hover:underline">Forgot password?</a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-teal-600 text-white py-3 rounded-xl font-bold hover:bg-teal-700 transition-all shadow-lg shadow-teal-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing In...
                  </>
                ) : (
                  <>
                    <ArrowRight size={20} /> Sign In
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center text-sm text-slate-500">
              New User? <Link to="/register" className="text-teal-600 font-medium hover:underline">Create account</Link>
            </div>
            
            <div className="mt-4 text-center">
               <Link to="/" className="text-xs text-slate-400 hover:text-slate-600">Back to Home</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

