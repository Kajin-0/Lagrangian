const fs = require('fs');
let code = fs.readFileSync('src/components/SystemDiagram.tsx', 'utf-8');

code = code.replace(/110 \* Math\.sin\(theta\)/g, "s('l', 110) * Math.sin(theta)");
code = code.replace(/110 \* Math\.cos\(theta\)/g, "s('l', 110) * Math.cos(theta)");
code = code.replace(/r="11"/g, "r={s('m', 11)}");

fs.writeFileSync('src/components/SystemDiagram.tsx', code);
