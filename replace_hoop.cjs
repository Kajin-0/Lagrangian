const fs = require('fs');
let code = fs.readFileSync('src/components/SystemDiagram.tsx', 'utf-8');

const targetStart = "{systemId === 'rotating-hoop' && (";
const targetEnd = "            </g>\n          )}";

const startIndex = code.indexOf(targetStart);
const endIndex = code.indexOf(targetEnd, startIndex) + targetEnd.length;

if (startIndex !== -1 && endIndex !== -1) {
  const replacement = `          {systemId === 'rotating-hoop' && (
            <g transform="translate(200, 115)">
              {/* Swept spherical volume (faint) */}
              <circle cx="0" cy="0" r="90" fill="none" stroke="#e5e7eb" strokeWidth="1.5" />
              <ellipse cx="0" cy="0" rx="90" ry="25" fill="none" stroke="#e5e7eb" strokeWidth="1" />
              
              {/* Central axis vector */}
              <line x1="0" y1="-105" x2="0" y2="105" stroke="#000000" strokeWidth="1.2" strokeDasharray="5 4" />
              <text x="0" y="-112" fill="#000000" fontSize="10" textAnchor="middle">Rotation Axis (Ω)</text>

              {/* Rotational direction indicator arc */}
              <path
                d="M -30 -102 A 30 10 0 0 1 30 -102"
                fill="none"
                stroke="#000000"
                strokeWidth="1.5"
                strokeDasharray="2 2"
              />
              <polygon points="28,-103 33,-99 33,-106" fill="#000000" />

              {/* Top / bottom supports */}
              <circle cx="0" cy="-90" r="4" fill="#000000" />
              <circle cx="0" cy="90" r="4" fill="#000000" />

              {/* The Hoop solid (projected) */}
              <ellipse
                cx="0"
                cy="0"
                rx={Math.max(0.1, 90 * Math.abs(Math.cos(valAngle)))}
                ry="90"
                fill="none"
                stroke="#000000"
                strokeWidth="4.5"
              />

              {/* Calculate 3D projected coords for the bead */}
              {(() => {
                const z = 90 * Math.sin(theta) * Math.sin(valAngle);
                const isFront = z >= 0;
                const scale = 1 + z / 300; // perspective scale
                const px = 90 * Math.sin(theta) * Math.cos(valAngle);
                const py = 90 * Math.cos(Math.PI - theta);

                return (
                  <>
                    {/* center indicator */}
                    <circle cx="0" cy="0" r="3" fill="#000000" />
                    
                    {/* Radius display helper */}
                    <line x1="0" y1="0" x2={px} y2={py} stroke="#000000" strokeWidth="1.5" strokeDasharray="2 2" />
                    
                    {/* Rotational distance to axis */}
                    <line
                      x1="0"
                      y1={py}
                      x2={px}
                      y2={py}
                      stroke="#000000"
                      strokeWidth="1.2"
                      strokeDasharray="3 3"
                    />

                    {/* Bead */}
                    <circle
                      cx={px}
                      cy={py}
                      r={10 * scale}
                      fill={isFront ? "#000000" : "#6b7280"}
                      stroke={isFront ? "#000000" : "#4b5563"}
                      strokeWidth={2 * scale}
                    />
                    <text
                      x={px}
                      y={py + 3.5 * scale}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize={10 * scale}
                      fontWeight="bold"
                    >
                      m
                    </text>
                  </>
                );
              })()}
            </g>
          )}`;

  code = code.substring(0, startIndex) + replacement + code.substring(endIndex);
  fs.writeFileSync('src/components/SystemDiagram.tsx', code);
  console.log("Hoop updated successfully.");
} else {
  console.error("Could not find hoop block.");
}
