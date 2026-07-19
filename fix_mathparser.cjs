const fs = require('fs');
let code = fs.readFileSync('src/lib/mathParser.ts', 'utf-8');

code = code.replace(
  "export function verifyExpression(\n  userExpr: string,\n  targetExpr: string,\n  allowedVars: string[]\n): CheckResult {",
  "export function verifyExpression(\n  userExpr: string,\n  targetExpr: string,\n  allowedVars: string[],\n  variations?: Record<string, number>\n): CheckResult {"
);

code = code.replace(
  "      const targetVal = evaluateAST(targetNode, testVars);",
  `      const targetVars = { ...testVars };
      if (variations) {
        for (const [key, mult] of Object.entries(variations)) {
          if (targetVars[key] !== undefined) {
             targetVars[key] = testVars[key] * mult;
          }
        }
      }
      const targetVal = evaluateAST(targetNode, targetVars);`
);

fs.writeFileSync('src/lib/mathParser.ts', code);
