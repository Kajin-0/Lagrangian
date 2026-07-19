const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

// 1. Add state
code = code.replace(
  "  const [selectedSystem, setSelectedSystem] = useState(PHYSICAL_SYSTEMS[0]);\n  const [currentTab, setCurrentTab] = useState<'problem' | 'notes'>('problem');",
  `  const [selectedSystem, setSelectedSystem] = useState(PHYSICAL_SYSTEMS[0]);
  const [variations, setVariations] = useState<Record<string, number>>({});
  const [currentTab, setCurrentTab] = useState<'problem' | 'notes'>('problem');`
);

// 2. Add randomize function and replace handleSelectSystem
code = code.replace(
  `  const handleSelectSystem = (sys: typeof PHYSICAL_SYSTEMS[0]) => {
    setSelectedSystem(sys);
    setInputT('');
    setInputV('');
    setIsChecked(false);
    setIsTCorrect(null);
    setIsVCorrect(null);
    setTrialProbesT([]);
    setTrialProbesV([]);
    setIsDrawerOpen(false);
  };`,
  `  const randomizeSystem = (sys: typeof PHYSICAL_SYSTEMS[0]) => {
    const newVars: Record<string, number> = {};
    for (const p of sys.parameters) {
      if (['g', 'c'].includes(p)) continue;
      if (Math.random() > 0.4) {
        newVars[p] = Math.floor(Math.random() * 3) + 2; // 2 to 4
      }
    }
    setVariations(newVars);
  };

  const handleSelectSystem = (sys: typeof PHYSICAL_SYSTEMS[0]) => {
    setSelectedSystem(sys);
    randomizeSystem(sys);
    setInputT('');
    setInputV('');
    setIsChecked(false);
    setIsTCorrect(null);
    setIsVCorrect(null);
    setTrialProbesT([]);
    setTrialProbesV([]);
    setIsDrawerOpen(false);
  };

  useEffect(() => {
    randomizeSystem(PHYSICAL_SYSTEMS[0]);
  }, []);`
);

// 3. Update verifyExpression calls
code = code.replace(
  `const resultT = verifyExpression(inputT, selectedSystem.correctT, selectedSystem.allowedVars);`,
  `const resultT = verifyExpression(inputT, selectedSystem.correctT, selectedSystem.allowedVars, variations);`
);
code = code.replace(
  `setTrialProbesT(generateTrialProbes(inputT, selectedSystem.correctT, selectedSystem.allowedVars));`,
  `setTrialProbesT(generateTrialProbes(inputT, selectedSystem.correctT, selectedSystem.allowedVars, variations));`
);
code = code.replace(
  `const resultV = verifyExpression(inputV, selectedSystem.correctV, selectedSystem.allowedVars);`,
  `const resultV = verifyExpression(inputV, selectedSystem.correctV, selectedSystem.allowedVars, variations);`
);
code = code.replace(
  `setTrialProbesV(generateTrialProbes(inputV, selectedSystem.correctV, selectedSystem.allowedVars));`,
  `setTrialProbesV(generateTrialProbes(inputV, selectedSystem.correctV, selectedSystem.allowedVars, variations));`
);

// 4. Pass variations to SystemDiagram
code = code.replace(
  `<SystemDiagram systemId={selectedSystem.id} />`,
  `<SystemDiagram systemId={selectedSystem.id} variations={variations} />`
);

// 5. Add rendered description with string replacement!
const renderDescFn = `
  const renderDescription = () => {
    let desc = selectedSystem.description;
    for (const [key, mult] of Object.entries(variations)) {
      const regex = new RegExp(\`\\\\b\${key}\\\\b\`, 'g');
      desc = desc.replace(regex, \`\${mult}\${key}\`);
    }
    return desc;
  };

  const renderEOM = (eq: string) => {
    let res = eq;
    for (const [key, mult] of Object.entries(variations)) {
      const regex = new RegExp(\`\\\\b\${key}\\\\b\`, 'g');
      res = res.replace(regex, \`(\${mult}*\${key})\`);
    }
    return res;
  };
`;

code = code.replace(
  `const handleInsertVar = (varName: string) => {`,
  renderDescFn + `\n  const handleInsertVar = (varName: string) => {`
);

code = code.replace(
  `<span className="text-[10px] uppercase tracking-widest">V = 0 at {selectedSystem.referenceVZero}</span>
              </div>
              <div className="w-full flex justify-center">`,
  `<span className="text-[10px] uppercase tracking-widest">V = 0 at {selectedSystem.referenceVZero}</span>
              </div>
              <p className="text-sm font-serif mb-4 leading-relaxed" dangerouslySetInnerHTML={{ __html: renderDescription() }} />
              <div className="w-full flex justify-center">`
);

// 6. Update EOM
code = code.replace(
  `<div key={i} className="font-bold">{eq}</div>`,
  `<div key={i} className="font-bold">{renderEOM(eq)}</div>`
);

// 7. Add Randomize button next to title
code = code.replace(
  `<h2 className="text-sm font-bold uppercase tracking-widest">{selectedSystem.title}</h2>`,
  `<div className="flex items-center gap-3">
                  <h2 className="text-sm font-bold uppercase tracking-widest">{selectedSystem.title}</h2>
                  <button onClick={() => randomizeSystem(selectedSystem)} className="text-xs border border-black px-2 py-0.5 hover:bg-black hover:text-white transition flex items-center gap-1">
                    <RefreshCw className="w-3 h-3" /> Randomize
                  </button>
                </div>`
);

fs.writeFileSync('src/App.tsx', code);
