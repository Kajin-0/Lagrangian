const fs = require('fs');

// Fix NotesEditor
let notes = fs.readFileSync('src/components/NotesEditor.tsx', 'utf-8');
notes = notes.replace('e: ChangeEvent', 'e: React.ChangeEvent');
notes = notes.replace('e: UIEvent', 'e: React.UIEvent');
// Add import React if missing
if (!notes.includes('import React')) {
  notes = notes.replace("import { useState, useRef, useEffect } from 'react';", "import React, { useState, useRef, useEffect } from 'react';");
}
fs.writeFileSync('src/components/NotesEditor.tsx', notes);

// Fix SystemDiagram
let diagram = fs.readFileSync('src/components/SystemDiagram.tsx', 'utf-8');
diagram = diagram.replace(/<circle([^>]+)title="[^"]*"/g, '<circle$1');
fs.writeFileSync('src/components/SystemDiagram.tsx', diagram);
