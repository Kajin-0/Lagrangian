const fs = require('fs');
let code = fs.readFileSync('src/components/SystemDiagram.tsx', 'utf-8');

// Fix the 's' scale function
// If variations is 2, 3, 4, it should scale slightly but keep everything in view.
// We can use: base * (1 + (variations[label] - 1) * 0.2)
code = code.replace(
  `const s = (label: string, base: number) => variations && variations[label] !== undefined ? base * (variations[label] / 2) : base;`,
  `const s = (label: string, base: number) => variations && variations[label] !== undefined ? base * (1 + (variations[label] - 1) * 0.2) : base;`
);

// Fix the remaining labels
const replacer = (search, replacement) => {
  code = code.split(search).join(replacement);
};

replacer('>m1<', '>{v(\\\'m1\\\')}<');
replacer('>m2<', '>{v(\\\'m2\\\')}<');
replacer('>k1<', '>{v(\\\'k1\\\')}<');
replacer('>k2<', '>{v(\\\'k2\\\')}<');
replacer('>k3<', '>{v(\\\'k3\\\')}<');
replacer('>m₁<', '>{v(\\\'m1\\\')}<');
replacer('>m₂<', '>{v(\\\'m2\\\')}<');

replacer('>Length: l<', '>Length: {v(\\\'l\\\')}<');
replacer('>Gravity: g (down)<', '>Gravity: {v(\\\'g\\\')} (down)<');
replacer('>Gravity: g<', '>Gravity: {v(\\\'g\\\')}<');
replacer('>Coeff: k<', '>Coeff: {v(\\\'k\\\')}<');
replacer('>Spring: k, l0<', '>Spring: {v(\\\'k\\\')}, {v(\\\'l0\\\')}<');
replacer('>Mass: m<', '>Mass: {v(\\\'m\\\')}<');
replacer('>Pendulum length: l<', '>Pendulum length: {v(\\\'l\\\')}<');
replacer('>Elastic parameter: k<', '>Elastic parameter: {v(\\\'k\\\')}<');

fs.writeFileSync('src/components/SystemDiagram.tsx', code);
