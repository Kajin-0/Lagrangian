const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

// 1. Add state variations
if (!code.includes('const [variations, setVariations] = useState')) {
  code = code.replace(
    `  const [selectedSystem, setSelectedSystem] = useState(PHYSICAL_SYSTEMS[0]);`,
    `  const [selectedSystem, setSelectedSystem] = useState(PHYSICAL_SYSTEMS[0]);\n  const [variations, setVariations] = useState<Record<string, number>>({});`
  );
}

// 2. Add randomizeSystem
if (!code.includes('const randomizeSystem = ')) {
  code = code.replace(
    `  const handleSelectSystem = (sys: typeof PHYSICAL_SYSTEMS[0]) => {`,
    `  const randomizeSystem = (sys: typeof PHYSICAL_SYSTEMS[0]) => {
    const newVars: Record<string, number> = {};
    for (const p of sys.parameters) {
      if (['g', 'c'].includes(p)) continue;
      if (Math.random() > 0.4) {
        newVars[p] = Math.floor(Math.random() * 3) + 2;
      }
    }
    setVariations(newVars);
  };

  const handleSelectSystem = (sys: typeof PHYSICAL_SYSTEMS[0]) => {
    randomizeSystem(sys);`
  );
}

// 3. Add useEffect randomize
if (!code.includes('randomizeSystem(PHYSICAL_SYSTEMS[0]);')) {
  code = code.replace(
    `  useEffect(() => {`,
    `  useEffect(() => {
    randomizeSystem(PHYSICAL_SYSTEMS[0]);
  }, []);

  useEffect(() => {`
  );
}

fs.writeFileSync('src/App.tsx', code);
