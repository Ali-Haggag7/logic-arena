"use client";

import React, { useState } from "react";
import { useMediaQuery } from "../../../hooks/useMediaQuery";

import { SectionId } from "./components/Shared";
import { SettingsLayout } from "./components/SettingsLayout";
import { IdentitySection } from "./components/IdentitySection";
import { SecuritySection } from "./components/SecuritySection";
import { AppearanceSection } from "./components/AppearanceSection";
import { PreferencesSection } from "./components/PreferencesSection";
import { NotificationsSection } from "./components/NotificationsSection";
import { apiClient } from "../../../lib/api-client";

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
  const [isGuest, setIsGuest] = useState(false);

  React.useEffect(() => {
    const token = localStorage.getItem("token") || localStorage.getItem("jwtToken");
    if (!token) {
      setIsGuest(true);
    }
  }, []);

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
