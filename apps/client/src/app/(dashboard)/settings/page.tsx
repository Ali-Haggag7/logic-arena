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

function renderSection(id: SectionId | null) {
  switch (id) {
    case "identity": return <IdentitySection />;
    case "security": return <SecuritySection />;
    case "appearance": return <AppearanceSection />;
    case "arena": return <PreferencesSection />;
    case "notifications": return <NotificationsSection />;
    default: return null;
  }
}

export default function SettingsPage() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [activeSection, setActiveSection] = useState<SectionId | null>("identity");

  return (
    <SettingsLayout
      activeSection={activeSection}
      onSectionChange={setActiveSection}
      isMobile={isMobile}
    >
      {renderSection(activeSection)}
    </SettingsLayout>
  );
}
