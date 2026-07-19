const fs = require('fs');
let appCode = fs.readFileSync('src/App.tsx', 'utf-8');

const newEqs = `,
  'rolling-wheel-incline': [
    "x'' = (2/3) * g * sin(alpha)"
  ],
  'coupled-oscillators': [
    "x1'' = -(k1+k2)/m1 * x1 + k2/m1 * x2",
    "x2'' = k2/m2 * x1 - (k2+k3)/m2 * x2"
  ],
  'block-wedge': [
    "(M+m)*X'' + m*s''*cos(alpha) = 0",
    "s'' + X''*cos(alpha) - g*sin(alpha) = 0"
  ],
  'swinging-atwood': [
    "(M+m)*r'' - m*r*theta'^2 - M*g + m*g*cos(theta) = 0",
    "r*theta'' + 2*r'*theta' + g*sin(theta) = 0"
  ]
`;

const eqInsertionTarget = "  ]\n};";
const eqIndex = appCode.lastIndexOf(eqInsertionTarget);
if (eqIndex !== -1) {
  appCode = appCode.substring(0, eqIndex) + newEqs + appCode.substring(eqIndex);
  fs.writeFileSync('src/App.tsx', appCode);
  console.log("Equations added successfully.");
} else {
  console.error("Could not find eqInsertionTarget.");
}
