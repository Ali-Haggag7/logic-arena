import React from 'react';
import { SectionLabel } from './SectionLabel';
import { Shield, Zap, Move, Radar, Target } from 'lucide-react';

const SUPER_POWERS = [
  {
    name: 'TELEPORT',
    energy: 80,
    icon: Zap,
    color: 'var(--docs-purple)',
    desc: 'Instantly warp to the specified map coordinates. Sets velocity to zero.',
    usage: 'TELEPORT 400 300',
  },
  {
    name: 'SHIELD',
    energy: 60,
    icon: Shield,
    color: 'var(--docs-cyan-dark)',
    desc: 'Activates an energy shield that blocks all incoming damage (projectiles, mines) for 30 ticks (1.5s).',
    usage: 'SHIELD',
  },
  {
    name: 'CLOAK',
    energy: 50,
    icon: Radar,
    color: 'var(--docs-indigo)',
    desc: 'Turns the robot completely invisible to enemy sensors, FOV, and radar for 40 ticks (2s).',
    usage: 'CLOAK',
  },
  {
    name: 'MINE',
    energy: 40,
    icon: Target,
    color: 'var(--docs-red)',
    desc: 'Drops a proximity mine at your current location. Arms after 250ms. Deals 35 AoE damage when triggered.',
    usage: 'MINE',
  },
  {
    name: 'DASH',
    energy: 30,
    icon: Move,
    color: 'var(--docs-orange)',
    desc: 'Instant, high-speed lateral thrust in the direction the robot is facing. Ideal for dodging.',
    usage: 'DASH 100',
  },
];

export function SuperPowersSection({ isMobile }: { isMobile: boolean }) {
  return (
    <section className={isMobile ? 'mb-10' : 'mb-16'}>
      <SectionLabel text="SUPER POWERS (TACTICAL ABILITIES)" isMobile={isMobile} />
      
      <div className={`mt-6 grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-2 lg:grid-cols-3 gap-6'}`}>
        {SUPER_POWERS.map((power) => (
          <div
            key={power.name}
            className="group relative flex flex-col p-5 rounded-2xl border border-accent/10 bg-card/20 overflow-hidden transition-all duration-300 hover:border-accent/40 hover:bg-card/40 hover:-translate-y-1 hover:shadow-lg hover:shadow-accent/5"
          >
            {/* Background glow */}
            <div
              className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[64px] opacity-20 transition-opacity duration-300 group-hover:opacity-40 pointer-events-none"
              style={{ backgroundColor: power.color }}
            />
            
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="flex items-center gap-3">
                <div 
                  className="p-2 rounded-xl flex items-center justify-center bg-accent/[0.05] border border-accent/10"
                  style={{ boxShadow: `inset 0 0 12px color-mix(in srgb, ${power.color} 20%, transparent)` }}
                >
                  <power.icon size={20} style={{ color: power.color }} />
                </div>
                <span className="font-black tracking-widest text-sm" style={{ color: power.color }}>
                  {power.name}
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/[0.03] border border-accent/10">
                <Zap size={12} className="text-docs-orange" />
                <span className="text-[10px] font-mono text-docs-orange font-bold">
                  {power.energy}
                </span>
              </div>
            </div>
            
            <p className="text-[11px] text-text-secondary leading-relaxed opacity-90 mb-6 flex-grow relative z-10">
              {power.desc}
            </p>
            
            <div className="mt-auto relative z-10">
              <div className="text-[10px] uppercase tracking-widest text-text-secondary/50 mb-2 font-bold">
                Usage
              </div>
              <code className="block w-full p-2.5 rounded-lg bg-accent/[0.05] border border-accent/10 text-[11px] font-mono text-accent/80 whitespace-nowrap overflow-x-auto">
                {power.usage}
              </code>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
