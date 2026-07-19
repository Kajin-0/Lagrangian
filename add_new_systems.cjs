const fs = require('fs');

let sysCode = fs.readFileSync('src/data/systems.ts', 'utf-8');

const newSystems = `,
  {
    id: 'rolling-wheel-incline',
    title: 'Rolling Wheel on Incline',
    difficulty: 'Intermediate',
    shortDescription: 'A wheel rolling down a slope without slipping.',
    description: 'A uniform wheel (solid cylinder) of mass $m$ and radius $R$ rolls without slipping down an incline of angle $\\\\alpha$. Let $x$ be the distance the wheel has traveled down the incline. The moment of inertia of a uniform solid cylinder is $I = \\\\frac{1}{2}mR^2$.',
    coordinates: ['x', 'x_dot'],
    parameters: ['m', 'R', 'g', 'alpha'],
    allowedVars: ['m', 'R', 'g', 'alpha', 'x', 'x_dot'],
    variablesExplanation: [
      { symbol: 'm', meaning: 'Mass of the wheel', unit: 'kg' },
      { symbol: 'R', meaning: 'Radius of the wheel', unit: 'm' },
      { symbol: 'g', meaning: 'Gravitational acceleration', unit: 'm/s²' },
      { symbol: 'alpha', meaning: 'Angle of the incline', unit: 'rad' },
      { symbol: 'x', meaning: 'Distance traveled down the incline', unit: 'm' },
      { symbol: 'x_dot', meaning: 'Translational velocity', unit: 'm/s' }
    ],
    correctT: '0.75 * m * x_dot^2',
    correctV: '-m * g * x * sin(alpha)',
    exampleT: '0.5 * m * x_dot^2 + 0.5 * (0.5 * m * R^2) * (x_dot / R)^2',
    exampleV: '-m * g * x * sin(alpha)',
    referenceVZero: 'V = 0 at the starting position (x = 0).',
    hints: [
      'The total kinetic energy is the sum of translational and rotational kinetic energy: $T = \\\\frac{1}{2}mv^2 + \\\\frac{1}{2}I\\\\omega^2$.',
      'The rolling without slipping condition links the translational and angular velocities: $v = \\\\omega R$, or $\\\\omega = \\\\frac{\\\\dot{x}}{R}$.',
      'The vertical drop after traveling a distance $x$ along the incline is $x \\\\sin\\\\alpha$.'
    ]
  },
  {
    id: 'coupled-oscillators',
    title: 'Coupled Oscillators',
    difficulty: 'Intermediate',
    shortDescription: 'Two masses connected by three springs.',
    description: 'Two masses $m_1$ and $m_2$ slide on a frictionless horizontal surface. They are connected to two fixed walls by springs of constants $k_1$ and $k_3$, and to each other by a spring of constant $k_2$. Let $x_1$ and $x_2$ be their displacements from equilibrium.',
    coordinates: ['x1', 'x1_dot', 'x2', 'x2_dot'],
    parameters: ['m1', 'm2', 'k1', 'k2', 'k3'],
    allowedVars: ['m1', 'm2', 'k1', 'k2', 'k3', 'x1', 'x1_dot', 'x2', 'x2_dot'],
    variablesExplanation: [
      { symbol: 'm1', meaning: 'Mass 1', unit: 'kg' },
      { symbol: 'm2', meaning: 'Mass 2', unit: 'kg' },
      { symbol: 'k1', meaning: 'Spring 1 constant', unit: 'N/m' },
      { symbol: 'k2', meaning: 'Coupling spring constant', unit: 'N/m' },
      { symbol: 'k3', meaning: 'Spring 3 constant', unit: 'N/m' },
      { symbol: 'x1', meaning: 'Displacement of mass 1', unit: 'm' },
      { symbol: 'x1_dot', meaning: 'Velocity of mass 1', unit: 'm/s' },
      { symbol: 'x2', meaning: 'Displacement of mass 2', unit: 'm' },
      { symbol: 'x2_dot', meaning: 'Velocity of mass 2', unit: 'm/s' }
    ],
    correctT: '0.5 * m1 * x1_dot^2 + 0.5 * m2 * x2_dot^2',
    correctV: '0.5 * k1 * x1^2 + 0.5 * k2 * (x2 - x1)^2 + 0.5 * k3 * x2^2',
    exampleT: '1/2 * m1 * x1_dot^2 + 1/2 * m2 * x2_dot^2',
    exampleV: '1/2 * k1 * x1^2 + 1/2 * k2 * (x2 - x1)^2 + 1/2 * k3 * x2^2',
    referenceVZero: 'V = 0 at the equilibrium positions.',
    hints: [
      'The kinetic energy is simply the sum of the kinetic energies of each mass.',
      'The potential energy is the sum of the elastic potential energies stored in all three springs.',
      'The stretch of the middle spring is the difference in displacements of the two masses, $(x_2 - x_1)$.'
    ]
  },
  {
    id: 'block-wedge',
    title: 'Block on a Movable Wedge',
    difficulty: 'Advanced',
    shortDescription: 'A block sliding down a wedge that can slide horizontally.',
    description: 'A wedge of mass $M$ is free to slide on a frictionless horizontal floor. A block of mass $m$ slides down the frictionless face of the wedge, which has an angle $\\\\alpha$. Let $X$ be the horizontal position of the wedge, and $s$ be the distance the block has slid down the wedge from the top.',
    coordinates: ['X', 'X_dot', 's', 's_dot'],
    parameters: ['M', 'm', 'g', 'alpha'],
    allowedVars: ['M', 'm', 'g', 'alpha', 'X', 'X_dot', 's', 's_dot'],
    variablesExplanation: [
      { symbol: 'M', meaning: 'Mass of the wedge', unit: 'kg' },
      { symbol: 'm', meaning: 'Mass of the block', unit: 'kg' },
      { symbol: 'g', meaning: 'Gravitational acceleration', unit: 'm/s²' },
      { symbol: 'alpha', meaning: 'Angle of the wedge', unit: 'rad' },
      { symbol: 'X', meaning: 'Horizontal position of the wedge', unit: 'm' },
      { symbol: 'X_dot', meaning: 'Velocity of the wedge', unit: 'm/s' },
      { symbol: 's', meaning: 'Distance block has slid down wedge', unit: 'm' },
      { symbol: 's_dot', meaning: 'Velocity of block relative to wedge', unit: 'm/s' }
    ],
    correctT: '0.5 * M * X_dot^2 + 0.5 * m * (X_dot^2 + s_dot^2 + 2 * X_dot * s_dot * cos(alpha))',
    correctV: '-m * g * s * sin(alpha)',
    exampleT: '1/2 * M * X_dot^2 + 1/2 * m * ((X_dot + s_dot * cos(alpha))^2 + (-s_dot * sin(alpha))^2)',
    exampleV: '-m * g * s * sin(alpha)',
    referenceVZero: 'V = 0 at the top of the wedge (s = 0).',
    hints: [
      'The wedge moves horizontally with velocity $\\\\dot{X}$.',
      'The block\\'s velocity vector has two components: the wedge\\'s velocity $\\\\dot{X}$ horizontally, plus its relative velocity $\\\\dot{s}$ parallel to the wedge surface.',
      'The block\\'s total velocity squared is $v^2 = v_x^2 + v_y^2$, where $v_x = \\\\dot{X} + \\\\dot{s} \\\\cos\\\\alpha$ and $v_y = -\\\\dot{s} \\\\sin\\\\alpha$.'
    ]
  },
  {
    id: 'swinging-atwood',
    title: 'Swinging Atwood Machine',
    difficulty: 'Advanced',
    shortDescription: 'An Atwood machine with a swinging mass.',
    description: 'An Atwood machine where one mass $M$ is constrained to move vertically, and the other mass $m$ can swing as a pendulum in a 2D plane. The total length of the string is $L$. Let $r$ be the distance from the pulley to the swinging mass $m$, and $\\\\theta$ be its angular deflection. Then the distance to $M$ is $L - r$.',
    coordinates: ['r', 'r_dot', 'theta', 'theta_dot'],
    parameters: ['M', 'm', 'g', 'L'],
    allowedVars: ['M', 'm', 'g', 'L', 'r', 'r_dot', 'theta', 'theta_dot'],
    variablesExplanation: [
      { symbol: 'M', meaning: 'Counterweight mass', unit: 'kg' },
      { symbol: 'm', meaning: 'Swinging mass', unit: 'kg' },
      { symbol: 'g', meaning: 'Gravitational acceleration', unit: 'm/s²' },
      { symbol: 'L', meaning: 'Total length of string', unit: 'm' },
      { symbol: 'r', meaning: 'Length of the swinging part of string', unit: 'm' },
      { symbol: 'r_dot', meaning: 'Radial velocity of swinging mass', unit: 'm/s' },
      { symbol: 'theta', meaning: 'Angle of swinging mass', unit: 'rad' },
      { symbol: 'theta_dot', meaning: 'Angular velocity of swinging mass', unit: 'rad/s' }
    ],
    correctT: '0.5 * M * r_dot^2 + 0.5 * m * (r_dot^2 + r^2 * theta_dot^2)',
    correctV: 'M * g * r - m * g * r * cos(theta)',
    exampleT: '1/2 * M * (-r_dot)^2 + 1/2 * m * (r_dot^2 + r^2 * theta_dot^2)',
    exampleV: '-M * g * (L - r) - m * g * r * cos(theta)',
    referenceVZero: 'V = 0 at the pulley, neglecting constant offset -MgL.',
    hints: [
      'The velocity of $M$ is purely vertical, and equal to $-\\\\dot{r}$ (since its position is $y = L - r$).',
      'The velocity of $m$ is expressed in polar coordinates: $v^2 = \\\\dot{r}^2 + r^2 \\\\dot{\\\\theta}^2$.',
      'The potential energy of $M$ is $-Mg(L-r)$. We can ignore the constant $-MgL$ part.'
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
