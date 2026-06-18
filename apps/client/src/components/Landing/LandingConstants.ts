import {
  Trophy,
  Film,
  Users,
  Eye,
  BookOpen,
  Smartphone,
  Zap,
  Shield,
  Code2,
  Swords,
  TrendingUp,
} from "lucide-react";

export const HERO_LINES = ["WRITE CODE.", "BATTLE", "ROBOTS."] as const;

export const HERO_BADGES = [
  "60 FPS ENGINE",
  "AliScript v2.4",
  "LIVE ON logicarena.dev",
] as const;

export const TRUST_STATS = [
  { value: "6", label: "GAME MODES" },
  { value: "3", label: "ENVIRONMENTS" },
  { value: "60", label: "LEVEL CAMPAIGN" },
  { value: "∞", label: "REAL-TIME BATTLES" },
] as const;

export const HOW_IT_WORKS_STEPS = [
  {
    step: "01",
    title: "WRITE",
    icon: Code2,
    desc: "Script your robot's intelligence using AliScript — our battle language with loops, functions, and swarm APIs.",
  },
  {
    step: "02",
    title: "DEPLOY",
    icon: Swords,
    desc: "Upload your script to the arena. Watch it execute live at 60fps against real opponents.",
  },
  {
    step: "03",
    title: "EVOLVE",
    icon: TrendingUp,
    desc: "Study replays. Climb the ELO leaderboard. Unlock upgrades in the Black Market.",
  },
] as const;

export const GAME_MODES = [
  { name: "DEATHMATCH", img: "/thumbnails/mode-combat.png", desc: "Classic 1v1. Eliminate or be eliminated." },
  { name: "SURVIVAL", img: "/thumbnails/mode-survival.png", desc: "Outlast endless enemy waves." },
  { name: "CTF", img: "/thumbnails/mode-ctf.png", desc: "Capture the flag. Return it. Repeat." },
  { name: "KOTH", img: "/thumbnails/mode-koth.png", desc: "Hold the center zone longest to win." },
  { name: "RACING", img: "/thumbnails/mode-racing.png", desc: "First to the finish line. Obstacles included." },
  { name: "TRAINING", img: "/thumbnails/mode-training.png", desc: "Infinite sandbox. Refine your logic." },
] as const;

export const ARENAS = [
  { name: "NEO-CYBER", img: "/thumbnails/env-cyber.png", desc: "The original. Neon grid. No mercy." },
  { name: "MAGMA CORE", img: "/thumbnails/env-lava.png", desc: "Lava floors. Damage on contact. High risk, high reward." },
  { name: "GLACIAL TUNDRA", img: "/thumbnails/env-ice.png", desc: "Ice terrain. Reduced traction. Precision required." },
] as const;

export const ALISCRIPT_FEATURES = [
  "WHILE Loops",
  "IF / ELSE / AND / OR",
  "Dictionaries",
  "Arrays",
  "BROADCAST / RECEIVE",
  "Math Library",
  "Swarm Intelligence",
  "Big O Education",
] as const;

export const ROBOTS = [
  { name: "UNIT-01", img: "/thumbnails/chassis-unit-01.png", desc: "Balanced all-rounder. Excellent starting model." },
  { name: "UNIT-02", img: "/thumbnails/chassis-unit-02.png", desc: "Agile scout. High mobility and rapid targeting." },
  { name: "ARMORED MECH", img: "/thumbnails/chassis-titan.png", desc: "Heavy armor. Built for taking massive damage." },
  { name: "SANDMAN", img: "/thumbnails/chassis-sandman.png", desc: "Advanced tactical mech with extreme firepower." },
  { name: "IRON MECHA", img: "/thumbnails/chassis-iron-mecha.png", desc: "Rugged iron-clad mech built for heavy frontline skirmishes." },
  { name: "SENTINEL", img: "/thumbnails/chassis-sentinel.png", desc: "Advanced security warden engineered for scanning and defense." },
  { name: "CRIMSON TITAN", img: "/thumbnails/chassis-crimson-titan.png", desc: "Devastating warmachine forged in reinforced crimson plating." },
] as const;

export const PLATFORM_FEATURES = [
  { icon: Trophy, title: "ELO RANKING", desc: "Climb the global leaderboard with every win" },
  { icon: Film, title: "MATCH REPLAYS", desc: "Replay any battle frame by frame" },
  { icon: Users, title: "TOURNAMENT MODE", desc: "Structured 2/4/8-player brackets" },
  { icon: Eye, title: "LIVE SPECTATOR", desc: "Watch any live match in real time" },
  { icon: BookOpen, title: "60-LEVEL CAMPAIGN", desc: "LeetCode-style algorithmic challenges" },
  { icon: Smartphone, title: "PWA SUPPORT", desc: "Install as a native app on any device" },
  { icon: Zap, title: "REAL-TIME ENGINE", desc: "60fps physics. Zero lag. Always live." },
  { icon: Shield, title: "SECURE PLATFORM", desc: "JWT auth, rate limiting, enterprise security" },
] as const;

export const TECH_STACK = [
  { name: "TypeScript", icon: "/tech-icons/typescript.svg", color: "#3178C6" },
  { name: "Next.js", icon: "/tech-icons/nextjs.svg", color: "#FFFFFF" },
  { name: "React", icon: "/tech-icons/react.svg", color: "#61DAFB" },
  { name: "Three.js", icon: "/tech-icons/threejs.svg", color: "#049EF4" },
  { name: "TailwindCSS", icon: "/tech-icons/tailwindcss.svg", color: "#06B6D4" },
  { name: "Framer Motion", icon: "/tech-icons/framermotion.svg", color: "#FFFFFF" },
  { name: "NestJS", icon: "/tech-icons/nestjs.svg", color: "#E0234E" },
  { name: "Socket.IO", icon: "/tech-icons/socketio.svg", color: "#25c2a0" },
  { name: "PostgreSQL", icon: "/tech-icons/postgresql.svg", color: "#4169E1" },
  { name: "Prisma", icon: "/tech-icons/prisma.svg", color: "#FFFFFF" },
  { name: "Redis", icon: "/tech-icons/redis.svg", color: "#DC382D" },
  { name: "Docker", icon: "/tech-icons/docker.svg", color: "#2496ED" },
] as const;

export const PARTICLE_COUNT = 12;

export const aliScriptExample = `// Swarm intelligence example
WHILE TRUE DO
  IF CAN_SEE_ENEMY AND MY_ENERGY > 30 DO
    BROADCAST(NEAREST_VISIBLE_X)
    FIRE
  ELSE IF IN_STASIS DO
    WAIT
  ELSE DO
    SCAN
    PATHFIND
  END
END`;
