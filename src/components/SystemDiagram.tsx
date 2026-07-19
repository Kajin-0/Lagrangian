/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { Play, Pause } from 'lucide-react';

interface SystemDiagramProps {
  systemId: string;
  variations?: Record<string, number>;
}


const renderSpring = (x1: number, y1: number, x2: number, y2: number, coils: number = 8, radius: number = 5) => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx);
  const straightLen = 10;
  const coilLen = length - 2 * straightLen;
  if (coilLen <= 0) return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#000" strokeWidth="1.5" />;
  const coilStep = coilLen / coils;
  let path = `M 0 0 L ${straightLen} 0`;
  for (let i = 0; i < coils; i++) {
    path += ` L ${straightLen + (i + 0.25) * coilStep} ${-radius}`;
    path += ` L ${straightLen + (i + 0.75) * coilStep} ${radius}`;
    path += ` L ${straightLen + (i + 1) * coilStep} 0`;
  }
  path += ` L ${length} 0`;
  return <path d={path} fill="none" stroke="#000" strokeWidth="1.5" transform={`translate(${x1}, ${y1}) rotate(${(angle * 180) / Math.PI})`} />;
};

export default function SystemDiagram({ systemId, variations }: SystemDiagramProps) {
  const v = (label: string) => variations && variations[label] !== undefined ? `${variations[label]}${label}` : label;
  const s = (label: string, base: number) => {
    if (!variations || variations[label] === undefined) return base;
    const mult = variations[label];
    if (label.startsWith('l') || label === 'L' || label === 'R' || label === 'r') {
      return base * (1 + (mult - 1) * 0.05);
    }
    return base * (1 + (mult - 1) * 0.1);
  };
  const [isPlaying, setIsPlaying] = useState(true);
  const [time, setTime] = useState(0);

  // Manual coordination sliders (used when paused)
  const [theta, setTheta] = useState(0.5); // rad, ~30 deg
  const [valX, setValX] = useState(30);   // generic displacement
  const [valY, setValY] = useState(40);   // vertical displacement
  const [valR, setValR] = useState(120);  // spring radius
  const [valAngle, setValAngle] = useState(0.4);

  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(Date.now());

  // Reset sliders when systemId changes
  useEffect(() => {
    setIsPlaying(true);
    setTime(0);
    setTheta(0.6);
    setValX(25);
    setValY(30);
    setValR(110);
    setValAngle(0.5);
  }, [systemId]);

  // Handle animation loop
  useEffect(() => {
    if (isPlaying) {
      const loop = () => {
        const now = Date.now();
        const delta = (now - lastTimeRef.current) / 1000;
        lastTimeRef.current = now;

        setTime((prev) => prev + delta);
        animationRef.current = requestAnimationFrame(loop);
      };

      lastTimeRef.current = Date.now();
      animationRef.current = requestAnimationFrame(loop);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying]);

  // Synchronize play state to manual sliders
  useEffect(() => {
    if (isPlaying) {
      if (systemId === 'simple-pendulum') {
        const currentTheta = 0.8 * Math.cos(time * 3);
        setTheta(currentTheta);
      } else if (systemId === 'horizontal-spring') {
        const currentX = 45 * Math.cos(time * 4);
        setValX(currentX);
      } else if (systemId === 'vertical-spring') {
        const currentY = 35 * Math.sin(time * 4.5);
        setValY(currentY);
      } else if (systemId === 'bead-rotating-rod') {
        // Bead flings out centrifugally, then resets
        const cycle = time % 4;
        const currentR = 20 + 80 * Math.sin((cycle / 4) * (Math.PI / 2)) * Math.sin((cycle / 4) * (Math.PI / 2));
        setValR(currentR);
        setValAngle(time * 2); // rotating rod angle
      } else if (systemId === 'spring-pendulum') {
        // Swing + stretch (coupled frequencies)
        const currentTheta = 0.6 * Math.cos(time * 2.5);
        const currentR = 100 + 20 * Math.cos(time * 4.8);
        setTheta(currentTheta);
        setValR(currentR);
      } else if (systemId === 'rotating-hoop') {
        // Bead slides depending on centrifugal vs gravity oscillation
        const currentTheta = 0.8 + 0.5 * Math.cos(time * 3.5);
        setTheta(currentTheta);
        setValAngle(time * 4); // spin angle representation
            } else if (systemId === 'atwood-machine') {
        const tCycle = time % 2;
        const currentY = -40 + 80 * (tCycle / 2) * (tCycle / 2);
        setValY(currentY);
      } else if (systemId === 'inclined-plane') {
        const tCycle = time % 2;
        const currentS = 188 * (tCycle / 2) * (tCycle / 2);
        setValX(currentS);
      } else if (systemId === 'projectile-motion') {
        const tCycle = time % 3;
        const startX = -120;
        const vX = 80;
        const currentX = startX + vX * tCycle;
        const currentY = -80 * tCycle + 26.666 * tCycle * tCycle;
        setValX(currentX);
        setValY(currentY);
      } else if (systemId === 'double-pendulum') {
        const currentTheta1 = 0.5 * Math.cos(time * 3);
        const currentTheta2 = 0.5 * Math.cos(time * 3) + 1.2 * Math.cos(time * 4.2);
        setTheta(currentTheta1);
        setValAngle(currentTheta2);
      } else if (systemId === 'planetary-motion') {
        const currentTheta = time * 2;
        const currentR = 50 + 20 * Math.sin(time * 3);
        setTheta(currentTheta);
        setValR(currentR);
      } else if (systemId === 'physical-pendulum') {
        const currentTheta = 1.2 * Math.cos(time * 3);
        setTheta(currentTheta);
      } else if (systemId === 'rolling-wheel-incline') {
        const currentX = (time * 40) % 250;
        setValX(currentX);
        setTheta(currentX / 15);
      } else if (systemId === 'coupled-oscillators') {
        const currentX1 = 20 * Math.sin(time * 3);
        const currentX2 = 20 * Math.cos(time * 3);
        setValX(currentX1);
        setValY(currentX2);
      } else if (systemId === 'block-wedge') {
        const currentS = (time * 40) % 130;
        const currentX = -currentS * 0.3;
        setValX(currentX);
        setValY(currentS); // We use valY for s
        setValAngle(Math.PI / 6); // 30 degrees for alpha
      } else if (systemId === 'swinging-atwood') {
        const currentR = 60 + 20 * Math.sin(time * 1.5);
        const currentTheta = 0.5 * Math.cos(time * 2);
        setValR(currentR);
        setTheta(currentTheta);
      } else if (systemId === 'spherical-pendulum') {
    const currentTheta = 0.6 + 0.3 * Math.sin(time * 2); 
    const currentPhi = (time * 1.5) % 6.28;
    setTheta(currentTheta);
    setValAngle(currentPhi);
  } else if (systemId === 'particle-cone') {
    const currentRho = 45 + 20 * Math.sin(time * 3);
    const currentPhi = (time * 2) % 6.28;
    setValR(currentRho);
    setValAngle(currentPhi);
} else if (systemId === 'cart-pendulum') {
        // Coupled cart-pendulum system (center of mass remains fixed)
        const currentTheta = 0.8 * Math.cos(time * 3);
        setTheta(currentTheta);
        // Cart slides to the opposite side to conserve center of mass
        const currentX = -25 * Math.sin(currentTheta);
        setValX(currentX);
      }
    }
  }, [time, isPlaying, systemId]);

  const handleReset = () => {
    setTime(0);
    setIsPlaying(false);
    setTheta(0.6);
    setValX(25);
    setValY(30);
    setValR(110);
    setValAngle(0.5);
  };

  // Helper code to map a zigzag path for spring drawing
  const generateSpringPath = (startX: number, startY: number, endX: number, endY: number, turns = 12, width = 12) => {
    const dx = endX - startX;
    const dy = endY - startY;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len === 0) return '';

    const ux = dx / len;
    const uy = dy / len;
    const nx = -uy; // normal vector
    const ny = ux;

    const points: string[] = [`M ${startX} ${startY}`];

    // Anchor first 8%
    const anchorLenStart = len * 0.08;
    const anchorLenEnd = len * 0.08;
    const activeLen = len - anchorLenStart - anchorLenEnd;

    points.push(`L ${startX + ux * anchorLenStart} ${startY + uy * anchorLenStart}`);

    for (let i = 0; i < turns; i++) {
      const frac = (i + 0.5) / turns;
      const dist = anchorLenStart + frac * activeLen;
      const px = startX + ux * dist;
      const py = startY + uy * dist;

      // zig left/right
      const side = i % 2 === 0 ? 1 : -1;
      const zX = px + nx * width * side;
      const zY = py + ny * width * side;

      points.push(`L ${zX} ${zY}`);
    }

    points.push(`L ${startX + ux * (len - anchorLenEnd)} ${startY + uy * (len - anchorLenEnd)}`);
    points.push(`L ${endX} ${endY}`);

    return points.join(' ');
  };

  // Grid background style
  const renderGrid = () => (
    <g className="opacity-10">
      <defs>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </g>
  );

  return (
    <div className="flex flex-col w-full h-full bg-white border border-black overflow-hidden font-mono text-black">
      {/* SVG Canvas Frame */}

      {/* SVG Canvas Frame */}
      <div className="relative flex-1 min-h-[220px] max-h-[300px] md:max-h-[320px] bg-white flex items-center justify-center overflow-hidden">
        <div className="absolute top-2 right-2 z-10 flex gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1 px-2 text-xs border border-black hover:bg-black hover:text-white transition flex items-center justify-center gap-1.5 w-24 bg-white"
            title={isPlaying ? 'Pause simulation to drag coordinates manually' : 'Play physics simulation'}
          >
            {isPlaying ? (
              <>
                <Pause className="h-3 w-3" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="h-3 w-3" />
                <span>Animate</span>
              </>
            )}
          </button>
        </div>
        <svg
          viewBox="0 0 400 240"
          className="w-full h-full text-black font-mono select-none"
        >
          {renderGrid()}

          {/* SYSTEM ID MATCHED */}
          {systemId === 'simple-pendulum' && (
            <g transform="translate(200, 40)">
              {/* Ceiling support */}
              <rect x="-40" y="-8" width="80" height="8" rx="2" fill="#000000" />
              <line x1="-35" y1="0" x2="-35" y2="-4" stroke="#000000" strokeWidth="2" />
              <line x1="-20" y1="0" x2="-20" y2="-4" stroke="#000000" strokeWidth="2" />
              <line x1="-5" y1="0" x2="-5" y2="-4" stroke="#000000" strokeWidth="2" />
              <line x1="10" y1="0" x2="10" y2="-4" stroke="#000000" strokeWidth="2" />
              <line x1="25" y1="0" x2="25" y2="-4" stroke="#000000" strokeWidth="2" />
              <line x1="35" y1="0" x2="35" y2="-4" stroke="#000000" strokeWidth="2" />

              {/* Angle arc */}
              <path
                d={`M 0 45 A 45 45 0 0 ${theta >= 0 ? 1 : 0} ${45 * Math.sin(theta)} ${45 * Math.cos(theta)}`}
                fill="none"
                stroke="#000000"
                strokeWidth="1.5"
                strokeDasharray="2 2"
              />
              <text
                x={65 * Math.sin(theta / 2)}
                y={65 * Math.cos(theta / 2)}
                fill="#000000"
                fontSize="11"
                textAnchor="middle"
              >
                θ
              </text>

              {/* Vertical dotted reference alignment */}
              <line x1="0" y1="0" x2="0" y2="180" stroke="#000000" strokeWidth="1" strokeDasharray="4 4" />

              {/* Pendulum rod */}
              <line
                x1="0"
                y1="0"
                x2={s('l', 160) * Math.sin(theta)}
                y2={s('l', 160) * Math.cos(theta)}
                stroke="#000000"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <text
                x={80 * Math.sin(theta) + 15 * Math.cos(theta)}
                y={80 * Math.cos(theta) - 15 * Math.sin(theta)}
                fill="#000000"
                fontSize="12"
                fontStyle="italic"
                textAnchor="middle"
              >{v('l')}</text>

              {/* Bob Mass */}
              <circle
                cx={s('l', 160) * Math.sin(theta)}
                cy={s('l', 160) * Math.cos(theta)}
                r={s('m', 14)}
                fill="#000000"
                stroke="#000000"
                strokeWidth="3.5"
              />
              <text
                x={s('l', 160) * Math.sin(theta)}
                y={s('l', 160) * Math.cos(theta) + 4}
                textAnchor="middle"
                fill="#ffffff"
                fontSize="11"
                fontWeight="bold"
              >{v('m')}</text>

              {/* Pivot joint */}
              <circle cx="0" cy="0" r="5" fill="#ffffff" />

              {/* Dimensions markers / helpers */}
              <g transform="translate(-140, 20)">
                <text x="0" y="0" fill="#000000" fontSize="10">Length: {v('l')}</text>
                <text x="0" y="16" fill="#000000" fontSize="10">Gravity: {v('g')} (down)</text>
                <text x="0" y="32" fill="#000000" fontSize="10">Var: θ, θ'</text>
                <text x="0" y="55" fill="#000000" fontSize="10">y=0 (Pivot level)</text>
                <line x1="-5" y1="45" x2="35" y2="45" stroke="#000000" strokeWidth="1" strokeDasharray="2 2" />
              </g>
            </g>
          )}

          {/* SYSTEM ID MATCHED */}
          {systemId === 'atwood-machine' && (
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
          {systemId === 'double-pendulum' && (
            <>
              <span className="truncate">θ₁ =</span>
              <span className="tabular-nums whitespace-nowrap">{theta.toFixed(3)} rad</span>
              <span className="truncate">θ₂ =</span>
              <span className="tabular-nums whitespace-nowrap">{valAngle.toFixed(3)} rad</span>
            </>
          )}
{systemId === 'horizontal-spring' && (
            <g transform="translate(0, 0)">
              {/* Floor */}
              <line x1="20" y1="160" x2="380" y2="160" stroke="#000000" strokeWidth="3" />
              {/* Wall */}
              <line x1="50" y1="40" x2="50" y2="160" stroke="#000000" strokeWidth="6" strokeLinecap="square" />
              {/* Hatch marks on Wall */}
              <line x1="50" y1="50" x2="42" y2="58" stroke="#000000" strokeWidth="2" />
              <line x1="50" y1="70" x2="42" y2="78" stroke="#000000" strokeWidth="2" />
              <line x1="50" y1="90" x2="42" y2="98" stroke="#000000" strokeWidth="2" />
              <line x1="50" y1="110" x2="42" y2="118" stroke="#000000" strokeWidth="2" />
              <line x1="50" y1="130" x2="42" y2="138" stroke="#000000" strokeWidth="2" />
              <line x1="50" y1="150" x2="42" y2="158" stroke="#000000" strokeWidth="2" />

              {/* Equilibrium center marker */}
              <line x1="200" y1="160" x2="200" y2="190" stroke="#000000" strokeWidth="1" strokeDasharray="3 3" />
              <text x="200" y="202" fill="#000000" fontSize="10" textAnchor="middle">Equilibrium (x=0)</text>

              {/* Vector guide marker for current x */}
              <line x1="200" y1="180" x2={200 + valX} y2="180" stroke="#000000" strokeWidth="1.5" />
              <circle cx={200 + valX} cy="180" r="3" fill="#000000" />
              <text x={200 + valX / 2} y="174" fill="#000000" fontSize="10" textAnchor="middle">x</text>

              {/* Spring */}
              <path
                d={generateSpringPath(50, 110, 200 + valX - 35, 110, 14, 15)}
                fill="none"
                stroke="#000000"
                strokeWidth="2.5"
              />

              {/* Mass Block */}
              <rect
                x={200 + valX - 35}
                y="80"
                width="70"
                height="80"
                rx="4"
                fill="#000000"
                stroke="#000000"
                strokeWidth="3.5"
              />
              <text
                x={200 + valX}
                y="125"
                textAnchor="middle"
                fill="#ffffff"
                fontSize="12"
                fontWeight="bold"
              >{v('m')}</text>

              {/* Info stats */}
              <text x="60" y="220" fill="#000000" fontSize="10">Elastic parameter: {v('k')}</text>
              <text x="260" y="220" fill="#000000" fontSize="10">State values: x, x'</text>
            </g>
          )}

          {/* SYSTEM ID MATCHED */}
          {systemId === 'vertical-spring' && (
            <g transform="translate(0, 0)">
              {/* Ceiling support */}
              <rect x="150" y="20" width="100" height="8" rx="2" fill="#000000" />
              <line x1="150" y1="20" x2="250" y2="20" stroke="#000000" strokeWidth="4" />

              {/* Reference indicator ceiling level */}
              <line x1="80" y1="20" x2="320" y2="20" stroke="#000000" strokeWidth="0.8" strokeDasharray="4 4" />
              <text x="85" y="15" fill="#000000" fontSize="9">y=0 reference (Ceiling V=0)</text>

              {/* Unstretched Spring line indicator level */}
              <line x1="240" y1="100" x2="320" y2="100" stroke="#000000" strokeWidth="0.8" strokeDasharray="2 2" />
              <text x="250" y="94" fill="#000000" fontSize="9">Unstretched length (y = 0)</text>

              {/* Displacement pointer coordinate y */}
              <line x1="280" y1="100" x2="280" y2={100 + valY} stroke="#000000" strokeWidth="1.5" />
              <circle cx="280" cy={100 + valY} r="3" fill="#000000" />
              <text x="290" y={100 + valY / 2 + 3} fill="#000000" fontSize="10">y</text>

              {/* Spring */}
              <path
                d={generateSpringPath(200, 24, 200, 100 + valY, 15, 12)}
                fill="none"
                stroke="#000000"
                strokeWidth="2.5"
              />

              {/* Mass block */}
              <rect
                x="170"
                y={100 + valY}
                width="60"
                height="50"
                rx="4"
                fill="#000000"
                stroke="#000000"
                strokeWidth="3.5"
              />
              <text
                x="200"
                y={100 + valY + 30}
                textAnchor="middle"
                fill="#ffffff"
                fontSize="11"
                fontWeight="bold"
              >{v('m')}</text>

              {/* Context display parameters */}
              <g transform="translate(30, 160)">
                <text x="0" y="0" fill="#000000" fontSize="10">Coeff: {v('k')}</text>
                <text x="0" y="16" fill="#000000" fontSize="10">Gravity: {v('g')} (down)</text>
                <text x="0" y="32" fill="#000000" fontSize="10">Drawn coordinate: y (downward)</text>
              </g>
            </g>
          )}

          {/* SYSTEM ID MATCHED */}
          {systemId === 'bead-rotating-rod' && (
            <g transform="translate(200, 120)">
              {/* Rotating Pivot */}
              <circle cx="0" cy="0" r="6" fill="#ffffff" stroke="#000000" strokeWidth="2" />
              <text x="-15" y="-15" fill="#ffffff" fontSize="11" textAnchor="end">Pivot</text>

              {/* Rotational velocity indicator */}
              <path
                d="M -25 -25 A 35 35 0 0 1 25 -25"
                fill="none"
                stroke="#000000"
                strokeWidth="1.5"
                strokeDasharray="3 2"
              />
              <text x="0" y="-35" fill="#000000" fontSize="10" textAnchor="middle">Const Ω (omega)</text>

              {/* Rotating rod */}
              <line
                x1={-160 * Math.cos(valAngle)}
                y1={-160 * Math.sin(valAngle)}
                x2={160 * Math.cos(valAngle)}
                y2={160 * Math.sin(valAngle)}
                stroke="#000000"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Bead (on the rod) */}
              <g transform={`rotate(${valAngle * (180 / Math.PI)})`}>
                {/* Distance marker r */}
                <line x1="0" y1="-8" x2={valR} y2="-8" stroke="#000000" strokeWidth="1.2" strokeDasharray="2 2" />
                <text x={valR / 2} y="-14" fill="#000000" fontSize="10" textAnchor="middle">r</text>

                {/* Bead particle mass m */}
                <circle
                  cx={valR}
                  cy="0"
                  r={s('m', 9)}
                  fill="#000000"
                  stroke="#000000"
                  strokeWidth="2.5"
                />
                <text
                  cx={valR}
                  cy="3"
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="9"
                  fontWeight="bold"
                  x={valR}
                  y={3}
                >{v('m')}</text>
              </g>

              {/* Context text labels */}
              <g transform="translate(-180, 80)">
                <text x="0" y="0" fill="#000000" fontSize="10">Mass: {v('m')}</text>
                <text x="0" y="14" fill="#000000" fontSize="10">No vertical gravity (Horizontal)</text>
                <text x="0" y="28" fill="#000000" fontSize="10">Co-ord: r, r'</text>
              </g>
            </g>
          )}

          {/* SYSTEM ID MATCHED */}
          {systemId === 'spring-pendulum' && (
            <g transform="translate(200, 40)">
              {/* Ceiling Support */}
              <rect x="-30" y="-8" width="60" height="8" rx="2" fill="#000000" />
              <circle cx="0" cy="0" r="4" fill="#ffffff" />
              <line x1="0" y1="0" x2="0" y2="180" stroke="#000000" strokeWidth="0.8" strokeDasharray="4 4" />

              {/* Angle arc */}
              <path
                d={`M 0 50 A 50 50 0 0 ${theta >= 0 ? 1 : 0} ${50 * Math.sin(theta)} ${50 * Math.cos(theta)}`}
                fill="none"
                stroke="#000000"
                strokeWidth="1.5"
                strokeDasharray="2 2"
              />
              <text
                x={70 * Math.sin(theta / 2)}
                y={70 * Math.cos(theta / 2)}
                fill="#000000"
                fontSize="11"
                textAnchor="middle"
              >
                θ
              </text>

              {/* Mass position coordinates */}
              const bobX = valR * Math.sin(theta);
              const bobY = valR * Math.cos(theta);

              {/* Spring suspension */}
              <path
                d={generateSpringPath(0, 0, valR * Math.sin(theta), valR * Math.cos(theta), 16, 10)}
                fill="none"
                stroke="#000000"
                strokeWidth="2.2"
              />

              {/* Unstretched length indicator r = l0 */}
              <circle
                cx={95 * Math.sin(theta)}
                cy={95 * Math.cos(theta)}
                r="3"
                fill="#000000"
                
              />
              <line
                x1={95 * Math.sin(theta) - 10 * Math.cos(theta)}
                y1={95 * Math.cos(theta) + 10 * Math.sin(theta)}
                x2={95 * Math.sin(theta) + 10 * Math.cos(theta)}
                y2={95 * Math.cos(theta) - 10 * Math.sin(theta)}
                stroke="#000000"
                strokeWidth="1.5"
              />
              <text
                x={s('l', 110) * Math.sin(theta) + 10}
                y={s('l', 110) * Math.cos(theta)}
                fontSize="9"
                fill="#000000"
              >
                unstretched (l0)
              </text>

              {/* Mass Bob */}
              <circle
                cx={valR * Math.sin(theta)}
                cy={valR * Math.cos(theta)}
                r={s('m', 13)}
                fill="#000000"
                stroke="#000000"
                strokeWidth="3"
              />
              <text
                x={valR * Math.sin(theta)}
                y={valR * Math.cos(theta) + 4}
                textAnchor="middle"
                fill="#ffffff"
                fontSize="10"
                fontWeight="bold"
              >{v('m')}</text>

              {/* Label Info */}
              <g transform="translate(-180, 20)">
                <text x="0" y="0" fill="#000000" fontSize="10">Spring: {v('k')}, {v('l0')}</text>
                <text x="0" y="14" fill="#000000" fontSize="10">Gravity: {v('g')}</text>
                <text x="0" y="28" fill="#000000" fontSize="10">Stretch: r (variable)</text>
                <text x="0" y="42" fill="#000000" fontSize="10">Angle: θ (variable)</text>
              </g>
            </g>
          )}

          {/* SYSTEM ID MATCHED */}
          {systemId === 'rotating-hoop' && (
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
                    >{v('m')}</text>
                  </>
                );
              })()}
            </g>
          )}

          {/* SYSTEM ID MATCHED */}
          {systemId === 'cart-pendulum' && (
            <g transform="translate(200, 60)">
              {/* Runway / Rail track */}
              <line x1="-180" y1="0" x2="180" y2="0" stroke="#000000" strokeWidth="4" />
              <line x1="-180" y1="6" x2="-180" y2="-6" stroke="#000000" strokeWidth="2" />
              <line x1="180" y1="6" x2="180" y2="-6" stroke="#000000" strokeWidth="2" />

              {/* Displacement text for cart */}
              <text x={valX} y="-24" fill="#000000" fontSize="10" textAnchor="middle">Cart Position: x</text>
              <line x1="0" y1="-16" x2={valX} y2="-16" stroke="#000000" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx={valX} cy="-16" r="2" fill="#000000" />

              {/* Sliding Cart (M) */}
              <rect
                x={valX - 40}
                y="-18"
                width="80"
                height={s('M', 30)}
                rx="3"
                fill="#000000"
                stroke="#000000"
                strokeWidth="2.5"
              />
              <text x={valX} y="2" fill="#000000" textAnchor="middle" fontSize="11" fontWeight="bold">{v('M')}</text>

              {/* Wheels of Cart */}
              <circle cx={valX - s('M', 50)/2} cy="15" r="7" fill="#000000" stroke="#000000" strokeWidth="1.5" />
              <circle cx={valX + s('M', 50)/2} cy="15" r="7" fill="#000000" stroke="#000000" strokeWidth="1.5" />

              {/* Pendulum suspension pivot joint on Cart */}
              <circle cx={valX} cy="5" r="4.5" fill="#000000" />

              {/* Dotted pivot timeline down */}
              <line x1={valX} y1="5" x2={valX} y2="150" stroke="#000000" strokeWidth="1" strokeDasharray="3 3" />

              {/* Angle arc helper */}
              <path
                d={`M ${valX} ${5 + 40} A 40 40 0 0 ${theta >= 0 ? 1 : 0} ${valX + 40 * Math.sin(theta)} ${5 + 40 * Math.cos(theta)}`}
                fill="none"
                stroke="#000000"
                strokeWidth="1.2"
                strokeDasharray="2 2"
              />
              <text
                x={valX + 55 * Math.sin(theta / 2)}
                y={5 + 55 * Math.cos(theta / 2)}
                fill="#000000"
                fontSize="11"
                textAnchor="middle"
              >
                θ
              </text>

              {/* Pendulum rod from Pivot inside Cart */}
              <line
                x1={valX}
                y1="5"
                x2={valX + s('l', 110) * Math.sin(theta)}
                y2={5 + s('l', 110) * Math.cos(theta)}
                stroke="#000000"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              <text x={valX + 55 * Math.sin(theta) + 12 * Math.cos(theta)} y={5 + 55 * Math.cos(theta) - 12 * Math.sin(theta)} fill="#000000" fontSize="10" fontStyle="italic" textAnchor="middle">{v('l')}</text>
              {/* Pendulum bob (m) */}
              <circle
                cx={valX + s('l', 110) * Math.sin(theta)}
                cy={5 + s('l', 110) * Math.cos(theta)}
                r={s('m', 11)}
                fill="#000000"
                stroke="#000000"
                strokeWidth="3.0"
              />
              <text
                x={valX + s('l', 110) * Math.sin(theta)}
                y={5 + s('l', 110) * Math.cos(theta) + 4}
                textAnchor="middle"
                fill="#ffffff"
                fontSize="9"
                fontWeight="bold"
              >{v('m')}</text>

              {/* Information labels */}
              <g transform="translate(-180, 110)">
                <text x="0" y="0" fill="#000000" fontSize="10">Coupled coordinates: x_dot, θ, θ'</text>
                <text x="0" y="14" fill="#000000" fontSize="10">Gravity: g, Pendulum length: l</text>
                <text x="0" y="28" fill="#000000" fontSize="10" fontWeight="bold">Center of mass is invariant</text>
              </g>
            </g>
          )}
                  {systemId === 'atwood-machine' && (
            <g transform="translate(200, 40)">
              {/* Ceiling Support */}
              <rect x="-20" y="-8" width="40" height="8" rx="2" fill="#000000" />
              {/* Pulley connection */}
              <line x1="0" y1="0" x2="0" y2="20" stroke="#000000" strokeWidth="2" />
              {/* Pulley */}
              <circle cx="0" cy="30" r="15" fill="#ffffff" stroke="#000000" strokeWidth="2" />
              <circle cx="0" cy="30" r="3" fill="#000000" />
              
              {/* Strings */}
              <line x1="-15" y1="30" x2="-15" y2={80 + valY} stroke="#000000" strokeWidth="1.5" />
              <line x1="15" y1="30" x2="15" y2={80 - valY} stroke="#000000" strokeWidth="1.5" />
              
              {/* Masses */}
              <rect x="-27" y={80 + valY} width="24" height="24" rx="2" fill="#000000" />
              <text x="-15" y={80 + valY + 16} fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">{v('m1')}</text>
              
              <rect x="3" y={80 - valY} width="24" height="24" rx="2" fill="#000000" />
              <text x="15" y={80 - valY + 16} fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">{v('m2')}</text>

              {/* Displacement text */}
              <line x1="-35" y1="80" x2="-35" y2={80 + valY} stroke="#000000" strokeWidth="1" strokeDasharray="3 3" />
              <text x="-40" y={80 + valY / 2} fill="#000000" fontSize="10" textAnchor="end">y</text>
            </g>
          )}

          {systemId === 'inclined-plane' && (
            <g transform="translate(100, 180)">
              {/* The plane */}
              <polygon points="0,0 160,0 0,-100" fill="#ffffff" stroke="#000000" strokeWidth="2" />
              <text x="35" y="-10" fill="#000000" fontSize="10">α</text>
              {/* Angle arc */}
              <path d="M 25 0 A 25 25 0 0 0 21 -13" fill="none" stroke="#000000" strokeWidth="1" />
              
              {/* Block */}
              <g transform={`translate(${valX * 160/188}, ${-100 + valX * 100/188})`}>
                <g transform="rotate(32)">
                  <rect x="-15" y="-30" width="30" height="30" fill="#000000" />
                  <text x="0" y="-11" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">{v('m')}</text>
                </g>
              </g>
            </g>
          )}

          {systemId === 'projectile-motion' && (
            <g transform="translate(200, 180)">
              {/* Ground */}
              <line x1="-180" y1="0" x2="180" y2="0" stroke="#000000" strokeWidth="2" />
              <line x1="-180" y1="4" x2="180" y2="4" stroke="#000000" strokeWidth="0.5" strokeDasharray="2 2" />
              
              {/* Trajectory (dashed line) */}
              <path d="M -120 0 Q 0 -120 120 0" fill="none" stroke="#000000" strokeWidth="1" strokeDasharray="4 4" />
              
              {/* Mass */}
              {(() => {
                const vx = 80;
                const vy = -80 + 53.333 * (((valX + 120) / 80) % 3);
                const mag = Math.sqrt(vx * vx + vy * vy);
                const nx = vx / mag;
                const ny = vy / mag;
                const vLen = 25;
                const ex = valX + nx * vLen;
                const ey = valY + ny * vLen;
                return (
                  <>
                    <circle cx={valX} cy={valY} r="8" fill="#000000" />
                    <text x={valX} y={valY - 12} fill="#000000" fontSize="10" textAnchor="middle">{v('m')}</text>
                    <line x1={valX} y1={valY} x2={ex} y2={ey} stroke="#000000" strokeWidth="1.5" />
                    <polygon points={`${ex},${ey} ${ex - 4*nx + 3*ny},${ey - 4*ny - 3*nx} ${ex - 4*nx - 3*ny},${ey - 4*ny + 3*nx}`} fill="#000000" />
                    <text x={ex + 6*nx} y={ey + 6*ny} fill="#000000" fontSize="10" alignmentBaseline="middle" textAnchor="middle">v</text>
                  </>
                );
              })()}
            </g>
          )}
          {systemId === 'double-pendulum' && (
            <g transform="translate(200, 40)">
              {/* Ceiling Support */}
              <rect x="-30" y="-8" width="60" height="8" rx="2" fill="#000000" />
              
              {/* Pivot 1 */}
              <circle cx="0" cy="0" r="4" fill="#ffffff" stroke="#000000" strokeWidth="2" />
              
              {/* Pendulum 1 */}
              <line x1="0" y1="0" x2={70 * Math.sin(theta)} y2={70 * Math.cos(theta)} stroke="#000000" strokeWidth="2.5" />
              <circle cx={70 * Math.sin(theta)} cy={70 * Math.cos(theta)} r="10" fill="#000000" />
              <text x={70 * Math.sin(theta) + 18} y={70 * Math.cos(theta) + 4} fill="#000000" fontSize="11" fontWeight="bold">{v('m1')}</text>
              
              {/* Vertical dotted line 1 */}
              <line x1="0" y1="0" x2="0" y2="40" stroke="#000000" strokeWidth="1" strokeDasharray="3 3" />
              {/* Angle 1 arc */}
              <path d={`M 0 30 A 30 30 0 0 ${theta >= 0 ? 0 : 1} ${30 * Math.sin(theta)} ${30 * Math.cos(theta)}`} fill="none" stroke="#000000" strokeWidth="1" />
              <text x={12 * Math.sin(theta / 2)} y={30 + 10 * Math.cos(theta / 2)} fill="#000000" fontSize="10">θ₁</text>

              {/* Pivot 2 */}
              <circle cx={70 * Math.sin(theta)} cy={70 * Math.cos(theta)} r="2" fill="#ffffff" />
              
              {/* Pendulum 2 */}
              <line 
                x1={70 * Math.sin(theta)} 
                y1={70 * Math.cos(theta)} 
                x2={70 * Math.sin(theta) + 60 * Math.sin(valAngle)} 
                y2={70 * Math.cos(theta) + 60 * Math.cos(valAngle)} 
                stroke="#000000" strokeWidth="2.5" 
              />
              <circle 
                cx={70 * Math.sin(theta) + 60 * Math.sin(valAngle)} 
                cy={70 * Math.cos(theta) + 60 * Math.cos(valAngle)} 
                r="8" fill="#000000" 
              />
              <text 
                x={70 * Math.sin(theta) + 60 * Math.sin(valAngle) + 15} 
                y={70 * Math.cos(theta) + 60 * Math.cos(valAngle) + 4} 
                fill="#000000" fontSize="11" fontWeight="bold">{v('m2')}</text>

              {/* Vertical dotted line 2 */}
              <line 
                x1={70 * Math.sin(theta)} 
                y1={70 * Math.cos(theta)} 
                x2={70 * Math.sin(theta)} 
                y2={70 * Math.cos(theta) + 30} 
                stroke="#000000" strokeWidth="1" strokeDasharray="3 3" 
              />
              {/* Angle 2 arc */}
              <path 
                d={`M ${70 * Math.sin(theta)} ${70 * Math.cos(theta) + 20} A 20 20 0 0 ${valAngle >= 0 ? 0 : 1} ${70 * Math.sin(theta) + 20 * Math.sin(valAngle)} ${70 * Math.cos(theta) + 20 * Math.cos(valAngle)}`} 
                fill="none" stroke="#000000" strokeWidth="1" 
              />
              <text 
                x={70 * Math.sin(theta) + 12 * Math.sin(valAngle / 2)} 
                y={70 * Math.cos(theta) + 20 + 8 * Math.cos(valAngle / 2)} 
                fill="#000000" fontSize="10">θ₂</text>
            </g>
          )}

          
          {systemId === 'planetary-motion' && (
            <g transform="translate(200, 120)">
              {/* Central Star */}
              <circle cx="0" cy="0" r="15" fill="#fff" stroke="#000" strokeWidth="2" />
              <text x="0" y="4" fill="#000" fontSize="10" fontWeight="bold" textAnchor="middle">{v('M')}</text>
              
              {/* Orbit Path (rough approximation for visual) */}
              <circle cx="0" cy="0" r={valR} fill="none" stroke="#000" strokeWidth="1" strokeDasharray="4 4" />
              
              {/* Planet Position */}
              <g transform={`translate(${valR * Math.cos(theta)}, ${-valR * Math.sin(theta)})`}>
                <circle cx="0" cy="0" r="6" fill="#000" stroke="#000" strokeWidth="1.5" />
                <text x="10" y="4" fill="#000" fontSize="10" fontWeight="bold">{v('m')}</text>
                
                {/* Velocity Vector */}
                <line x1="0" y1="0" x2={-20 * Math.sin(theta)} y2={-20 * Math.cos(theta)} stroke="#000" strokeWidth="1.5" />
                <polygon points={`${-20 * Math.sin(theta)},${-20 * Math.cos(theta)} ${-20 * Math.sin(theta) + 4 * Math.cos(theta - 0.5)},${-20 * Math.cos(theta) - 4 * Math.sin(theta - 0.5)} ${-20 * Math.sin(theta) - 4 * Math.cos(theta + 0.5)},${-20 * Math.cos(theta) + 4 * Math.sin(theta + 0.5)}`} fill="#000" />
              </g>

              {/* Radial Line */}
              <line x1="0" y1="0" x2={valR * Math.cos(theta)} y2={-valR * Math.sin(theta)} stroke="#000" strokeWidth="1" />
              <text x={(valR/2) * Math.cos(theta + 0.1)} y={-(valR/2) * Math.sin(theta + 0.1)} fill="#000" fontSize="10">r</text>
            </g>
          )}

          {systemId === 'physical-pendulum' && (
            <g transform="translate(200, 40)">
              {/* Pivot Point */}
              <circle cx="0" cy="0" r="4" fill="#fff" stroke="#000" strokeWidth="2" />
              <rect x="-15" y="-8" width="30" height="4" fill="#000" />
              
              {/* Dotted Vertical Line */}
              <line x1="0" y1="0" x2="0" y2="100" stroke="#000" strokeWidth="1" strokeDasharray="4 4" />

              {/* The Rod (rotated) */}
              <g transform={`rotate(${(-theta * 180) / Math.PI})`}>
                <rect x="-4" y="0" width="8" height="120" rx="4" fill="#000" />
                <circle cx="0" cy="60" r="3" fill="#fff" />
                <text x="12" y="64" fill="#000" fontSize="12" fontWeight="bold">CM</text>
              </g>
              
              {/* Angle Arc */}
              <path 
                d={`M 0 40 A 40 40 0 0 ${theta >= 0 ? 0 : 1} ${40 * Math.sin(theta)} ${40 * Math.cos(theta)}`} 
                fill="none" stroke="#000" strokeWidth="1" 
              />
              <text x={20 * Math.sin(theta / 2)} y={40 + 10 * Math.cos(theta / 2)} fill="#000" fontSize="10">θ</text>
            </g>
          )}

          {systemId === 'rolling-wheel-incline' && (
            <g transform="translate(80, 50)">
              {/* Incline */}
              <polygon points="0,0 250,150 0,150" fill="#f9f9f9" stroke="#000" strokeWidth="2" />
              
              <g transform={`rotate(30.96)`}> {/* atan(150/250) = 30.96 deg */}
                {/* Wheel */}
                <g transform={`translate(${valX}, -15)`}>
                  <circle cx="0" cy="0" r="15" fill="#fff" stroke="#000" strokeWidth="2" />
                  {/* Spoke to show rotation */}
                  <line x1="0" y1="0" x2={`${15 * Math.cos(theta)}`} y2={`${15 * Math.sin(theta)}`} stroke="#000" strokeWidth="2" />
                  <text x="0" y="-20" fill="#000" fontSize="10" fontWeight="bold" textAnchor="middle">{v('m')}, {v('R')}</text>
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
              <text x={-80 + valX} y="4" fill="#000" fontSize="12" fontWeight="bold" textAnchor="middle">{v('m1')}</text>

              {/* Mass 2 */}
              <rect x={80 + valY - 15} y="-15" width="30" height="30" fill="#fff" stroke="#000" strokeWidth="2" />
              <text x={80 + valY} y="4" fill="#000" fontSize="12" fontWeight="bold" textAnchor="middle">{v('m2')}</text>

              {/* Spring 1 */}
              {renderSpring(-150, 0, -80 + valX - 15, 0, 6, 4)}
              <text x={-115 + valX/2} y="-10" fill="#000" fontSize="10" textAnchor="middle">k₁</text>

              {/* Spring 2 */}
              {renderSpring(-80 + valX + 15, 0, 80 + valY - 15, 0, 8, 4)}
              <text x={(valX + valY)/2} y="-10" fill="#000" fontSize="10" textAnchor="middle">k₂</text>

              {/* Spring 3 */}
              {renderSpring(80 + valY + 15, 0, 150, 0, 6, 4)}
              <text x={115 + valY/2} y="-10" fill="#000" fontSize="10" textAnchor="middle">k₃</text>
            </g>
          )}

          {systemId === 'block-wedge' && (
            <g transform="translate(200, 150)">
              {/* Floor */}
              <line x1="-180" y1="0" x2="180" y2="0" stroke="#000" strokeWidth="2" />
              
              <g transform={`translate(${valX}, 0)`}>
                {/* Wedge */}
                <polygon points="-60,0 60,0 -60,-80" fill="#fff" stroke="#000" strokeWidth="2" />
                <text x="-30" y="-10" fill="#000" fontSize="12" fontWeight="bold">{v('M')}</text>
            <line x1="10" y1="-10" x2="30" y2="-10" stroke="#000" strokeWidth="1.5" />
            <polygon points="30,-10 26,-13 26,-7" fill="#000" />
            <text x="35" y="-6" fill="#000" fontSize="10" fontStyle="italic">Ẋ</text>
                
                {/* Block on Wedge */}
                <g transform="translate(-60, -80)">
                  <g transform="rotate(33.69)"> {/* Approx 33 deg for 80/120 triangle */}
                    <g transform={`translate(${valY}, 0)`}>
                      <rect x="0" y="-20" width="20" height="20" fill="#fff" stroke="#000" strokeWidth="2" />
                      <text x="10" y="-5" fill="#000" fontSize="10" fontWeight="bold" textAnchor="middle">{v('m')}</text>
                  <line x1="22" y1="-10" x2="35" y2="-10" stroke="#000" strokeWidth="1.5" />
                  <polygon points="35,-10 31,-13 31,-7" fill="#000" />
                  <text x="40" y="-6" fill="#000" fontSize="10" fontStyle="italic">ṡ</text>
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
              <text x="-10" y={154 - valR} fill="#000" fontSize="12" fontWeight="bold" textAnchor="middle">{v('M')}</text>

              {/* Swinging Mass m */}
              <g transform={`rotate(${(theta * 180) / Math.PI})`}>
                <line x1="10" y1="0" x2="10" y2={valR} stroke="#000" strokeWidth="1" />
                <circle cx="10" cy={valR} r="8" fill="#fff" stroke="#000" strokeWidth="2" />
                <text x="25" y={valR + 5} fill="#000" fontSize="12" fontWeight="bold">{v('m')}</text>
              </g>
            </g>
          )}

      {systemId === 'spherical-pendulum' && (
        <g transform="translate(200, 50)">
          {/* Pivot */}
          <circle cx="0" cy="0" r="4" fill="#fff" stroke="#000" strokeWidth="2" />
          <rect x="-15" y="-8" width="30" height="4" fill="#000" />
          <line x1="0" y1="0" x2="0" y2="150" stroke="#ccc" strokeWidth="1" strokeDasharray="4 4" />
          
          {/* Calculate 3D projection. Z is down. Isometric perspective */}
          <g transform={`translate(${120 * Math.sin(theta) * Math.cos(valAngle)}, ${120 * Math.cos(theta) - 15 * Math.sin(theta) * Math.sin(valAngle)})`}>
            <line x1={-120 * Math.sin(theta) * Math.cos(valAngle)} y1={-120 * Math.cos(theta) + 15 * Math.sin(theta) * Math.sin(valAngle)} x2="0" y2="0" stroke="#000" strokeWidth="2" />
            <circle cx="0" cy="0" r="10" fill={Math.sin(valAngle) > 0 ? "#fff" : "#eee"} stroke="#000" strokeWidth="2" />
            <text x="15" y="4" fill="#000" fontSize="12" fontWeight="bold">{v('m')}</text>
          </g>
          
          {/* Path ellipse rough trace */}
          <ellipse cx="0" cy={120 * Math.cos(theta)} rx={120 * Math.sin(theta)} ry={15 * Math.sin(theta)} fill="none" stroke="#ddd" strokeWidth="1" strokeDasharray="2 2" />
        </g>
      )}

      {systemId === 'particle-cone' && (
        <g transform="translate(200, 40)">
          {/* Cone outline (cross section) */}
          <polygon points="0,150 -100,0 100,0" fill="none" stroke="#000" strokeWidth="2" />
          <ellipse cx="0" cy="0" rx="100" ry="20" fill="none" stroke="#000" strokeWidth="1" />
          <line x1="0" y1="0" x2="0" y2="170" stroke="#ccc" strokeWidth="1" strokeDasharray="4 4" />

          {/* c is slope, let's say c=1.5 so z = 1.5 * rho */}
          <g transform={`translate(${valR * Math.cos(valAngle)}, ${150 - 1.5 * valR - 0.2 * valR * Math.sin(valAngle)})`}>
            <circle cx="0" cy="0" r="8" fill={Math.sin(valAngle) > 0 ? "#fff" : "#ccc"} stroke="#000" strokeWidth="2" />
            <text x="12" y="4" fill="#000" fontSize="12" fontWeight="bold">{v('m')}</text>
          </g>

          {/* Trace orbit circle at current z */}
          <ellipse cx="0" cy={150 - 1.5 * valR} rx={valR} ry={0.2 * valR} fill="none" stroke="#999" strokeWidth="1" strokeDasharray="2 2" />
        </g>
      )}
