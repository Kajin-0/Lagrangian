const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const newEqs = `,
  'atwood-machine': [
    "y'' - ((m1 - m2) / (m1 + m2)) * g = 0"
  ],
  'inclined-plane': [
    "s'' - g * sin(alpha) = 0"
  ],
  'projectile-motion': [
    "x'' = 0",
    "y'' + g = 0"
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
