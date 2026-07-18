/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PhysicalSystem } from '../types';

export const PHYSICAL_SYSTEMS: PhysicalSystem[] = [
  {
    id: 'simple-pendulum',
    title: 'Simple Pendulum',
    difficulty: 'Beginner',
    shortDescription: 'A point mass swinging from a rigid ceiling pivot under gravity.',
    description: 'A point mass $m$ is suspended from a frictionless pivot by a massless, inextensible string of length $l$. The system is placed in a uniform downward gravitational field $g$. The dynamical variable is the angle $\\theta$ measured from the downward vertical.',
    coordinates: ['theta', 'theta_dot'],
    parameters: ['m', 'l', 'g'],
    allowedVars: ['m', 'l', 'g', 'theta', 'theta_dot'],
    variablesExplanation: [
      { symbol: 'm', meaning: 'Mass of the pendulum bob', unit: 'kg' },
      { symbol: 'l', meaning: 'Length of the string', unit: 'm' },
      { symbol: 'g', meaning: 'Gravitational acceleration (approx. 9.81)', unit: 'm/s²' },
      { symbol: 'theta', meaning: 'Angular displacement from bottom vertical axis', unit: 'rad' },
      { symbol: 'theta_dot', meaning: 'Angular velocity of the bob (dθ/dt)', unit: 'rad/s' }
    ],
    correctT: '0.5 * m * l^2 * theta_dot^2',
    correctV: '-m * g * l * cos(theta)',
    exampleT: '1/2 * m * l^2 * theta_dot^2',
    exampleV: '-m * g * l * cos(theta)',
    referenceVZero: 'Set the reference level V = 0 at the support pivot level (so the bob is at height y = -l * cos(theta)).',
    hints: [
      'The bob moves along a circular arc of radius $l$. What is its linear speed $v$ in terms of the angular velocity $\\dot{\\theta}$?',
      'Since $v = l \\dot{\\theta}$, polar kinetic energy is simply $T = \\frac{1}{2} m v^2 = \\frac{1}{2} m (l \\dot{\\theta})^2$.',
      'For the potential energy, write the height $y$ relative to the pivot. Since $\\theta$ is measured from the downward vertical, the height is $y = -l \\cos\\theta$. Potental energy is $V = m g y$.'
    ]
  },
  {
    id: 'horizontal-spring',
    title: 'Horizontal Mass-Spring',
    difficulty: 'Beginner',
    shortDescription: 'A block on a frictionless table connected to a wall by a spring.',
    description: 'A block of mass $m$ rests on a completely frictionless horizontal table. It is attached to a rigid wall via an ideal linear spring of spring constant $k$ and relaxed length $l_0$. The displacement from equilibrium is represented by the variable $x$.',
    coordinates: ['x', 'x_dot'],
    parameters: ['m', 'k'],
    allowedVars: ['m', 'k', 'x', 'x_dot'],
    variablesExplanation: [
      { symbol: 'm', meaning: 'Mass of the moving block', unit: 'kg' },
      { symbol: 'k', meaning: 'Spring constant / stiffness', unit: 'N/m' },
      { symbol: 'x', meaning: 'Displacement from the spring equilibrium position', unit: 'm' },
      { symbol: 'x_dot', meaning: 'Linear velocity of the mass (dx/dt)', unit: 'm/s' }
    ],
    correctT: '0.5 * m * x_dot^2',
    correctV: '0.5 * k * x^2',
    exampleT: '0.5 * m * x_dot^2',
    exampleV: '0.5 * k * x^2',
    referenceVZero: 'Set V = 0 at the spring relaxed/equilibrium position (x = 0).',
    hints: [
      'Since the motion is completely horizontal in one dimension, the kinetic energy only depends on the mass and linear velocity $\\dot{x}$.',
      'The potential energy is purely elastic and stored in the spring according to Hooke\'s law: $V = \\frac{1}{2} k x^2$. Gravity plays no role horizontally.'
    ]
  },
  {
    id: 'vertical-spring',
    title: 'Vertical Mass-Spring',
    difficulty: 'Intermediate',
    shortDescription: 'A hanging mass suspended from a ceiling by a spring under gravity.',
    description: 'A block of mass $m$ is suspended vertically from a rigid ceiling by an ideal spring of stiffness $k$. Let $y$ be the downward displacement of the mass measured from its unstretched spring length position. Zero gravitational potential is at the ceiling.',
    coordinates: ['y', 'y_dot'],
    parameters: ['m', 'k', 'g'],
    allowedVars: ['m', 'k', 'g', 'y', 'y_dot'],
    variablesExplanation: [
      { symbol: 'm', meaning: 'Mass of the suspended block', unit: 'kg' },
      { symbol: 'k', meaning: 'Spring constant / stiffness', unit: 'N/m' },
      { symbol: 'g', meaning: 'Gravitational acceleration', unit: 'm/s²' },
      { symbol: 'y', meaning: 'Downward displacement from unstretched spring length', unit: 'm' },
      { symbol: 'y_dot', meaning: 'Downward velocity of the mass (dy/dt)', unit: 'm/s' }
    ],
    correctT: '0.5 * m * y_dot^2',
    correctV: '0.5 * k * y^2 - m * g * y',
    exampleT: '1/2 * m * y_dot^2',
    exampleV: '1/2 * k * y^2 - m * g * y',
    referenceVZero: 'Set gravitational V = 0 at the ceiling, and spring V = 0 whenunstretched (y = 0). Note: height of mass below ceiling is -y.',
    hints: [
      'The kinetic energy is standard 1D motion: $T = \\frac{1}{2} m \\dot{y}^2$.',
      'The potential energy consists of two components: elastic energy from spring stretching, plus gravitational potential energy.',
      'The spring stretch length is exactly $y$ (since zero is unstretched), giving elastic energy $\\frac{1}{2} k y^2$.',
      'Since $y$ is measured downward from the ceiling, the vertical position is $-y$ relative to the ceiling. The gravitational energy is therefore $m g (-y) = -m g y$. Combine both for the total $V$.'
    ]
  },
  {
    id: 'bead-rotating-rod',
    title: 'Bead on Rotating Horizontal Rod',
    difficulty: 'Intermediate',
    shortDescription: 'A bead sliding along a rod that rotates horizontally at a constant speed.',
    description: 'A straight rod is located in a horizontal plane and forced to rotate with a constant angular velocity $\\omega$ about a vertical pivot at one end. A bead of mass $m$ slides frictionless along the rod. Let $r$ be the coordinate representing the radial distance from the pivot.',
    coordinates: ['r', 'r_dot'],
    parameters: ['m', 'omega'],
    allowedVars: ['m', 'omega', 'r', 'r_dot'],
    variablesExplanation: [
      { symbol: 'm', meaning: 'Mass of the sliding bead', unit: 'kg' },
      { symbol: 'omega', meaning: 'Constant angular velocity of the rod', unit: 'rad/s' },
      { symbol: 'r', meaning: 'Radial distance of the bead from the pivot', unit: 'm' },
      { symbol: 'r_dot', meaning: 'Radial velocity of the bead (dr/dt)', unit: 'm/s' }
    ],
    correctT: '0.5 * m * (r_dot^2 + r^2 * omega^2)',
    correctV: '0',
    exampleT: '0.5 * m * (r_dot^2 + r^2 * omega^2)',
    exampleV: '0',
    referenceVZero: 'The motion is entirely horizontal, so gravitational potential is a constant. We set V = 0.',
    hints: [
      'Since the rod is horizontal, there is no gravity. Thus potential energy is $V = 0$.',
      'For kinetic energy, represent polar coordinates $(r, \\theta)$. Note that the rod is rotating at a constant rate: $\\theta = \\omega t$, so $\\dot{\\theta} = \\omega$.',
      'In polar coordinates, raw speed squared is $v^2 = \\dot{r}^2 + r^2 \\dot{\\theta}^2$. Substitute $\\dot{\\theta} = \\omega$ and build the regular kinetic energy.'
    ]
  },
  {
    id: 'spring-pendulum',
    title: 'Spring Pendulum (2D Elastic)',
    difficulty: 'Advanced',
    shortDescription: 'A pendulum where the support suspension is an elastic spring.',
    description: 'A mass $m$ is connected to a spring of stiffness $k$ and natural unstretched length $l_0$. The other end of the spring is pivoted freely at a ceiling support. The pendulum can swing and stretch in a 2D vertical plane. The variables are the spring distance $r$ and angle $\\theta$ from the downward vertical.',
    coordinates: ['r', 'r_dot', 'theta', 'theta_dot'],
    parameters: ['m', 'k', 'l0', 'g'],
    allowedVars: ['m', 'k', 'l0', 'g', 'r', 'r_dot', 'theta', 'theta_dot'],
    variablesExplanation: [
      { symbol: 'm', meaning: 'Mass of the pendulum bob', unit: 'kg' },
      { symbol: 'k', meaning: 'Spring constant / stiffness', unit: 'N/m' },
      { symbol: 'l0', meaning: 'Unstretched spring length', unit: 'm' },
      { symbol: 'g', meaning: 'Gravitational acceleration', unit: 'm/s²' },
      { symbol: 'r', meaning: 'Current length of the spring', unit: 'm' },
      { symbol: 'r_dot', meaning: 'Rate of radial spring expansion (dr/dt)', unit: 'm/s' },
      { symbol: 'theta', meaning: 'Angle from the downward vertical axis', unit: 'rad' },
      { symbol: 'theta_dot', meaning: 'Angular velocity of the pendulum (dθ/dt)', unit: 'rad/s' }
    ],
    correctT: '0.5 * m * (r_dot^2 + r^2 * theta_dot^2)',
    correctV: '0.5 * k * (r - l0)^2 - m * g * r * cos(theta)',
    exampleT: '0.5 * m * (r_dot^2 + r^2 * theta_dot^2)',
    exampleV: '1/2 * k * (r - l0)^2 - m * g * r * cos(theta)',
    referenceVZero: 'V = 0 at the pivot support ceiling. Positive height is vertical upwards (mass is down so gravity is negative).',
    hints: [
      'In 2D polar coordinates $(r, \\theta)$, the velocity has two orthogonal components: radial $\\dot{r}$ and angular tangent $r \\dot{\\theta}$.',
      'The speed squared is $v^2 = \\dot{r}^2 + r^2 \\dot{\\theta}^2$. Put this directly into the kinetic energy formula $T = \\frac{1}{2} m v^2$.',
      'Potential energy is twofold: elastic spring expansion energy and gravity.',
      'The spring stretch length is $(r - l_0)$, so the elastic energy is $\\frac{1}{2} k (r - l_0)^2$.',
      'With vertical coordinates centering on the pivot: the height of the mass is $-r \\cos\\theta$. Thus, its gravitational energy is $V_{gravity} = -m g r \\cos\\theta$. Combine both!'
    ]
  },
  {
    id: 'rotating-hoop',
    title: 'Bead on Rotating Vertical Hoop',
    difficulty: 'Advanced',
    shortDescription: 'A bead slides on a circular wire hoop rotating around its vertical axis.',
    description: 'A circular hoop of radius $R$ is forced to rotate with constant angular velocity $\\omega$ about its vertical diameter. A bead of mass $m$ slides frictionless along the hoop wire. The angle $\\theta$ represents the position of the bead relative to the bottom center. Gravitational acceleration is $g$.',
    coordinates: ['theta', 'theta_dot'],
    parameters: ['m', 'g', 'R', 'omega'],
    allowedVars: ['m', 'g', 'R', 'omega', 'theta', 'theta_dot'],
    variablesExplanation: [
      { symbol: 'm', meaning: 'Mass of the sliding bead', unit: 'kg' },
      { symbol: 'g', meaning: 'Gravitational acceleration', unit: 'm/s²' },
      { symbol: 'R', meaning: 'Radius of the wire hoop', unit: 'm' },
      { symbol: 'omega', meaning: 'Constant angular velocity of the hoop rotation', unit: 'rad/s' },
      { symbol: 'theta', meaning: 'Angular position of bead from bottom vertical axis', unit: 'rad' },
      { symbol: 'theta_dot', meaning: 'Rate of change of angular position (dθ/dt)', unit: 'rad/s' }
    ],
    correctT: '0.5 * m * R^2 * (theta_dot^2 + omega^2 * sin(theta)^2)',
    correctV: 'm * g * R * (1 - cos(theta))',
    exampleT: '0.5 * m * R^2 * (theta_dot^2 + omega^2 * sin(theta)^2)',
    exampleV: 'm * g * R * (1 - cos(theta))',
    referenceVZero: 'V = 0 at the bottom-most point of the hoop.',
    hints: [
      'The bead\'s speed has two contributions: its motion along the hoop, and the rotational movement carrying it around the central axis.',
      'For motion along the hoop, the linear speed component is $v_1 = R \\dot{\\theta}$.',
      'For rotating around the central axis, the radius of rotation is the distance to the axis, which is $r_{axis} = R \\sin\\theta$. Thus, the speed due to rotation is $v_2 = r_{axis} \\omega = R \\omega \\sin\\theta$.',
      'Because these two velocity directions are orthogonal, the net speed squared is $v^2 = v_1^2 + v_2^2 = (R \\dot{\\theta})^2 + (R \\omega \\sin\\theta)^2$. Factor out $R^2$ to write $T$.',
      'For potential energy, the height of the bead relative to the bottom point is $h = R - R \\cos\\theta = R(1 - \\cos\\theta)$. Plug this into $m g h$!'
    ]
  },
  {
    id: 'cart-pendulum',
    title: 'Cart and Pivot Pendulum',
    difficulty: 'Expert',
    shortDescription: 'Classic coupled system of a moveable cart and an oscillating pendulum.',
    description: 'A cart of mass $M$ slides horizontally without friction on a linear track. Pivoted to the center of the cart is a pendulum of length $l$ carrying a bob of mass $m$ at its end. Gravity $g$ is pointing down. The coordinates are the cart position tracking variable speed $x_dot$, and the pendulum angle $\\theta$ from downward vertical.',
    coordinates: ['x_dot', 'theta', 'theta_dot'],
    parameters: ['M', 'm', 'g', 'l'],
    allowedVars: ['M', 'm', 'g', 'l', 'x_dot', 'theta', 'theta_dot'],
    variablesExplanation: [
      { symbol: 'M', meaning: 'Mass of the sliding track cart', unit: 'kg' },
      { symbol: 'm', meaning: 'Mass of the pivoted pendulum bob', unit: 'kg' },
      { symbol: 'g', meaning: 'Gravitational acceleration', unit: 'm/s²' },
      { symbol: 'l', meaning: 'Length of the pendulum arm', unit: 'm' },
      { symbol: 'x_dot', meaning: 'Velocity of the sliding cart (dx/dt)', unit: 'm/s' },
      { symbol: 'theta', meaning: 'Angle of the pendulum bob from downward vertical', unit: 'rad' },
      { symbol: 'theta_dot', meaning: 'Angular velocity of the pendulum (dθ/dt)', unit: 'rad/s' }
    ],
    correctT: '0.5 * M * x_dot^2 + 0.5 * m * (x_dot^2 + l^2 * theta_dot^2 + 2 * l * x_dot * theta_dot * cos(theta))',
    correctV: '-m * g * l * cos(theta)',
    exampleT: '0.5 * M * x_dot^2 + 0.5 * m * (x_dot^2 + l^2 * theta_dot^2 + 2*l*x_dot*theta_dot*cos(theta))',
    exampleV: '-m * g * l * cos(theta)',
    referenceVZero: 'V = 0 at the cart track level (the pendulum pivot level). Height downwards represents negative potential.',
    hints: [
      'The kinetic energy is the sum of the cart kinetic energy ($T_{cart} = \\frac{1}{2} M \\dot{x}^2$) and the pendulum bob kinetic energy ($T_{bob} = \\frac{1}{2} m v_{bob}^2$).',
      'To find $v_{bob}^2$, relate the bob coordinates $(x_{bob}, y_{bob})$ to $x$ and $\\theta$: $x_{bob} = x + l \\sin\\theta$ and $y_{bob} = -l \\cos\\theta$.',
      'Take the time derivatives to get velocities: $\\dot{x}_{bob} = \\dot{x} + l \\dot{\\theta} \\cos\\theta$ and $\\dot{y}_{bob} = l \\dot{\\theta} \\sin\\theta$.',
      'Find the speed squared: $v_{bob}^2 = \\dot{x}_{bob}^2 + \\dot{y}_{bob}^2 = (\\dot{x} + l \\dot{\\theta} \\cos\\theta)^2 + (l \\dot{\\theta} \\sin\\theta)^2$. Expand this carefully using algebra!',
      'Using $\\sin^2\\theta + \\cos^2\\theta = 1$, the cross term simplifies to $2 l \\dot{x} \\dot{\\theta} \\cos\\theta$, which yields the bob speed squared: $\\dot{x}^2 + l^2 \\dot{\\theta}^2 + 2 l \\dot{x} \\dot{\\theta} \\cos\\theta$. Combine everything for $T$.',
      'For potential energy, the cart stays at $y=0$ (no contribution). The bob has vertical coordinates $y_{bob} = -l \\cos\\theta$. Gravitational potential is $V = m g y_{bob} = -m g l \\cos\\theta$.'
    ]
  }
,
  {
    id: 'atwood-machine',
    title: 'Atwood Machine (Pulley)',
    difficulty: 'Intermediate',
    shortDescription: 'Two masses connected by a string over a frictionless pulley.',
    description: 'An Atwood machine consists of two masses $m_1$ and $m_2$ connected by an inextensible massless string of total length $l$ passing over a frictionless pulley of negligible mass and radius $R$. Let $y$ be the downward position of $m_1$. The position of $m_2$ is then $(l - \pi R - y)$. Gravity $g$ is pointing down.',
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
      'Both masses move at the same speed because the string is inextensible. If $m_1$ moves down at speed $\dot{y}$, $m_2$ moves up at speed $\dot{y}$.',
      'The total kinetic energy is simply the sum of kinetic energies of both masses.',
      'For potential energy, choose the pulley as $y=0$. The height of $m_1$ is $-y$, and $m_2$ is $-(l - \pi R - y)$. Substitute these into $V = m g h$.'
    ]
  },
  {
    id: 'inclined-plane',
    title: 'Block on Inclined Plane',
    difficulty: 'Beginner',
    shortDescription: 'A block sliding down a frictionless inclined plane.',
    description: 'A block of mass $m$ slides down a frictionless plane inclined at a constant angle $\alpha$ to the horizontal. Let $s$ be the distance the block has slid down the plane from the top. Gravity $g$ is acting downwards.',
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
      'The block only moves along one dimension (the surface of the plane). Its speed is simply $\dot{s}$.',
      'Potential energy depends only on vertical height. Using trigonometry, the vertical drop $h$ corresponding to a slide distance $s$ is $h = s \sin\alpha$.',
      'Since the block is going downwards from the top, its vertical position is $-s \sin\alpha$.'
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

,
    {
    id: 'double-pendulum',
    title: 'Double Pendulum',
    difficulty: 'Expert',
    shortDescription: 'A pendulum with another pendulum attached to its end.',
    description: 'A double pendulum consists of one pendulum of mass $m_1$ and length $l_1$ attached to a fixed support, and a second pendulum of mass $m_2$ and length $l_2$ attached to the mass of the first pendulum. Gravity $g$ is pointing downwards. The coordinates are the angles $\theta_1$ and $\theta_2$ with respect to the downward vertical.',
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
      'Find the Cartesian coordinates of each mass first. For $m_1$, $(x_1, y_1) = (l_1 \sin\theta_1, -l_1 \cos\theta_1)$.',
      'For $m_2$, it hangs from $m_1$, so $(x_2, y_2) = (x_1 + l_2 \sin\theta_2, y_1 - l_2 \cos\theta_2)$.',
      'Take the time derivatives to get velocities $\dot{x}_1, \dot{y}_1, \dot{x}_2, \dot{y}_2$, then compute $v_1^2 = \dot{x}_1^2 + \dot{y}_1^2$ and $v_2^2 = \dot{x}_2^2 + \dot{y}_2^2$.',
      'The kinetic energy is $T = \frac{1}{2}m_1 v_1^2 + \frac{1}{2}m_2 v_2^2$. Use trig identities to simplify the $v_2^2$ term (like $\cos(\theta_1 - \theta_2)$).',
      'The potential energy is simply $V = m_1 g y_1 + m_2 g y_2$.'
    ]
  }
];
