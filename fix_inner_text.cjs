const fs = require('fs');
let code = fs.readFileSync('src/components/SystemDiagram.tsx', 'utf-8');

// replace >l< with >{v('l')}< but preserving whitespace
code = code.replace(/>\s*l\s*<\/text>/g, '>{v(\'l\')}</text>');
code = code.replace(/>\s*m\s*<\/text>/g, '>{v(\'m\')}</text>');
code = code.replace(/>\s*M\s*<\/text>/g, '>{v(\'M\')}</text>');
code = code.replace(/>\s*m1\s*<\/text>/g, '>{v(\'m1\')}</text>');
code = code.replace(/>\s*m2\s*<\/text>/g, '>{v(\'m2\')}</text>');
code = code.replace(/>\s*m₁\s*<\/text>/g, '>{v(\'m1\')}</text>');
code = code.replace(/>\s*m₂\s*<\/text>/g, '>{v(\'m2\')}</text>');
code = code.replace(/>\s*k\s*<\/text>/g, '>{v(\'k\')}</text>');
code = code.replace(/>\s*k1\s*<\/text>/g, '>{v(\'k1\')}</text>');
code = code.replace(/>\s*k2\s*<\/text>/g, '>{v(\'k2\')}</text>');
code = code.replace(/>\s*k3\s*<\/text>/g, '>{v(\'k3\')}</text>');

fs.writeFileSync('src/components/SystemDiagram.tsx', code);
