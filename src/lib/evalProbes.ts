/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ASTNode, evaluateAST, MathParser } from './mathParser';

export interface TrialProbe {
  name: string;
  variableValues: Record<string, number>;
  correctValue: number;
  userValue: number | null;
  error?: string;
}

export function generateTrialProbes(
  userExpr: string,
  targetExpr: string,
  allowedVars: string[],
  variations?: Record<string, number>
): TrialProbe[] {
  // Parse target
  let targetNode: ASTNode;
  try {
    targetNode = new MathParser(targetExpr).parse();
  } catch {
    return [];
  }

  // Parse user (can fail, so we handle userValue as null if parsing fails)
  let userNode: ASTNode | null = null;
  try {
    userNode = new MathParser(userExpr).parse();
  } catch {
    // user input has a syntax error or is empty
  }

  // Create 3 trials
  const trials: TrialProbe[] = [];

  // System-specific probe generators
  const getTrialSet = (index: number) => {
    const vals: Record<string, number> = {};
    // Default setup
    for (const v of allowedVars) {
      vals[v] = 1.0;
    }

    if (index === 0) {
      // Trial 1: "Small/Standard Scale"
      for (const v of allowedVars) {
        if (v === 'm' || v === 'M') vals[v] = 2.0;
        else if (v === 'g') vals[v] = 9.81;
        else if (v === 'l' || v === 'l0' || v === 'R') vals[v] = 1.2;
        else if (v === 'k') vals[v] = 15.0;
        else if (v === 'theta') vals[v] = 0.5; // ~28 degrees
        else if (v === 'theta_dot') vals[v] = 1.0;
        else if (v === 'omega') vals[v] = 2.0;
        else if (v === 'x' || v === 'y' || v === 'r') vals[v] = 0.25;
        else if (v === 'x_dot' || v === 'y_dot' || v === 'r_dot') vals[v] = 0.8;
      }
      return { name: 'Trial A: Small Amplitude', values: vals };
    } else if (index === 1) {
      // Trial 2: "High Amplitude/Speed"
      for (const v of allowedVars) {
        if (v === 'm' || v === 'M') vals[v] = 5.0;
        else if (v === 'g') vals[v] = 9.81;
        else if (v === 'l' || v === 'l0' || v === 'R') vals[v] = 3.0;
        else if (v === 'k') vals[v] = 60.0;
        else if (v === 'theta') vals[v] = 1.2; // ~69 degrees
        else if (v === 'theta_dot') vals[v] = 4.0;
        else if (v === 'omega') vals[v] = 4.5;
        else if (v === 'x' || v === 'y' || v === 'r') vals[v] = 1.6;
        else if (v === 'x_dot' || v === 'y_dot' || v === 'r_dot') vals[v] = 3.2;
      }
      return { name: 'Trial B: High Energy (Fast & Stretched)', values: vals };
    } else {
      // Trial 3: "Symmetric / Critical Geometry"
      for (const v of allowedVars) {
        if (v === 'm' || v === 'M') vals[v] = 1.5;
        else if (v === 'g') vals[v] = 10.0;
        else if (v === 'l' || v === 'l0' || v === 'R') vals[v] = 2.0;
        else if (v === 'k') vals[v] = 25.0;
        else if (v === 'theta') vals[v] = Math.PI / 2; // Exact orthogonal 90 degrees
        else if (v === 'theta_dot') vals[v] = 2.5;
        else if (v === 'omega') vals[v] = 3.2;
        else if (v === 'x' || v === 'y' || v === 'r') vals[v] = 1.0;
        else if (v === 'x_dot' || v === 'y_dot' || v === 'r_dot') vals[v] = 0.0; // Stationary or zero speed
      }
      return { name: 'Trial C: Orthogonal / Static Boundary', values: vals };
    }
  };

  for (let i = 0; i < 3; i++) {
    const trialSet = getTrialSet(i);
    let targetVal = 0;
    let userVal: number | null = null;
    let errorStr: string | undefined;

    try {
      const targetVars = { ...trialSet.values };
      if (variations) {
        for (const [key, mult] of Object.entries(variations)) {
          if (targetVars[key] !== undefined) {
             targetVars[key] = trialSet.values[key] * mult;
          }
        }
      }
      targetVal = evaluateAST(targetNode, targetVars);
    } catch {
      // should not happen for target
    }

    if (userNode) {
      try {
        userVal = evaluateAST(userNode, trialSet.values);
      } catch (err: any) {
        errorStr = err.message;
      }
    }

    trials.push({
      name: trialSet.name,
      variableValues: trialSet.values,
      correctValue: targetVal,
      userValue: userVal,
      error: errorStr
    });
  }

  return trials;
}
