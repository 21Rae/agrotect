
export enum HealthStatus {
  OPTIMAL = 'OPTIMAL',
  WARNING = 'WARNING',
  CRITICAL = 'CRITICAL'
}

export interface SensorData {
  timestamp: string;
  pH: number;
  temp: number; // Celsius
  humidity: number; // %
  light: number; // lux
  ec: number; // mS/cm
}

export interface Zone {
  id: string;
  name: string;
  crop: string;
  stage: string;
  lastSync: string;
  status: HealthStatus;
  currentData: SensorData;
}

export interface AIRecommendation {
  id: string;
  type: 'nutrient' | 'climate' | 'lighting';
  parameter: string;
  currentValue: number;
  recommendedValue: number;
  rationale: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'approved' | 'rejected' | 'executed';
}

export interface PlantHealthAnalysis {
  healthScore: number;
  detectedIssues: string[];
  severity: 'none' | 'low' | 'medium' | 'high';
  treatmentPlan: string;
  confidence: number;
}
