const fs = require('fs');

// Fix systems.ts
let sysCode = fs.readFileSync('src/data/systems.ts', 'utf-8');
const sysIndex = sysCode.lastIndexOf("    id: 'vertical-spring'");
if (sysIndex !== -1) {
  const openBracket = sysCode.lastIndexOf('{', sysIndex);
  const closeBracket = sysCode.indexOf('}', sysIndex) + 1;
  const trailingComma = sysCode.indexOf(',', closeBracket);
  const end = trailingComma !== -1 && trailingComma < closeBracket + 10 ? trailingComma + 1 : closeBracket;
  sysCode = sysCode.substring(0, openBracket) + sysCode.substring(end);
  // remove the comma before if needed, let's just do a string replace since I appended it exactly.
}
fs.writeFileSync('src/data/systems.ts', sysCode);

// Fix App.tsx
let appCode = fs.readFileSync('src/App.tsx', 'utf-8');
const appIndex = appCode.lastIndexOf("'vertical-spring': [");
if (appIndex !== -1) {
  const end = appCode.indexOf(']', appIndex) + 1;
  const trailingComma = appCode.indexOf(',', end);
  appCode = appCode.substring(0, appIndex) + appCode.substring(end + 1); // rough
}
fs.writeFileSync('src/App.tsx', appCode);

console.log("duplicates removed");
