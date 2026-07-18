const fs = require('fs');
let code = fs.readFileSync('src/data/systems.ts', 'utf-8');

const newSystems = `,
  {
    id: 'double-pendulum',
    title: 'Double Pendulum',
    difficulty: 'Expert',
    shortDescription: 'A pendulum with another pendulum attached to its end.',
    description: 'A double pendulum consists of one pendulum of mass $m_1$ and length $l_1$ attached to a fixed support, and a second pendulum of mass $m_2$ and length $l_2$ attached to the mass of the first pendulum. Gravity $g$ is pointing downwards. The coordinates are the angles $\\theta_1$ and $\\theta_2$ with respect to the downward vertical.',
    coordinates: ['theta1', 'theta1_dot', 'theta2', 'theta2_dot'],
    parameters: ['m1', 'm2', 'l1', 'l2', 'g'],
    allowedVars: ['m1', 'm2', 'l1', 'l2', 'g', 'theta1', 'theta1_dot', 'theta2', 'theta2_dot'],
    variablesExplanation: [
      { symbol: 'm1', meaning: 'Mass of the first pendulum bob', unit: 'kg' },
      { symbol: 'm2', meaning: 'Mass of the second pendulum bob', unit: 'kg' },
      { symbol: 'l1', meaning: 'Length of the first pendulum arm', unit: 'm' },
      { symbol: 'l2', meaning: 'Length of the second pendulum arm', unit: 'm' },
      { symbol: 'g', meaning: 'Gravitational acceleration', unit: 'm/s²' },
      { symbol: 'theta1', meaning: 'Angle of the first pendulum from vertical', unit: 'rad' },
      { symbol: 'theta1_dot', meaning: 'Angular velocity of the first pendulum', unit: 'rad/s' },
      { symbol: 'theta2', meaning: 'Angle of the second pendulum from vertical', unit: 'rad' },
      { symbol: 'theta2_dot', meaning: 'Angular velocity of the second pendulum', unit: 'rad/s' }
    ],
    correctT: '0.5 * m1 * l1^2 * theta1_dot^2 + 0.5 * m2 * (l1^2 * theta1_dot^2 + l2^2 * theta2_dot^2 + 2 * l1 * l2 * theta1_dot * theta2_dot * cos(theta1 - theta2))',
    correctV: '-m1 * g * l1 * cos(theta1) - m2 * g * (l1 * cos(theta1) + l2 * cos(theta2))',
    exampleT: '0.5 * m1 * l1^2 * theta1_dot^2 + 0.5 * m2 * (l1^2 * theta1_dot^2 + l2^2 * theta2_dot^2 + 2*l1*l2*theta1_dot*theta2_dot*cos(theta1 - theta2))',
    exampleV: '-m1 * g * l1 * cos(theta1) - m2 * g * (l1 * cos(theta1) + l2 * cos(theta2))',
    referenceVZero: 'V = 0 at the fixed pivot of the first pendulum. Downward is negative potential.',
    hints: [
      'Find the Cartesian coordinates of each mass first. For $m_1$, $(x_1, y_1) = (l_1 \\sin\\theta_1, -l_1 \\cos\\theta_1)$.',
      'For $m_2$, it hangs from $m_1$, so $(x_2, y_2) = (x_1 + l_2 \\sin\\theta_2, y_1 - l_2 \\cos\\theta_2)$.',
      'Take the time derivatives to get velocities $\\dot{x}_1, \\dot{y}_1, \\dot{x}_2, \\dot{y}_2$, then compute $v_1^2 = \\dot{x}_1^2 + \\dot{y}_1^2$ and $v_2^2 = \\dot{x}_2^2 + \\dot{y}_2^2$.',
      'The kinetic energy is $T = \\frac{1}{2}m_1 v_1^2 + \\frac{1}{2}m_2 v_2^2$. Use trig identities to simplify the $v_2^2$ term (like $\\cos(\\theta_1 - \\theta_2)$).',
      'The potential energy is simply $V = m_1 g y_1 + m_2 g y_2$.'
    ]
  },
  {
    id: 'vertical-spring',
    title: 'Vertical Spring Mass',
    difficulty: 'Beginner',
    shortDescription: 'A mass oscillating vertically on a spring under gravity.',
    description: 'A mass $m$ is hung from a ceiling by a spring of stiffness $k$ and natural unstretched length $l_0$. The system is constrained to move only in the vertical direction. Let $y$ be the downward displacement from the ceiling. Gravity $g$ points down.',
    coordinates: ['y', 'y_dot'],
    parameters: ['m', 'k', 'l0', 'g'],
    allowedVars: ['m', 'k', 'l0', 'g', 'y', 'y_dot'],
    variablesExplanation: [
      { symbol: 'm', meaning: 'Mass of the bob', unit: 'kg' },
      { symbol: 'k', meaning: 'Spring constant', unit: 'N/m' },
      { symbol: 'l0', meaning: 'Unstretched length of the spring', unit: 'm' },
      { symbol: 'g', meaning: 'Gravitational acceleration', unit: 'm/s²' },
      { symbol: 'y', meaning: 'Downward position of the mass from the ceiling', unit: 'm' },
      { symbol: 'y_dot', meaning: 'Downward velocity of the mass', unit: 'm/s' }
    ],
    correctT: '0.5 * m * y_dot^2',
    correctV: '0.5 * k * (y - l0)^2 - m * g * y',
    exampleT: '1/2 * m * y_dot^2',
    exampleV: '1/2 * k * (y - l0)^2 - m * g * y',
    referenceVZero: 'V = 0 for gravity at the ceiling. The spring energy is zero when $y = l_0$.',
    hints: [
      'The kinetic energy is just due to the vertical motion: $T = \\frac{1}{2} m \\dot{y}^2$.',
      'Potential energy has two parts: spring potential and gravitational potential.',
      'The spring stretch is $y - l_0$. The mass is at position $y$ downwards, so its gravitational height is $-y$.'
    ]
  }
`;

const EOM_END = code.lastIndexOf('];');
if (EOM_END !== -1) {
  code = code.substring(0, EOM_END) + newSystems + code.substring(EOM_END);
  fs.writeFileSync('src/data/systems.ts', code);
  console.log("Systems added successfully.");
} else {
  console.error("Could not find EOM.");
}