</svg>

        {/* Math overlay of current values */}
        <div className="absolute bottom-2 right-3 font-mono text-[10px] text-black bg-white py-1 px-2 border border-black shadow flex gap-3">
          {systemId === 'simple-pendulum' && (
            <>
              <span>θ = {theta.toFixed(3)} rad</span>
              <span>θ' = {(-2.4 * Math.sin(time * 3)).toFixed(3)} rad/s</span>
            </>
          )}
          {systemId === 'horizontal-spring' && (
            <>
              <span>x = {valX.toFixed(1)} mm</span>
              <span>x' = {(-180 * Math.sin(time * 4)).toFixed(0)} mm/s</span>
            </>
          )}
          {systemId === 'vertical-spring' && (
            <>
              <span>y = {valY.toFixed(1)} mm</span>
              <span>y' = {(157.5 * Math.cos(time * 4.5)).toFixed(0)} mm/s</span>
            </>
          )}
          {systemId === 'bead-rotating-rod' && (
            <>
              <span>r = {valR.toFixed(1)} mm</span>
              <span>r' = {valR > 95 ? 'flung!' : 'sliding'}</span>
              <span>θ = {(valAngle % (2 * Math.PI)).toFixed(2)} rad</span>
            </>
          )}
          {systemId === 'spring-pendulum' && (
            <>
              <span>r = {valR.toFixed(1)} mm</span>
              <span>θ = {theta.toFixed(3)} rad</span>
            </>
          )}
          {systemId === 'rotating-hoop' && (
            <>
              <span>θ = {theta.toFixed(3)} rad</span>
              <span>φ' (spin) = 4.000 rad/s</span>
            </>
          )}
          {systemId === 'cart-pendulum' && (
            <>
              <span>x' (cart) = {(-75 * Math.cos(theta) * (-2.4 * Math.sin(time * 3))).toFixed(1)} cm/s</span>
              <span>θ = {theta.toFixed(3)} rad</span>
            </>
          )}
        </div>
      </div>

      {/* Manual Drag sliders - always rendered to maintain height */}
      <div className={`px-4 py-3 bg-white border-t border-black flex flex-col gap-2.5 transition-opacity ${isPlaying ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
        <p className="text-[10.5px] text-black italic font-bold h-8 flex items-center">
          {isPlaying ? 'Simulation running (controls disabled):' : 'Paused. Adjust coordinates manually to study configurations:'}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Conditional Sliders based on system */}
            {(systemId === 'simple-pendulum' || systemId === 'spring-pendulum' || systemId === 'rotating-hoop' || systemId === 'cart-pendulum') && (
              <div className="flex flex-col">
                <div className="flex justify-between text-[11px] font-mono font-bold text-black">
                  <span className="truncate">θ (theta):</span>
                  <span className="tabular-nums whitespace-nowrap">{theta.toFixed(3)} rad ({(theta * (180 / Math.PI)).toFixed(0)}°)</span>
                </div>
                <input
                  type="range"
                  min="-1.5"
                  max="1.5"
                  step="0.01"
                  value={theta}
                  onChange={(e) => setTheta(parseFloat(e.target.value))}
                  className="w-full h-1 bg-black appearance-none cursor-pointer mt-1"
                />
              </div>
            )}

            
            
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

            {systemId === 'rolling-wheel-incline' && (
              <div className="flex flex-col">
                <div className="flex justify-between text-[11px] font-mono font-bold text-black">
                  <span className="truncate">x (distance):</span>
                  <span className="tabular-nums whitespace-nowrap">{valX.toFixed(1)} m</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="250"
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

        {systemId === 'spherical-pendulum' && (
          <>
            <div className="flex flex-col">
              <div className="flex justify-between text-[11px] font-mono font-bold text-black">
                <span className="truncate">θ (Polar):</span>
                <span className="tabular-nums whitespace-nowrap">{theta.toFixed(2)} rad</span>
              </div>
              <input
                type="range"
                min="0"
                max="1.5"
                step="0.01"
                value={theta}
                onChange={(e) => setTheta(parseFloat(e.target.value))}
                className="w-full h-1 bg-black appearance-none cursor-pointer mt-1"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex justify-between text-[11px] font-mono font-bold text-black">
                <span className="truncate">φ (Azimuthal):</span>
                <span className="tabular-nums whitespace-nowrap">{valAngle.toFixed(2)} rad</span>
              </div>
              <input
                type="range"
                min="0"
                max="6.28"
                step="0.01"
                value={valAngle}
                onChange={(e) => setValAngle(parseFloat(e.target.value))}
                className="w-full h-1 bg-black appearance-none cursor-pointer mt-1"
              />
            </div>
          </>
        )}
        {systemId === 'particle-cone' && (
          <>
            <div className="flex flex-col">
              <div className="flex justify-between text-[11px] font-mono font-bold text-black">
                <span className="truncate">ρ (Radius):</span>
                <span className="tabular-nums whitespace-nowrap">{valR.toFixed(1)} m</span>
              </div>
              <input
                type="range"
                min="20"
                max="75"
                step="1"
                value={valR}
                onChange={(e) => setValR(parseFloat(e.target.value))}
                className="w-full h-1 bg-black appearance-none cursor-pointer mt-1"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex justify-between text-[11px] font-mono font-bold text-black">
                <span className="truncate">φ (Azimuthal):</span>
                <span className="tabular-nums whitespace-nowrap">{valAngle.toFixed(2)} rad</span>
              </div>
              <input
                type="range"
                min="0"
                max="6.28"
                step="0.01"
                value={valAngle}
                onChange={(e) => setValAngle(parseFloat(e.target.value))}
                className="w-full h-1 bg-black appearance-none cursor-pointer mt-1"
              />
            </div>
          </>
        )}
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
{(systemId === 'horizontal-spring' || systemId === 'cart-pendulum') && (
              <div className="flex flex-col">
                <div className="flex justify-between text-[11px] font-mono font-bold text-black">
                  <span className="truncate">x (displacement):</span>
                  <span className="tabular-nums whitespace-nowrap">{valX.toFixed(1)} mm</span>
                </div>
                <input
                  type="range"
                  min="-45"
                  max="45"
                  step="1"
                  value={valX}
                  onChange={(e) => setValX(parseFloat(e.target.value))}
                  className="w-full h-1 bg-black appearance-none cursor-pointer mt-1"
                />
              </div>
            )}

            {systemId === 'vertical-spring' && (
              <div className="flex flex-col">
                <div className="flex justify-between text-[11px] font-mono font-bold text-black">
                  <span className="truncate">y (downward stretch):</span>
                  <span className="tabular-nums whitespace-nowrap">{valY.toFixed(1)} mm</span>
                </div>
                <input
                  type="range"
                  min="-35"
                  max="70"
                  step="1"
                  value={valY}
                  onChange={(e) => setValY(parseFloat(e.target.value))}
                  className="w-full h-1 bg-black appearance-none cursor-pointer mt-1"
                />
              </div>
            )}

            {(systemId === 'bead-rotating-rod' || systemId === 'spring-pendulum') && (
              <div className="flex flex-col">
                <div className="flex justify-between text-[11px] font-mono font-bold text-black">
                  <span className="truncate">r (radial distance):</span>
                  <span className="tabular-nums whitespace-nowrap">{valR.toFixed(1)} mm</span>
                </div>
                <input
                  type="range"
                  min={systemId === 'spring-pendulum' ? '70' : '10'}
                  max={systemId === 'spring-pendulum' ? '150' : '150'}
                  step="1"
                  value={valR}
                  onChange={(e) => setValR(parseFloat(e.target.value))}
                  className="w-full h-1 bg-black appearance-none cursor-pointer mt-1"
                />
              </div>
            )}

            {systemId === 'bead-rotating-rod' && (
              <div className="flex flex-col">
                <div className="flex justify-between text-[11px] font-mono font-bold text-black">
                  <span className="truncate">θ (rod layout angle):</span>
                  <span className="tabular-nums whitespace-nowrap">{(valAngle % (2 * Math.PI)).toFixed(2)} rad</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="6.28"
                  step="0.05"
                  value={valAngle}
                  onChange={(e) => setValAngle(parseFloat(e.target.value))}
                  className="w-full h-1 bg-black appearance-none cursor-pointer mt-1"
                />
              </div>
            )}
          </div>
        </div>
    </div>
  );
}
