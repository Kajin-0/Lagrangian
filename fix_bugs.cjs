const fs = require('fs');
let code = fs.readFileSync('src/components/SystemDiagram.tsx', 'utf-8');

// Fix spherical pendulum line
code = code.replace(
  'x1={`-120 * Math.sin(theta) * Math.cos(valAngle)`} y1={`-120 * Math.cos(theta) + 15 * Math.sin(theta) * Math.sin(valAngle)`}',
  'x1={-120 * Math.sin(theta) * Math.cos(valAngle)} y1={-120 * Math.cos(theta) + 15 * Math.sin(theta) * Math.sin(valAngle)}'
);

// Fix particle-cone sim
code = code.replace(
  'const currentRho = 60 + 20 * Math.sin(time * 3);',
  'const currentRho = 45 + 20 * Math.sin(time * 3);'
);

// Fix particle-cone slider max
code = code.replace(
  '<input\n                type="range"\n                min="20"\n                max="100"',
  '<input\n                type="range"\n                min="20"\n                max="75"'
);

// Block-wedge velocity vector:
// The user said: "does block on a movable wedge need a velocity vector? if not no worries... just make sure you include necessary labels"
// We already added s_dot and X_dot labels in the previous run!
// Let's verify if they are there.

fs.writeFileSync('src/components/SystemDiagram.tsx', code);
