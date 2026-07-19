const fs = require('fs');
let code = fs.readFileSync('src/components/SystemDiagram.tsx', 'utf-8');

const replacer = (systemId, rules) => {
  const parts = code.split(new RegExp(`\\{\\/\\* SYSTEM ID MATCHED \\*\\/\\}\\s*\\{systemId === '${systemId}' && \\(|\\{\\/\\* SYSTEM \\d+: [^*]+\\*\\/\\}\\s*\\{systemId === '${systemId}' && \\(`));
  if (parts.length === 2) {
    const endIdx = parts[1].indexOf('</g>');
    let chunk = parts[1].substring(0, endIdx);
    
    for (const rule of rules) {
      if (typeof rule[0] === 'string') {
        chunk = chunk.replaceAll(rule[0], rule[1]);
      } else {
        chunk = chunk.replace(rule[0], rule[1]);
      }
    }
    
    parts[1] = chunk + parts[1].substring(endIdx);
    code = parts.join(`{/* SYSTEM ID MATCHED */}\n          {systemId === '${systemId}' && (`);
  }
};

replacer('simple-pendulum', [
  ['160 * Math.sin(theta)', "s('l', 160) * Math.sin(theta)"],
  ['160 * Math.cos(theta)', "s('l', 160) * Math.cos(theta)"],
  ['r="15"', "r={s('m', 15)}"],
]);

replacer('horizontal-spring', [
  ['r="15"', "r={s('m', 15)}"],
  ['valX - 15', "valX - s('m', 15)"],
  ['15 * Math.sin(time * 3)', "s('m', 15) * Math.sin(time * 3)"]
]);

replacer('vertical-spring', [
  ['r="15"', "r={s('m', 15)}"],
  ['valY - 15', "valY - s('m', 15)"]
]);

replacer('bead-rotating-rod', [
  ['r="10"', "r={s('m', 10)}"]
]);

replacer('spring-pendulum', [
  ['r="12"', "r={s('m', 12)}"],
]);

replacer('rotating-hoop', [
  ['r="10"', "r={s('m', 10)}"],
]);

replacer('cart-pendulum', [
  ['width="50"', "width={s('M', 50)}"],
  ['height="30"', "height={s('M', 30)}"],
  ['r="12"', "r={s('m', 12)}"],
  ['100 * Math.sin(theta)', "s('l', 100) * Math.sin(theta)"],
  ['100 * Math.cos(theta)', "s('l', 100) * Math.cos(theta)"],
]);

replacer('atwood-machine', [
  ['r="14"', "r={s('m1', 14)}"],
  ['r="10"', "r={s('m2', 10)}"],
]);

replacer('inclined-plane', [
  ['width="30"', "width={s('m', 30)}"],
  ['height="30"', "height={s('m', 30)}"],
]);

replacer('projectile-motion', [
  ['r="10"', "r={s('m', 10)}"],
]);

replacer('double-pendulum', [
  ['70 * Math.sin(theta)', "s('l1', 70) * Math.sin(theta)"],
  ['70 * Math.cos(theta)', "s('l1', 70) * Math.cos(theta)"],
  ['50 * Math.sin(valAngle)', "s('l2', 50) * Math.sin(valAngle)"],
  ['50 * Math.cos(valAngle)', "s('l2', 50) * Math.cos(valAngle)"],
  ['r="14"', "r={s('m1', 14)}"],
  ['r="10"', "r={s('m2', 10)}"],
]);

replacer('planetary-motion', [
  ['r="8"', "r={s('m', 8)}"],
  ['r="20"', "r={s('M', 20)}"]
]);

replacer('physical-pendulum', [
  ['width="16"', "width={s('m', 16)}"],
  ['height="120"', "height={s('L', 120)}"]
]);

replacer('rolling-wheel-incline', [
  ['r="20"', "r={s('m', 20)}"],
  ['r="20"', "r={s('R', 20)}"]
]);

replacer('coupled-oscillators', [
  ['r="16"', "r={s('m1', 16)}"],
  ['r="12"', "r={s('m2', 12)}"],
  ['valX - 16', "valX - s('m1', 16)"],
  ['valX + 16', "valX + s('m1', 16)"],
  ['valY - 12', "valY - s('m2', 12)"],
  ['valY + 12', "valY + s('m2', 12)"],
]);

replacer('block-wedge', [
  ['width="20"', "width={s('m', 20)}"],
  ['height="20"', "height={s('m', 20)}"],
]);

replacer('swinging-atwood', [
  ['width="24"', "width={s('M', 24)}"],
  ['height="24"', "height={s('M', 24)}"],
  ['r="12"', "r={s('m', 12)}"],
]);

replacer('spherical-pendulum', [
  ['r="12"', "r={s('m', 12)}"],
]);

replacer('particle-cone', [
  ['r="8"', "r={s('m', 8)}"],
]);

fs.writeFileSync('src/components/SystemDiagram.tsx', code);
