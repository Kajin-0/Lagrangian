const fs = require('fs');
let code = fs.readFileSync('src/components/SystemDiagram.tsx', 'utf-8');

const sliderCode = `
            {systemId === 'planetary-motion' && (
              <>
                <div className="flex flex-col">
                  <div className="flex justify-between text-[11px] font-mono font-bold text-black">
                    <span className="truncate">r (distance):</span>
                    <span className="tabular-nums whitespace-nowrap">{valR.toFixed(1)} m</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="150"
                    step="1"
                    value={valR}
                    onChange={(e) => setValR(parseFloat(e.target.value))}
                    className="w-full h-1 bg-black appearance-none cursor-pointer mt-1"
                  />
                </div>
                <div className="flex flex-col">
                  <div className="flex justify-between text-[11px] font-mono font-bold text-black">
                    <span className="truncate">θ (theta):</span>
                    <span className="tabular-nums whitespace-nowrap">{theta.toFixed(2)} rad</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="6.28"
                    step="0.01"
                    value={theta}
                    onChange={(e) => setTheta(parseFloat(e.target.value))}
                    className="w-full h-1 bg-black appearance-none cursor-pointer mt-1"
                  />
                </div>
              </>
            )}
            {systemId === 'physical-pendulum' && (
              <div className="flex flex-col">
                <div className="flex justify-between text-[11px] font-mono font-bold text-black">
                  <span className="truncate">θ (theta):</span>
                  <span className="tabular-nums whitespace-nowrap">{theta.toFixed(2)} rad</span>
                </div>
                <input
                  type="range"
                  min="-2.5"
                  max="2.5"
                  step="0.01"
                  value={theta}
                  onChange={(e) => setTheta(parseFloat(e.target.value))}
                  className="w-full h-1 bg-black appearance-none cursor-pointer mt-1"
                />
              </div>
            )}
`;
const sliderTarget = "{systemId === 'atwood-machine' && ("; 
const sliderIndex = code.lastIndexOf(sliderTarget);
if (sliderIndex !== -1) {
  code = code.substring(0, sliderIndex) + sliderCode + code.substring(sliderIndex);
  fs.writeFileSync('src/components/SystemDiagram.tsx', code);
  console.log("Sliders added successfully.");
} else {
  console.error("Could not find sliderTarget.");
}
