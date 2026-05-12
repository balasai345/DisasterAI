import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Activity, Brain, BarChart3, Globe, Zap, Users, ArrowRight } from 'lucide-react';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 bg-white shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Shield className="w-8 h-8 text-teal-600" />
          <span className="text-xl font-bold text-slate-800">DisasterAI</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a href="#home" className="hover:text-teal-600 transition-colors">Home</a>
          <a href="#about" className="hover:text-teal-600 transition-colors">About</a>
          <a href="#features" className="hover:text-teal-600 transition-colors">Features</a>
          <a href="#technology" className="hover:text-teal-600 transition-colors">Technology</a>
          <a href="#impact" className="hover:text-teal-600 transition-colors">Impact</a>
        </div>
        <Link to="/login" className="px-6 py-2 bg-teal-600 text-white rounded-full font-medium hover:bg-teal-700 transition-colors flex items-center gap-2">
          <Users size={18} />
          Register
        </Link>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative px-8 py-20 lg:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 z-10">
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight text-slate-900">
              Hybrid AI and Intelligent <br />
              <span className="text-teal-600">Agent Approach</span>
            </h1>
            <h2 className="text-2xl text-slate-500 font-light">
              Disaster Risk Analysis and Management
            </h2>
            <p className="text-lg text-slate-600 max-w-xl leading-relaxed">
              Leveraging cutting-edge artificial intelligence and intelligent agent systems to predict, analyze, and manage disaster risks with unprecedented accuracy and speed.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/login" className="px-8 py-4 bg-teal-600 text-white rounded-lg font-bold text-lg hover:bg-teal-700 transition-all shadow-lg shadow-teal-200 flex items-center gap-2">
                Get Started <ArrowRight size={20} />
              </Link>
              <Link to="/login" className="px-8 py-4 bg-white text-teal-600 border-2 border-teal-100 rounded-lg font-bold text-lg hover:border-teal-600 transition-all flex items-center gap-2">
                <Users size={20} /> Login Now
              </Link>
            </div>
          </div>
          
          {/* Hero Visual */}
          <div className="relative z-10 flex justify-center">
            <div className="relative w-[500px] h-[500px]">
              {/* Radar/Circle Animation */}
              <div className="absolute inset-0 border border-slate-200 rounded-full animate-[spin_10s_linear_infinite]"></div>
              <div className="absolute inset-12 border border-slate-200 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
              <div className="absolute inset-24 border border-slate-200 rounded-full animate-[spin_20s_linear_infinite]"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 bg-teal-50 rounded-full flex items-center justify-center shadow-inner">
                  <div className="w-32 h-32 bg-teal-100 rounded-full flex items-center justify-center animate-pulse">
                    <Shield className="w-16 h-16 text-teal-600" />
                  </div>
                </div>
              </div>
              {/* Orbiting Dots */}
              <div className="absolute top-0 left-1/2 w-4 h-4 bg-red-500 rounded-full -translate-x-1/2 -translate-y-2 shadow-lg shadow-red-200"></div>
              <div className="absolute bottom-1/4 right-0 w-3 h-3 bg-orange-500 rounded-full shadow-lg shadow-orange-200"></div>
              <div className="absolute top-1/3 left-0 w-3 h-3 bg-blue-500 rounded-full shadow-lg shadow-blue-200"></div>
            </div>
          </div>
        </div>
        
        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-50/50 -skew-x-12 translate-x-32 -z-0"></div>
      </section>

      {/* About / Features Grid */}
      <section id="features" className="px-8 py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">About Our Approach</h2>
            <p className="text-slate-500 mt-4 max-w-2xl mx-auto">
              Revolutionizing disaster management through intelligent systems that combine deep learning, agent-based logic, and real-time analytics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                <Brain className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Hybrid Intelligence</h3>
              <p className="text-slate-600 leading-relaxed">
                Combining multiple AI approaches including machine learning, deep learning, and expert systems for comprehensive disaster analysis.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-teal-50 rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Intelligent Agents</h3>
              <p className="text-slate-600 leading-relaxed">
                Autonomous agents that continuously monitor, analyze, and respond to emerging disaster risks in real-time.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-purple-50 rounded-xl flex items-center justify-center mb-6">
                <BarChart3 className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Predictive Analytics</h3>
              <p className="text-slate-600 leading-relaxed">
                Advanced algorithms that forecast disaster probabilities and potential impact zones with high accuracy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Grid */}
      <section className="px-8 py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Key Features</h2>
            <p className="text-slate-500 mt-4">Comprehensive tools for disaster risk management</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Global Monitoring', icon: Globe, color: 'bg-blue-500' },
              { title: 'Real-time Alerts', icon: Zap, color: 'bg-orange-500' },
              { title: 'Risk Mapping', icon: Activity, color: 'bg-red-500' },
              { title: 'Resource Management', icon: Users, color: 'bg-teal-500' },
              { title: 'Historical Analysis', icon: BarChart3, color: 'bg-indigo-500' },
              { title: 'Mobile Integration', icon: Shield, color: 'bg-pink-500' },
            ].map((feature, idx) => (
              <div key={idx} className="flex items-start gap-4 p-6 rounded-xl border border-slate-100 hover:border-teal-100 hover:bg-teal-50/30 transition-colors group">
                <div className={`w-10 h-10 rounded-lg ${feature.color} flex items-center justify-center flex-shrink-0 text-white shadow-md`}>
                  <feature.icon size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1 group-hover:text-teal-700 transition-colors">{feature.title}</h4>
                  <p className="text-xs text-slate-500">Advanced capabilities for disaster response.</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-teal-500" />
            <span className="text-lg font-bold text-white">DisasterAI</span>
          </div>
          <p className="text-sm">© 2026 DisasterAI. All rights reserved. | Hybrid Intelligent Systems</p>
        </div>
      </footer>
    </div>
  );
}
