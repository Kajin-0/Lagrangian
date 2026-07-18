const fs = require('fs');
let code = fs.readFileSync('src/components/SystemDiagram.tsx', 'utf-8');

const svgCode = `          {systemId === 'double-pendulum' && (
            <g transform="translate(200, 40)">
              {/* Ceiling Support */}
              <rect x="-30" y="-8" width="60" height="8" rx="2" fill="#000000" />
              
              {/* Pivot 1 */}
              <circle cx="0" cy="0" r="4" fill="#ffffff" stroke="#000000" strokeWidth="2" />
              
              {/* Pendulum 1 */}
              <line x1="0" y1="0" x2={70 * Math.sin(theta)} y2={70 * Math.cos(theta)} stroke="#000000" strokeWidth="2.5" />
              <circle cx={70 * Math.sin(theta)} cy={70 * Math.cos(theta)} r="10" fill="#000000" />
              <text x={70 * Math.sin(theta) + 18} y={70 * Math.cos(theta) + 4} fill="#000000" fontSize="11" fontWeight="bold">m₁</text>
              
              {/* Vertical dotted line 1 */}
              <line x1="0" y1="0" x2="0" y2="40" stroke="#000000" strokeWidth="1" strokeDasharray="3 3" />
              {/* Angle 1 arc */}
              <path d={\`M 0 30 A 30 30 0 0 \${theta >= 0 ? 0 : 1} \${30 * Math.sin(theta)} \${30 * Math.cos(theta)}\`} fill="none" stroke="#000000" strokeWidth="1" />
              <text x={12 * Math.sin(theta / 2)} y={30 + 10 * Math.cos(theta / 2)} fill="#000000" fontSize="10">θ₁</text>

              {/* Pivot 2 */}
              <circle cx={70 * Math.sin(theta)} cy={70 * Math.cos(theta)} r="2" fill="#ffffff" />
              
              {/* Pendulum 2 */}
              <line 
                x1={70 * Math.sin(theta)} 
                y1={70 * Math.cos(theta)} 
                x2={70 * Math.sin(theta) + 60 * Math.sin(valAngle)} 
                y2={70 * Math.cos(theta) + 60 * Math.cos(valAngle)} 
                stroke="#000000" strokeWidth="2.5" 
              />
              <circle 
                cx={70 * Math.sin(theta) + 60 * Math.sin(valAngle)} 
                cy={70 * Math.cos(theta) + 60 * Math.cos(valAngle)} 
                r="8" fill="#000000" 
              />
              <text 
                x={70 * Math.sin(theta) + 60 * Math.sin(valAngle) + 15} 
                y={70 * Math.cos(theta) + 60 * Math.cos(valAngle) + 4} 
                fill="#000000" fontSize="11" fontWeight="bold">m₂</text>

              {/* Vertical dotted line 2 */}
              <line 
                x1={70 * Math.sin(theta)} 
                y1={70 * Math.cos(theta)} 
                x2={70 * Math.sin(theta)} 
                y2={70 * Math.cos(theta) + 30} 
                stroke="#000000" strokeWidth="1" strokeDasharray="3 3" 
              />
              {/* Angle 2 arc */}
              <path 
                d={\`M \${70 * Math.sin(theta)} \${70 * Math.cos(theta) + 20} A 20 20 0 0 \${valAngle >= 0 ? 0 : 1} \${70 * Math.sin(theta) + 20 * Math.sin(valAngle)} \${70 * Math.cos(theta) + 20 * Math.cos(valAngle)}\`} 
                fill="none" stroke="#000000" strokeWidth="1" 
              />
              <text 
                x={70 * Math.sin(theta) + 12 * Math.sin(valAngle / 2)} 
                y={70 * Math.cos(theta) + 20 + 8 * Math.cos(valAngle / 2)} 
                fill="#000000" fontSize="10">θ₂</text>
            </g>
          )}

          {systemId === 'vertical-spring' && (
            <g transform="translate(200, 20)">
              {/* Ceiling Support */}
              <rect x="-30" y="-8" width="60" height="8" rx="2" fill="#000000" />
              {/* Hatch marks on ceiling */}
              <line x1="-20" y1="-8" x2="-10" y2="-18" stroke="#000000" strokeWidth="1" />
              <line x1="0" y1="-8" x2="10" y2="-18" stroke="#000000" strokeWidth="1" />
              <line x1="20" y1="-8" x2="30" y2="-18" stroke="#000000" strokeWidth="1" />

              {/* Pivot */}
              <circle cx="0" cy="0" r="4" fill="#ffffff" stroke="#000000" strokeWidth="2" />
              
              {/* Spring */}
              <path 
                d={generateSpringPath(0, 0, 0, valY, 12, 10)} 
                fill="none" stroke="#000000" strokeWidth="1.5" strokeLinejoin="round" 
              />
              <text x="18" y={valY / 2} fill="#000000" fontSize="11" fontWeight="bold">k</text>
              
              {/* Mass */}
              <rect x="-15" y={valY} width="30" height="30" rx="3" fill="#000000" />
              <text x="0" y={valY + 19} fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">m</text>

              {/* Displacement text */}
              <line x1="-35" y1="0" x2="-35" y2={valY + 15} stroke="#000000" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="-40" y1="0" x2="-30" y2="0" stroke="#000000" strokeWidth="1" />
              <line x1="-40" y1={valY + 15} x2="-30" y2={valY + 15} stroke="#000000" strokeWidth="1" />
              <text x="-42" y={valY / 2 + 7} fill="#000000" fontSize="10" textAnchor="end">y</text>

              {/* Rest Length l0 indicator (faint) */}
              <line x1="30" y1="60" x2="45" y2="60" stroke="#000000" strokeWidth="0.5" strokeDasharray="2 2" />
              <text x="50" y="63" fill="#000000" fontSize="9">l₀ (rest)</text>
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
