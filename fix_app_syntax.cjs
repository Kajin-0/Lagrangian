const fs = require('fs');
let appCode = fs.readFileSync('src/App.tsx', 'utf-8');
appCode = appCode.replace(
  `    "theta2'' = (2*sin(theta1-theta2)*(theta1_dot^2*l1*(m1+m2) + g*(m1+m2)*cos(theta1) + theta2_dot^2*l2*m2*cos(theta1-theta2))) / (l2*(2*m1+m2-m2*cos(2*theta1-2*theta2)))"\n,\n  'planetary-motion': [`,
  `    "theta2'' = (2*sin(theta1-theta2)*(theta1_dot^2*l1*(m1+m2) + g*(m1+m2)*cos(theta1) + theta2_dot^2*l2*m2*cos(theta1-theta2))) / (l2*(2*m1+m2-m2*cos(2*theta1-2*theta2)))"\n  ],\n  'planetary-motion': [`
);
fs.writeFileSync('src/App.tsx', appCode);
