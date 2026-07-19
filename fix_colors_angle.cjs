const fs = require('fs');
let code = fs.readFileSync('src/components/SystemDiagram.tsx', 'utf-8');

// Fix colors for planetary motion
code = code.replace(
  /<circle cx="0" cy="0" r="15" fill="#facc15" stroke="#000" strokeWidth="2" \/>/g,
  '<circle cx="0" cy="0" r="15" fill="#fff" stroke="#000" strokeWidth="2" />'
);

code = code.replace(
  /<circle cx="0" cy="0" r={valR} fill="none" stroke="#ccc" strokeWidth="1" strokeDasharray="4 4" \/>/g,
  '<circle cx="0" cy="0" r={valR} fill="none" stroke="#000" strokeWidth="1" strokeDasharray="4 4" />'
);

code = code.replace(
  /<circle cx="0" cy="0" r="6" fill="#3b82f6" stroke="#000" strokeWidth="1\.5" \/>/g,
  '<circle cx="0" cy="0" r="6" fill="#000" stroke="#000" strokeWidth="1.5" />'
);

code = code.replace(
  /stroke="#ef4444"/g,
  'stroke="#000"'
);

code = code.replace(
  /fill="#ef4444"/g,
  'fill="#000"'
);

// Fix angle for physical pendulum
code = code.replace(
  /<g transform=\{\`rotate\(\$\{\(theta \* 180\) \/ Math\.PI\}\)\`\}>/,
  '<g transform={`rotate(${(-theta * 180) / Math.PI})`}>'
);

fs.writeFileSync('src/components/SystemDiagram.tsx', code);
console.log("Colors and angle fixed successfully.");
