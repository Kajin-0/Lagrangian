const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const newEqs = `,
  'double-pendulum': [
    "theta1'' = (-g*(2*m1+m2)*sin(theta1) - m2*g*sin(theta1-2*theta2) - 2*sin(theta1-theta2)*m2*(theta2_dot^2*l2 + theta1_dot^2*l1*cos(theta1-theta2))) / (l1*(2*m1+m2-m2*cos(2*theta1-2*theta2)))",
    "theta2'' = (2*sin(theta1-theta2)*(theta1_dot^2*l1*(m1+m2) + g*(m1+m2)*cos(theta1) + theta2_dot^2*l2*m2*cos(theta1-theta2))) / (l2*(2*m1+m2-m2*cos(2*theta1-2*theta2)))"
  ],
  'vertical-spring': [
    "y'' + (k/m)*y = g + (k*l0)/m"
  ]
`;

const EOM_END = code.indexOf('};', code.indexOf('const EULER_LAGRANGE_EQUATIONS'));
if (EOM_END !== -1) {
  code = code.substring(0, EOM_END) + newEqs + code.substring(EOM_END);
  fs.writeFileSync('src/App.tsx', code);
  console.log("Eqs added successfully.");
} else {
  console.error("Could not find EOM.");
}
