"use client";

import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
  Suspense,
} from "react";
import dynamic from "next/dynamic";
import {
  ShoppingCart,
  Zap,
  Cpu,
  Palette,
  Target,
  CheckCircle,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { MarketItemCard } from "./components/MarketItemCard";
import { apiClient } from "../../../lib/api-client";
import {
  MARKET_ITEMS,
  INITIAL_POINTS,
  CATEGORY_LABELS,
} from "./constants";
import type { ItemCategory, MarketItem } from "./types";
import { useAuthState } from "../../../hooks/useAuthState";

// ── Helpers ───────────────────────────────────────────────────────────────────
const DEFAULT_LOADOUT: Record<ItemCategory, string> = {
  chassis: "chassis-phantom",
  paint:   "paint-crimson",
  tracer:  "tracer-pulse",
};

function findItem(id: string, fallbackCategory: ItemCategory): MarketItem {
  return (
    MARKET_ITEMS.find((i) => i.id === id) ??
    MARKET_ITEMS.find((i) => i.category === fallbackCategory) ??
    MARKET_ITEMS[0]
  );
}

// ── Dynamic 3-D canvas (SSR-safe) ─────────────────────────────────────────────
const RobotShowroom = dynamic(
  () =>
    import("./components/RobotShowroom").then((m) => ({
      default: m.RobotShowroom,
    })),
  { ssr: false, loading: () => <ShowroomSkeleton /> }
);

// ── Skeleton while canvas loads ───────────────────────────────────────────────
function ShowroomSkeleton() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-3 opacity-40">
      <div className="w-24 h-24 border-2 border-accent/30 rounded-xl animate-pulse bg-accent/5" />
      <p className="text-[9px] tracking-[0.3em] text-accent/40 uppercase animate-pulse">
        LOADING SHOWROOM…
      </p>
    </div>
  );
}

// ── Toast ─────────────────────────────────────────────────────────────────────
interface ToastProps {
  message: string;
  type: "success" | "error";
}

function Toast({ message, type }: ToastProps) {
  return (
    <div
      className={`
        fixed bottom-8 left-1/2 -translate-x-1/2 z-50
        flex items-center gap-2.5 px-5 py-3 rounded-xl
        border backdrop-blur-md font-mono text-[10px] tracking-[0.18em] font-bold
        shadow-[0_8px_32px_rgba(0,0,0,0.5)]
        animate-[toastIn_0.3s_ease]
        ${
          type === "success"
            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
            : "bg-red-500/10 border-red-500/30 text-red-400"
        }
      `}
    >
      {type === "success" ? (
        <CheckCircle className="w-3.5 h-3.5 shrink-0" />
      ) : (
        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
      )}
      {message}
    </div>
  );
}

// ── Category Tab ──────────────────────────────────────────────────────────────
const CATEGORY_ICONS: Record<ItemCategory, React.ReactNode> = {
  chassis: <Cpu className="w-3.5 h-3.5" />,
  paint:   <Palette className="w-3.5 h-3.5" />,
  tracer:  <Target className="w-3.5 h-3.5" />,
};

interface CategoryTabProps {
  category: ItemCategory;
  isActive: boolean;
  onClick: () => void;
}

