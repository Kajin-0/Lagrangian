const fs = require('fs');
let code = fs.readFileSync('src/components/SystemDiagram.tsx', 'utf-8');

const simCode = `      } else if (systemId === 'rolling-wheel-incline') {
        const currentX = (time * 15) % 100;
        setValX(currentX);
        setTheta(currentX / 15);
      } else if (systemId === 'coupled-oscillators') {
        const currentX1 = 20 * Math.sin(time * 3);
        const currentX2 = 20 * Math.cos(time * 3);
        setValX(currentX1);
        setValY(currentX2);
      } else if (systemId === 'block-wedge') {
        const currentX = 10 * Math.sin(time * 2);
        const currentS = 40 + 20 * Math.sin(time * 2.5);
        setValX(currentX);
        setValY(currentS); // We use valY for s
        setValAngle(Math.PI / 6); // 30 degrees for alpha
      } else if (systemId === 'swinging-atwood') {
        const currentR = 60 + 20 * Math.sin(time * 1.5);
        const currentTheta = 0.5 * Math.cos(time * 2);
        setValR(currentR);
        setTheta(currentTheta);
`;
const insertionPoint = "} else if (systemId === 'cart-pendulum') {";
const index = code.indexOf(insertionPoint);
if (index !== -1) {
  code = code.substring(0, index) + simCode + code.substring(index);
  console.log("Sim logic added successfully.");
} else {
  console.error("Could not find insertion point.");
}

const sliderCode = `
            {systemId === 'rolling-wheel-incline' && (
              <div className="flex flex-col">
                <div className="flex justify-between text-[11px] font-mono font-bold text-black">
                  <span className="truncate">x (distance):</span>
                  <span className="tabular-nums whitespace-nowrap">{valX.toFixed(1)} m</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={valX}
                  onChange={(e) => {
                    setValX(parseFloat(e.target.value));
                    setTheta(parseFloat(e.target.value) / 15);
                  }}
                  className="w-full h-1 bg-black appearance-none cursor-pointer mt-1"
                />
              </div>
            )}
            {systemId === 'coupled-oscillators' && (
              <>
                <div className="flex flex-col">
                  <div className="flex justify-between text-[11px] font-mono font-bold text-black">
                    <span className="truncate">x1:</span>
                    <span className="tabular-nums whitespace-nowrap">{valX.toFixed(1)} m</span>
                  </div>
                  <input
                    type="range"
                    min="-40"
                    max="40"
                    step="1"
                    value={valX}
                    onChange={(e) => setValX(parseFloat(e.target.value))}
                    className="w-full h-1 bg-black appearance-none cursor-pointer mt-1"
                  />
                </div>
                <div className="flex flex-col">
                  <div className="flex justify-between text-[11px] font-mono font-bold text-black">
                    <span className="truncate">x2:</span>
                    <span className="tabular-nums whitespace-nowrap">{valY.toFixed(1)} m</span>
                  </div>
                  <input
                    type="range"
                    min="-40"
                    max="40"
                    step="1"
                    value={valY}
                    onChange={(e) => setValY(parseFloat(e.target.value))}
                    className="w-full h-1 bg-black appearance-none cursor-pointer mt-1"
                  />
                </div>
              </>
            )}
            {systemId === 'block-wedge' && (
              <>
                <div className="flex flex-col">
                  <div className="flex justify-between text-[11px] font-mono font-bold text-black">
                    <span className="truncate">X (Wedge pos):</span>
                    <span className="tabular-nums whitespace-nowrap">{valX.toFixed(1)} m</span>
                  </div>
                  <input
                    type="range"
                    min="-40"
                    max="40"
                    step="1"
                    value={valX}
                    onChange={(e) => setValX(parseFloat(e.target.value))}
                    className="w-full h-1 bg-black appearance-none cursor-pointer mt-1"
                  />
                </div>
                <div className="flex flex-col">
                  <div className="flex justify-between text-[11px] font-mono font-bold text-black">
                    <span className="truncate">s (Block pos):</span>
                    <span className="tabular-nums whitespace-nowrap">{valY.toFixed(1)} m</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={valY}
                    onChange={(e) => setValY(parseFloat(e.target.value))}
                    className="w-full h-1 bg-black appearance-none cursor-pointer mt-1"
                  />
                </div>
              </>
            )}
            {systemId === 'swinging-atwood' && (
              <>
                <div className="flex flex-col">
                  <div className="flex justify-between text-[11px] font-mono font-bold text-black">
                    <span className="truncate">r (Length):</span>
                    <span className="tabular-nums whitespace-nowrap">{valR.toFixed(1)} m</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="120"
                    step="1"
                    value={valR}
                    onChange={(e) => setValR(parseFloat(e.target.value))}
                    className="w-full h-1 bg-black appearance-none cursor-pointer mt-1"
                  />
                </div>
                <div className="flex flex-col">
                  <div className="flex justify-between text-[11px] font-mono font-bold text-black">
                    <span className="truncate">θ (Angle):</span>
                    <span className="tabular-nums whitespace-nowrap">{theta.toFixed(2)} rad</span>
                  </div>
                  <input
                    type="range"
                    min="-2"
                    max="2"
                    step="0.01"
                    value={theta}
                    onChange={(e) => setTheta(parseFloat(e.target.value))}
                    className="w-full h-1 bg-black appearance-none cursor-pointer mt-1"
                  />
                </div>
              </>
            )}
`;
const sliderTarget = "{systemId === 'atwood-machine' && ("; 
const sliderIndex = code.lastIndexOf(sliderTarget);
if (sliderIndex !== -1) {
  code = code.substring(0, sliderIndex) + sliderCode + code.substring(sliderIndex);
  console.log("Sliders logic added successfully.");
} else {
  console.error("Could not find sliderTarget.");
}

