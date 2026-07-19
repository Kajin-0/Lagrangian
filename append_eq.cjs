const fs = require('fs');

let appCode = fs.readFileSync('src/App.tsx', 'utf-8');

const newEqs = `,
  'planetary-motion': [
    "r'' - r * theta'^2 = -G * M / r^2",
    "r * theta'' + 2 * r' * theta' = 0"
  ],
  'physical-pendulum': [
    "theta'' + (3 * g / (2 * L)) * sin(theta) = 0"
  ]
`;

const EOM_END = appCode.indexOf('  ]\n};', appCode.indexOf('const EULER_LAGRANGE_EQUATIONS'));
if (EOM_END !== -1) {
  appCode = appCode.substring(0, EOM_END) + newEqs + appCode.substring(EOM_END);
  fs.writeFileSync('src/App.tsx', appCode);
  console.log("Eqs added successfully.");
} else {
  console.error("Could not find EOM.");
}
