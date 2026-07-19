const fs = require('fs');
let code = fs.readFileSync('src/components/NotesEditor.tsx', 'utf-8');
code = code.replace(/React\./g, '');
fs.writeFileSync('src/components/NotesEditor.tsx', code);
