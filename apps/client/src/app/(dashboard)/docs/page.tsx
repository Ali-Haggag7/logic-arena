"use client";

import React, { useState } from "react";

/* ─── Command Data (extracted from CommandsDatabase.tsx) ───────────────── */
interface CommandDoc {
  command: string;
  category: string;
  parameters: string;
  description: string;
  example: string;
}

const COMMAND_TABLE: CommandDoc[] = [
  // Movement
  {
    command: "MOVE",
    category: "Movement",
    parameters: "—",
    description: "Move the bot forward at default speed",
    example: "MOVE",
  },
  {
    command: "MOVE_FAST",
    category: "Movement",
    parameters: "—",
    description: "Move the bot at maximum speed",
    example: "MOVE_FAST",
  },
  {
    command: "BACKUP",
    category: "Movement",
    parameters: "—",
    description: "Retreat backwards to create distance",
    example: "BACKUP",
  },
  {
    command: "STOP",
    category: "Movement",
    parameters: "—",
    description: "Halt all movement immediately",
    example: "STOP",
  },
  {
    command: "PATHFIND",
    category: "Movement",
    parameters: "—",
    description: "Autonomously navigate around obstacles",
    example: "PATHFIND",
  },
  // Attack
  {
    command: "FIRE",
    category: "Attack",
    parameters: "—",
    description: "Fire weapon at current target",
    example: "FIRE",
  },
  {
    command: "BURST_FIRE",
    category: "Attack",
    parameters: "—",
    description: "Unleash a rapid burst of projectiles",
    example: "BURST_FIRE",
  },
  // Tactics
  {
    command: "IF spotted THEN FIRE",
    category: "Tactics",
    parameters: "condition",
    description: "Fire only when an enemy is detected in sensor range",
    example: "IF spotted THEN FIRE",
  },
  {
    command: "IF distance < N THEN FIRE",
    category: "Tactics",
    parameters: "N: number",
    description: "Fire when enemy is within N units",
    example: "IF distance < 500 THEN FIRE",
  },
  {
    command: "IF spotted THEN MOVE",
    category: "Tactics",
    parameters: "condition",
    description: "Advance toward the enemy when spotted",
    example: "IF spotted THEN MOVE",
  },
  // Advanced Combat
  {
    command: "IF health < N THEN STOP",
    category: "Advanced Combat",
    parameters: "N: number",
    description: "Halt movement when HP drops below threshold",
    example: "IF health < 20 THEN STOP",
  },
  // Evasion
  {
    command: "IF health < N THEN MOVE",
    category: "Evasion",
    parameters: "N: number",
    description: "Retreat when HP falls below threshold",
    example: "IF health < 30 THEN MOVE",
  },
  {
    command: "IF distance < N THEN MOVE",
    category: "Evasion",
    parameters: "N: number",
    description: "Evade when enemy closes within N units",
    example: "IF distance < 200 THEN MOVE",
  },
  // Intelligence
  {
    command: "SET rotation = rotation + N",
    category: "Intelligence",
    parameters: "N: float",
    description: "Rotate the bot's sensor by N radians per tick",
    example: "SET rotation = rotation + 0.1",
  },
  {
    command: "IF NOT spotted THEN SET rotation",
    category: "Intelligence",
    parameters: "condition",
    description: "Continuously scan when no enemy is detected",
    example: "IF NOT spotted THEN SET rotation = rotation + 0.1",
  },
];

const QUICK_REF = [
  {
    title: "MOVEMENT",
    icon: "⬡",
    color: "#22d3ee",
    commands: ["MOVE", "MOVE_FAST", "BACKUP", "STOP", "PATHFIND"],
  },
  {
    title: "ATTACK",
    icon: "◈",
    color: "#f97316",
    commands: ["FIRE", "BURST_FIRE", "IF spotted THEN FIRE", "IF distance < N THEN FIRE"],
  },
  {
    title: "INTELLIGENCE",
    icon: "◉",
    color: "#a855f7",
    commands: [
      "IF health < N THEN STOP",
      "IF health < N THEN MOVE",
      "IF distance < N THEN MOVE",
      "SET rotation = rotation + N",
    ],
  },
];

const SAMPLE_SCRIPT = `IF spotted THEN FIRE
IF distance < 300 THEN MOVE_FAST
IF health < 25 THEN BACKUP
IF NOT spotted THEN SET rotation = rotation + 0.1
PATHFIND`;

