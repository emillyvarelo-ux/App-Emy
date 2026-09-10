import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  HeartHandshake,
  ShieldCheck,
  Brain,
  Volume2,
  VolumeX,
  Printer,
  ArrowRight,
  Layers,
  Star
} from "lucide-react";

interface WelcomeSplashScreenProps {
  isOpen: boolean;
  onClose: () => void;
  onExploreModule?: (tabId: string) => void;
}

// Gentle pleasant musical chime using Web Audio API for sensory comfort
const playPleasantChime = (frequency: number = 523.25) => {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);

    // Soft chime envelope
    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.8);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.85);
  } catch {
    // Audio context may be restricted before user gesture
  }
};

const FEATURES = [
  {
    id: "adapter",
    icon: Sparkles,
    color: "from-purple-500 to-indigo-500",
    border: "border-purple-200 hover:border-purple-400",
    bg: "bg-purple-50/70",
    badge: "Motor DUA",
    badgeColor: "bg-purple-100 text-purple-800",
    title: "Adaptação de Aulas",
    description:
      "Personalize qualquer plano de aula valorizando hiperfocos, CAA e acomodações sensoriais."
  },
  {
    id: "library",
    icon: ShieldCheck,
    color: "from-rose-500 to-fuchsia-500",
    border: "border-rose-200 hover:border-rose-400",
    bg: "bg-rose-50/70",
    badge: "Prevenção Ativa",
    badgeColor: "bg-rose-100 text-rose-800",
    title: "Cultura Anti-Bullying",
    description:
      "Dinâmicas de guardiões, histórias sociais de Carol Gray e roteiros de autodefesa assertiva."
  },
  {
    id: "dashboard",
    icon: Brain,
    color: "from-amber-500 to-orange-500",
    border: "border-amber-200 hover:border-amber-400",
    bg: "bg-amber-50/70",
    badge: "Socioemocional",
    badgeColor: "bg-amber-100 text-amber-800",
    title: "Semáforo & Regulação",
    description:
      "Checagem de sentimentos, respiração guiada com ritmo 4-4-4 e áudio com síntese de voz."
  },
  {
    id: "students",
    icon: Printer,
    color: "from-emerald-500 to-teal-500",
    border: "border-emerald-200 hover:border-emerald-400",
    bg: "bg-emerald-50/70",
    badge: "Pronto p/ Mesa",
    badgeColor: "bg-emerald-100 text-emerald-800",
    title: "Cartões Recortáveis & PEI",
    description:
      "Pranchas visuais plastificáveis para o aluno e relatórios impressos para o conselho pedagógico."
  }
];

const FLOATING_BADGES = [
  { text: "✨ Neurodiversidade", color: "bg-fuchsia-600 text-white", x: "7%", y: "14%", delay: 0 },
  { text: "💜 Autismo (TEA)", color: "bg-purple-700 text-white", x: "82%", y: "16%", delay: 0.4 },
  { text: "⚡ TDAH & Potência", color: "bg-amber-600 text-white", x: "10%", y: "80%", delay: 0.8 },
  { text: "🛡️ Escola Acolhedora", color: "bg-violet-700 text-white", x: "80%", y: "82%", delay: 0.2 },
  { text: "🎨 Desenho Universal", color: "bg-indigo-600 text-white", x: "88%", y: "48%", delay: 0.6 },
  { text: "💬 Comunicação Alternativa", color: "bg-purple-800 text-white", x: "4%", y: "48%", delay: 1.0 }
];

interface SparkleParticle {
  id: number;
  x: number; // percentage across width (0 to 100)
  size: number;
  duration: number;
  delay: number;
  drift: number;
  rotate: number;
  shape: "star4" | "star8" | "diamond" | "dot";
  colorClass: string;
}

