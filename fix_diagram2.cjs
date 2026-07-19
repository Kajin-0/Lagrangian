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

replacer('physical-pendulum', [
  ['width="16"', 'width={s(\\\'m\\\', 16)}'],
  ['height="120"', 'height={s(\\\'L\\\', 120)}']
]);

replacer('rolling-wheel-incline', [
  ['r="20"', 'r={s(\\\'m\\\', 20)}'],
  ['r="20"', 'r={s(\\\'R\\\', 20)}']
]);

replacer('coupled-oscillators', [
  ['r="16"', 'r={s(\\\'m1\\\', 16)}'],
  ['r="12"', 'r={s(\\\'m2\\\', 12)}'],
  ['valX - 16', 'valX - s(\\\'m1\\\', 16)'],
  ['valX + 16', 'valX + s(\\\'m1\\\', 16)'],
  ['valY - 12', 'valY - s(\\\'m2\\\', 12)'],
  ['valY + 12', 'valY + s(\\\'m2\\\', 12)'],
]);

replacer('block-wedge', [
  ['width="20"', 'width={s(\\\'m\\\', 20)}'],
  ['height="20"', 'height={s(\\\'m\\\', 20)}'],
]);

replacer('swinging-atwood', [
  ['width="24"', 'width={s(\\\'M\\\', 24)}'],
  ['height="24"', 'height={s(\\\'M\\\', 24)}'],
  ['r="12"', 'r={s(\\\'m\\\', 12)}'],
]);

replacer('spherical-pendulum', [
  ['r="12"', 'r={s(\\\'m\\\', 12)}'],
  ['120 * Math.sin(theta)', 's(\\\'l\\\', 120) * Math.sin(theta)'],
  ['120 * Math.cos(theta)', 's(\\\'l\\\', 120) * Math.cos(theta)'],
]);

replacer('particle-cone', [
  ['r="8"', 'r={s(\\\'m\\\', 8)}'],
]);

fs.writeFileSync('src/components/SystemDiagram.tsx', code);
