import React, { createContext, useState, useContext, ReactNode } from 'react';
import { UserRole } from '../types';

export interface User {
  id: number;
  username: string;
  fullName: string;
  role: UserRole;
  lastActive: string;
  status: 'Active' | 'Suspended';
}

export interface Stakeholder {
  id: number;
  name: string;
  role: string;
  organization: string;
  email: string;
  phone: string;
  status: 'Active' | 'Inactive';
}

export interface AppSettings {
  floodThreshold: number;
  wildfireThreshold: number;
  emailNotifications: {
    enabled: boolean;
    levels: { low: boolean; medium: boolean; high: boolean; critical: boolean };
  };
  smsNotifications: {
    enabled: boolean;
    levels: { low: boolean; medium: boolean; high: boolean; critical: boolean };
  };
  autoDispatch: boolean;
  dataRetentionDays: number;
  apiKey: string;
  region: string;
}

interface DataContextType {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  stakeholders: Stakeholder[];
  setStakeholders: React.Dispatch<React.SetStateAction<Stakeholder[]>>;
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
}

const initialUsers: User[] = [
  { id: 1, username: "admin", fullName: "System Administrator", role: "admin", lastActive: "Just now", status: 'Active' },
  { id: 2, username: "operator1", fullName: "John Doe", role: "operator", lastActive: "2 hours ago", status: 'Active' },
  { id: 3, username: "viewer_guest", fullName: "Guest Viewer", role: "viewer", lastActive: "1 day ago", status: 'Active' },
  { id: 4, username: "sarah_ops", fullName: "Sarah Smith", role: "operator", lastActive: "5 mins ago", status: 'Suspended' },
];

const initialStakeholders: Stakeholder[] = [
  { id: 1, name: "Dr. Aditi Sharma", role: "Chief Hydrologist", organization: "Central Water Commission", email: "aditi.sharma@cwc.gov.in", phone: "+91 98765 43210", status: 'Active' },
  { id: 2, name: "Rajesh Kumar", role: "Emergency Response Lead", organization: "NDRF", email: "rajesh.k@ndrf.gov.in", phone: "+91 98765 12345", status: 'Active' },
  { id: 3, name: "Sarah Jenkins", role: "NGO Coordinator", organization: "Red Cross", email: "sarah.j@redcross.org", phone: "+91 98765 67890", status: 'Active' },
  { id: 4, name: "Amit Patel", role: "District Magistrate", organization: "Delhi Govt", email: "dm.delhi@gov.in", phone: "+91 98765 98765", status: 'Inactive' },
];

const initialSettings: AppSettings = {
  floodThreshold: 85,
  wildfireThreshold: 90,
  emailNotifications: {
    enabled: true,
    levels: { low: false, medium: true, high: true, critical: true }
  },
  smsNotifications: {
    enabled: false,
    levels: { low: false, medium: false, high: true, critical: true }
  },
  autoDispatch: false,
  dataRetentionDays: 30,
  apiKey: '************************',
  region: 'asia-southeast1'
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>(initialStakeholders);
  const [settings, setSettings] = useState<AppSettings>(initialSettings);

  return (
    <DataContext.Provider value={{ users, setUsers, stakeholders, setStakeholders, settings, setSettings }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
