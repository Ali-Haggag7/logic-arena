"use client";

import dynamic from "next/dynamic";
import { useMediaQuery } from "../hooks/useMediaQuery";

const AiTutorLazy = dynamic(
  () => import("./AiTutor").then((m) => m.AiTutor),
  { ssr: false },
);

export function AiTutorClient() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  return <AiTutorLazy isMobile={isMobile} />;
}

