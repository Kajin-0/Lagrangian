const fs = require('fs');

// 1. Data systems
let sysCode = fs.readFileSync('src/data/systems.ts', 'utf-8');
const newSystems = `,
  {
    id: 'spherical-pendulum',
    title: 'Spherical Pendulum',
    difficulty: 'Advanced',
    shortDescription: 'A pendulum free to swing in three dimensions.',
    description: 'A mass $m$ is suspended from a pivot by a massless string of length $L$, free to swing in 3D space. Use spherical coordinates with $\\\\theta$ as the polar angle (from the downward vertical) and $\\\\phi$ as the azimuthal angle.',
    coordinates: ['theta', 'theta_dot', 'phi', 'phi_dot'],
    parameters: ['m', 'L', 'g'],
    allowedVars: ['m', 'L', 'g', 'theta', 'theta_dot', 'phi', 'phi_dot'],
    variablesExplanation: [
      { symbol: 'm', meaning: 'Mass of the bob', unit: 'kg' },
      { symbol: 'L', meaning: 'Length of the pendulum string', unit: 'm' },
      { symbol: 'g', meaning: 'Gravitational acceleration', unit: 'm/s²' },
      { symbol: 'theta', meaning: 'Polar angle (from downward vertical)', unit: 'rad' },
      { symbol: 'theta_dot', meaning: 'Polar angular velocity', unit: 'rad/s' },
      { symbol: 'phi', meaning: 'Azimuthal angle', unit: 'rad' },
      { symbol: 'phi_dot', meaning: 'Azimuthal angular velocity', unit: 'rad/s' }
    ],
    correctT: '0.5 * m * L^2 * (theta_dot^2 + (sin(theta))^2 * phi_dot^2)',
    correctV: '-m * g * L * cos(theta)',
    exampleT: '1/2 * m * L^2 * (theta_dot^2 + sin(theta)^2 * phi_dot^2)',
    exampleV: '-m * g * L * cos(theta)',
    referenceVZero: 'V = 0 at the pivot.',
    hints: [
      'The kinetic energy is $T = \\\\frac{1}{2}m v^2$. In spherical coordinates with constant $L$, $v^2 = L^2 \\\\dot{\\\\theta}^2 + L^2 \\\\sin^2\\\\theta \\\\dot{\\\\phi}^2$.',
      'The potential energy depends on the vertical height $z = -L \\\\cos\\\\theta$.'
    ]
  },
  {
    id: 'particle-cone',
    title: 'Particle in a Cone',
    difficulty: 'Advanced',
    shortDescription: 'A particle sliding inside a frictionless inverted cone.',
    description: 'A particle of mass $m$ is constrained to slide on the inside surface of a frictionless inverted cone. The cone\\'s surface is described by $z = c \\\\rho$ in cylindrical coordinates, where $c$ is a constant slope. Let $\\\\rho$ be the horizontal radius from the axis, and $\\\\phi$ the azimuthal angle.',
    coordinates: ['rho', 'rho_dot', 'phi', 'phi_dot'],
    parameters: ['m', 'c', 'g'],
    allowedVars: ['m', 'c', 'g', 'rho', 'rho_dot', 'phi', 'phi_dot'],
    variablesExplanation: [
      { symbol: 'm', meaning: 'Mass of the particle', unit: 'kg' },
      { symbol: 'c', meaning: 'Slope of the cone (z = c * rho)', unit: 'dimensionless' },
      { symbol: 'g', meaning: 'Gravitational acceleration', unit: 'm/s²' },
      { symbol: 'rho', meaning: 'Horizontal distance from central axis', unit: 'm' },
      { symbol: 'rho_dot', meaning: 'Radial velocity', unit: 'm/s' },
      { symbol: 'phi', meaning: 'Azimuthal angle', unit: 'rad' },
      { symbol: 'phi_dot', meaning: 'Azimuthal angular velocity', unit: 'rad/s' }
    ],
    correctT: '0.5 * m * ((1 + c^2) * rho_dot^2 + rho^2 * phi_dot^2)',
    correctV: 'm * g * c * rho',
    exampleT: '1/2 * m * (rho_dot^2 + rho^2 * phi_dot^2 + c^2 * rho_dot^2)',
    exampleV: 'm * g * c * rho',
    referenceVZero: 'V = 0 at the apex of the cone (rho = 0).',
    hints: [
      'The velocity in cylindrical coordinates is $v^2 = \\\\dot{\\\\rho}^2 + \\\\rho^2\\\\dot{\\\\phi}^2 + \\\\dot{z}^2$.',
      'Since $z = c\\\\rho$, taking the time derivative gives $\\\\dot{z} = c\\\\dot{\\\\rho}$. Substitute this into $T$.',
      'Potential energy is $V = mgz = mgc\\\\rho$.'
    ]
  }
`;
const sysEomIndex = sysCode.lastIndexOf('];');
sysCode = sysCode.substring(0, sysEomIndex) + newSystems + sysCode.substring(sysEomIndex);
fs.writeFileSync('src/data/systems.ts', sysCode);

