import { GoogleGenAI } from "@google/genai";

// Initialize Gemini
// Note: In a real "Hybrid" system, this agent would load a specific .pth model (ResNet/VGG).
// For this MVP, we use Gemini Vision to simulate the "Best Performing Model" inference.

export interface AnalysisResult {
  classification: {
    type: string;
    confidence: number;
    explanation: string;
    regions?: { ymin: number; xmin: number; ymax: number; xmax: number; label: string }[];
    humanitarianSeverity?: 'Low' | 'Medium' | 'High' | 'Critical';
    damageSeverity?: 'Low' | 'Medium' | 'High' | 'Critical';
    lossExplanation?: string;
  };
  risk: {
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
    zone: string;
    score: number;
  };
  decision: {
    alertTriggered: boolean;
    notifiedStakeholders: string[];
  };
  alertData?: {
    type: string;
    severity: string;
    location: string;
    confidence: number;
    image_data: string;
    status: string;
    explanation?: string;
    regions?: { ymin: number; xmin: number; ymax: number; xmax: number; label: string }[];
  };
}

// --- 1. Classification Agent ---
async function classificationAgent(imageBase64: string): Promise<AnalysisResult['classification']> {
  try {
    // Prioritize real keys over placeholders
    let apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey.includes('MY_GEMINI_API_KEY')) {
      apiKey = process.env.API_KEY;
    }
    
    if (!apiKey) {
      console.error("CRITICAL: No valid API key found. GEMINI_API_KEY:", process.env.GEMINI_API_KEY, "API_KEY:", process.env.API_KEY);
      throw new Error("API Key is missing or invalid");
    }

    console.log(`[Agent] Initializing Gemini with Key: ${apiKey.substring(0, 5)}... (Length: ${apiKey.length})`);
    
    const ai = new GoogleGenAI({ apiKey });
    
    // Use a model known to support vision and JSON mode well
    const model = "gemini-2.5-flash"; 
    const prompt = `
      Analyze this image for disaster risk management.
      Identify if there is a natural disaster (Flood, Wildfire, Earthquake damage, Hurricane, Landslide, etc.).
      
      CRITICAL INSTRUCTION: You must distinguish between natural disaster damage (e.g., earthquake rubble) and human-made controlled demolitions, construction sites, or industrial activities. 
      If the image shows a controlled demolition, construction site, or normal human activity, classify the type as "Controlled Demolition" or "Normal" (do NOT classify it as a natural disaster).
      If no disaster is present, state "Normal".
      
      Return a JSON object with:
      - type: The type of disaster (or "Normal").
      - confidence: A number between 0 and 1 (simulating model confidence).
      - explanation: A brief technical explanation of visual features (simulating Grad-CAM findings, e.g., "High water levels detected in urban area", "Smoke plumes visible").
      - regions: An array of objects, each with { ymin, xmin, ymax, xmax, label } representing the bounding box of the disaster feature. Use a scale of 0 to 1000 for coordinates. If no specific feature is found, return an empty array.
      - humanitarianSeverity: "Low", "Medium", "High", or "Critical" based on potential human impact.
      - damageSeverity: "Low", "Medium", "High", or "Critical" based on infrastructure/property damage.
      - lossExplanation: A brief explanation of how the loss/damage was assessed from the visual evidence.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: [
        { text: prompt },
        { inlineData: { mimeType: "image/jpeg", data: imageBase64.split(',')[1] } }
      ],
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Classification Agent");
    
    // Robust JSON parsing: remove markdown code blocks if present
    const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
    
    return JSON.parse(cleanText);
  } catch (error) {
    console.error("Classification Agent failed:", error);
    return { type: "Unknown", confidence: 0, explanation: "Agent failed to classify due to an error." };
  }
}

// --- 2. Risk Analysis Agent ---
function riskAnalysisAgent(classification: AnalysisResult['classification']): AnalysisResult['risk'] {
  const { type, confidence } = classification;
  
  let severity: AnalysisResult['risk']['severity'] = 'Low';
  let score = 0;

  // Rule-based logic (Hybrid Approach)
  if (type.toLowerCase().includes('flood')) {
    severity = 'High';
    score = 85;
  } else if (type.toLowerCase().includes('fire')) {
    severity = 'Critical';
    score = 95;
  } else if (type.toLowerCase().includes('demolition') || type.toLowerCase().includes('construction')) {
    severity = 'Low';
    score = 15;
  } else if (type.toLowerCase().includes('quake') || type.toLowerCase().includes('rubble')) {
    severity = 'High';
    score = 80;
  } else if (type.toLowerCase().includes('landslide')) {
    severity = 'Medium';
    score = 60;
  } else if (type.toLowerCase() === 'normal' || type.toLowerCase() === 'none') {
    severity = 'Low';
    score = 10;
  }

  // Adjust by confidence
  score = Math.round(score * confidence);

  return {
    severity,
    zone: 'Zone-A (Simulated)', // In real app, map lat/long to zone
    score
  };
}

// --- 3. Decision Agent ---
function decisionAgent(risk: AnalysisResult['risk']): AnalysisResult['decision'] {
  const { severity } = risk;
  
  let alertTriggered = false;
  let notifiedStakeholders: string[] = [];

  if (severity === 'Critical' || severity === 'High') {
    alertTriggered = true;
    notifiedStakeholders = ['Emergency Operator', 'Admin', 'Local Police'];
  } else if (severity === 'Medium') {
    alertTriggered = true;
    notifiedStakeholders = ['Admin', 'Maintenance'];
  }

  return {
    alertTriggered,
    notifiedStakeholders
  };
}

// --- 4. Alert Agent (Client Side) ---
function alertAgent(
  classification: AnalysisResult['classification'],
  risk: AnalysisResult['risk'],
  decision: AnalysisResult['decision'],
  location: string,
  imageBase64: string
): AnalysisResult['alertData'] | undefined {
  if (!decision.alertTriggered) return undefined;

  return {
    type: classification.type,
    severity: risk.severity,
    location: location,
    confidence: classification.confidence,
    image_data: imageBase64,
    status: 'Active',
    explanation: classification.explanation,
    regions: classification.regions
  };
}

// --- Orchestrator ---
export async function runDisasterAnalysis(imageBase64: string, location: string): Promise<AnalysisResult> {
  // 1. Classification
  const classification = await classificationAgent(imageBase64);
  
  // 2. Risk Analysis
  const risk = riskAnalysisAgent(classification);
  
  // 3. Decision
  const decision = decisionAgent(risk);
  
  // 4. Alerting (Prepare Data)
  const alertData = alertAgent(classification, risk, decision, location, imageBase64);

  return {
    classification,
    risk,
    decision,
    alertData
  };
}