// Sparkle Shower Component
const SparkleShower: React.FC = () => {
  // Generate 50 unique glittering particles for smooth falling shower
  const sparkles = useMemo<SparkleParticle[]>(() => {
    const colors = [
      "text-amber-300 drop-shadow-[0_0_8px_rgba(252,211,77,0.8)]",
      "text-yellow-200 drop-shadow-[0_0_8px_rgba(254,240,138,0.8)]",
      "text-purple-300 drop-shadow-[0_0_8px_rgba(216,180,254,0.8)]",
      "text-fuchsia-300 drop-shadow-[0_0_8px_rgba(244,114,182,0.8)]",
      "text-violet-200 drop-shadow-[0_0_8px_rgba(233,213,255,0.8)]",
      "text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.9)]"
    ];
    const shapes: SparkleParticle["shape"][] = ["star4", "star8", "diamond", "dot"];

    return Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: (i * 2.05 + Math.sin(i * 11) * 1.5) % 98,
      size: 10 + (i % 5) * 3.5, // 10px to 24px
      duration: 3.2 + (i % 7) * 0.7, // 3.2s to 7.4s
      delay: (i * 0.15) % 4.5,
      drift: ((i % 2 === 0 ? 1 : -1) * (15 + (i % 6) * 5)),
      rotate: (i * 45) % 360,
      shape: shapes[i % shapes.length],
      colorClass: colors[i % colors.length]
    }));
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      {sparkles.map((sp) => (
        <motion.div
          key={sp.id}
          initial={{
            y: "-10vh",
            x: `${sp.x}vw`,
            opacity: 0,
            scale: 0.3,
            rotate: sp.rotate
          }}
          animate={{
            y: ["-5vh", "105vh"],
            x: [`${sp.x}vw`, `${sp.x + sp.drift * 0.05}vw`],
            opacity: [0, 0.95, 1, 0.85, 0],
            scale: [0.3, 1.25, 0.9, 1.1, 0.2],
            rotate: [sp.rotate, sp.rotate + 360]
          }}
          transition={{
            duration: sp.duration,
            repeat: Infinity,
            delay: sp.delay,
            ease: "easeInOut"
          }}
          style={{ width: sp.size, height: sp.size }}
          className={`absolute ${sp.colorClass}`}
        >
          {sp.shape === "star4" && (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
              <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
            </svg>
          )}
          {sp.shape === "star8" && (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
              <path d="M12 0L13.8 8.2L20.5 3.5L15.8 10.2L24 12L15.8 13.8L20.5 20.5L13.8 15.8L12 24L10.2 15.8L3.5 20.5L8.2 13.8L0 12L8.2 10.2L3.5 3.5L10.2 8.2L12 0Z" />
            </svg>
          )}
          {sp.shape === "diamond" && (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
              <path d="M12 2L22 12L12 22L2 12Z" />
            </svg>
          )}
          {sp.shape === "dot" && (
            <div className="w-full h-full rounded-full bg-current shadow-lg" />
          )}
        </motion.div>
      ))}
    </div>
  );
};

