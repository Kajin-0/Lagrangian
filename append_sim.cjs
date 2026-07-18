const fs = require('fs');
let code = fs.readFileSync('src/components/SystemDiagram.tsx', 'utf-8');

const simCode = `      } else if (systemId === 'atwood-machine') {
        const currentY = 50 * Math.sin(time * 2);
        setValY(currentY);
      } else if (systemId === 'inclined-plane') {
        const currentS = 50 + 40 * Math.cos(time * 2);
        setValX(currentS);
      } else if (systemId === 'projectile-motion') {
        const tCycle = time % 3;
        const startX = -120;
        const vX = 80;
        const currentX = startX + vX * tCycle;
        const currentY = - (-80 * tCycle + 26.6 * tCycle * tCycle); // Just a generic parabola
        setValX(currentX);
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
