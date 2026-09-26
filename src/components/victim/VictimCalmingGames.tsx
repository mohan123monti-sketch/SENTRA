import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Gamepad2, 
  RotateCcw, 
  Heart, 
  Moon, 
  Sun, 
  Wind, 
  Compass, 
  Smile, 
  CheckCircle2, 
  Bot, 
  Volume2, 
  VolumeX, 
  Plus, 
  Flower2, 
  Waves,
  Feather,
  Shield,
  Layers
} from 'lucide-react';

type GameTab = 'bubbles' | 'zen_garden' | 'memory' | 'breathing';

export const VictimCalmingGames: React.FC<{ onNavigateTab: (tab: string) => void }> = ({ onNavigateTab }) => {
  const [activeGame, setActiveGame] = useState<GameTab>('bubbles');

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top Header Card */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-teal-800 font-semibold flex items-center gap-1.5">
            <Gamepad2 className="w-3.5 h-3.5 text-teal-700" />
            <span>Mindful Oasis & Calming De-escalation</span>
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            Mindful Stress Relief & Grounding Games
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-xl leading-relaxed">
            Legal proceedings place high demands on your emotional nervous system. These sensory grounding games are designed to lower acute physiological stress, break ruminating thought loops, and restore inner equilibrium.
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('chatai')}
          className="px-3.5 py-2 border border-teal-200 bg-teal-50 text-teal-900 rounded text-xs font-semibold flex items-center gap-1.5 hover:bg-teal-100 transition-colors self-start sm:self-auto shrink-0"
        >
          <Bot className="w-4 h-4 text-teal-700" />
          <span>Talk to AI Companion</span>
        </button>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="bg-white rounded-lg border border-slate-200 p-1.5 shadow-xs flex flex-wrap gap-1.5 text-xs font-semibold">
        <button
          onClick={() => setActiveGame('bubbles')}
          className={`flex-1 min-w-[140px] py-2 px-3 rounded text-center transition-all flex items-center justify-center gap-2 ${
            activeGame === 'bubbles'
              ? 'bg-teal-800 text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>1. Worry Bubble Pop</span>
        </button>

        <button
          onClick={() => setActiveGame('breathing')}
          className={`flex-1 min-w-[140px] py-2 px-3 rounded text-center transition-all flex items-center justify-center gap-2 ${
            activeGame === 'breathing'
              ? 'bg-teal-800 text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Wind className="w-3.5 h-3.5" />
          <span>2. Grounding Breath Sphere</span>
        </button>

        <button
          onClick={() => setActiveGame('zen_garden')}
          className={`flex-1 min-w-[140px] py-2 px-3 rounded text-center transition-all flex items-center justify-center gap-2 ${
            activeGame === 'zen_garden'
              ? 'bg-teal-800 text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Waves className="w-3.5 h-3.5" />
          <span>3. Zen Sand & Pebble Garden</span>
        </button>

        <button
          onClick={() => setActiveGame('memory')}
          className={`flex-1 min-w-[140px] py-2 px-3 rounded text-center transition-all flex items-center justify-center gap-2 ${
            activeGame === 'memory'
              ? 'bg-teal-800 text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>4. Tranquility Match</span>
        </button>
      </div>

      {/* ACTIVE GAME RENDER */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs min-h-[460px]">
        {activeGame === 'bubbles' && <WorryBubbleGame />}
        {activeGame === 'breathing' && <BreathingSphereGame />}
        {activeGame === 'zen_garden' && <ZenSandGardenGame />}
        {activeGame === 'memory' && <TranquilMemoryGame />}
      </div>
    </div>
  );
};

/* =========================================================================
   GAME 1: WORRY BUBBLE POP & AFFIRMATION RELEASE
   ========================================================================= */

interface BubbleItem {
  id: number;
  label: string;
  affirmation: string;
  popped: boolean;
  color: string;
  size: number;
  x: number;
  y: number;
}

const INITIAL_BUBBLES: Array<Omit<BubbleItem, 'id' | 'popped' | 'x' | 'y'>> = [
  { label: "Hearing Dread", affirmation: "You have courage within you. One step at a time.", color: "from-rose-400 to-amber-300", size: 100 },
  { label: "What If Thoughts", affirmation: "You only need to handle this present breath.", color: "from-blue-400 to-indigo-300", size: 95 },
  { label: "Cross-Examination Tension", affirmation: "Your truth remains solid. You are protected.", color: "from-purple-400 to-pink-300", size: 110 },
  { label: "Sleepless Night", affirmation: "Your mind is allowed to rest. You are safe now.", color: "from-teal-400 to-emerald-300", size: 90 },
  { label: "Feeling Isolated", affirmation: "You have a dedicated support caseworker beside you.", color: "from-amber-400 to-orange-300", size: 105 },
  { label: "Physical Shaking", affirmation: "Breathe into your feet. The ground supports you.", color: "from-cyan-400 to-blue-300", size: 95 },
  { label: "Court Uncertainty", affirmation: "You have legal procedural rights andDLSA advocacy.", color: "from-emerald-400 to-teal-300", size: 100 },
  { label: "Overwhelmed", affirmation: "Release the pressure to be perfect. You are doing enough.", color: "from-fuchsia-400 to-rose-300", size: 105 },
];

const WorryBubbleGame: React.FC = () => {
  const [bubbles, setBubbles] = useState<BubbleItem[]>(() =>
    INITIAL_BUBBLES.map((b, i) => ({
      ...b,
      id: i,
      popped: false,
      x: 10 + (i % 4) * 22 + (Math.random() * 6 - 3),
      y: 15 + Math.floor(i / 4) * 40 + (Math.random() * 8 - 4),
    }))
  );

  const [poppedCount, setPoppedCount] = useState(0);
  const [latestAffirmation, setLatestAffirmation] = useState<string | null>(null);

  const popBubble = (id: number) => {
    setBubbles(prev =>
      prev.map(b => {
        if (b.id === id && !b.popped) {
          setLatestAffirmation(b.affirmation);
          setPoppedCount(c => c + 1);
          return { ...b, popped: true };
        }
        return b;
      })
    );
  };

  const resetBubbles = () => {
    setBubbles(
      INITIAL_BUBBLES.map((b, i) => ({
        ...b,
        id: i,
        popped: false,
        x: 10 + (i % 4) * 22 + (Math.random() * 6 - 3),
        y: 15 + Math.floor(i / 4) * 40 + (Math.random() * 8 - 4),
      }))
    );
    setPoppedCount(0);
    setLatestAffirmation(null);
  };

  const allPopped = poppedCount === bubbles.length;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
        <div>
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-teal-700" />
            <span>Worry-Bubble Release & Affirmations</span>
          </h2>
          <p className="text-[11px] text-slate-500">
            Tap each worry bubble to pop it and release the tension into an empowering affirmation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-teal-800 font-bold bg-teal-50 px-2.5 py-1 rounded border border-teal-200">
            {poppedCount} / {bubbles.length} Worries Released
          </span>
          <button
            onClick={resetBubbles}
            className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 underline font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Bubbles</span>
          </button>
        </div>
      </div>

      {/* Latest Affirmation Toast */}
      {latestAffirmation && (
        <div className="p-3 bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200 rounded-lg flex items-center gap-2.5 text-xs text-teal-950 animate-in fade-in duration-200 shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0" />
          <span className="font-semibold italic">"{latestAffirmation}"</span>
        </div>
      )}

      {/* Bubble Play Area */}
      <div className="relative h-[340px] bg-gradient-to-b from-slate-50 via-teal-50/20 to-sky-50/30 rounded-xl border border-slate-200 overflow-hidden p-4 select-none">
        {allPopped ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-3 animate-in fade-in zoom-in-95 duration-300">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
              <Heart className="w-7 h-7 text-emerald-600 animate-pulse" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              All Tension Bubbles Released
            </h3>
            <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
              You have released every thought. Take a long, gentle breath. Your strength and truth are with you today.
            </p>
            <button
              onClick={resetBubbles}
              className="mt-2 px-4 py-2 bg-teal-800 hover:bg-teal-700 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Release More Worries</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 h-full">
            {bubbles.map((b) => (
              <div key={b.id} className="flex items-center justify-center p-2">
                {!b.popped ? (
                  <button
                    onClick={() => popBubble(b.id)}
                    className={`w-full max-w-[130px] aspect-square rounded-full bg-gradient-to-tr ${b.color} text-slate-900 font-semibold p-3 shadow-md hover:scale-108 active:scale-95 transition-all flex flex-col items-center justify-center text-center gap-1 cursor-pointer border border-white/60 hover:shadow-lg animate-pulse`}
                  >
                    <span className="text-xs font-bold leading-tight drop-shadow-xs">
                      {b.label}
                    </span>
                    <span className="text-[10px] text-slate-800/80 uppercase font-mono tracking-tighter">
                      Tap to pop
                    </span>
                  </button>
                ) : (
                  <div className="w-full max-w-[130px] aspect-square rounded-full border-2 border-dashed border-emerald-300 bg-emerald-50/50 flex flex-col items-center justify-center p-2 text-center text-[10px] text-emerald-800 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mb-1" />
                    <span>Released</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/* =========================================================================
   GAME 2: MINDFUL BREATHING SPHERE (BOX & 4-7-8 PACER)
   ========================================================================= */

const BreathingSphereGame: React.FC = () => {
  const [mode, setMode] = useState<'box' | 'relax'>('box');
  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Pause'>('Inhale');
  const [countdown, setCountdown] = useState(4);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // Advance phase
          if (mode === 'box') {
            setPhase((curr) => {
              if (curr === 'Inhale') return 'Hold';
              if (curr === 'Hold') return 'Exhale';
              if (curr === 'Exhale') return 'Pause';
              return 'Inhale';
            });
            return 4;
          } else {
            // 4-7-8 relaxing
            setPhase((curr) => {
              if (curr === 'Inhale') {
                return 'Hold';
              }
              if (curr === 'Hold') {
                return 'Exhale';
              }
              return 'Inhale';
            });
            if (phase === 'Inhale') return 7;
            if (phase === 'Hold') return 8;
            return 4;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, mode, phase]);

  const getSphereScale = () => {
    if (phase === 'Inhale') return 'scale-125';
    if (phase === 'Hold') return 'scale-125';
    if (phase === 'Exhale') return 'scale-75';
    return 'scale-75';
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
        <div>
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <Wind className="w-4 h-4 text-teal-700" />
            <span>Grounding Breath Pacer (Vagus Nerve De-escalation)</span>
          </h2>
          <p className="text-[11px] text-slate-500">
            Slow rhythmic breathing communicates safety directly to the brain's autonomic nervous system.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setMode('box');
              setPhase('Inhale');
              setCountdown(4);
            }}
            className={`px-3 py-1 rounded text-xs font-semibold border transition-colors ${
              mode === 'box'
                ? 'bg-teal-800 text-white border-teal-800'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Box Breathing (4-4-4-4)
          </button>
          <button
            onClick={() => {
              setMode('relax');
              setPhase('Inhale');
              setCountdown(4);
            }}
            className={`px-3 py-1 rounded text-xs font-semibold border transition-colors ${
              mode === 'relax'
                ? 'bg-teal-800 text-white border-teal-800'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            4-7-8 Deep Sleep
          </button>
        </div>
      </div>

      {/* Visual Sphere Canvas */}
      <div className="h-[320px] bg-gradient-to-b from-slate-900 via-slate-800 to-teal-950 rounded-xl flex flex-col items-center justify-center p-6 relative overflow-hidden text-center text-white">
        {/* Soft Background Rays */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(45,212,191,0.15),transparent_70%)] pointer-events-none"></div>

        {/* Breathing Sphere */}
        <div
          className={`w-36 h-36 rounded-full bg-gradient-to-tr from-teal-400 via-emerald-300 to-cyan-200 shadow-[0_0_50px_rgba(45,212,191,0.5)] flex flex-col items-center justify-center text-slate-900 transition-transform duration-1000 ease-in-out ${getSphereScale()}`}
        >
          <span className="text-xl font-bold tracking-tight">{phase}</span>
          <span className="text-2xl font-mono font-extrabold mt-0.5">{countdown}s</span>
        </div>

        {/* Dynamic Instructional Guidance */}
        <div className="mt-8 space-y-1">
          <p className="text-xs font-medium text-teal-200">
            {phase === 'Inhale' && 'Slowly breathe in through your nose... expanding your belly.'}
            {phase === 'Hold' && 'Hold gently and peacefully... feeling still and calm.'}
            {phase === 'Exhale' && 'Slowly release through your mouth... letting tension dissolve.'}
            {phase === 'Pause' && 'Rest quietly before the next restorative breath.'}
          </p>
          <span className="text-[10px] text-slate-400 block font-mono">
            {mode === 'box' ? 'Mode: 4s Equal Flow' : 'Mode: 4s Inhale · 7s Hold · 8s Exhale'}
          </span>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   GAME 3: ZEN SAND & PEBBLE RAKE GARDEN
   ========================================================================= */

interface Pebble {
  id: number;
  x: number;
  y: number;
  type: 'stone' | 'lotus' | 'shell';
}

const ZenSandGardenGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pebbles, setPebbles] = useState<Pebble[]>([
    { id: 1, x: 120, y: 140, type: 'stone' },
    { id: 2, x: 260, y: 100, type: 'lotus' },
    { id: 3, x: 380, y: 180, type: 'stone' },
    { id: 4, x: 500, y: 120, type: 'shell' }
  ]);
  const [activeItem, setActiveItem] = useState<'rake' | 'stone' | 'lotus' | 'shell'>('rake');
  const [isDrawing, setIsDrawing] = useState(false);

  // Initialize canvas with serene sand texture
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Sand background
    ctx.fillStyle = '#f4ede4';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Initial peaceful horizontal wave lines
    ctx.strokeStyle = '#e2d5c3';
    ctx.lineWidth = 1.5;
    for (let y = 15; y < canvas.height; y += 16) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      for (let x = 0; x < canvas.width; x += 30) {
        ctx.quadraticCurveTo(x + 15, y + Math.sin(x * 0.05) * 4, x + 30, y);
      }
      ctx.stroke();
    }
  }, []);

  const handleClearSand = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#f4ede4';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Redraw fine sand ridges
    ctx.strokeStyle = '#e2d5c3';
    ctx.lineWidth = 1.5;
    for (let y = 15; y < canvas.height; y += 16) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      for (let x = 0; x < canvas.width; x += 30) {
        ctx.quadraticCurveTo(x + 15, y + Math.sin(x * 0.05) * 4, x + 30, y);
      }
      ctx.stroke();
    }
  };

  const handleCanvasInteraction = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (activeItem !== 'rake') {
      // Place decorative item
      setPebbles(prev => [
        ...prev,
        { id: Date.now(), x, y, type: activeItem }
      ]);
      return;
    }

    // Rake sand
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = '#cbb89e';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';

    if (e.buttons === 1 || isDrawing) {
      ctx.beginPath();
      ctx.arc(x, y, 12, 0, Math.PI * 2);
      ctx.stroke();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
        <div>
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <Waves className="w-4 h-4 text-teal-700" />
            <span>Zen Sand & River Stone Garden</span>
          </h2>
          <p className="text-[11px] text-slate-500">
            Drag to rake sand ripples or place smooth river stones and lotus blossoms.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveItem('rake')}
            className={`px-2.5 py-1 rounded text-xs font-semibold border flex items-center gap-1 ${
              activeItem === 'rake'
                ? 'bg-teal-800 text-white border-teal-800'
                : 'border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span>Rake Sand</span>
          </button>

          <button
            onClick={() => setActiveItem('stone')}
            className={`px-2.5 py-1 rounded text-xs font-semibold border flex items-center gap-1 ${
              activeItem === 'stone'
                ? 'bg-teal-800 text-white border-teal-800'
                : 'border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span>+ Stone</span>
          </button>

          <button
            onClick={() => setActiveItem('lotus')}
            className={`px-2.5 py-1 rounded text-xs font-semibold border flex items-center gap-1 ${
              activeItem === 'lotus'
                ? 'bg-teal-800 text-white border-teal-800'
                : 'border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span>+ Lotus</span>
          </button>

          <button
            onClick={handleClearSand}
            className="px-2.5 py-1 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded text-xs flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Smooth Sand</span>
          </button>
        </div>
      </div>

      {/* Sand Canvas */}
      <div className="relative rounded-xl border border-amber-200 shadow-inner overflow-hidden bg-[#f4ede4] cursor-crosshair">
        <canvas
          ref={canvasRef}
          width={700}
          height={320}
          className="w-full h-[320px] block"
          onMouseDown={() => setIsDrawing(true)}
          onMouseUp={() => setIsDrawing(false)}
          onMouseMove={handleCanvasInteraction}
          onClick={handleCanvasInteraction}
        />

        {/* Render Decorative Pebbles */}
        {pebbles.map((p) => (
          <div
            key={p.id}
            style={{ left: p.x - 12, top: p.y - 12 }}
            className="absolute pointer-events-none select-none transition-transform"
          >
            {p.type === 'stone' && (
              <div className="w-7 h-5 rounded-full bg-slate-700 shadow-md border border-slate-600/80"></div>
            )}
            {p.type === 'lotus' && (
              <span className="text-xl drop-shadow-sm leading-none" role="img" aria-label="lotus">
                🪷
              </span>
            )}
            {p.type === 'shell' && (
              <span className="text-lg drop-shadow-sm leading-none" role="img" aria-label="shell">
                🐚
              </span>
            )}
          </div>
        ))}
      </div>
      <p className="text-[10px] text-slate-400 text-center font-mono">
        Click to place selected item, or drag across the sand to carve calming ripple currents.
      </p>
    </div>
  );
};

/* =========================================================================
   GAME 4: TRANQUILITY PATTERN MATCH (MEMORY ZEN)
   ========================================================================= */

interface CardItem {
  id: number;
  symbol: string;
  name: string;
  matched: boolean;
}

const CARDS_DATA = [
  { symbol: "🪷", name: "Lotus" },
  { symbol: "🌙", name: "Crescent" },
  { symbol: "🎋", name: "Bamboo" },
  { symbol: "🌊", name: "River Wave" },
  { symbol: "🕊️", name: "Dove" },
  { symbol: "🪨", name: "Zen Stone" },
];

const TranquilMemoryGame: React.FC = () => {
  const [deck, setDeck] = useState<CardItem[]>(() => {
    const doubled = [...CARDS_DATA, ...CARDS_DATA].map((c, i) => ({
      ...c,
      id: i,
      matched: false
    }));
    return doubled.sort(() => Math.random() - 0.5);
  });

  const [flipped, setFlipped] = useState<number[]>([]);
  const [matchesCount, setMatchesCount] = useState(0);

  const handleCardClick = (index: number) => {
    if (flipped.length === 2 || flipped.includes(index) || deck[index].matched) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      if (deck[first].name === deck[second].name) {
        setTimeout(() => {
          setDeck(prev => prev.map((card, i) => 
            i === first || i === second ? { ...card, matched: true } : card
          ));
          setMatchesCount(c => c + 1);
          setFlipped([]);
        }, 500);
      } else {
        setTimeout(() => setFlipped([]), 900);
      }
    }
  };

  const resetGame = () => {
    const doubled = [...CARDS_DATA, ...CARDS_DATA].map((c, i) => ({
      ...c,
      id: i,
      matched: false
    }));
    setDeck(doubled.sort(() => Math.random() - 0.5));
    setFlipped([]);
    setMatchesCount(0);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
        <div>
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-teal-700" />
            <span>Tranquility Nature Match</span>
          </h2>
          <p className="text-[11px] text-slate-500">
            A pressure-free matching diversion to anchor focus away from stressful thoughts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-teal-800 font-bold bg-teal-50 px-2.5 py-1 rounded border border-teal-200">
            {matchesCount} / {CARDS_DATA.length} Pairs Harmonized
          </span>
          <button
            onClick={resetGame}
            className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 underline font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Shuffle</span>
          </button>
        </div>
      </div>

      {matchesCount === CARDS_DATA.length ? (
        <div className="h-[300px] flex flex-col items-center justify-center text-center space-y-3 bg-teal-50/50 border border-teal-200 rounded-xl p-6">
          <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6 text-teal-700" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            Peaceful Mind Achieved
          </h3>
          <p className="text-xs text-slate-600 max-w-sm mx-auto">
            You completed all pairs with patience and clarity. Carry this grounded presence into your day.
          </p>
          <button
            onClick={resetGame}
            className="px-4 py-2 bg-teal-800 hover:bg-teal-700 text-white rounded text-xs font-semibold"
          >
            Play Again
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {deck.map((card, idx) => {
            const isCardFlipped = flipped.includes(idx) || card.matched;
            return (
              <button
                key={card.id}
                onClick={() => handleCardClick(idx)}
                className={`aspect-square rounded-xl text-2xl font-bold flex flex-col items-center justify-center border transition-all cursor-pointer select-none shadow-2xs ${
                  isCardFlipped
                    ? 'bg-white border-teal-300 ring-2 ring-teal-600 text-slate-900 scale-102'
                    : 'bg-gradient-to-br from-slate-100 to-teal-50/60 border-slate-200 hover:border-teal-400 text-slate-400'
                }`}
              >
                {isCardFlipped ? (
                  <>
                    <span>{card.symbol}</span>
                    <span className="text-[9px] font-sans text-slate-600 mt-1 font-semibold">{card.name}</span>
                  </>
                ) : (
                  <span className="text-xs font-mono text-slate-400 font-bold">SENTRA</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
