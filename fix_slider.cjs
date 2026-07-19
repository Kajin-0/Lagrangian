const fs = require('fs');
let code = fs.readFileSync('src/components/SystemDiagram.tsx', 'utf-8');

code = code.replace(
  `                  <span className="truncate">s (Block pos):</span>
                  <span className="tabular-nums whitespace-nowrap">{valY.toFixed(1)} m</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"`,
  `                  <span className="truncate">s (Block pos):</span>
                  <span className="tabular-nums whitespace-nowrap">{valY.toFixed(1)} m</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="130"`
);

fs.writeFileSync('src/components/SystemDiagram.tsx', code);