const CATEGORY_COLORS: Record<string, string> = {
  Movement: "#22d3ee",
  Attack: "#f97316",
  Tactics: "#facc15",
  "Advanced Combat": "#ef4444",
  Evasion: "#22c55e",
  Intelligence: "#a855f7",
};

/* ─── Page ─────────────────────────────────────────────────────────────── */
export default function DocsPage() {
  const [script, setScript] = useState(SAMPLE_SCRIPT);
  const [parsed, setParsed] = useState<string[]>([]);
  const [parseBtnHovered, setParseBtnHovered] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const handleParse = () => {
    const lines = script
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    setParsed(lines);
  };

  const filteredCommands = activeCategory
    ? COMMAND_TABLE.filter((c) => c.category === activeCategory)
    : COMMAND_TABLE;

  const categories = Array.from(new Set(COMMAND_TABLE.map((c) => c.category)));

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 8px rgba(34,211,238,0.3), 0 0 24px rgba(34,211,238,0.1); }
          50%       { box-shadow: 0 0 16px rgba(34,211,238,0.6), 0 0 48px rgba(34,211,238,0.2); }
        }
        @keyframes scanline {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        .docs-textarea {
          resize: vertical;
          background: rgba(0,0,0,0.7);
          border: 1px solid rgba(34,211,238,0.2);
          border-radius: 8px;
          color: #22d3ee;
          font-family: var(--font-geist-mono), monospace;
          font-size: 12px;
          line-height: 1.7;
          padding: 16px;
          width: 100%;
          min-height: 200px;
          outline: none;
          transition: border-color 0.2s;
          letter-spacing: 0.05em;
        }
        .docs-textarea:focus {
          border-color: rgba(34,211,238,0.5);
          box-shadow: 0 0 0 2px rgba(34,211,238,0.08), 0 0 20px rgba(34,211,238,0.1);
        }
        .docs-scrollbar::-webkit-scrollbar { width: 4px; }
        .docs-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .docs-scrollbar::-webkit-scrollbar-thumb { background: rgba(34,211,238,0.2); border-radius: 2px; }
        .cmd-row:hover { background-color: rgba(34,211,238,0.03); }
        .quick-card:hover { transform: translateY(-3px); }
        .quick-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#030712",
          fontFamily: "var(--font-geist-mono), monospace",
          color: "rgba(34,211,238,0.9)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Grid background */}
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(8,145,178,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(8,145,178,0.06) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* Content */}
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            padding: "48px 24px 100px",
            position: "relative",
            zIndex: 1,
            animation: "fadeIn 0.35s ease",
          }}
        >
          {/* ── A) HERO ── */}
          <div
            style={{
              borderBottom: "1px solid rgba(34,211,238,0.1)",
              paddingBottom: "36px",
              marginBottom: "52px",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontSize: "9px",
                letterSpacing: "0.4em",
                color: "rgba(34,211,238,0.3)",
                marginBottom: "12px",
                textTransform: "uppercase",
              }}
            >
              // LANGUAGE_REFERENCE_v1.0
            </p>
            <h1
              style={{
                fontSize: "clamp(32px, 6vw, 56px)",
                fontWeight: 900,
                letterSpacing: "0.22em",
                color: "#22d3ee",
                textShadow:
                  "0 0 12px rgba(34,211,238,0.9), 0 0 40px rgba(34,211,238,0.5), 0 0 80px rgba(34,211,238,0.2)",
                margin: "0 0 16px",
                lineHeight: 1,
              }}
            >
              ALISCRIPT
              <span
                style={{
                  fontSize: "0.38em",
                  color: "rgba(34,211,238,0.35)",
                  letterSpacing: "0.3em",
                  marginLeft: "16px",
                  verticalAlign: "super",
                }}
              >
                v1.0
              </span>
            </h1>
            <p
              style={{
                fontSize: "13px",
                color: "rgba(34,211,238,0.45)",
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                margin: 0,
              }}
            >
              The Combat Programming Language
            </p>

            {/* Decorative line */}
            <div
              style={{
                margin: "28px auto 0",
                maxWidth: "320px",
                height: "1px",
                background: "linear-gradient(90deg, transparent, #22d3ee, transparent)",
                opacity: 0.3,
              }}
            />

            {/* Status badges */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "16px",
                marginTop: "22px",
                flexWrap: "wrap",
              }}
            >
              {[
                { label: "COMMANDS", value: "15" },
                { label: "CATEGORIES", value: "6" },
                { label: "STATUS", value: "STABLE" },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  style={{
                    padding: "6px 16px",
                    border: "1px solid rgba(34,211,238,0.2)",
                    borderRadius: "4px",
                    backgroundColor: "rgba(34,211,238,0.04)",
                    fontSize: "9px",
                    letterSpacing: "0.18em",
                    color: "rgba(34,211,238,0.5)",
                    display: "flex",
                    gap: "8px",
                    alignItems: "center",
                  }}
                >
                  <span style={{ color: "rgba(34,211,238,0.3)" }}>{label}:</span>
                  <span style={{ color: "#22d3ee", fontWeight: 700 }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── B) QUICK REFERENCE CARDS ── */}
          <section style={{ marginBottom: "60px" }}>
            <SectionLabel text="QUICK_REFERENCE" />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "16px",
                marginTop: "20px",
              }}
            >
              {QUICK_REF.map((card) => (
                <div
                  key={card.title}
                  className="quick-card"
                  style={{
                    backgroundColor: "rgba(0,0,0,0.6)",
                    border: `1px solid ${card.color}22`,
                    borderRadius: "12px",
                    padding: "24px",
                    backdropFilter: "blur(12px)",
                    boxShadow: `0 4px 24px rgba(0,0,0,0.6), inset 0 1px 0 ${card.color}15`,
                  }}
                >
                  {/* Card header */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginBottom: "18px",
                      paddingBottom: "14px",
                      borderBottom: `1px solid ${card.color}18`,
                    }}
                  >
                    <span
                      style={{
                        fontSize: "18px",
                        color: card.color,
                        textShadow: `0 0 10px ${card.color}88`,
                      }}
                    >
                      {card.icon}
                    </span>
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: 900,
                        letterSpacing: "0.28em",
                        color: card.color,
                        textShadow: `0 0 8px ${card.color}66`,
                      }}
                    >
                      {card.title}
                    </span>
                  </div>

                  {/* Commands list */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {card.commands.map((cmd) => (
                      <div
                        key={cmd}
                        style={{
                          padding: "8px 12px",
                          borderRadius: "6px",
                          backgroundColor: `${card.color}08`,
                          border: `1px solid ${card.color}15`,
                          fontSize: "11px",
                          color: `${card.color}cc`,
                          letterSpacing: "0.06em",
                          fontWeight: 600,
                          fontFamily: "var(--font-geist-mono), monospace",
                        }}
                      >
                        {cmd}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── C) INTERACTIVE PLAYGROUND ── */}
          <section style={{ marginBottom: "60px" }}>
            <SectionLabel text="INTERACTIVE_PLAYGROUND" />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
                marginTop: "20px",
              }}
            >
              {/* Left: editor */}
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "8px",
                      letterSpacing: "0.22em",
                      color: "rgba(34,211,238,0.3)",
                      textTransform: "uppercase",
                    }}
                  >
                    // script_editor
                  </span>
                  <span
                    style={{
                      fontSize: "8px",
                      color: "rgba(34,211,238,0.2)",
                      letterSpacing: "0.15em",
                    }}
                  >
                    {script.split("\n").filter(Boolean).length} LINES
                  </span>
                </div>
                <textarea
                  className="docs-textarea"
                  value={script}
                  onChange={(e) => setScript(e.target.value)}
                  spellCheck={false}
                  id="aliscript-editor"
                />
                <button
                  id="parse-script-btn"
                  onMouseEnter={() => setParseBtnHovered(true)}
                  onMouseLeave={() => setParseBtnHovered(false)}
                  onClick={handleParse}
                  style={{
                    marginTop: "12px",
                    width: "100%",
                    padding: "12px 24px",
                    backgroundColor: parseBtnHovered
                      ? "rgba(34,211,238,0.18)"
                      : "rgba(34,211,238,0.08)",
                    border: parseBtnHovered
                      ? "1px solid rgba(34,211,238,0.7)"
                      : "1px solid rgba(34,211,238,0.3)",
                    borderRadius: "8px",
                    color: parseBtnHovered ? "#22d3ee" : "rgba(34,211,238,0.7)",
                    fontSize: "10px",
                    fontWeight: 900,
                    letterSpacing: "0.28em",
                    fontFamily: "var(--font-geist-mono), monospace",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    textShadow: parseBtnHovered
                      ? "0 0 12px rgba(34,211,238,0.6)"
                      : "none",
                    boxShadow: parseBtnHovered
                      ? "0 0 20px rgba(34,211,238,0.15), inset 0 0 20px rgba(34,211,238,0.05)"
                      : "none",
                    animation: parseBtnHovered ? "pulse-glow 1.5s infinite" : "none",
                  }}
                >
                  ▶ PARSE SCRIPT
                </button>
              </div>

              {/* Right: output */}
              <div>
                <div style={{ marginBottom: "10px" }}>
                  <span
                    style={{
                      fontSize: "8px",
                      letterSpacing: "0.22em",
                      color: "rgba(34,211,238,0.3)",
                      textTransform: "uppercase",
                    }}
                  >
                    // parsed_commands
                  </span>
                </div>
                <div
                  className="docs-scrollbar"
                  style={{
                    minHeight: "200px",
                    maxHeight: "360px",
                    overflowY: "auto",
                    backgroundColor: "rgba(0,0,0,0.7)",
                    border: "1px solid rgba(34,211,238,0.15)",
                    borderRadius: "8px",
                    padding: "16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  {parsed.length === 0 ? (
                    <div
                      style={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "rgba(34,211,238,0.18)",
                        fontSize: "10px",
                        letterSpacing: "0.2em",
                        textAlign: "center",
                        padding: "48px 16px",
                      }}
                    >
                      AWAITING PARSE COMMAND...
                    </div>
                  ) : (
                    parsed.map((cmd, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          animation: "fadeIn 0.2s ease",
                          animationDelay: `${idx * 0.04}s`,
                          animationFillMode: "both",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "8px",
                            color: "rgba(34,211,238,0.2)",
                            minWidth: "24px",
                            textAlign: "right",
                            fontWeight: 700,
                          }}
                        >
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "6px 14px",
                            borderRadius: "6px",
                            backgroundColor: "rgba(34,211,238,0.1)",
                            border: "1px solid rgba(34,211,238,0.3)",
                            color: "#22d3ee",
                            fontSize: "11px",
                            fontWeight: 700,
                            letterSpacing: "0.08em",
                            textShadow: "0 0 8px rgba(34,211,238,0.4)",
                            boxShadow: "0 0 12px rgba(34,211,238,0.08), inset 0 0 12px rgba(34,211,238,0.04)",
                            fontFamily: "var(--font-geist-mono), monospace",
                          }}
                        >
                          {cmd}
                        </span>
                      </div>
                    ))
                  )}
                </div>

                {parsed.length > 0 && (
                  <div
                    style={{
                      marginTop: "10px",
                      fontSize: "9px",
                      color: "rgba(34,211,238,0.25)",
                      letterSpacing: "0.15em",
                      textAlign: "right",
                    }}
                  >
                    {parsed.length} COMMAND{parsed.length !== 1 ? "S" : ""} PARSED
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* ── D) COMMAND REFERENCE TABLE ── */}
          <section>
            <SectionLabel text="COMMAND_REFERENCE" />

            {/* Category filter */}
            <div
              style={{
                display: "flex",
                gap: "8px",
                flexWrap: "wrap",
                marginTop: "20px",
                marginBottom: "16px",
              }}
            >
              <FilterChip
                label="ALL"
                active={activeCategory === null}
                color="#22d3ee"
                onClick={() => setActiveCategory(null)}
              />
              {categories.map((cat) => (
                <FilterChip
                  key={cat}
                  label={cat.toUpperCase()}
                  active={activeCategory === cat}
                  color={CATEGORY_COLORS[cat] ?? "#22d3ee"}
                  onClick={() => setActiveCategory(cat === activeCategory ? null : cat)}
                />
              ))}
            </div>

            {/* Table */}
            <div
              style={{
                borderRadius: "12px",
                border: "1px solid rgba(34,211,238,0.1)",
                overflow: "hidden",
                backgroundColor: "rgba(0,0,0,0.55)",
                backdropFilter: "blur(12px)",
                boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "10px",
                  letterSpacing: "0.08em",
                }}
              >
                <thead>
                  <tr
                    style={{
                      borderBottom: "1px solid rgba(34,211,238,0.12)",
                      backgroundColor: "rgba(34,211,238,0.04)",
                    }}
                  >
                    {["Command", "Category", "Parameters", "Description", "Example"].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: "14px 18px",
                          textAlign: "left",
                          fontSize: "8px",
                          fontWeight: 700,
                          letterSpacing: "0.25em",
                          color: "rgba(34,211,238,0.35)",
                          textTransform: "uppercase",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredCommands.map((cmd, idx) => {
                    const catColor = CATEGORY_COLORS[cmd.category] ?? "#22d3ee";
                    return (
                      <tr
                        key={`${cmd.command}-${idx}`}
                        className="cmd-row"
                        style={{
                          borderBottom:
                            idx < filteredCommands.length - 1
                              ? "1px solid rgba(34,211,238,0.05)"
                              : "none",
                          transition: "background-color 0.15s",
                        }}
                      >
                        {/* Command */}
                        <td style={{ padding: "14px 18px" }}>
                          <code
                            style={{
                              color: "#22d3ee",
                              fontWeight: 700,
                              backgroundColor: "rgba(34,211,238,0.07)",
                              border: "1px solid rgba(34,211,238,0.15)",
                              padding: "3px 8px",
                              borderRadius: "4px",
                              fontSize: "10px",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {cmd.command}
                          </code>
                        </td>

                        {/* Category */}
                        <td style={{ padding: "14px 18px" }}>
                          <span
                            style={{
                              display: "inline-block",
                              padding: "3px 10px",
                              borderRadius: "4px",
                              backgroundColor: `${catColor}12`,
                              border: `1px solid ${catColor}30`,
                              color: catColor,
                              fontSize: "8px",
                              fontWeight: 700,
                              letterSpacing: "0.15em",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {cmd.category.toUpperCase()}
                          </span>
                        </td>

                        {/* Parameters */}
                        <td
                          style={{
                            padding: "14px 18px",
                            color: "rgba(34,211,238,0.35)",
                            fontSize: "10px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {cmd.parameters}
                        </td>

                        {/* Description */}
                        <td
                          style={{
                            padding: "14px 18px",
                            color: "rgba(34,211,238,0.6)",
                            lineHeight: 1.6,
                          }}
                        >
                          {cmd.description}
                        </td>

                        {/* Example */}
                        <td style={{ padding: "14px 18px" }}>
                          <code
                            style={{
                              color: "rgba(34,211,238,0.5)",
                              fontSize: "10px",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {cmd.example}
                          </code>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div
              style={{
                marginTop: "12px",
                fontSize: "8px",
                color: "rgba(34,211,238,0.18)",
                letterSpacing: "0.18em",
                textAlign: "right",
              }}
            >
              {filteredCommands.length} / {COMMAND_TABLE.length} COMMANDS DISPLAYED
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

/* ─── Sub-components ──────────────────────────────────────────────────── */
function SectionLabel({ text }: { text: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        marginBottom: "4px",
      }}
    >
      <span
        style={{
          fontSize: "9px",
          letterSpacing: "0.3em",
          color: "rgba(34,211,238,0.35)",
          fontWeight: 700,
          textTransform: "uppercase",
        }}
      >
        // {text}
      </span>
      <div
        style={{
          flex: 1,
          height: "1px",
          background: "linear-gradient(90deg, rgba(34,211,238,0.15), transparent)",
        }}
      />
    </div>
  );
}

function FilterChip({
  label,
  active,
  color,
  onClick,
}: {
  label: string;
  active: boolean;
  color: string;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "5px 14px",
        borderRadius: "4px",
        backgroundColor: active ? `${color}18` : hovered ? `${color}0d` : "transparent",
        border: active
          ? `1px solid ${color}55`
          : hovered
            ? `1px solid ${color}35`
            : `1px solid rgba(34,211,238,0.12)`,
        color: active ? color : hovered ? `${color}bb` : "rgba(34,211,238,0.35)",
        fontSize: "8px",
        fontWeight: 700,
        letterSpacing: "0.2em",
        cursor: "pointer",
        transition: "all 0.15s ease",
        fontFamily: "var(--font-geist-mono), monospace",
        textShadow: active ? `0 0 8px ${color}66` : "none",
      }}
    >
      {label}
    </button>
  );
}
