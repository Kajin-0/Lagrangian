const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

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
  `  const handleInsertVariable = (varName: string) => {`,
  renderDescFn + `\n  const handleInsertVariable = (varName: string) => {`
);

fs.writeFileSync('src/App.tsx', code);
