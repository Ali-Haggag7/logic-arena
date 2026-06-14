"use client";

import React, { useState } from "react";
import { useMediaQuery } from "../../../hooks/useMediaQuery";
import { useAuthState } from "../../../hooks/useAuthState";

import { SectionId } from "./components/shared";
import { SettingsLayout } from "./components/SettingsLayout";
import dynamic from "next/dynamic";
import { IdentitySection } from "./components/identity/IdentitySection";

const SecuritySection = dynamic(() =>
  import("./components/SecuritySection").then(m => m.SecuritySection), { ssr: false });
const AppearanceSection = dynamic(() =>
  import("./components/AppearanceSection").then(m => m.AppearanceSection), { ssr: false });
const PreferencesSection = dynamic(() =>
  import("./components/PreferencesSection").then(m => m.PreferencesSection), { ssr: false });
const NotificationsSection = dynamic(() =>
  import("./components/NotificationsSection").then(m => m.NotificationsSection), { ssr: false });

function renderSection(id: SectionId | null, isGuest: boolean) {
  switch (id) {
    case "identity": return <IdentitySection isGuest={isGuest} />;
    case "security": return <SecuritySection isGuest={isGuest} />;
    case "appearance": return <AppearanceSection />;
    case "arena": return <PreferencesSection isGuest={isGuest} />;
    case "notifications": return <NotificationsSection isGuest={isGuest} />;
    default: return null;
  }
}

export default function SettingsPage() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [activeSection, setActiveSection] = useState<SectionId | null>("identity");
  const { isGuest } = useAuthState();

  return (
    <SettingsLayout
      activeSection={activeSection}
      onSectionChange={setActiveSection}
      isMobile={isMobile}
      isGuest={isGuest}
      renderSection={(id) => renderSection(id, isGuest)}
    />
  );
}