function CategoryTab({ category, isActive, onClick }: CategoryTabProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex items-center gap-2 px-4 py-2.5 rounded-lg border text-[10px] font-black
        tracking-[0.2em] font-mono transition-all duration-200 uppercase
        ${
          isActive
            ? "bg-accent/15 border-accent/50 text-accent shadow-[0_0_16px_rgba(var(--accent-rgb),0.15)]"
            : "bg-accent/[0.03] border-accent/10 text-accent/40 hover:border-accent/30 hover:text-accent/70"
        }
      `}
    >
      {CATEGORY_ICONS[category]}
      {CATEGORY_LABELS[category]}
    </button>
  );
}

// ── API shape returned by GET /users/black-market ─────────────────────────────
interface BlackMarketApiData {
  points:          number;
  unlockedItems:   string[];
  equippedChassis: string;
  equippedPaint:   string;
  equippedTracer:  string;
}

// ── Loadout type ──────────────────────────────────────────────────────────────
interface Loadout {
  chassis: MarketItem;
  paint:   MarketItem;
  tracer:  MarketItem;
}

const CATEGORIES: ItemCategory[] = ["chassis", "paint", "tracer"];

// ── Page ──────────────────────────────────────────────────────────────────────
export default function BlackMarketPage() {
  const { isGuest } = useAuthState();

  // ── State ────────────────────────────────────────────────────────────────
  const [points, setPoints] = useState<number>(INITIAL_POINTS);
  const [ownedItemIds, setOwnedItemIds] = useState<Set<string>>(
    () => new Set(["chassis-phantom", "paint-crimson", "tracer-pulse"])
  );
  const [activeCategory, setActiveCategory] = useState<ItemCategory>("chassis");
  const [previewItem, setPreviewItem] = useState<MarketItem>(MARKET_ITEMS[0]);
  const [previewLoadout, setPreviewLoadout] = useState<Loadout>(() => ({
    chassis: findItem(DEFAULT_LOADOUT.chassis, "chassis"),
    paint:   findItem(DEFAULT_LOADOUT.paint,   "paint"),
    tracer:  findItem(DEFAULT_LOADOUT.tracer,  "tracer"),
  }));
  const [equippedIds, setEquippedIds] = useState<Record<ItemCategory, string>>(DEFAULT_LOADOUT);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // ── Load from API ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (isGuest) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    apiClient
      .get<BlackMarketApiData>("/users/black-market")
      .then((res) => {
        if (cancelled) return;
        const data = res.data;

        setPoints(data.points);
        setOwnedItemIds(new Set(data.unlockedItems));

        const equipped: Record<ItemCategory, string> = {
          chassis: data.equippedChassis,
          paint:   data.equippedPaint,
          tracer:  data.equippedTracer,
        };
        setEquippedIds(equipped);

        const loadout: Loadout = {
          chassis: findItem(equipped.chassis, "chassis"),
          paint:   findItem(equipped.paint,   "paint"),
          tracer:  findItem(equipped.tracer,  "tracer"),
        };
        setPreviewLoadout(loadout);
        setPreviewItem(loadout.chassis);
      })
      .catch(() => {
        /* 401s are handled globally by apiClient interceptor */
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [isGuest]);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const showToast = useCallback(
    (message: string, type: "success" | "error") => {
      setToast({ message, type });
      setTimeout(() => setToast(null), 2800);
    },
    []
  );

  const filteredItems = useMemo(
    () => MARKET_ITEMS.filter((item) => item.category === activeCategory),
    [activeCategory]
  );

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handlePreview = useCallback((item: MarketItem) => {
    setPreviewItem(item);
    // Update 3-D preview loadout for the relevant slot
    setPreviewLoadout((prev) => ({ ...prev, [item.category]: item }));
  }, []);

  const handlePurchase = useCallback(
    async (item: MarketItem) => {
      // If owned but not equipped → equip only
      if (ownedItemIds.has(item.id) || ["chassis-phantom","paint-crimson","tracer-pulse"].includes(item.id)) {
        if (equippedIds[item.category] === item.id) {
          showToast(`${item.name} — ALREADY EQUIPPED`, "success");
          return;
        }
        // Equip only
        setActionLoading(true);
        try {
          if (!isGuest) {
            await apiClient.post("/users/black-market/equip", {
              itemId: item.id,
              category: item.category,
            });
          }
          setEquippedIds((prev) => ({ ...prev, [item.category]: item.id }));
          setPreviewLoadout((prev) => ({ ...prev, [item.category]: item }));
          showToast(`${item.name} — EQUIPPED`, "success");
        } catch {
          showToast("EQUIP FAILED — TRY AGAIN", "error");
        } finally {
          setActionLoading(false);
        }
        return;
      }

      // Not owned — purchase check
      if (item.price > points) {
        showToast("INSUFFICIENT FUNDS — EARN MORE POINTS", "error");
        return;
      }

      setActionLoading(true);
      try {
        if (!isGuest) {
          await apiClient.post("/users/black-market/purchase", {
            itemId: item.id,
          });
          await apiClient.post("/users/black-market/equip", {
            itemId: item.id,
            category: item.category,
          });
        }
        // Optimistic local update after confirmed API success
        setPoints((prev) => prev - item.price);
        setOwnedItemIds((prev) => new Set([...prev, item.id]));
        setEquippedIds((prev) => ({ ...prev, [item.category]: item.id }));
        setPreviewLoadout((prev) => ({ ...prev, [item.category]: item }));
        setPreviewItem(item);
        showToast(`${item.name} — ACQUIRED`, "success");
      } catch (err: unknown) {
        const message =
          (err as { response?: { data?: { message?: string } } })?.response
            ?.data?.message ?? "TRANSACTION FAILED — TRY AGAIN";
        showToast(message.toUpperCase(), "error");
      } finally {
        setActionLoading(false);
      }
    },
    [ownedItemIds, points, equippedIds, isGuest, showToast]
  );

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Keyframes ── */}
      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(-50%) translateY(12px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes marketFadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes headerGlow {
          0%, 100% { text-shadow: 0 0 20px rgba(var(--accent-rgb),0.7), 0 0 60px rgba(var(--accent-rgb),0.3); }
          50%       { text-shadow: 0 0 30px rgba(var(--accent-rgb),1),   0 0 90px rgba(var(--accent-rgb),0.5); }
        }
        @keyframes pedestalPulse {
          0%, 100% { box-shadow: 0 0 20px rgba(var(--accent-rgb),0.2); }
          50%       { box-shadow: 0 0 40px rgba(var(--accent-rgb),0.4); }
        }
      `}</style>

      <div className="min-h-screen bg-bg-primary font-mono text-accent/90 relative overflow-x-hidden">
        {/* Grid background */}
        <div
          className="fixed inset-0 pointer-events-none z-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(var(--accent-rgb),0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--accent-rgb),0.05) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
        {/* Radial glow */}
        <div
          className="fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[320px] pointer-events-none z-0 opacity-20"
          style={{
            background:
              "radial-gradient(ellipse at center top, rgba(var(--accent-rgb),0.5) 0%, transparent 70%)",
          }}
        />

        <div
          className="relative z-10 max-w-[1300px] mx-auto px-6 pt-10 pb-24"
          style={{ animation: "marketFadeIn 0.4s ease" }}
        >
          {/* ── HEADER ── */}
          <div className="border-b border-accent/10 pb-8 mb-10">
            <p className="text-[9px] tracking-[0.45em] text-accent/30 mb-3 uppercase font-bold">
              // PHASE_5 :: BLACK_MARKET_v2.0
            </p>

            <div className="flex flex-col sm:flex-row sm:items-end gap-4 justify-between">
              <div>
                <h1
                  className="text-[clamp(30px,5vw,56px)] font-black tracking-[0.25em] text-accent leading-none uppercase"
                  style={{ animation: "headerGlow 3s ease-in-out infinite" }}
                >
                  THE BLACK
                  <span className="block text-[0.55em] tracking-[0.4em] text-accent/60 mt-1">
                    _MARKET
                  </span>
                </h1>
                <p className="mt-3 text-[10px] text-accent/35 tracking-[0.18em] uppercase font-bold">
                  SPEND YOUR SPOILS — UPGRADE YOUR ARSENAL
                </p>
              </div>

              {/* Points display */}
              <div
                className="flex items-center gap-3 px-5 py-3 rounded-xl border backdrop-blur-md"
                style={{
                  background: "rgba(var(--accent-rgb),0.05)",
                  borderColor: "rgba(var(--accent-rgb),0.25)",
                  boxShadow: "0 0 24px rgba(var(--accent-rgb),0.08)",
                }}
              >
                <Zap
                  className="w-5 h-5 text-accent flex-shrink-0"
                  style={{ filter: "drop-shadow(0 0 6px rgba(var(--accent-rgb),0.8))" }}
                />
                <div>
                  <div className="text-[8px] text-accent/40 tracking-[0.3em] uppercase">
                    AVAILABLE POINTS
                  </div>
                  {loading ? (
                    <div className="flex items-center gap-2 mt-0.5">
                      <Loader2 className="w-4 h-4 text-accent/40 animate-spin" />
                      <span className="text-[12px] text-accent/30 font-black">LOADING…</span>
                    </div>
                  ) : (
                    <div
                      className="text-[22px] font-black tracking-[0.1em] text-accent leading-none"
                      style={{ textShadow: "0 0 16px rgba(var(--accent-rgb),0.9)" }}
                    >
                      {points.toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── BODY ── */}
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-8">

            {/* LEFT: Category Tabs + Item Grid */}
            <div className="flex flex-col gap-6">
              {/* Category tabs */}
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <CategoryTab
                    key={cat}
                    category={cat}
                    isActive={activeCategory === cat}
                    onClick={() => setActiveCategory(cat)}
                  />
                ))}
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-accent/10" />
                <span className="text-[9px] tracking-[0.3em] text-accent/25 uppercase font-bold">
                  {filteredItems.length} ITEMS IN STOCK
                </span>
                <div className="h-px flex-1 bg-accent/10" />
              </div>

              {/* Item grid */}
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3].map((n) => (
                    <div
                      key={n}
                      className="h-40 rounded-xl border border-accent/10 bg-accent/[0.03] animate-pulse"
                    />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredItems.map((item) => (
                    <MarketItemCard
                      key={item.id}
                      item={item}
                      isOwned={
                        ownedItemIds.has(item.id) ||
                        ["chassis-phantom", "paint-crimson", "tracer-pulse"].includes(item.id)
                      }
                      isEquipped={equippedIds[item.category] === item.id}
                      isPreview={previewItem.id === item.id}
                      canAfford={points >= item.price}
                      onPreview={handlePreview}
                      onPurchase={handlePurchase}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT: Showroom */}
            <div className="flex flex-col gap-4">
              {/* 3-D panel */}
              <div
                className="relative rounded-2xl border overflow-hidden"
                style={{
                  background:
                    "linear-gradient(160deg, rgba(var(--accent-rgb),0.04) 0%, rgba(0,0,0,0) 60%)",
                  borderColor: "rgba(var(--accent-rgb),0.15)",
                  boxShadow:
                    "0 0 40px rgba(var(--accent-rgb),0.06), inset 0 0 40px rgba(var(--accent-rgb),0.02)",
                  animation: "pedestalPulse 4s ease-in-out infinite",
                }}
              >
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent to-transparent opacity-50" />

                {/* LIVE PREVIEW badge */}
                <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse shadow-[0_0_6px_rgba(var(--accent-rgb),0.8)]" />
                  <span className="text-[9px] tracking-[0.3em] text-accent/50 uppercase font-bold">
                    LIVE PREVIEW
                  </span>
                </div>

                {/* Action spinner overlay */}
                {actionLoading && (
                  <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <Loader2 className="w-8 h-8 text-accent animate-spin" />
                  </div>
                )}

                {/* 3-D Canvas */}
                <div className="h-[380px] w-full">
                  <Suspense fallback={<ShowroomSkeleton />}>
                    <RobotShowroom
                      chassisId={previewLoadout.chassis.id}
                      paintColor={previewLoadout.paint.color}
                      tracerColor={previewLoadout.tracer.color}
                    />
                  </Suspense>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent to-transparent opacity-30" />
              </div>

              {/* Preview Info Card */}
              <div
                className="rounded-xl border p-5"
                style={{
                  background: "rgba(var(--accent-rgb),0.03)",
                  borderColor: "rgba(var(--accent-rgb),0.12)",
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-4 h-4 rounded-sm flex-shrink-0"
                      style={{
                        background: previewItem.color,
                        boxShadow: `0 0 8px ${previewItem.glowColor}80`,
                      }}
                    />
                    <h2 className="text-[13px] font-black tracking-[0.15em] text-accent/90">
                      {previewItem.name}
                    </h2>
                  </div>
                  <span
                    className={`text-[8px] font-black tracking-[0.2em] px-2 py-0.5 rounded border ${
                      previewItem.rarity === "LEGENDARY"
                        ? "text-amber-400 bg-amber-500/10 border-amber-500/30"
                        : previewItem.rarity === "RARE"
                        ? "text-purple-400 bg-purple-500/10 border-purple-500/30"
                        : "text-accent/70 bg-accent/10 border-accent/20"
                    }`}
                  >
                    {previewItem.rarity}
                  </span>
                </div>

                <p className="text-[10px] text-accent/40 tracking-[0.08em] leading-relaxed mb-4">
                  {previewItem.description}
                </p>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[8px] text-accent/30 tracking-[0.25em] uppercase mb-0.5">
                      COST
                    </div>
                    <div
                      className="text-[16px] font-black tracking-[0.1em]"
                      style={{
                        color: previewItem.glowColor,
                        textShadow: `0 0 10px ${previewItem.glowColor}80`,
                      }}
                    >
                      {previewItem.price === 0
                        ? "FREE"
                        : `${previewItem.price.toLocaleString()} PTS`}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handlePurchase(previewItem)}
                    disabled={
                      actionLoading ||
                      equippedIds[previewItem.category] === previewItem.id ||
                      (previewItem.price > points &&
                        !ownedItemIds.has(previewItem.id) &&
                        previewItem.price > 0)
                    }
                    aria-label={
                      equippedIds[previewItem.category] === previewItem.id
                        ? `${previewItem.name} is currently equipped`
                        : ownedItemIds.has(previewItem.id)
                        ? `Equip ${previewItem.name}`
                        : `Purchase ${previewItem.name} for ${previewItem.price} points`
                    }
                    className={`
                      flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black
                      tracking-[0.2em] font-mono border transition-all duration-200
                      ${
                        actionLoading
                          ? "opacity-50 cursor-not-allowed bg-accent/5 border-accent/20 text-accent/50"
                          : equippedIds[previewItem.category] === previewItem.id
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 cursor-default"
                          : previewItem.price > points &&
                            !ownedItemIds.has(previewItem.id) &&
                            previewItem.price > 0
                          ? "bg-red-500/5 border-red-500/15 text-red-500/35 cursor-not-allowed opacity-50"
                          : "bg-accent/10 border-accent/40 text-accent hover:bg-accent/20 hover:border-accent/70 hover:shadow-[0_0_20px_rgba(var(--accent-rgb),0.25)] cursor-pointer"
                      }
                    `}
                  >
                    {actionLoading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        PROCESSING…
                      </>
                    ) : equippedIds[previewItem.category] === previewItem.id ? (
                      <>
                        <CheckCircle className="w-3.5 h-3.5" />
                        EQUIPPED
                      </>
                    ) : ownedItemIds.has(previewItem.id) ||
                      ["chassis-phantom", "paint-crimson", "tracer-pulse"].includes(previewItem.id) ? (
                      <>
                        <Zap className="w-3.5 h-3.5" />
                        EQUIP NOW
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-3.5 h-3.5" />
                        {previewItem.price === 0 ? "EQUIP NOW" : "PURCHASE NOW"}
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Owned count */}
              <div
                className="rounded-lg border px-4 py-3 flex items-center justify-between"
                style={{
                  background: "rgba(var(--accent-rgb),0.02)",
                  borderColor: "rgba(var(--accent-rgb),0.08)",
                }}
              >
                <span className="text-[9px] tracking-[0.25em] text-accent/30 uppercase font-bold">
                  ITEMS OWNED
                </span>
                <span className="text-[12px] font-black text-accent/60 tracking-[0.1em]">
                  {ownedItemIds.size} / {MARKET_ITEMS.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </>
  );
}