const svgCode = `
          {systemId === 'rolling-wheel-incline' && (
            <g transform="translate(100, 30)">
              {/* Incline */}
              <polygon points="0,0 200,0 0,150" fill="none" stroke="#000" strokeWidth="2" transform="translate(0, 50)" />
              
              <g transform="translate(0, 50)">
                <g transform={\`rotate(37)\`}>
                  {/* Wheel */}
                  <g transform={\`translate(\${valX + 15}, -15)\`}>
                    <circle cx="0" cy="0" r="15" fill="#fff" stroke="#000" strokeWidth="2" />
                    {/* Spoke to show rotation */}
                    <line x1="0" y1="0" x2={\`\${15 * Math.cos(theta)}\`} y2={\`\${15 * Math.sin(theta)}\`} stroke="#000" strokeWidth="2" />
                    <text x="0" y="-20" fill="#000" fontSize="10" fontWeight="bold" textAnchor="middle">m, R</text>
                  </g>
                </g>
              </g>
            </g>
          )}

          {systemId === 'coupled-oscillators' && (
            <g transform="translate(200, 100)">
              <line x1="-150" y1="15" x2="150" y2="15" stroke="#000" strokeWidth="2" />
              {/* Left Wall */}
              <rect x="-160" y="-10" width="10" height="40" fill="#000" />
              {/* Right Wall */}
              <rect x="150" y="-10" width="10" height="40" fill="#000" />

              {/* Mass 1 */}
              <rect x={-80 + valX - 15} y="-15" width="30" height="30" fill="#fff" stroke="#000" strokeWidth="2" />
              <text x={-80 + valX} y="4" fill="#000" fontSize="12" fontWeight="bold" textAnchor="middle">m₁</text>

              {/* Mass 2 */}
              <rect x={80 + valY - 15} y="-15" width="30" height="30" fill="#fff" stroke="#000" strokeWidth="2" />
              <text x={80 + valY} y="4" fill="#000" fontSize="12" fontWeight="bold" textAnchor="middle">m₂</text>

              {/* Spring 1 */}
              <path d={\`M -150 0 L \${-80 + valX - 15} 0\`} stroke="#000" strokeWidth="2" strokeDasharray="3 3" />
              <text x={-115 + valX/2} y="-10" fill="#000" fontSize="10" textAnchor="middle">k₁</text>

              {/* Spring 2 */}
              <path d={\`M \${-80 + valX + 15} 0 L \${80 + valY - 15} 0\`} stroke="#000" strokeWidth="2" strokeDasharray="3 3" />
              <text x={(valX + valY)/2} y="-10" fill="#000" fontSize="10" textAnchor="middle">k₂</text>

              {/* Spring 3 */}
              <path d={\`M \${80 + valY + 15} 0 L 150 0\`} stroke="#000" strokeWidth="2" strokeDasharray="3 3" />
              <text x={115 + valY/2} y="-10" fill="#000" fontSize="10" textAnchor="middle">k₃</text>
            </g>
          )}

          {systemId === 'block-wedge' && (
            <g transform="translate(200, 150)">
              {/* Floor */}
              <line x1="-180" y1="0" x2="180" y2="0" stroke="#000" strokeWidth="2" />
              
              <g transform={\`translate(\${valX}, 0)\`}>
                {/* Wedge */}
                <polygon points="-60,0 60,0 -60,-80" fill="#fff" stroke="#000" strokeWidth="2" />
                <text x="-30" y="-10" fill="#000" fontSize="12" fontWeight="bold">M</text>
                
                {/* Block on Wedge */}
                <g transform="translate(-60, -80)">
                  <g transform="rotate(33.69)"> {/* Approx 33 deg for 80/120 triangle */}
                    <g transform={\`translate(\${valY}, 0)\`}>
                      <rect x="0" y="-20" width="20" height="20" fill="#fff" stroke="#000" strokeWidth="2" />
                      <text x="10" y="-5" fill="#000" fontSize="10" fontWeight="bold" textAnchor="middle">m</text>
                    </g>
                  </g>
                </g>
              </g>
            </g>
          )}

          {systemId === 'swinging-atwood' && (
            <g transform="translate(200, 50)">
              {/* Ceiling */}
              <line x1="-40" y1="-30" x2="40" y2="-30" stroke="#000" strokeWidth="2" />
              
              {/* Pulley */}
              <circle cx="0" cy="0" r="10" fill="#fff" stroke="#000" strokeWidth="2" />
              <line x1="0" y1="-30" x2="0" y2="0" stroke="#000" strokeWidth="2" />

              {/* Counterweight M */}
              {/* If r gets larger, M goes up. So y = L - r. Let's map it roughly. */}
              <line x1="-10" y1="0" x2="-10" y2={140 - valR} stroke="#000" strokeWidth="1" />
              <rect x="-20" y={140 - valR} width="20" height="20" fill="#fff" stroke="#000" strokeWidth="2" />
              <text x="-10" y={154 - valR} fill="#000" fontSize="12" fontWeight="bold" textAnchor="middle">M</text>

              {/* Swinging Mass m */}
              <g transform={\`rotate(\${(theta * 180) / Math.PI})\`}>
                <line x1="10" y1="0" x2="10" y2={valR} stroke="#000" strokeWidth="1" />
                <circle cx="10" cy={valR} r="8" fill="#fff" stroke="#000" strokeWidth="2" />
                <text x="25" y={valR + 5} fill="#000" fontSize="12" fontWeight="bold">m</text>
              </g>
            </g>
          )}
`;
const EOM_END = code.indexOf('</svg>');
if (EOM_END !== -1) {
  code = code.substring(0, EOM_END) + svgCode + code.substring(EOM_END);
  fs.writeFileSync('src/components/SystemDiagram.tsx', code);
  console.log("SVG logic added successfully.");
} else {
  console.error("Could not find EOM.");
}
