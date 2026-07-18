const fs = require('fs');
let code = fs.readFileSync('src/components/SystemDiagram.tsx', 'utf-8');

function removeBlock(str, prefix) {
  let idx = code.indexOf(prefix);
  if (idx !== -1) {
    let nextBrace = code.indexOf('}', idx);
    let nextParen = code.indexOf(')', nextBrace); // or whatever
  }
}

// Just remove my specific vertical spring blocks.
// They look like:
// "} else if (systemId === 'vertical-spring') { \n const currentY = 80 + 30 * Math.cos(time * 4); \n setValY(currentY);"
code = code.replace("      } else if (systemId === 'vertical-spring') {\n        const currentY = 80 + 30 * Math.cos(time * 4);\n        setValY(currentY);\n", "");

// The Math block:
// "          {systemId === 'vertical-spring' && (\n            <>\n              <span className=\"truncate\">y =</span>\n              <span className=\"tabular-nums whitespace-nowrap\">{valY.toFixed(1)} mm</span>\n            </>\n          )}\n"
code = code.replace("          {systemId === 'vertical-spring' && (\n            <>\n              <span className=\"truncate\">y =</span>\n              <span className=\"tabular-nums whitespace-nowrap\">{valY.toFixed(1)} mm</span>\n            </>\n          )}\n", "");

// The SVG block:
// 954:          {systemId === 'vertical-spring' && ( ... to 1003 or so.
const svgStart = code.indexOf("{systemId === 'vertical-spring' && (\n            <g transform=\"translate(200, 20)\">");
if (svgStart !== -1) {
  const svgEnd = code.indexOf("          )}", svgStart) + 12;
  code = code.substring(0, svgStart) + code.substring(svgEnd + 1); // remove newline
}

// The slider block:
const sliderStart = code.indexOf("{systemId === 'vertical-spring' && (\n              <div className=\"flex flex-col\">\n                <div className=\"flex justify-between text-[11px] font-mono font-bold text-black\">\n                  <span className=\"truncate\">y (displacement):</span>");
if (sliderStart !== -1) {
  const sliderEnd = code.indexOf("              </div>\n            )}", sliderStart) + 33;
  code = code.substring(0, sliderStart) + code.substring(sliderEnd + 1);
}

fs.writeFileSync('src/components/SystemDiagram.tsx', code);
