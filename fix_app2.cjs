const fs = require('fs');
let appCode = fs.readFileSync('src/App.tsx', 'utf-8');

appCode = appCode.replace(
  `  ]\n  ]\n};`,
  `  ]\n};`
);

fs.writeFileSync('src/App.tsx', appCode);
