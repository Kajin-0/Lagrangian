const fs = require('fs');
let code = fs.readFileSync('src/components/SystemDiagram.tsx', 'utf-8');

const regexes = [
  // simple pendulum bob:
  { sys: 'simple-pendulum', re: /r="14"/, repl: "r={s('m', 14)}" },
  // bead rotating rod:
  { sys: 'bead-rotating-rod', re: /r="9"/, repl: "r={s('m', 9)}" },
  // rotating hoop:
  { sys: 'rotating-hoop', re: /r="13"/, repl: "r={s('m', 13)}" },
  // cart pendulum bob:
  { sys: 'cart-pendulum', re: /r="11"/, repl: "r={s('m', 11)}" },
  // atwood m1 and m2 radii might be wrong in my initial replace
  // ... let's check
];

fs.writeFileSync('src/components/SystemDiagram.tsx', code);