export const WelcomeSplashScreen: React.FC<WelcomeSplashScreenProps> = ({
  isOpen,
  onClose,
  onExploreModule
}) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [activeFeatureIdx, setActiveFeatureIdx] = useState(0);
  const [extraBursts, setExtraBursts] = useState<{ id: number; x: number; y: number }[]>([]);

  // Auto rotate highlight feature every 3s
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setActiveFeatureIdx((prev) => (prev + 1) % FEATURES.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [isOpen]);

  const handleEnter = (tabId?: string) => {
    if (soundEnabled) {
      playPleasantChime(659.25); // E5
      setTimeout(() => playPleasantChime(783.99), 120); // G5
      setTimeout(() => playPleasantChime(1046.5), 240); // C6
    }

    if (dontShowAgain) {
      localStorage.setItem("neuroeduca_skip_splash", "true");
    } else {
      localStorage.removeItem("neuroeduca_skip_splash");
    }

    onClose();
    if (tabId && onExploreModule) {
      onExploreModule(tabId);
    }
  };

  const handleBadgeClick = (freq: number) => {
    if (soundEnabled) playPleasantChime(freq);
  };

  const handleScreenClick = (e: React.MouseEvent) => {
    // Spawn playful extra burst of sparkles where the user clicks
    const newBurst = {
      id: Date.now() + Math.random(),
      x: e.clientX,
      y: e.clientY
    };
    setExtraBursts((prev) => [...prev.slice(-8), newBurst]);
    if (soundEnabled) {
      playPleasantChime(587.33);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="splash-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.3 }}
        onClick={handleScreenClick}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-purple-950/80 backdrop-blur-md"
      >
        {/* Continuous Shower of Falling Sparkles across the Screen */}
        <SparkleShower />

        {/* Interactive Sparkle Click Bursts */}
        {extraBursts.map((burst) => (
          <motion.div
            key={burst.id}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 2.2, opacity: 0 }}
            transition={{ duration: 0.75, ease: "easeOut" }}
            style={{ left: burst.x - 24, top: burst.y - 24 }}
            className="fixed pointer-events-none z-40 text-amber-300 flex items-center justify-center"
          >
            <Sparkles className="w-12 h-12 drop-shadow-[0_0_12px_rgba(252,211,77,0.9)]" />
          </motion.div>
        ))}

        {/* Animated colorful background circles in purple and gold tones */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            animate={{
              x: [0, 40, -30, 0],
              y: [0, -50, 30, 0],
              scale: [1, 1.2, 0.9, 1]
            }}
            transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-tr from-fuchsia-600/30 via-purple-700/35 to-violet-600/25 blur-3xl"
          />
          <motion.div
            animate={{
              x: [0, -50, 40, 0],
              y: [0, 60, -40, 0],
              scale: [1, 1.15, 0.95, 1]
            }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-gradient-to-tr from-amber-400/25 via-purple-600/30 to-indigo-900/35 blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.25, 1],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[540px] h-[540px] rounded-full bg-gradient-to-r from-purple-500/20 via-fuchsia-500/25 to-amber-300/20 blur-3xl"
          />

          {/* Floating animated decorative bubbles */}
          {FLOATING_BADGES.map((badge, idx) => (
            <motion.div
              key={idx}
              initial={{ y: 20, opacity: 0 }}
              animate={{
                y: [0, -14, 0],
                rotate: [0, idx % 2 === 0 ? 3 : -3, 0],
                opacity: 0.9
              }}
              transition={{
                duration: 4 + idx * 0.7,
                repeat: Infinity,
                delay: badge.delay,
                ease: "easeInOut"
              }}
              style={{ left: badge.x, top: badge.y }}
              onClick={(e) => {
                e.stopPropagation();
                handleBadgeClick(440 + idx * 60);
              }}
              className={`hidden md:flex absolute items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg shadow-purple-950/30 cursor-pointer pointer-events-auto hover:scale-110 transition-transform ${badge.color}`}
            >
              <span>{badge.text}</span>
            </motion.div>
          ))}
        </div>

        {/* Main Card Window */}
        <motion.div
          initial={{ scale: 0.88, y: 24, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 20, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 26 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border-4 border-purple-200/80 overflow-hidden my-auto max-h-[95vh] flex flex-col z-30"
        >
          {/* Top Sparkling Golden & Purple Stripe Bar (Replacing Rainbow) */}
          <div className="h-2.5 w-full bg-gradient-to-r from-purple-800 via-fuchsia-600 via-amber-300 via-yellow-200 via-fuchsia-600 to-purple-800 shrink-0 shadow-sm shadow-amber-300/40 relative overflow-hidden">
            <motion.div
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/80 to-transparent"
            />
          </div>

          {/* Top Bar with Sensory Sound & Skip Button */}
          <div className="flex items-center justify-between px-6 pt-4 pb-2 border-b border-purple-100 bg-purple-50/40 shrink-0">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-purple-700 via-purple-600 to-fuchsia-600 text-white text-[11px] font-extrabold tracking-wide uppercase shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: "6s" }} />
                Boas-vindas ao NeuroEduca
              </span>
              <span className="hidden sm:inline text-xs text-purple-700 font-medium">
                Desenho Universal & Convivência Escolar
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setSoundEnabled(!soundEnabled);
                  if (!soundEnabled) playPleasantChime(523.25);
                }}
                className={`p-1.5 rounded-xl border transition-colors text-xs flex items-center gap-1.5 cursor-pointer ${
                  soundEnabled
                    ? "bg-purple-100 border-purple-300 text-purple-800"
                    : "bg-slate-100 border-slate-300 text-slate-500"
                }`}
                title={soundEnabled ? "Sons relaxantes ativados" : "Sons silenciados"}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 text-purple-700" /> : <VolumeX className="w-4 h-4" />}
                <span className="hidden md:inline font-medium">{soundEnabled ? "Som Ativo" : "Mudo"}</span>
              </button>

              <button
                type="button"
                onClick={() => handleEnter()}
                className="text-xs text-purple-700 hover:text-purple-950 font-bold hover:bg-purple-100/60 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
              >
                Pular Introdução ✕
              </button>
            </div>
          </div>

          {/* Scrollable Center Content */}
          <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
            {/* Hero Brand Centerpiece */}
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              {/* Animated Glowing Icon with Golden Sparkles */}
              <motion.div
                whileHover={{ rotate: 8, scale: 1.08 }}
                onClick={() => handleBadgeClick(587.33)}
                className="relative inline-block cursor-pointer mx-auto"
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-purple-700 via-fuchsia-600 to-amber-400 p-1 shadow-xl shadow-purple-600/30 flex items-center justify-center mx-auto">
                  <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center relative overflow-hidden">
                    {/* Inner playful animated gradient pulse */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-purple-100 via-fuchsia-50 to-amber-50 opacity-80" />
                    <HeartHandshake className="w-10 h-10 sm:w-12 sm:h-12 text-purple-700 relative z-10" />
                  </div>
                </div>

                {/* Floating sparkle stars around logo (No rainbow) */}
                <motion.span
                  animate={{ scale: [1, 1.3, 1], rotate: [0, 45, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                  className="absolute -top-1 -right-2 text-base text-amber-400 drop-shadow-md"
                >
                  ✨
                </motion.span>
                <motion.span
                  animate={{ scale: [1, 1.25, 1], rotate: [0, -30, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                  className="absolute -bottom-1 -left-2 text-base text-purple-500 drop-shadow-md"
                >
                  ⭐
                </motion.span>
              </motion.div>

              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif tracking-tight text-purple-950">
                  Neuro<span className="bg-gradient-to-r from-purple-600 via-fuchsia-600 to-purple-800 bg-clip-text text-transparent">Educa</span>
                </h1>
                <p className="text-sm sm:text-base text-purple-900 font-semibold mt-1 flex items-center justify-center gap-1.5 flex-wrap">
                  <Sparkles className="w-4 h-4 text-amber-500 inline shrink-0" />
                  <span>Onde cada mente aprende com dignidade, acolhimento e sem medo de ser quem é.</span>
                  <Sparkles className="w-4 h-4 text-amber-500 inline shrink-0" />
                </p>
                <p className="text-xs sm:text-sm text-purple-700/85 mt-1 max-w-xl mx-auto leading-relaxed">
                  Ambiente pedagógico interativo para adaptação de conteúdos em segundos, fortalecimento da empatia entre colegas e erradicação do bullying em crianças neurodivergentes.
                </p>
              </div>

              {/* Neurodiversity Values Pill Carousel */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-900 border border-purple-200 shadow-xs flex items-center gap-1">
                  💜 Autismo & TEA
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200 shadow-xs flex items-center gap-1">
                  ⚡ TDAH & Criatividade
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-800 border border-purple-200 shadow-xs flex items-center gap-1">
                  🌱 Acomodação Sensorial
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200 shadow-xs flex items-center gap-1">
                  🛡️ Turma Protetora
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-900 border border-indigo-200 shadow-xs flex items-center gap-1">
                  🔒 Offline & LGPD
                </span>
              </div>
            </div>

            {/* 4 Interactive Feature Cards */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-800 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-purple-600" />
                  O que você pode fazer no NeuroEduca:
                </span>
                <span className="text-[11px] text-purple-600 font-medium">
                  Clique em um módulo para ir direto
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {FEATURES.map((feat, idx) => {
                  const Icon = feat.icon;
                  const isHighlighted = idx === activeFeatureIdx;

                  return (
                    <motion.div
                      key={feat.id}
                      whileHover={{ scale: 1.03, y: -3 }}
                      onClick={() => handleEnter(feat.id)}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-3 ${feat.bg} ${feat.border} ${
                        isHighlighted
                          ? "ring-2 ring-purple-500/40 shadow-md scale-[1.02]"
                          : "shadow-xs"
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div
                            className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${feat.color} text-white flex items-center justify-center shadow-xs`}
                          >
                            <Icon className="w-5 h-5" />
                          </div>
                          <span
                            className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${feat.badgeColor}`}
                          >
                            {feat.badge}
                          </span>
                        </div>

                        <h3 className="font-bold text-purple-950 text-sm font-serif">
                          {feat.title}
                        </h3>

                        <p className="text-[11px] text-purple-900/80 leading-relaxed">
                          {feat.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-purple-200/60 flex items-center justify-between text-[11px] font-bold text-purple-900 group">
                        <span>Acessar agora</span>
                        <ArrowRight className="w-3.5 h-3.5 text-purple-600 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Anti-Bullying Manifesto Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-900 via-indigo-950 to-purple-950 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-center sm:text-left">
                <div className="w-12 h-12 rounded-2xl bg-purple-800/80 border border-purple-600 flex items-center justify-center text-2xl shrink-0">
                  🤝
                </div>
                <div>
                  <h4 className="font-bold text-sm text-purple-100">
                    Compromisso Coletivo: Escola Segura & Livre de Julgamentos
                  </h4>
                  <p className="text-xs text-purple-200/80 mt-0.5">
                    Não toleramos apelidos, exclusões ou deboches sobre estímulos e comunicação neurodivergente.
                  </p>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 text-purple-200 text-xs font-semibold border border-white/10">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Pacto Anti-Bullying</span>
              </div>
            </div>
          </div>

          {/* Bottom Action Bar */}
          <div className="px-6 py-4 border-t border-purple-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
            {/* Checkbox: Don't show again */}
            <label className="flex items-center gap-2 text-xs text-purple-800 font-medium cursor-pointer select-none">
              <input
                type="checkbox"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 border-purple-300 cursor-pointer"
              />
              <span>Não abrir automaticamente na próxima vez</span>
            </label>

            {/* Main Animated Enter Button with Golden Sparkle Icon */}
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleEnter("adapter")}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-3 rounded-2xl bg-gradient-to-r from-purple-700 via-fuchsia-600 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white font-extrabold text-sm shadow-lg shadow-purple-700/35 cursor-pointer transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Entrar no NeuroEduca</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
