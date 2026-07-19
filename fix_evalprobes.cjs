const fs = require('fs');
let code = fs.readFileSync('src/lib/evalProbes.ts', 'utf-8');

code = code.replace(
  "export function generateTrialProbes(\n  userExpr: string,\n  targetExpr: string,\n  allowedVars: string[]\n): TrialProbe[] {",
  "export function generateTrialProbes(\n  userExpr: string,\n  targetExpr: string,\n  allowedVars: string[],\n  variations?: Record<string, number>\n): TrialProbe[] {"
);

code = code.replace(
  "    try {\n      targetVal = evaluateAST(targetNode, trialSet.values);\n    } catch {",
  `    try {
      const targetVars = { ...trialSet.values };
      if (variations) {
        for (const [key, mult] of Object.entries(variations)) {
          if (targetVars[key] !== undefined) {
             targetVars[key] = trialSet.values[key] * mult;
          }
        }
      }
      targetVal = evaluateAST(targetNode, targetVars);
    } catch {`
);

fs.writeFileSync('src/lib/evalProbes.ts', code);
