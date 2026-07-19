const fs = require('fs');

let sysCode = fs.readFileSync('src/data/systems.ts', 'utf-8');

const newSystems = `,
  {
    id: 'planetary-motion',
    title: 'Planetary Motion',
    difficulty: 'Intermediate',
    shortDescription: 'A planet orbiting a massive star under gravity.',
    description: 'A planet of mass $m$ orbits a star of mass $M$. The star is much heavier and assumed fixed at the origin. Use polar coordinates $(r, \\theta)$ for the planet, where $r$ is the radial distance from the star, and $\\theta$ is the angular position. The gravitational constant is $G$.',
    coordinates: ['r', 'r_dot', 'theta', 'theta_dot'],
    parameters: ['m', 'M', 'G'],
    allowedVars: ['m', 'M', 'G', 'r', 'r_dot', 'theta', 'theta_dot'],
    variablesExplanation: [
      { symbol: 'm', meaning: 'Mass of the planet', unit: 'kg' },
      { symbol: 'M', meaning: 'Mass of the star', unit: 'kg' },
      { symbol: 'G', meaning: 'Gravitational constant', unit: 'N·m²/kg²' },
      { symbol: 'r', meaning: 'Radial distance from the star', unit: 'm' },
      { symbol: 'r_dot', meaning: 'Radial velocity', unit: 'm/s' },
      { symbol: 'theta', meaning: 'Angular position', unit: 'rad' },
      { symbol: 'theta_dot', meaning: 'Angular velocity', unit: 'rad/s' }
    ],
    correctT: '0.5 * m * (r_dot^2 + r^2 * theta_dot^2)',
    correctV: '-G * m * M / r',
    exampleT: '1/2 * m * (r_dot^2 + r^2 * theta_dot^2)',
    exampleV: '-G * m * M / r',
    referenceVZero: 'V = 0 at r = infinity.',
    hints: [
      'The velocity vector in polar coordinates is $\\\\vec{v} = \\\\dot{r}\\\\hat{r} + r\\\\dot{\\\\theta}\\\\hat{\\\\theta}$.',
      'Kinetic energy is $T = \\\\frac{1}{2} m v^2 = \\\\frac{1}{2} m (\\\\dot{r}^2 + r^2 \\\\dot{\\\\theta}^2)$.',
      'The potential energy for Newton\\'s law of universal gravitation is $V = -\\\\frac{GmM}{r}$.'
    ]
  },
  {
    id: 'physical-pendulum',
    title: 'Physical Pendulum (Falling Stick)',
    difficulty: 'Beginner',
    shortDescription: 'A uniform rod swinging from a pivot at one end.',
    description: 'A uniform rod of mass $m$ and length $L$ is pivoted at one of its ends and oscillates under gravity $g$. Its moment of inertia about the pivot is $I = \\\\frac{1}{3}mL^2$. Let $\\\\theta$ be the angle from the downward vertical.',
    coordinates: ['theta', 'theta_dot'],
    parameters: ['m', 'L', 'g'],
    allowedVars: ['m', 'L', 'g', 'theta', 'theta_dot'],
    variablesExplanation: [
      { symbol: 'm', meaning: 'Mass of the rod', unit: 'kg' },
      { symbol: 'L', meaning: 'Length of the rod', unit: 'm' },
      { symbol: 'g', meaning: 'Gravitational acceleration', unit: 'm/s²' },
      { symbol: 'theta', meaning: 'Angle from the downward vertical', unit: 'rad' },
      { symbol: 'theta_dot', meaning: 'Angular velocity', unit: 'rad/s' }
    ],
    correctT: '1/6 * m * L^2 * theta_dot^2',
    correctV: '-m * g * (L / 2) * cos(theta)',
    exampleT: '1/2 * (1/3 * m * L^2) * theta_dot^2',
    exampleV: '-m * g * (L / 2) * cos(theta)',
    referenceVZero: 'V = 0 at the pivot point.',
    hints: [
      'The kinetic energy of a purely rotating rigid body is $T = \\\\frac{1}{2} I \\\\dot{\\\\theta}^2$.',
      'The moment of inertia of a rod about its end is $I = \\\\frac{1}{3} m L^2$.',
      'The potential energy depends on the height of the center of mass. The CM is at distance $L/2$ from the pivot, so its height is $-\\\\frac{L}{2} \\\\cos\\\\theta$.'
    ]
  }
`;

const EOM_END = sysCode.lastIndexOf('];');
if (EOM_END !== -1) {
  sysCode = sysCode.substring(0, EOM_END) + newSystems + sysCode.substring(EOM_END);
  fs.writeFileSync('src/data/systems.ts', sysCode);
  console.log("Systems added successfully.");
} else {
  console.error("Could not find EOM.");
}
