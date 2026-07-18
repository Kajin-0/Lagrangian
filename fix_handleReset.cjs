const fs = require('fs');
let code = fs.readFileSync('src/components/SystemDiagram.tsx', 'utf-8');

const targetStr = `  const handleReset = () => {
    setTime(0);
    setTheta(0.5);
    setValX(30);
    setValY(40);
    setValR(120);
    setValAngle(0.4);
  };`;

code = code.replace(targetStr, "");
fs.writeFileSync('src/components/SystemDiagram.tsx', code);
