import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Trophy, Clock, Database } from 'lucide-react';

const modelData = [
  { name: 'ResNet50', accuracy: 94.5, precision: 93.2, recall: 92.8, f1: 93.0, inferenceTime: 45 },
  { name: 'VGG16', accuracy: 92.1, precision: 91.5, recall: 90.2, f1: 90.8, inferenceTime: 120 },
  { name: 'MobileNetV2', accuracy: 89.8, precision: 88.4, recall: 87.9, f1: 88.1, inferenceTime: 15 },
  { name: 'EfficientNet-B0', accuracy: 95.2, precision: 94.8, recall: 94.1, f1: 94.4, inferenceTime: 28 },
];

export function Benchmarking() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-slate-900">Model Benchmarking</h2>
        <p className="text-slate-500 mt-2">Comparative analysis of hybrid AI agents.</p>
      </header>

      {/* Winner Card */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="w-8 h-8 text-yellow-300" />
            <h3 className="text-2xl font-bold">Best Performing Agent: EfficientNet-B0</h3>
          </div>
          <p className="max-w-2xl text-indigo-100 mb-6">
            EfficientNet-B0 achieved the highest F1-score (94.4%) with an optimal balance of inference speed (28ms). 
            This model is currently deployed as the primary Classification Agent.
          </p>
          <div className="flex gap-6">
            <div className="bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
              <div className="text-xs text-indigo-200">Accuracy</div>
              <div className="text-xl font-bold">95.2%</div>
            </div>
            <div className="bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
              <div className="text-xs text-indigo-200">Inference Time</div>
              <div className="text-xl font-bold">28ms</div>
            </div>
            <div className="bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
              <div className="text-xs text-indigo-200">Model Size</div>
              <div className="text-xl font-bold">21 MB</div>
            </div>
          </div>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4">
          <Database size={300} />
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Accuracy Comparison */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Performance Metrics Comparison</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={modelData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{fontSize: 12}} />
                <YAxis domain={[80, 100]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="accuracy" fill="#6366f1" name="Accuracy %" radius={[4, 4, 0, 0]} />
                <Bar dataKey="f1" fill="#8b5cf6" name="F1-Score %" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Inference Time Comparison */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Clock className="text-slate-400" size={20} />
            Inference Latency (Lower is Better)
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={modelData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12}} />
                <Tooltip />
                <Legend />
                <Bar dataKey="inferenceTime" fill="#f43f5e" name="Time (ms)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Detailed Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="text-lg font-bold text-slate-900">Detailed Benchmarking Results</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium">
              <tr>
                <th className="px-6 py-3">Model Agent</th>
                <th className="px-6 py-3">Accuracy</th>
                <th className="px-6 py-3">Precision</th>
                <th className="px-6 py-3">Recall</th>
                <th className="px-6 py-3">F1-Score</th>
                <th className="px-6 py-3">Inference Time</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {modelData.map((model) => (
                <tr key={model.name} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-900">{model.name}</td>
                  <td className="px-6 py-4">{model.accuracy}%</td>
                  <td className="px-6 py-4">{model.precision}%</td>
                  <td className="px-6 py-4">{model.recall}%</td>
                  <td className="px-6 py-4">{model.f1}%</td>
                  <td className="px-6 py-4">{model.inferenceTime} ms</td>
                  <td className="px-6 py-4">
                    {model.name === 'EfficientNet-B0' ? (
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">Selected</span>
                    ) : (
                      <span className="px-2 py-1 bg-slate-100 text-slate-500 rounded-full text-xs">Archived</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
