"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiClient } from "../../../../lib/api-client";
import { ReplayData, Snapshot } from "./types";
import { ReplayCanvas } from "./components/ReplayCanvas";
import { ReplayControls } from "./components/ReplayControls";
import { useMediaQuery } from "../../../../hooks/useMediaQuery";
import { useReplayPlayback } from "./hooks/useReplayPlayback";
import { ReplayViewerDesktopLayout } from "./components/ReplayViewerDesktopLayout";
import { ReplayViewerMobileLayout } from "./components/ReplayViewerMobileLayout";

export default function ReplayPage() {
  const params = useParams();
  const router = useRouter();
  const matchId = params?.matchId as string;

  const [replayData, setReplayData] = useState<ReplayData | null>(null);
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    currentFrame,
    isPlaying,
    speed,
    lerpT,
    setSpeed,
    handlePlay,
    handlePause,
    handleReset,
    handleScrub,
  } = useReplayPlayback(snapshots);

  useEffect(() => {
    const fetchReplay = async () => {
      try {
        const res = await apiClient.get(`/users/matches/${matchId}/replay`);
        const data: ReplayData = res.data;
        setReplayData(data);
        const snaps = Array.isArray(data.replayData) ? data.replayData : [];
        setSnapshots(snaps);
      } catch (e: any) {
        if (e.response?.status === 401) {
          router.push("/login");
        } else if (e.response?.status === 404) {
          setError("Match not found");
        } else {
          setError(e.message ?? "Unknown error");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchReplay();
  }, [matchId, router]);

  const prevSnapshot = currentFrame > 0 ? snapshots[currentFrame - 1] : undefined;
  const currSnapshot = snapshots[currentFrame];
  const isMobile = useMediaQuery("(max-width: 768px)");

  const ViewerSection = (
    <>
      <ReplayCanvas
        prevSnapshot={prevSnapshot}
        currSnapshot={currSnapshot}
        lerpT={lerpT}
      />
      <ReplayControls
        currentFrame={currentFrame}
        totalFrames={snapshots.length}
        isPlaying={isPlaying}
        speed={speed}
        onPlay={handlePlay}
        onPause={handlePause}
        onReset={handleReset}
        onSpeedChange={setSpeed}
        onScrub={handleScrub}
      />
    </>
  );

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div
        className={`min-h-screen bg-bg-primary font-mono text-accent/90 relative overflow-hidden ${isMobile ? "pb-[calc(80px+env(safe-area-inset-bottom))]" : ""}`}
      >
        <div
          className="fixed inset-0 pointer-events-none z-0"
          style={{
            backgroundImage: "linear-gradient(rgba(8,145,178,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(8,145,178,0.07) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {isMobile ? (
          <ReplayViewerMobileLayout 
            replayData={replayData} 
            snapshots={snapshots} 
            loading={loading} 
            error={error} 
            ViewerSection={ViewerSection} 
            router={router} 
          />
        ) : (
          <ReplayViewerDesktopLayout 
            replayData={replayData} 
            snapshots={snapshots} 
            loading={loading} 
            error={error} 
            ViewerSection={ViewerSection} 
            router={router} 
          />
        )}
      </div>
    </>
  );
}
