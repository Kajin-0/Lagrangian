const fs = require('fs');
let code = fs.readFileSync('src/components/SystemDiagram.tsx', 'utf-8');

code = code.replace(
  /const s = \(label: string, base: number\) => variations && variations\[label\] !== undefined \? base \* \(1 \+ \(variations\[label\] - 1\) \* 0\.2\) : base;/g,
  `const s = (label: string, base: number) => {
    if (!variations || variations[label] === undefined) return base;
    const mult = variations[label];
    if (label.startsWith('l') || label === 'L' || label === 'R' || label === 'r') {
      return base * (1 + (mult - 1) * 0.05);
    }
    return base * (1 + (mult - 1) * 0.1);
  };`
);

fs.writeFileSync('src/components/SystemDiagram.tsx', code);
