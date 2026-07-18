const fs = require('fs');
let code = fs.readFileSync('src/components/SystemDiagram.tsx', 'utf-8');

const svgCode = `          {systemId === 'atwood-machine' && (
            <g transform="translate(200, 40)">
              {/* Ceiling Support */}
              <rect x="-20" y="-8" width="40" height="8" rx="2" fill="#000000" />
              {/* Pulley connection */}
              <line x1="0" y1="0" x2="0" y2="20" stroke="#000000" strokeWidth="2" />
              {/* Pulley */}
              <circle cx="0" cy="30" r="15" fill="#ffffff" stroke="#000000" strokeWidth="2" />
              <circle cx="0" cy="30" r="3" fill="#000000" />
              
              {/* Strings */}
              <line x1="-15" y1="30" x2="-15" y2={80 + valY} stroke="#000000" strokeWidth="1.5" />
              <line x1="15" y1="30" x2="15" y2={80 - valY} stroke="#000000" strokeWidth="1.5" />
              
              {/* Masses */}
              <rect x="-27" y={80 + valY} width="24" height="24" rx="2" fill="#000000" />
              <text x="-15" y={80 + valY + 16} fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">m₁</text>
              
              <rect x="3" y={80 - valY} width="24" height="24" rx="2" fill="#000000" />
              <text x="15" y={80 - valY + 16} fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">m₂</text>

              {/* Displacement text */}
              <line x1="-35" y1="80" x2="-35" y2={80 + valY} stroke="#000000" strokeWidth="1" strokeDasharray="3 3" />
              <text x="-40" y={80 + valY / 2} fill="#000000" fontSize="10" textAnchor="end">y</text>
            </g>
          )}

          {systemId === 'inclined-plane' && (
            <g transform="translate(100, 180)">
              {/* The plane */}
              <polygon points="0,0 160,0 0,-100" fill="#ffffff" stroke="#000000" strokeWidth="2" />
              <text x="35" y="-10" fill="#000000" fontSize="10">α</text>
              {/* Angle arc */}
              <path d="M 25 0 A 25 25 0 0 0 21 -13" fill="none" stroke="#000000" strokeWidth="1" />
              
              {/* Block */}
              <g transform={\`translate(\${valX * 160/188}, \${-100 + valX * 100/188})\`}>
                <g transform="rotate(32)">
                  <rect x="-15" y="-30" width="30" height="30" fill="#000000" />
                  <text x="0" y="-11" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">m</text>
                </g>
              </g>
            </g>
          )}

          {systemId === 'projectile-motion' && (
            <g transform="translate(200, 180)">
              {/* Ground */}
              <line x1="-180" y1="0" x2="180" y2="0" stroke="#000000" strokeWidth="2" />
              <line x1="-180" y1="4" x2="180" y2="4" stroke="#000000" strokeWidth="0.5" strokeDasharray="2 2" />
              
              {/* Trajectory (dashed line) */}
              <path d="M -120 0 Q 0 -120 120 0" fill="none" stroke="#000000" strokeWidth="1" strokeDasharray="4 4" />
              
              {/* Mass */}
              <circle cx={valX} cy={valY} r="8" fill="#000000" />
              <text x={valX} y={valY - 12} fill="#000000" fontSize="10" textAnchor="middle">m</text>
              <line x1={valX} y1={valY} x2={valX + 15} y2={valY - 15} stroke="#000000" strokeWidth="1.5" />
              <polygon points={\`\${valX + 15},\${valY - 15} \${valX + 11},\${valY - 17} \${valX + 17},\${valY - 11}\`} fill="#000000" />
              <text x={valX + 22} y={valY - 18} fill="#000000" fontSize="10">v</text>
            </g>
          )}
`;

const EOM_END = code.indexOf('</svg>');
if (EOM_END !== -1) {
  code = code.substring(0, EOM_END) + svgCode + code.substring(EOM_END);
  fs.writeFileSync('src/components/SystemDiagram.tsx', code);
  console.log("SVG added successfully.");
} else {
  console.error("Could not find EOM.");
}
