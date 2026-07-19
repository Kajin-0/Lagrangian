const fs = require('fs');
let code = fs.readFileSync('src/components/SystemDiagram.tsx', 'utf-8');

code = code.replace(
  `export default function SystemDiagram({ systemId }: { systemId: string }) {`,
  `export default function SystemDiagram({ systemId, variations }: { systemId: string, variations?: Record<string, number> }) {
  const v = (label: string) => variations && variations[label] !== undefined ? \`\${variations[label]}\${label}\` : label;
`
);

const replaces = ['m', 'm1', 'm2', 'M', 'k', 'k1', 'k2', 'k3', 'l', 'L', 'R'];
for (const rep of replaces) {
  const regex = new RegExp(">(" + rep + ")<", 'g');
  code = code.replace(regex, ">{" + "v('" + rep + "')}<");
}

code = code.replace(/>m, R</g, ">{v('m')}, {v('R')}<");

fs.writeFileSync('src/components/SystemDiagram.tsx', code);