// 2. EOMs
let appCode = fs.readFileSync('src/App.tsx', 'utf-8');
const newEqs = `,
  'spherical-pendulum': [
    "theta'' + (g/L)*sin(theta) - sin(theta)*cos(theta)*phi'^2 = 0",
    "phi'' + 2*cot(theta)*theta'*phi' = 0"
  ],
  'particle-cone': [
    "rho'' - rho*phi'^2/(1+c^2) + g*c/(1+c^2) = 0",
    "phi'' + 2*rho'*phi'/rho = 0"
  ]
`;
const eqInsertionTarget = "  ]\n};";
const eqIndex = appCode.lastIndexOf(eqInsertionTarget);
appCode = appCode.substring(0, eqIndex) + newEqs + appCode.substring(eqIndex);

appCode = appCode.replace(
  `case 'theta_dot': return "θ̇ (θ')";`,
  `case 'theta_dot': return "θ̇ (θ')";\n    case 'phi': return 'φ';\n    case 'phi_dot': return "φ̇ (φ')";\n    case 'rho': return 'ρ';\n    case 'rho_dot': return "ρ̇ (ρ')";`
);
fs.writeFileSync('src/App.tsx', appCode);

// 3. Diagrams
let code = fs.readFileSync('src/components/SystemDiagram.tsx', 'utf-8');

// Labels for block-wedge
code = code.replace(
  `<text x="10" y="-5" fill="#000" fontSize="10" fontWeight="bold" textAnchor="middle">m</text>`,
  `<text x="10" y="-5" fill="#000" fontSize="10" fontWeight="bold" textAnchor="middle">m</text>
                  <line x1="22" y1="-10" x2="35" y2="-10" stroke="#000" strokeWidth="1.5" />
                  <polygon points="35,-10 31,-13 31,-7" fill="#000" />
                  <text x="40" y="-6" fill="#000" fontSize="10" fontStyle="italic">ṡ</text>`
);
code = code.replace(
  `<text x="-30" y="-10" fill="#000" fontSize="12" fontWeight="bold">M</text>`,
  `<text x="-30" y="-10" fill="#000" fontSize="12" fontWeight="bold">M</text>
            <line x1="10" y1="-10" x2="30" y2="-10" stroke="#000" strokeWidth="1.5" />
            <polygon points="30,-10 26,-13 26,-7" fill="#000" />
            <text x="35" y="-6" fill="#000" fontSize="10" fontStyle="italic">Ẋ</text>`
);

// Sim logic
const simCode = `      } else if (systemId === 'spherical-pendulum') {
    const currentTheta = 0.6 + 0.3 * Math.sin(time * 2); 
    const currentPhi = (time * 1.5) % 6.28;
    setTheta(currentTheta);
    setValAngle(currentPhi);
  } else if (systemId === 'particle-cone') {
    const currentRho = 60 + 20 * Math.sin(time * 3);
    const currentPhi = (time * 2) % 6.28;
    setValR(currentRho);
    setValAngle(currentPhi);
`;
const insertionPoint = "} else if (systemId === 'cart-pendulum') {";
const sIndex = code.indexOf(insertionPoint);
code = code.substring(0, sIndex) + simCode + code.substring(sIndex);

