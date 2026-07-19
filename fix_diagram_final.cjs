const fs = require('fs');
let code = fs.readFileSync('src/components/SystemDiagram.tsx', 'utf-8');

if (!code.includes('variations?: Record<string, number>')) {
  code = code.replace(
    `interface SystemDiagramProps {
  systemId: string;
}`,
    `interface SystemDiagramProps {
  systemId: string;
  variations?: Record<string, number>;
}`
  );
}

if (!code.includes('const v = (label: string) =>')) {
  code = code.replace(
    `export default function SystemDiagram({ systemId }: SystemDiagramProps) {`,
    `export default function SystemDiagram({ systemId, variations }: SystemDiagramProps) {
  const v = (label: string) => variations && variations[label] !== undefined ? \`\${variations[label]}\${label}\` : label;`
  );
}

fs.writeFileSync('src/components/SystemDiagram.tsx', code);
