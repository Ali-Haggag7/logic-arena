export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Leaderboard", href: "/leaderboard" },
  { label: "Campaigns", href: "/campaign" },
  { label: "Replay Theater", href: "/replay" },
  { label: "Docs", href: "/docs" },
];

export const ARENA_LINKS = [
  { label: "How It Works", href: "/how-it-works" },
  { label: "AliScript Language", href: "/docs#aliscript" },
  { label: "Robot Builder", href: "/garage" },
  { label: "Join Tournament", href: "/tournaments" },
  { label: "Practice Mode", href: "/arena" },
  { label: "Patch Notes", href: "/patch-notes" },
];

export const COMMUNITY_LINKS = [
  { label: "LinkedIn", target: "_blank", href: "https://www.linkedin.com/in/ali-haggag7" },
  { label: "GitHub", target: "_blank", href: "https://github.com/Ali-Haggag7" },
  { label: "Portfolio", target: "_blank", href: "https://alihaggag.me" },
];

export const LEGAL_LINKS = [
  { label: "Terms of Service", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Cookie Policy", href: "/cookies" },
  { label: "Contact Us", href: "/contact" },
];

export const ACCORDION_SECTIONS = [
  { title: "Navigate", links: NAV_LINKS },
  { title: "Arena", links: ARENA_LINKS },
  { title: "Community", links: COMMUNITY_LINKS },
  { title: "Legal", links: LEGAL_LINKS },
] as const;
