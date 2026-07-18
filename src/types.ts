/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PhysicalSystem {
  id: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  shortDescription: string;
  description: string;
  coordinates: string[]; // e.g. ["theta", "theta_dot"]
  parameters: string[]; // e.g. ["m", "l", "g"]
  allowedVars: string[]; // Combined list of allowed variable tokens
  variablesExplanation: { symbol: string; meaning: string; unit?: string }[];
  correctT: string; // The reference target formulas for checker (T)
  correctV: string; // The reference target formulas for checker (V)
  exampleT: string; // Formatting hint representation of T
  exampleV: string; // Formatting hint representation of V
  hints: string[];
  referenceVZero: string; // Sentence describing where V = 0 is set
}

export interface UserProgress {
  completedSystems: string[]; // list of completed physical system IDs
  history: {
    systemId: string;
    timestamp: string;
    attempts: number;
    solved: boolean;
  }[];
}