// Sliders
const sliderCode = `
        {systemId === 'spherical-pendulum' && (
          <>
            <div className="flex flex-col">
              <div className="flex justify-between text-[11px] font-mono font-bold text-black">
                <span className="truncate">θ (Polar):</span>
                <span className="tabular-nums whitespace-nowrap">{theta.toFixed(2)} rad</span>
              </div>
              <input
                type="range"
                min="0"
                max="1.5"
                step="0.01"
                value={theta}
                onChange={(e) => setTheta(parseFloat(e.target.value))}
                className="w-full h-1 bg-black appearance-none cursor-pointer mt-1"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex justify-between text-[11px] font-mono font-bold text-black">
                <span className="truncate">φ (Azimuthal):</span>
                <span className="tabular-nums whitespace-nowrap">{valAngle.toFixed(2)} rad</span>
              </div>
              <input
                type="range"
                min="0"
                max="6.28"
                step="0.01"
                value={valAngle}
                onChange={(e) => setValAngle(parseFloat(e.target.value))}
                className="w-full h-1 bg-black appearance-none cursor-pointer mt-1"
              />
            </div>
          </>
        )}
        {systemId === 'particle-cone' && (
          <>
            <div className="flex flex-col">
              <div className="flex justify-between text-[11px] font-mono font-bold text-black">
                <span className="truncate">ρ (Radius):</span>
                <span className="tabular-nums whitespace-nowrap">{valR.toFixed(1)} m</span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                step="1"
                value={valR}
                onChange={(e) => setValR(parseFloat(e.target.value))}
                className="w-full h-1 bg-black appearance-none cursor-pointer mt-1"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex justify-between text-[11px] font-mono font-bold text-black">
                <span className="truncate">φ (Azimuthal):</span>
                <span className="tabular-nums whitespace-nowrap">{valAngle.toFixed(2)} rad</span>
              </div>
              <input
                type="range"
                min="0"
                max="6.28"
                step="0.01"
                value={valAngle}
                onChange={(e) => setValAngle(parseFloat(e.target.value))}
                className="w-full h-1 bg-black appearance-none cursor-pointer mt-1"
              />
            </div>
          </>
        )}
`;
const sliderTarget = "{systemId === 'atwood-machine' && ("; 
const sliderIndex = code.lastIndexOf(sliderTarget);
code = code.substring(0, sliderIndex) + sliderCode + code.substring(sliderIndex);

// SVG
const svgCode = `
      {systemId === 'spherical-pendulum' && (
        <g transform="translate(200, 50)">
          {/* Pivot */}
          <circle cx="0" cy="0" r="4" fill="#fff" stroke="#000" strokeWidth="2" />
          <rect x="-15" y="-8" width="30" height="4" fill="#000" />
          <line x1="0" y1="0" x2="0" y2="150" stroke="#ccc" strokeWidth="1" strokeDasharray="4 4" />
          
          {/* Calculate 3D projection. Z is down. Isometric perspective */}
          <g transform={\`translate(\${120 * Math.sin(theta) * Math.cos(valAngle)}, \${120 * Math.cos(theta) - 15 * Math.sin(theta) * Math.sin(valAngle)})\`}>
            <line x1={\`-120 * Math.sin(theta) * Math.cos(valAngle)\`} y1={\`-120 * Math.cos(theta) + 15 * Math.sin(theta) * Math.sin(valAngle)\`} x2="0" y2="0" stroke="#000" strokeWidth="2" />
            <circle cx="0" cy="0" r="10" fill={Math.sin(valAngle) > 0 ? "#fff" : "#eee"} stroke="#000" strokeWidth="2" />
            <text x="15" y="4" fill="#000" fontSize="12" fontWeight="bold">m</text>
          </g>
          
          {/* Path ellipse rough trace */}
          <ellipse cx="0" cy={120 * Math.cos(theta)} rx={120 * Math.sin(theta)} ry={15 * Math.sin(theta)} fill="none" stroke="#ddd" strokeWidth="1" strokeDasharray="2 2" />
        </g>
      )}

      {systemId === 'particle-cone' && (
        <g transform="translate(200, 40)">
          {/* Cone outline (cross section) */}
          <polygon points="0,150 -100,0 100,0" fill="none" stroke="#000" strokeWidth="2" />
          <ellipse cx="0" cy="0" rx="100" ry="20" fill="none" stroke="#000" strokeWidth="1" />
          <line x1="0" y1="0" x2="0" y2="170" stroke="#ccc" strokeWidth="1" strokeDasharray="4 4" />

          {/* c is slope, let's say c=1.5 so z = 1.5 * rho */}
          <g transform={\`translate(\${valR * Math.cos(valAngle)}, \${150 - 1.5 * valR - 0.2 * valR * Math.sin(valAngle)})\`}>
            <circle cx="0" cy="0" r="8" fill={Math.sin(valAngle) > 0 ? "#fff" : "#ccc"} stroke="#000" strokeWidth="2" />
            <text x="12" y="4" fill="#000" fontSize="12" fontWeight="bold">m</text>
          </g>

          {/* Trace orbit circle at current z */}
          <ellipse cx="0" cy={150 - 1.5 * valR} rx={valR} ry={0.2 * valR} fill="none" stroke="#999" strokeWidth="1" strokeDasharray="2 2" />
        </g>
      )}
`;
const svgEomIndex = code.indexOf('</svg>');
code = code.substring(0, svgEomIndex) + svgCode + code.substring(svgEomIndex);

fs.writeFileSync('src/components/SystemDiagram.tsx', code);
console.log("All updates applied.");
