"use client";

import dynamic from "next/dynamic";

const AiTutorLazy = dynamic(
  () => import("./AiTutor").then((m) => m.AiTutor),
  { ssr: false },
);

export function AiTutorClient() {
  return <AiTutorLazy />;
}
