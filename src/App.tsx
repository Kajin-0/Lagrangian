/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import {
  BookOpen,
  HelpCircle,
  CheckCircle2,
  XCircle,
  Check,
  ChevronRight,
  Info,
  Copy,
  RotateCcw,
  Calculator,
  AlertCircle,
  Award,
  Sparkles,
  RefreshCw,
  Bookmark
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { PHYSICAL_SYSTEMS } from './data/systems';
import { verifyExpression } from './lib/mathParser';
import { generateTrialProbes, TrialProbe } from './lib/evalProbes';
import SystemDiagram from './components/SystemDiagram';

// Euler-Lagrange final equations of motion mapped by system ID for custom celebration cards
const EULER_LAGRANGE_EQUATIONS: Record<string, string[]> = {
  'simple-pendulum': [
    "θ'' + (g / l) * sin(θ) = 0"
  ],
  'horizontal-spring': [
    "x'' + (k / m) * x = 0"
  ],
  'vertical-spring': [
    "y'' + (k / m) * y = g"
  ],
  'bead-rotating-rod': [
    "r'' - ω² * r = 0"
  ],
  'spring-pendulum': [
    "r'' - r * θ'² + (k/m)*(r - l0) + g * cos(θ) = 0",
    "θ'' + (2 * r' * θ') / r + (g / r) * sin(θ) = 0"
  ],
  'rotating-hoop': [
    "θ'' - ω² * sin(θ) * cos(θ) + (g / R) * sin(θ) = 0"
  ],
  'cart-pendulum': [
    "(M + m) * x'' + m * l * θ'' * cos(θ) - m * l * θ'² * sin(θ) = 0",
    "l * θ'' + x'' * cos(θ) + g * sin(θ) = 0"
  ]
,
  'atwood-machine': [
    "y'' - ((m1 - m2) / (m1 + m2)) * g = 0"
  ],
  'inclined-plane': [
    "s'' - g * sin(alpha) = 0"
  ],
  'projectile-motion': [
    "x'' = 0",
    "y'' + g = 0"
  ]
,
  'double-pendulum': [
    "theta1'' = (-g*(2*m1+m2)*sin(theta1) - m2*g*sin(theta1-2*theta2) - 2*sin(theta1-theta2)*m2*(theta2_dot^2*l2 + theta1_dot^2*l1*cos(theta1-theta2))) / (l1*(2*m1+m2-m2*cos(2*theta1-2*theta2)))",
    "theta2'' = (2*sin(theta1-theta2)*(theta1_dot^2*l1*(m1+m2) + g*(m1+m2)*cos(theta1) + theta2_dot^2*l2*m2*cos(theta1-theta2))) / (l2*(2*m1+m2-m2*cos(2*theta1-2*theta2)))"
  ]
};

// Help helper function to translate variable code token to mathematical unicode symbols
function unicodeSymbol(v: string): string {
  switch (v) {
    case 'theta': return 'θ';
    case 'theta_dot': return "θ̇ (θ')";
    case 'phi': return 'φ';
    case 'phi_dot': return "φ̇ (φ')";
    case 'omega': return 'ω';
    case 'pi': return 'π';
    case 'x_dot': return 'ẋ';
    case 'y_dot': return 'ẏ';
    case 'r_dot': return 'ṙ';
    default: return v;
  }
}

export default function App() {
  const [selectedSystem, setSelectedSystem] = useState(PHYSICAL_SYSTEMS[0]);
  const [inputT, setInputT] = useState('');
  const [inputV, setInputV] = useState('');

  const [isChecked, setIsChecked] = useState(false);
  const [isTCorrect, setIsTCorrect] = useState<boolean | null>(null);
  const [isVCorrect, setIsVCorrect] = useState<boolean | null>(null);

  const [trialProbesT, setTrialProbesT] = useState<TrialProbe[]>([]);
  const [trialProbesV, setTrialProbesV] = useState<TrialProbe[]>([]);

  const [completedList, setCompletedList] = useState<string[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const refInputT = useRef<HTMLInputElement>(null);
  const refInputV = useRef<HTMLInputElement>(null);
  const [lastFocusedInput, setLastFocusedInput] = useState<'T' | 'V'>('T');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('lagrangian_trainer_progress');
      if (stored) {
        setCompletedList(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const saveProgress = (list: string[]) => {
    try {
      localStorage.setItem('lagrangian_trainer_progress', JSON.stringify(list));
      setCompletedList(list);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSelectSystem = (sys: typeof PHYSICAL_SYSTEMS[0]) => {
    setSelectedSystem(sys);
    setInputT('');
    setInputV('');
    setIsChecked(false);
    setIsTCorrect(null);
    setIsVCorrect(null);
    setTrialProbesT([]);
    setTrialProbesV([]);
  };

  const handleInsertVariable = (varName: string) => {
    const activeRef = lastFocusedInput === 'T' ? refInputT : refInputV;
    const activeValue = lastFocusedInput === 'T' ? inputT : inputV;
    const setActiveValue = lastFocusedInput === 'T' ? setInputT : setInputV;

    if (activeRef.current) {
      const start = activeRef.current.selectionStart || 0;
      const end = activeRef.current.selectionEnd || 0;
      const textBefore = activeValue.substring(0, start);
      const textAfter = activeValue.substring(end);
      const insertion = textBefore.endsWith(' ') || start === 0 ? varName : ` ${varName}`;
      setActiveValue(textBefore + insertion + textAfter);

      setTimeout(() => {
        if (activeRef.current) {
          activeRef.current.focus();
          const newPos = start + insertion.length;
          activeRef.current.setSelectionRange(newPos, newPos);
        }
      }, 50);
    } else {
      setActiveValue(activeValue + (activeValue === '' ? varName : ` * ${varName}`));
    }
  };

  const handleVerify = () => {
    const resultT = verifyExpression(inputT, selectedSystem.correctT, selectedSystem.allowedVars);
    setIsTCorrect(resultT.correct);
    setTrialProbesT(generateTrialProbes(inputT, selectedSystem.correctT, selectedSystem.allowedVars));

    const resultV = verifyExpression(inputV, selectedSystem.correctV, selectedSystem.allowedVars);
    setIsVCorrect(resultV.correct);
    setTrialProbesV(generateTrialProbes(inputV, selectedSystem.correctV, selectedSystem.allowedVars));

    setIsChecked(true);

    if (resultT.correct && resultV.correct) {
      if (!completedList.includes(selectedSystem.id)) {
        saveProgress([...completedList, selectedSystem.id]);
      }
    }
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col antialiased selection:bg-black selection:text-white font-mono">
      
      <header className="border-b border-black px-4 py-3 flex items-center justify-between">
        <h1 className="text-sm font-bold tracking-widest uppercase">
          Lagrangian Core
        </h1>
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="text-xs text-black hover:bg-black hover:text-white border border-black px-2 py-1 transition flex items-center gap-1"
        >
          {completedList.length}/{PHYSICAL_SYSTEMS.length} Systems <ChevronRight className="w-3 h-3" />
        </button>
      </header>

      <AnimatePresence>
        {isDrawerOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="absolute inset-0 bg-white/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              className="relative w-64 bg-white border-l border-black h-full p-4 flex flex-col shadow-2xl"
            >
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-black">
                <span className="text-xs font-bold uppercase tracking-widest">Systems</span>
                <button onClick={() => setIsDrawerOpen(false)} className="text-black font-bold">✕</button>
              </div>
              <div className="flex flex-col gap-2 overflow-y-auto">
                {PHYSICAL_SYSTEMS.map((sys) => {
                  const isActive = selectedSystem.id === sys.id;
                  const isResolved = completedList.includes(sys.id);
                  return (
                    <button
                      key={sys.id}
                      onClick={() => { handleSelectSystem(sys); setIsDrawerOpen(false); }}
                      className={`text-left p-2 border transition flex justify-between items-center text-xs uppercase tracking-wider ${
                        isActive ? 'bg-black text-white border-black' : 'bg-white text-black border-black hover:bg-gray-100'
                      }`}
                    >
                      <span>{sys.title}</span>
                      {isResolved && <CheckCircle2 className={`w-3 h-3 ${isActive ? 'text-white' : 'text-black'}`} />}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <main className="flex-1 w-full max-w-xl mx-auto px-4 py-6 flex flex-col gap-6">
        
        <section className="bg-white border border-black p-4">
          <div className="flex justify-between items-center mb-4 border-b border-black pb-2">
            <h2 className="text-sm font-bold uppercase tracking-widest">{selectedSystem.title}</h2>
            <span className="text-[10px] uppercase tracking-widest">V = 0 at {selectedSystem.referenceVZero}</span>
          </div>
          <div className="w-full flex justify-center">
            <SystemDiagram systemId={selectedSystem.id} />
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold uppercase tracking-widest">Kinetic Energy (T)</label>
              {isChecked && (
                <span className={`text-[10px] font-bold ${isTCorrect ? 'text-black' : 'text-red-600'}`}>
                  {isTCorrect ? 'PASS' : 'FAIL'}
                </span>
              )}
            </div>
            <input
              ref={refInputT}
              value={inputT}
              onChange={(e) => { setInputT(e.target.value); setIsChecked(false); }}
              onFocus={() => setLastFocusedInput('T')}
              className="w-full bg-white border border-black p-3 text-sm focus:outline-none focus:ring-1 focus:ring-black"
              placeholder="e.g. 0.5*m*(l*theta_dot)^2"
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold uppercase tracking-widest">Potential Energy (V)</label>
              {isChecked && (
                <span className={`text-[10px] font-bold ${isVCorrect ? 'text-black' : 'text-red-600'}`}>
                  {isVCorrect ? 'PASS' : 'FAIL'}
                </span>
              )}
            </div>
            <input
              ref={refInputV}
              value={inputV}
              onChange={(e) => { setInputV(e.target.value); setIsChecked(false); }}
              onFocus={() => setLastFocusedInput('V')}
              className="w-full bg-white border border-black p-3 text-sm focus:outline-none focus:ring-1 focus:ring-black"
              placeholder="e.g. -m*g*l*cos(theta)"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {selectedSystem.allowedVars.map((v) => (
              <button
                key={v}
                onClick={() => handleInsertVariable(v)}
                className="px-2 py-1 bg-white border border-black hover:bg-black hover:text-white transition text-xs"
              >
                {unicodeSymbol(v)}
              </button>
            ))}
            {['(', ')', '*', '/', '+', '-', '^2', 'cos(', 'sin('].map((op) => (
              <button
                key={op}
                onClick={() => handleInsertVariable(op)}
                className="px-2 py-1 bg-white border border-black hover:bg-black hover:text-white transition text-xs"
              >
                {op}
              </button>
            ))}
          </div>

          <button
            onClick={handleVerify}
            className="w-full bg-black text-white hover:bg-white hover:text-black border border-black py-3 text-sm font-bold tracking-widest uppercase transition mt-2"
          >
            Verify
          </button>
        </section>

        {isChecked && isTCorrect && isVCorrect && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-black p-4 text-center">
            <span className="text-xs uppercase tracking-widest font-bold">Equations of Motion</span>
            <div className="mt-3 flex flex-col gap-2 text-sm">
              {EULER_LAGRANGE_EQUATIONS[selectedSystem.id]?.map((eq, i) => (
                <div key={i} className="font-bold">{eq}</div>
              ))}
            </div>
          </motion.div>
        )}

      </main>
    </div>
  );
}
