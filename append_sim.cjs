const fs = require('fs');
let code = fs.readFileSync('src/components/SystemDiagram.tsx', 'utf-8');

const simCode = `      } else if (systemId === 'planetary-motion') {
        const currentTheta = time * 2;
        const currentR = 50 + 20 * Math.sin(time * 3);
        setTheta(currentTheta);
        setValR(currentR);
      } else if (systemId === 'physical-pendulum') {
        const currentTheta = 1.2 * Math.cos(time * 3);
        setTheta(currentTheta);
`;
const insertionPoint = "} else if (systemId === 'cart-pendulum') {";
const index = code.indexOf(insertionPoint);
if (index !== -1) {
  code = code.substring(0, index) + simCode + code.substring(index);
  fs.writeFileSync('src/components/SystemDiagram.tsx', code);
  console.log("Sim added successfully.");
} else {
  console.error("Could not find insertion point.");
}
