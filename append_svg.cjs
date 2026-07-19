const fs = require('fs');
let code = fs.readFileSync('src/components/SystemDiagram.tsx', 'utf-8');

const svgCode = `
          {systemId === 'planetary-motion' && (
            <g transform="translate(200, 120)">
              {/* Central Star */}
              <circle cx="0" cy="0" r="15" fill="#facc15" stroke="#000" strokeWidth="2" />
              <text x="0" y="4" fill="#000" fontSize="10" fontWeight="bold" textAnchor="middle">M</text>
              
              {/* Orbit Path (rough approximation for visual) */}
              <circle cx="0" cy="0" r={valR} fill="none" stroke="#ccc" strokeWidth="1" strokeDasharray="4 4" />
              
              {/* Planet Position */}
              <g transform={\`translate(\${valR * Math.cos(theta)}, \${-valR * Math.sin(theta)})\`}>
                <circle cx="0" cy="0" r="6" fill="#3b82f6" stroke="#000" strokeWidth="1.5" />
                <text x="10" y="4" fill="#000" fontSize="10" fontWeight="bold">m</text>
                
                {/* Velocity Vector */}
                <line x1="0" y1="0" x2={-20 * Math.sin(theta)} y2={-20 * Math.cos(theta)} stroke="#ef4444" strokeWidth="1.5" />
                <polygon points={\`\${-20 * Math.sin(theta)},\${-20 * Math.cos(theta)} \${-20 * Math.sin(theta) + 4 * Math.cos(theta - 0.5)},\${-20 * Math.cos(theta) - 4 * Math.sin(theta - 0.5)} \${-20 * Math.sin(theta) - 4 * Math.cos(theta + 0.5)},\${-20 * Math.cos(theta) + 4 * Math.sin(theta + 0.5)}\`} fill="#ef4444" />
              </g>

              {/* Radial Line */}
              <line x1="0" y1="0" x2={valR * Math.cos(theta)} y2={-valR * Math.sin(theta)} stroke="#000" strokeWidth="1" />
              <text x={(valR/2) * Math.cos(theta + 0.1)} y={-(valR/2) * Math.sin(theta + 0.1)} fill="#000" fontSize="10">r</text>
            </g>
          )}

          {systemId === 'physical-pendulum' && (
            <g transform="translate(200, 40)">
              {/* Pivot Point */}
              <circle cx="0" cy="0" r="4" fill="#fff" stroke="#000" strokeWidth="2" />
              <rect x="-15" y="-8" width="30" height="4" fill="#000" />
              
              {/* Dotted Vertical Line */}
              <line x1="0" y1="0" x2="0" y2="100" stroke="#000" strokeWidth="1" strokeDasharray="4 4" />

              {/* The Rod (rotated) */}
              <g transform={\`rotate(\${(theta * 180) / Math.PI})\`}>
                <rect x="-4" y="0" width="8" height="120" rx="4" fill="#000" />
                <circle cx="0" cy="60" r="3" fill="#fff" />
                <text x="12" y="64" fill="#000" fontSize="12" fontWeight="bold">CM</text>
              </g>
              
              {/* Angle Arc */}
              <path 
                d={\`M 0 40 A 40 40 0 0 \${theta >= 0 ? 0 : 1} \${40 * Math.sin(theta)} \${40 * Math.cos(theta)}\`} 
                fill="none" stroke="#000" strokeWidth="1" 
              />
              <text x={20 * Math.sin(theta / 2)} y={40 + 10 * Math.cos(theta / 2)} fill="#000" fontSize="10">θ</text>
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
