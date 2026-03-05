// Zimbabwe Highway Code, Road Rules & Road Signs reference data
// ─────────────────────────────────────────────────────────────
// Data lives in separate JSON files for easy editing.
// This file re-exports everything with proper TypeScript types
// so that NO import paths need to change anywhere in the app.

// ── Types ──────────────────────────────────────────────────

export interface NoteSection {
  title: string;
  icon: string;
  content: string[];
}

export interface RoadSign {
  name: string;
  meaning: string;
  /** Path relative to project root, e.g. '/images/signs/class-a/curve-ahead.png' */
  image?: string;
  /** Subgroup label within a class, e.g. "Prohibitory Signs" inside Class B */
  subgroup?: string;
}

export interface SignSubgroup {
  name: string;
  description: string;
}

export type SignShape =
  | 'circle'
  | 'triangle'
  | 'rectangle'
  | 'circle-slash'
  | 'diamond'
  | 'octagon'
  | 'inverted-triangle';

export interface RoadSignCategory {
  title: string;
  subtitle: string;
  description: string;
  classCode: string;
  shape: SignShape;
  shapeColor: string;
  shapeFill: string;
  /** Folder name inside assets/images/ that holds the sign images for this class */
  imageFolder?: string;
  /** Optional subgroups within this class (e.g. Prohibitory / Command / Reservation in Class B) */
  subgroups?: SignSubgroup[];
  signs: RoadSign[];
}

// ── Data imports from JSON ─────────────────────────────────

import highwayCodeData from './highway-code.json';
import roadRulesData from './road-rules.json';
import roadSignsData from './road-signs.json';

export const HIGHWAY_CODE_SECTIONS: NoteSection[] = highwayCodeData;
export const ROAD_RULES_SECTIONS: NoteSection[] = roadRulesData;
export const ROAD_SIGNS_CATEGORIES: RoadSignCategory[] = roadSignsData as RoadSignCategory[];

// ── Section metadata for the Notes main screen ────────────

export const NOTES_SECTIONS = [
  {
    key: 'highway-code' as const,
    title: 'Highway Code',
    description: 'General driving rules, speed limits, and legal requirements',
    icon: 'menu-book',
    color: '#2563EB',
    itemCount: HIGHWAY_CODE_SECTIONS.length,
  },
  {
    key: 'road-rules' as const,
    title: 'Road Rules',
    description: 'Right of way, roundabouts, parking, and road markings',
    icon: 'gavel',
    color: '#0E8A3E',
    itemCount: ROAD_RULES_SECTIONS.length,
  },
  {
    key: 'road-signs' as const,
    title: 'Road Signs',
    description: 'Class A-E: Warning, regulatory, guidance, traffic lights, and road markings',
    icon: 'warning',
    color: '#DC2626',
    itemCount: ROAD_SIGNS_CATEGORIES.length,
  },
] as const;
