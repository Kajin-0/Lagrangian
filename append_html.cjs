const fs = require('fs');
let code = fs.readFileSync('src/components/SystemDiagram.tsx', 'utf-8');

const mathCode = `          {systemId === 'atwood-machine' && (
            <>
              <span className="truncate">y =</span>
              <span className="tabular-nums whitespace-nowrap">{valY.toFixed(1)} mm</span>
            </>
          )}
          {systemId === 'inclined-plane' && (
            <>
              <span className="truncate">s =</span>
              <span className="tabular-nums whitespace-nowrap">{valX.toFixed(1)} mm</span>
            </>
          )}
          {systemId === 'projectile-motion' && (
            <>
              <span className="truncate">x =</span>
              <span className="tabular-nums whitespace-nowrap">{valX.toFixed(1)} mm</span>
              <span className="truncate">y =</span>
              <span className="tabular-nums whitespace-nowrap">{-valY.toFixed(1)} mm</span>
            </>
          )}
`;
const mathTarget = "{systemId === 'horizontal-spring' && (";
const index = code.indexOf(mathTarget);
if (index !== -1) {
  code = code.substring(0, index) + mathCode + code.substring(index);
}

const sliderCode = `
            {systemId === 'atwood-machine' && (
              <div className="flex flex-col">
                <div className="flex justify-between text-[11px] font-mono font-bold text-black">
                  <span className="truncate">y (displacement):</span>
                  <span className="tabular-nums whitespace-nowrap">{valY.toFixed(1)} mm</span>
                </div>
                <input
                  type="range"
                  min="-50"
                  max="50"
                  step="1"
                  value={valY}
                  onChange={(e) => setValY(parseFloat(e.target.value))}
                  className="w-full h-1 bg-black appearance-none cursor-pointer mt-1"
                />
              </div>
            )}
            {systemId === 'inclined-plane' && (
              <div className="flex flex-col">
                <div className="flex justify-between text-[11px] font-mono font-bold text-black">
                  <span className="truncate">s (displacement):</span>
                  <span className="tabular-nums whitespace-nowrap">{valX.toFixed(1)} mm</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="188"
                  step="1"
                  value={valX}
                  onChange={(e) => setValX(parseFloat(e.target.value))}
                  className="w-full h-1 bg-black appearance-none cursor-pointer mt-1"
                />
              </div>
            )}
            {systemId === 'projectile-motion' && (
              <>
                <div className="flex flex-col">
                  <div className="flex justify-between text-[11px] font-mono font-bold text-black">
                    <span className="truncate">x (horizontal position):</span>
                    <span className="tabular-nums whitespace-nowrap">{valX.toFixed(1)} mm</span>
                  </div>
                  <input
                    type="range"
                    min="-120"
                    max="120"
                    step="1"
                    value={valX}
                    onChange={(e) => setValX(parseFloat(e.target.value))}
                    className="w-full h-1 bg-black appearance-none cursor-pointer mt-1"
                  />
                </div>
                <div className="flex flex-col">
                  <div className="flex justify-between text-[11px] font-mono font-bold text-black">
                    <span className="truncate">y (height, vertical pos):</span>
                    <span className="tabular-nums whitespace-nowrap">{-valY.toFixed(1)} mm</span>
                  </div>
                  <input
                    type="range"
                    min="-80"
                    max="0"
                    step="1"
                    value={valY}
                    onChange={(e) => setValY(parseFloat(e.target.value))}
                    className="w-full h-1 bg-black appearance-none cursor-pointer mt-1"
                  />
                </div>
              </>
            )}
`;
const sliderTarget = "{systemId === 'horizontal-spring' && ("; // Wait, "horizontal-spring" or "cart-pendulum" is in the text.
const sliderIndex = code.lastIndexOf("{(systemId === 'horizontal-spring' || systemId === 'cart-pendulum') && (");
if (sliderIndex !== -1) {
  code = code.substring(0, sliderIndex) + sliderCode + code.substring(sliderIndex);
}

fs.writeFileSync('src/components/SystemDiagram.tsx', code);
console.log("HTML code added successfully.");
