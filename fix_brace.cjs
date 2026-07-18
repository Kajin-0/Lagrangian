const fs = require('fs');
let code = fs.readFileSync('src/components/SystemDiagram.tsx', 'utf-8');
code = code.replace("            }\n{systemId === 'atwood-machine' && (", "{systemId === 'atwood-machine' && (");
// or just replace any `            }{systemId === 'atwood-machine'`
code = code.replace("            }{systemId === 'atwood-machine'", "            {systemId === 'atwood-machine'");
fs.writeFileSync('src/components/SystemDiagram.tsx', code);
