const fs = require('fs');
let code = fs.readFileSync('src/components/SystemDiagram.tsx', 'utf-8');

const simCode = `      } else if (systemId === 'double-pendulum') {
        const currentTheta1 = 0.5 * Math.cos(time * 3);
        const currentTheta2 = 0.5 * Math.cos(time * 3) + 1.2 * Math.cos(time * 4.2);
        setTheta(currentTheta1);
        setValAngle(currentTheta2);
      } else if (systemId === 'vertical-spring') {
        const currentY = 80 + 30 * Math.cos(time * 4);
        setValY(currentY);
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
