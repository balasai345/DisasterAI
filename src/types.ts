export type UserRole = 'admin' | 'operator' | 'viewer';

export interface Alert {
  id: number;
  type: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  location: string;
  lat?: number;
  lng?: number;
  timestamp: string;
  confidence: number;
  image_data: string;
  status: string;
  explanation?: string;
  regions?: { ymin: number; xmin: number; ymax: number; xmax: number; label: string }[];
}

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
  alertId?: number;
}

export interface ZoneRiskStatus {
  zone: string;
  riskScore: number;
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
  classificationType: string;
  confidence: number;
  explanation: string;
  metrics: {
    rainfall: string;
    riverLevel: string;
  };
}
