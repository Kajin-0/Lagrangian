const fs = require('fs');
let code = fs.readFileSync('src/components/SystemDiagram.tsx', 'utf-8');
code = code.replaceAll("\\'", "'");
fs.writeFileSync('src/components/SystemDiagram.tsx', code);
