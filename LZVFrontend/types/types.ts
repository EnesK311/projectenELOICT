import { ReactNode } from "react";

export type Match = {
    id: number;
    status: number;
    notification: number;
    division_id: number;
    sportshall_id: number;
    team1_id: number; // Consider renaming to home_team_id for clarity
    team2_id: number; // Consider renaming to away_team_id for clarity
    score1: number;
    score2: number;
    score3: number;
    score4: number;
    forfeit: number;
    forfeit_at: string | null;
    planned_at: string;
    planned_orig_at: string | null;
    season_id: number;
    delayed_request: number;
    delayed_status: number;
    delayed_prop_at: string | null;
    delayed_prop_count: number;
    created_at: string;
    updated_at: string;
    team1: {
      id: number;
      name: string;
      first_name: string;
      last_name: string;
      email: string;
      website: string | null;
      shirt_color: string;
      shorts_color: string;
      team_info: string | null;
      delay_home_max: number;
      delay_days_home_max: number;
      delay_days_away_max: number;
      last_login_at: string;
      created_at: string | null;
      updated_at: string;
    };
    team2: {
      id: number;
      name: string;
      first_name: string;
      last_name: string;
      email: string;
      website: string | null;
      shirt_color: string;
      shorts_color: string;
      team_info: string | null;
      delay_home_max: number;
      delay_days_home_max: number;
      delay_days_away_max: number;
      last_login_at: string;
      created_at: string | null;
      updated_at: string;
    };
    location: {
      id: number;
      status: number;
      name: string;
      location: string;
      address: string;
      phone1: string;
      phone2: string | null;
      email: string;
      lat: number;
      lng: number;
      created_at: string;
      updated_at: string;
    };
  };

export type User = {
    number: ReactNode;
    id: number;
    first_name: string;
    last_name: string;
    role: 'player' | 'manager' | 'viewer' | 'potential_manager';
    email: string;
    token: string;
    goals: number;
    assists: number;
    games: number;
  }

  // Represents a single region
export type Region = {
  id: number; // Unique identifier for the region
  name: string; // Name of the region
};

// Represents a single division within a region
export type Division = {
  id: number; // Unique identifier for the division
  name: string; // Name of the division
};

// Represents a team (used within Match type)
export type Team = {
  id: number; // Unique identifier for the team
  name: string; // Team name
  first_name: string; // First name of the team contact person
  last_name: string; // Last name of the team contact person
  email: string; // Email address of the team contact person
  website: string | null; // Team website (optional)
  shirt_color: string; // Color of the team's shirt
  shorts_color: string; // Color of the team's shorts
  team_info: string | null; // Additional information about the team (optional)
  delay_home_max: number; // Max allowed home delay in minutes
  delay_days_home_max: number; // Max allowed home delay in days
  delay_days_away_max: number; // Max allowed away delay in days
  last_login_at: string; // Last login date of the team contact person
  created_at: string | null; // Date when the team was created
  updated_at: string; // Last updated date of the team
};

// Represents a location (used within Match type)
export type Location = {
  id: number; // Unique identifier for the location
  status: number; // Location status
  name: string; // Location name
  location: string; // Location details (e.g., city, area)
  address: string; // Address of the location
  phone1: string; // Primary phone number
  phone2: string | null; // Secondary phone number (optional)
  email: string; // Email address
  lat: number; // Latitude for the location
  lng: number; // Longitude for the location
  created_at: string; // Date when the location was created
  updated_at: string; // Last updated date of the location
};