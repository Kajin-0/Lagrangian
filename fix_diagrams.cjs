const fs = require('fs');
let code = fs.readFileSync('src/components/SystemDiagram.tsx', 'utf-8');

const renderSpringFn = `
const renderSpring = (x1: number, y1: number, x2: number, y2: number, coils: number = 8, radius: number = 5) => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx);
  const straightLen = 10;
  const coilLen = length - 2 * straightLen;
  if (coilLen <= 0) return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#000" strokeWidth="1.5" />;
  const coilStep = coilLen / coils;
  let path = \`M 0 0 L \${straightLen} 0\`;
  for (let i = 0; i < coils; i++) {
    path += \` L \${straightLen + (i + 0.25) * coilStep} \${-radius}\`;
    path += \` L \${straightLen + (i + 0.75) * coilStep} \${radius}\`;
    path += \` L \${straightLen + (i + 1) * coilStep} 0\`;
  }
  path += \` L \${length} 0\`;
  return <path d={path} fill="none" stroke="#000" strokeWidth="1.5" transform={\`translate(\${x1}, \${y1}) rotate(\${(angle * 180) / Math.PI})\`} />;
};
`;

code = code.replace(
  "export default function SystemDiagram",
  renderSpringFn + "\nexport default function SystemDiagram"
);

// Rolling wheel sim
code = code.replace(
  `      } else if (systemId === 'rolling-wheel-incline') {
        const currentX = (time * 15) % 100;
        setValX(currentX);
        setTheta(currentX / 15);`,
  `      } else if (systemId === 'rolling-wheel-incline') {
        const currentX = (time * 40) % 250;
        setValX(currentX);
        setTheta(currentX / 15);`
);

// Rolling wheel slider max
code = code.replace(
  `            {systemId === 'rolling-wheel-incline' && (
              <div className="flex flex-col">
                <div className="flex justify-between text-[11px] font-mono font-bold text-black">
                  <span className="truncate">x (distance):</span>
                  <span className="tabular-nums whitespace-nowrap">{valX.toFixed(1)} m</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"`,
  `            {systemId === 'rolling-wheel-incline' && (
              <div className="flex flex-col">
                <div className="flex justify-between text-[11px] font-mono font-bold text-black">
                  <span className="truncate">x (distance):</span>
                  <span className="tabular-nums whitespace-nowrap">{valX.toFixed(1)} m</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="250"`
);

// Rolling wheel SVG
code = code.replace(
  `          {systemId === 'rolling-wheel-incline' && (
            <g transform="translate(100, 30)">
              {/* Incline */}
              <polygon points="0,0 200,0 0,150" fill="none" stroke="#000" strokeWidth="2" transform="translate(0, 50)" />
              
              <g transform="translate(0, 50)">
                <g transform={\`rotate(37)\`}>
                  {/* Wheel */}
                  <g transform={\`translate(\${valX + 15}, -15)\`}>
                    <circle cx="0" cy="0" r="15" fill="#fff" stroke="#000" strokeWidth="2" />
                    {/* Spoke to show rotation */}
                    <line x1="0" y1="0" x2={\`\${15 * Math.cos(theta)}\`} y2={\`\${15 * Math.sin(theta)}\`} stroke="#000" strokeWidth="2" />
                    <text x="0" y="-20" fill="#000" fontSize="10" fontWeight="bold" textAnchor="middle">m, R</text>
                  </g>
                </g>
              </g>
            </g>
          )}`,
  `          {systemId === 'rolling-wheel-incline' && (
            <g transform="translate(80, 50)">
              {/* Incline */}
              <polygon points="0,0 250,150 0,150" fill="#f9f9f9" stroke="#000" strokeWidth="2" />
              
              <g transform={\`rotate(30.96)\`}> {/* atan(150/250) = 30.96 deg */}
                {/* Wheel */}
                <g transform={\`translate(\${valX}, -15)\`}>
                  <circle cx="0" cy="0" r="15" fill="#fff" stroke="#000" strokeWidth="2" />
                  {/* Spoke to show rotation */}
                  <line x1="0" y1="0" x2={\`\${15 * Math.cos(theta)}\`} y2={\`\${15 * Math.sin(theta)}\`} stroke="#000" strokeWidth="2" />
                  <text x="0" y="-20" fill="#000" fontSize="10" fontWeight="bold" textAnchor="middle">m, R</text>
                </g>
              </g>
            </g>
          )}`
);

// Block wedge sim
code = code.replace(
  `      } else if (systemId === 'block-wedge') {
        const currentX = 10 * Math.sin(time * 2);
        const currentS = 40 + 20 * Math.sin(time * 2.5);
        setValX(currentX);
        setValY(currentS); // We use valY for s
        setValAngle(Math.PI / 6); // 30 degrees for alpha
      }`,
  `      } else if (systemId === 'block-wedge') {
        const currentS = (time * 40) % 130;
        const currentX = -currentS * 0.3;
        setValX(currentX);
        setValY(currentS); // We use valY for s
        setValAngle(Math.PI / 6); // 30 degrees for alpha
      }`
);

// Coupled oscillators SVG
code = code.replace(
  `              {/* Spring 1 */}
              <path d={\`M -150 0 L \${-80 + valX - 15} 0\`} stroke="#000" strokeWidth="2" strokeDasharray="3 3" />
              <text x={-115 + valX/2} y="-10" fill="#000" fontSize="10" textAnchor="middle">k₁</text>

              {/* Spring 2 */}
              <path d={\`M \${-80 + valX + 15} 0 L \${80 + valY - 15} 0\`} stroke="#000" strokeWidth="2" strokeDasharray="3 3" />
              <text x={(valX + valY)/2} y="-10" fill="#000" fontSize="10" textAnchor="middle">k₂</text>

              {/* Spring 3 */}
              <path d={\`M \${80 + valY + 15} 0 L 150 0\`} stroke="#000" strokeWidth="2" strokeDasharray="3 3" />
              <text x={115 + valY/2} y="-10" fill="#000" fontSize="10" textAnchor="middle">k₃</text>`,
  `              {/* Spring 1 */}
              {renderSpring(-150, 0, -80 + valX - 15, 0, 6, 4)}
              <text x={-115 + valX/2} y="-10" fill="#000" fontSize="10" textAnchor="middle">k₁</text>

              {/* Spring 2 */}
              {renderSpring(-80 + valX + 15, 0, 80 + valY - 15, 0, 8, 4)}
              <text x={(valX + valY)/2} y="-10" fill="#000" fontSize="10" textAnchor="middle">k₂</text>

              {/* Spring 3 */}
              {renderSpring(80 + valY + 15, 0, 150, 0, 6, 4)}
              <text x={115 + valY/2} y="-10" fill="#000" fontSize="10" textAnchor="middle">k₃</text>`
);

fs.writeFileSync('src/components/SystemDiagram.tsx', code);
