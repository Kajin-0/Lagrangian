const fs = require('fs');
let code = fs.readFileSync('src/data/systems.ts', 'utf-8');

const newSystems = `
  {
    id: 'atwood-machine',
    title: 'Atwood Machine (Pulley)',
    difficulty: 'Intermediate',
    shortDescription: 'Two masses connected by a string over a frictionless pulley.',
    description: 'An Atwood machine consists of two masses $m_1$ and $m_2$ connected by an inextensible massless string of total length $l$ passing over a frictionless pulley of negligible mass and radius $R$. Let $y$ be the downward position of $m_1$. The position of $m_2$ is then $(l - \\pi R - y)$. Gravity $g$ is pointing down.',
    coordinates: ['y', 'y_dot'],
    parameters: ['m1', 'm2', 'g'],
    allowedVars: ['m1', 'm2', 'g', 'y', 'y_dot'],
    variablesExplanation: [
      { symbol: 'm1', meaning: 'Mass of the first block', unit: 'kg' },
      { symbol: 'm2', meaning: 'Mass of the second block', unit: 'kg' },
      { symbol: 'g', meaning: 'Gravitational acceleration', unit: 'm/s²' },
      { symbol: 'y', meaning: 'Downward position of mass 1', unit: 'm' },
      { symbol: 'y_dot', meaning: 'Downward velocity of mass 1 (dy/dt)', unit: 'm/s' }
    ],
    correctT: '0.5 * (m1 + m2) * y_dot^2',
    correctV: '-m1 * g * y - m2 * g * (l - 3.14159 * R - y)',
    exampleT: '0.5 * (m1 + m2) * y_dot^2',
    exampleV: '-m1 * g * y - m2 * g * (l - 3.14159 * R - y)', // Often l and R constants are absorbed, so it could just be -m1*g*y - m2*g*(l-y) or so. Let's simplify.
    referenceVZero: 'V = 0 at the pulley axis.',
    hints: [
      'Both masses move at the same speed because the string is inextensible. If $m_1$ moves down at speed $\\dot{y}$, $m_2$ moves up at speed $\\dot{y}$.',
      'The total kinetic energy is simply the sum of kinetic energies of both masses.',
      'For potential energy, choose the pulley as $y=0$. The height of $m_1$ is $-y$, and $m_2$ is $-(l - \\pi R - y)$. Substitute these into $V = m g h$.'
    ]
  },
  {
    id: 'inclined-plane',
    title: 'Block on Inclined Plane',
    difficulty: 'Beginner',
    shortDescription: 'A block sliding down a frictionless inclined plane.',
    description: 'A block of mass $m$ slides down a frictionless plane inclined at a constant angle $\\alpha$ to the horizontal. Let $s$ be the distance the block has slid down the plane from the top. Gravity $g$ is acting downwards.',
    coordinates: ['s', 's_dot'],
    parameters: ['m', 'g', 'alpha'],
    allowedVars: ['m', 'g', 'alpha', 's', 's_dot'],
    variablesExplanation: [
      { symbol: 'm', meaning: 'Mass of the block', unit: 'kg' },
      { symbol: 'g', meaning: 'Gravitational acceleration', unit: 'm/s²' },
      { symbol: 'alpha', meaning: 'Angle of incline from horizontal', unit: 'rad' },
      { symbol: 's', meaning: 'Distance slid down along the plane', unit: 'm' },
      { symbol: 's_dot', meaning: 'Velocity along the plane (ds/dt)', unit: 'm/s' }
    ],
    correctT: '0.5 * m * s_dot^2',
    correctV: '-m * g * s * sin(alpha)',
    exampleT: '1/2 * m * s_dot^2',
    exampleV: '-m * g * s * sin(alpha)',
    referenceVZero: 'V = 0 at the top of the incline (s=0).',
    hints: [
      'The block only moves along one dimension (the surface of the plane). Its speed is simply $\\dot{s}$.',
      'Potential energy depends only on vertical height. Using trigonometry, the vertical drop $h$ corresponding to a slide distance $s$ is $h = s \\sin\\alpha$.',
      'Since the block is going downwards from the top, its vertical position is $-s \\sin\\alpha$.'
    ]
  },
  {
    id: 'projectile-motion',
    title: 'Projectile Motion',
    difficulty: 'Intermediate',
    shortDescription: 'A mass moving freely in two dimensions under gravity.',
    description: 'A projectile of mass $m$ is launched in a 2D vertical plane. Its horizontal position is $x$ and vertical position is $y$. The only force acting on it is gravity $g$ downwards (ignoring air resistance).',
    coordinates: ['x', 'x_dot', 'y', 'y_dot'],
    parameters: ['m', 'g'],
    allowedVars: ['m', 'g', 'x', 'x_dot', 'y', 'y_dot'],
    variablesExplanation: [
      { symbol: 'm', meaning: 'Mass of the projectile', unit: 'kg' },
      { symbol: 'g', meaning: 'Gravitational acceleration', unit: 'm/s²' },
      { symbol: 'x', meaning: 'Horizontal position', unit: 'm' },
      { symbol: 'x_dot', meaning: 'Horizontal velocity (dx/dt)', unit: 'm/s' },
      { symbol: 'y', meaning: 'Vertical position (height)', unit: 'm' },
      { symbol: 'y_dot', meaning: 'Vertical velocity (dy/dt)', unit: 'm/s' }
    ],
    correctT: '0.5 * m * (x_dot^2 + y_dot^2)',
    correctV: 'm * g * y',
    exampleT: '1/2 * m * (x_dot^2 + y_dot^2)',
    exampleV: 'm * g * y',
    referenceVZero: 'V = 0 at ground level (y=0).',
    hints: [
      'The total kinetic energy is the sum of horizontal and vertical kinetic energies.',
      'Potential energy depends only on the vertical position $y$.'
    ]
  }
`;

// Insert before the last bracket
const lastIndex = code.lastIndexOf('];');
if (lastIndex !== -1) {
  code = code.substring(0, lastIndex) + ',' + newSystems + '\n];\n';
  fs.writeFileSync('src/data/systems.ts', code);
  console.log("Systems added successfully.");
} else {
  console.error("Could not find end of array.");
}
