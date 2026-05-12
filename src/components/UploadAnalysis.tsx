import React, { useState, useRef, useEffect } from 'react';
import { Upload, Camera as CameraIcon, AlertCircle, CheckCircle, Brain, Activity, MapPin, Shield, RefreshCw, WifiOff, Save, CloudLightning } from 'lucide-react';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { set, get } from 'idb-keyval';
import { AnalysisResult, runDisasterAnalysis } from '../agents/orchestrator';
import { Alert } from '../types';

interface UploadAnalysisProps {
  addAlert?: (alert: Omit<Alert, 'id' | 'timestamp'>) => void;
}

export function UploadAnalysis({ addAlert }: UploadAnalysisProps) {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [location, setLocation] = useState('Sector 4 (Simulated)');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Offline & Camera State
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingImages, setPendingImages] = useState<{ id: string, data: string, timestamp: number }[]>([]);
  const [syncing, setSyncing] = useState(false);

  // Simulated Heatmap State
  const [heatmapUrl, setHeatmapUrl] = useState<string | null>(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Load pending images on mount
    loadPendingImages();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadPendingImages = async () => {
    try {
      const stored = await get('offline_images');
      if (stored) setPendingImages(stored);
    } catch (e) {
      console.error('Failed to load pending images', e);
    }
  };

  const savePendingImage = async (imageData: string) => {
    try {
      const newImage = { id: Date.now().toString(), data: imageData, timestamp: Date.now() };
      const updated = [...pendingImages, newImage];
      await set('offline_images', updated);
      setPendingImages(updated);
      alert('Image saved offline. It will be analyzed when the internet connection is restored.');
      setImage(null); // Clear current
    } catch (e) {
      console.error('Failed to save image offline', e);
      alert('Failed to save image offline.');
    }
  };

  const syncPendingImages = async () => {
    if (!isOnline || pendingImages.length === 0) return;
    setSyncing(true);
    
    try {
      // For MVP, we just take the first pending image and run analysis on it
      // In a real app, we'd loop through all and process them in background
      const imgToProcess = pendingImages[0];
      setImage(imgToProcess.data);
      
      // Remove from queue
      const updated = pendingImages.slice(1);
      await set('offline_images', updated);
      setPendingImages(updated);
      
      // Run analysis
      await runAnalysisForImage(imgToProcess.data);
    } catch (e) {
      console.error('Sync failed', e);
      alert('Failed to sync pending images.');
    } finally {
      setSyncing(false);
    }
  };

  const handleTakePhoto = async () => {
    try {
      const photo = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera
      });
      
      if (photo.dataUrl) {
        setImage(photo.dataUrl);
        setResult(null);
        setHeatmapUrl(null);
      }
    } catch (e) {
      console.error('Camera error:', e);
      // User cancelled or camera not available
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
        setHeatmapUrl(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Simulate Grad-CAM generation
  const generateSimulatedHeatmap = (originalImage: string, regions?: { ymin: number; xmin: number; ymax: number; xmax: number }[]) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = originalImage;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // 1. Draw black background (low activation)
      ctx.fillStyle = '#000033'; // Deep blue/black
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. Identify regions of interest
      // If no regions returned, fallback to center to show "general attention"
      const activeRegions = (regions && regions.length > 0) 
        ? regions 
        : [{ ymin: 200, xmin: 200, ymax: 800, xmax: 800 }];

      // 3. Draw "Heat" blobs
      activeRegions.forEach(region => {
        // Convert 0-1000 scale to pixels
        const x = (region.xmin / 1000) * canvas.width;
        const y = (region.ymin / 1000) * canvas.height;
        const w = ((region.xmax - region.xmin) / 1000) * canvas.width;
        const h = ((region.ymax - region.ymin) / 1000) * canvas.height;
        
        const cx = x + w / 2;
        const cy = y + h / 2;
        // Radius based on region size
        const radius = Math.max(w, h) * 0.6;

        // Create radial gradient for "activation"
        const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
        grd.addColorStop(0, "rgba(255, 0, 0, 0.9)");     // Red (Hot)
        grd.addColorStop(0.4, "rgba(255, 255, 0, 0.6)"); // Yellow
        grd.addColorStop(0.7, "rgba(0, 255, 255, 0.3)"); // Cyan/Greenish
        grd.addColorStop(1, "rgba(0, 0, 50, 0)");        // Fade to transparent

        ctx.fillStyle = grd;
        ctx.globalCompositeOperation = 'screen'; // Additive blending for multiple regions
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
        ctx.fill();
      });

      setHeatmapUrl(canvas.toDataURL());
    };
  };

  const runAnalysisForImage = async (imgData: string) => {
    setLoading(true);
    try {
      // 1. Run Client-Side Agents
      const analysisResult = await runDisasterAnalysis(imgData, location);
      setResult(analysisResult);
      
      // Pass regions to heatmap generator
      generateSimulatedHeatmap(imgData, analysisResult.classification.regions);

      // 2. If Alert Triggered, Save to Backend and Update State
      if (analysisResult.alertData) {
        if (addAlert) {
          addAlert(analysisResult.alertData as any);
        }

        // Trigger Amber Alert style notification for High/Critical severity
        if (analysisResult.alertData.severity === 'Critical' || analysisResult.alertData.severity === 'High') {
          try {
            const permStatus = await LocalNotifications.requestPermissions();
            if (permStatus.display === 'granted') {
              // Create a high-priority channel for Android
              await LocalNotifications.createChannel({
                id: 'emergency-alerts',
                name: 'Emergency Alerts',
                description: 'Critical disaster alerts',
                importance: 5, // 5 = MAX importance (heads-up notification)
                visibility: 1, // Public
                vibration: true,
                lights: true,
                lightColor: '#FF0000'
              });

              await LocalNotifications.schedule({
                notifications: [
                  {
                    title: `🚨 EMERGENCY ALERT: ${analysisResult.alertData.type}`,
                    body: `Severity: ${analysisResult.alertData.severity.toUpperCase()}. Location: ${analysisResult.alertData.location}. Please take immediate precautions.`,
                    id: Math.floor(Math.random() * 100000),
                    schedule: { at: new Date(Date.now() + 1000) }, // Trigger in 1 second
                    channelId: 'emergency-alerts',
                  }
                ]
              });
            }
          } catch (e) {
            console.error('Notification error:', e);
          }
        }

        // Only try to fetch if online
        if (navigator.onLine) {
          try {
            await fetch('/api/alerts', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(analysisResult.alertData),
            });
          } catch (e) {
            console.error('Failed to post alert to backend', e);
          }
        }
      }

    } catch (error) {
      console.error(error);
      alert('Analysis failed. See console.');
    } finally {
      setLoading(false);
    }
  };

  const runAnalysis = async () => {
    if (!image) return;
    
    if (!isOnline) {
      await savePendingImage(image);
      return;
    }

    await runAnalysisForImage(image);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 bg-slate-50 min-h-screen">
      <header>
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Disaster Image Classification</h2>
            <p className="text-sm md:text-base text-slate-500 mt-2">AI-powered disaster detection with visual model explanations</p>
          </div>
          {!isOnline && (
            <div className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full flex items-center gap-2 text-sm font-bold border border-amber-200">
              <WifiOff size={16} /> Offline Mode
            </div>
          )}
        </div>
      </header>

      {/* Offline Sync Banner */}
      {isOnline && pendingImages.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3 text-blue-800">
            <CloudLightning className="text-blue-600" />
            <div>
              <p className="font-bold">You are back online!</p>
              <p className="text-sm text-blue-600">You have {pendingImages.length} image(s) saved offline ready for analysis.</p>
            </div>
          </div>
          <button 
            onClick={syncPendingImages}
            disabled={syncing}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {syncing ? 'Syncing...' : 'Sync Now'}
          </button>
        </div>
      )}

      <div className="bg-white p-4 md:p-8 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <CameraIcon className="text-teal-600" /> Capture or Upload
          </h3>
          <button 
            onClick={handleTakePhoto}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 transition-colors text-sm"
          >
            <CameraIcon size={16} /> Take Photo
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Area */}
          <div className="space-y-4">
            <div 
              className="border-2 border-dashed border-slate-300 rounded-xl h-80 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer relative overflow-hidden group"
              onClick={() => fileInputRef.current?.click()}
            >
              {image ? (
                <img src={image} alt="Preview" className="w-full h-full object-contain" />
              ) : (
                <>
                  <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Upload className="w-8 h-8 text-teal-600" />
                  </div>
                  <p className="text-lg font-medium text-slate-700">Click to upload or drag and drop</p>
                  <p className="text-sm text-slate-400 mt-1">JPG, PNG, JPEG up to 10MB</p>
                </>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleImageUpload} 
              />
            </div>
            
            <button
              onClick={runAnalysis}
              disabled={!image || loading}
              className={`w-full py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 ${
                !image || loading 
                  ? 'bg-slate-300 cursor-not-allowed' 
                  : isOnline 
                    ? 'bg-teal-600 hover:bg-teal-700 shadow-lg shadow-teal-200'
                    : 'bg-amber-600 hover:bg-amber-700 shadow-lg shadow-amber-200'
              }`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analyzing...
                </>
              ) : isOnline ? (
                <>
                  <Brain size={20} /> Predict & Generate Heatmap
                </>
              ) : (
                <>
                  <Save size={20} /> Save for Later (Offline)
                </>
              )}
            </button>
          </div>

          {/* Preview / Placeholder */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 h-80 flex items-center justify-center text-slate-400">
             {image ? (
               <div className="text-center">
                 <img src={image} alt="Preview" className="max-h-64 mx-auto rounded-lg shadow-sm" />
                 <p className="mt-4 text-sm font-medium">Image Loaded</p>
               </div>
             ) : (
               <div className="text-center">
                 <CameraIcon size={48} className="mx-auto mb-2 opacity-50" />
                 <p>Image preview will appear here</p>
               </div>
             )}
          </div>
        </div>
      </div>

      {/* Results Section */}
      {result && (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-8">
          
          {/* Prediction Card */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-6">
              <Activity className="text-teal-600" />
              <h3 className="text-xl font-bold text-slate-800">Prediction Result</h3>
            </div>
            
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">Top Prediction</p>
                  <h2 className="text-4xl font-bold text-slate-900 mt-1">{result.classification.type}</h2>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">Confidence</p>
                  <p className="text-4xl font-bold text-teal-600">{(result.classification.confidence * 100).toFixed(2)}%</p>
                </div>
              </div>
              
              <div className="w-full bg-slate-200 h-4 rounded-full overflow-hidden">
                <div 
                  className="bg-teal-600 h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${result.classification.confidence * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="mt-6 flex gap-4">
               <button 
                 onClick={() => { setImage(null); setResult(null); }}
                 className="px-6 py-3 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 transition-colors flex items-center gap-2"
               >
                 <RefreshCw size={18} /> Analyse Another Image
               </button>
            </div>
          </div>

          {/* Impact & Loss Assessment Card */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-6">
              <Shield className="text-rose-600" />
              <h3 className="text-xl font-bold text-slate-800">Impact & Loss Assessment</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-rose-50 p-4 rounded-xl border border-rose-100">
                <p className="text-sm text-rose-600 font-bold uppercase tracking-wider mb-1">Humanitarian Severity</p>
                <p className="text-2xl font-bold text-rose-900">{result.classification.humanitarianSeverity || 'N/A'}</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                <p className="text-sm text-orange-600 font-bold uppercase tracking-wider mb-1">Damage Severity</p>
                <p className="text-2xl font-bold text-orange-900">{result.classification.damageSeverity || 'N/A'}</p>
              </div>
            </div>
            
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <h4 className="font-bold text-slate-800 mb-2">Loss Acquisition Analysis</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                {result.classification.lossExplanation || "No loss explanation available."}
              </p>
            </div>
          </div>

          {/* Explainable AI / Grad-CAM Section */}
          <div className="bg-white p-4 md:p-8 rounded-2xl shadow-sm border border-slate-100">
            <div className="mb-8">
              <h3 className="text-xl md:text-2xl font-bold text-slate-900">Visual Explanation</h3>
              <p className="text-slate-500">Comparison of uploaded image, Grad-CAM heatmap, and final overlay.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Original */}
              <div className="space-y-3">
                <div className="aspect-square bg-slate-100 rounded-xl overflow-hidden border border-slate-200 relative">
                  <img src={image!} alt="Original" className="w-full h-full object-cover" />
                </div>
                <p className="font-bold text-slate-700 text-center">Original Image</p>
              </div>

              {/* Object Detection (From Dashboard) */}
              <div className="space-y-3">
                <div className="aspect-square bg-slate-100 rounded-xl overflow-hidden border border-slate-200 relative">
                  <img src={image!} alt="Object Detection" className="w-full h-full object-cover" />
                  {result.classification.regions && result.classification.regions.map((region, idx) => (
                    <div
                      key={idx}
                      className="absolute border-2 border-red-500 bg-red-500/20 flex items-start justify-start"
                      style={{
                        top: `${(region.ymin / 1000) * 100}%`,
                        left: `${(region.xmin / 1000) * 100}%`,
                        width: `${((region.xmax - region.xmin) / 1000) * 100}%`,
                        height: `${((region.ymax - region.ymin) / 1000) * 100}%`,
                      }}
                    >
                      <span className="bg-red-600 text-white text-[10px] px-1 font-bold shadow-sm">
                        {region.label}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="font-bold text-slate-700 text-center">AI Object Detection</p>
              </div>

              {/* Heatmap (Simulated) */}
              <div className="space-y-3">
                <div className="aspect-square bg-slate-900 rounded-xl overflow-hidden border border-slate-200 relative">
                  {heatmapUrl ? (
                    <img src={heatmapUrl} alt="Grad-CAM Heatmap" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-tr from-blue-900 via-red-500 to-yellow-300 opacity-80 blur-xl scale-110"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-white font-bold opacity-50">Processing...</p>
                      </div>
                    </>
                  )}
                </div>
                <p className="font-bold text-slate-700 text-center">Grad-CAM Heatmap</p>
              </div>

              {/* Overlay */}
              <div className="space-y-3">
                <div className="aspect-square bg-slate-100 rounded-xl overflow-hidden border border-slate-200 relative">
                  <img src={image!} alt="Original" className="w-full h-full object-cover absolute inset-0" />
                  {heatmapUrl && (
                    <img src={heatmapUrl} alt="Overlay" className="w-full h-full object-cover absolute inset-0 opacity-60 mix-blend-screen" />
                  )}
                  {!heatmapUrl && (
                     <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/40 via-red-500/40 to-yellow-300/40 mix-blend-overlay"></div>
                  )}
                </div>
                <p className="font-bold text-slate-700 text-center">Overlay Visualization</p>
              </div>
            </div>

            <div className="mt-8 p-6 bg-indigo-50 rounded-xl border border-indigo-100 shadow-sm">
              <h4 className="font-bold text-indigo-900 mb-3 flex items-center gap-2 text-lg">
                <Brain className="text-indigo-600" size={24} /> 
                Model Attention Analysis
              </h4>
              <div className="bg-white p-4 rounded-lg border border-indigo-100">
                <p className="text-slate-700 text-base leading-relaxed font-medium">
                  {result.classification.explanation || "No explanation provided by the model."}
                </p>
              </div>
              <p className="text-xs text-indigo-400 mt-2 italic">
                * This explanation is generated based on visual features identified by the AI model.
              </p>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
