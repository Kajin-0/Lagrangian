const fs = require('fs');
let code = fs.readFileSync('src/components/SystemDiagram.tsx', 'utf-8');

const mathCode = `          {systemId === 'double-pendulum' && (
            <>
              <span className="truncate">θ₁ =</span>
              <span className="tabular-nums whitespace-nowrap">{theta.toFixed(3)} rad</span>
              <span className="truncate">θ₂ =</span>
              <span className="tabular-nums whitespace-nowrap">{valAngle.toFixed(3)} rad</span>
            </>
          )}
          {systemId === 'vertical-spring' && (
            <>
              <span className="truncate">y =</span>
              <span className="tabular-nums whitespace-nowrap">{valY.toFixed(1)} mm</span>
            </>
          )}
`;
const mathTarget = "{systemId === 'horizontal-spring' && (";
const index = code.indexOf(mathTarget);
if (index !== -1) {
  code = code.substring(0, index) + mathCode + code.substring(index);
}

const sliderCode = `
            {systemId === 'double-pendulum' && (
              <>
                <div className="flex flex-col">
                  <div className="flex justify-between text-[11px] font-mono font-bold text-black">
                    <span className="truncate">θ₁ (theta 1):</span>
                    <span className="tabular-nums whitespace-nowrap">{theta.toFixed(3)} rad</span>
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
                <div className="flex flex-col">
                  <div className="flex justify-between text-[11px] font-mono font-bold text-black">
                    <span className="truncate">θ₂ (theta 2):</span>
                    <span className="tabular-nums whitespace-nowrap">{valAngle.toFixed(3)} rad</span>
                  </div>
                  <input
                    type="range"
                    min="-3.14"
                    max="3.14"
                    step="0.01"
                    value={valAngle}
                    onChange={(e) => setValAngle(parseFloat(e.target.value))}
                    className="w-full h-1 bg-black appearance-none cursor-pointer mt-1"
                  />
                </div>
              </>
            )}
            {systemId === 'vertical-spring' && (
              <div className="flex flex-col">
                <div className="flex justify-between text-[11px] font-mono font-bold text-black">
                  <span className="truncate">y (displacement):</span>
                  <span className="tabular-nums whitespace-nowrap">{valY.toFixed(1)} mm</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="160"
                  step="1"
                  value={valY}
                  onChange={(e) => setValY(parseFloat(e.target.value))}
                  className="w-full h-1 bg-black appearance-none cursor-pointer mt-1"
                />
              </div>
            )}
`;
const sliderTarget = "{systemId === 'atwood-machine' && ("; 
const sliderIndex = code.lastIndexOf(sliderTarget);
if (sliderIndex !== -1) {
  code = code.substring(0, sliderIndex) + sliderCode + code.substring(sliderIndex);
}

fs.writeFileSync('src/components/SystemDiagram.tsx', code);
console.log("HTML code added successfully.");
