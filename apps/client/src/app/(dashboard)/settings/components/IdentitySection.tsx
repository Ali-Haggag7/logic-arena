"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { Camera, Loader2 } from "lucide-react";
import { apiClient } from "../../../../lib/api-client";
import { useFeedback, SectionHeader, SettingsInput, SaveButton } from "./Shared";
import { getAuthUsername, setAuthSession, getAuthUserId, getAuthAvatarUrl } from "../../../../lib/client-security";

/** Accepted avatar MIME types (matches server-side validation) */
const ACCEPTED_AVATAR_TYPES = "image/png, image/jpeg, image/webp";

/** 2 MB cap — matches server-side Multer + pipe validation */
const MAX_AVATAR_BYTES = 2 * 1024 * 1024;

export function IdentitySection({ isGuest = false }: { isGuest?: boolean }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [initials, setInitials] = useState("?");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [hasGoogle, setHasGoogle] = useState(false);
  const [hasGithub, setHasGithub] = useState(false);

  const [originalUsername, setOriginalUsername] = useState("");
  const [originalEmail, setOriginalEmail] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { state: usernameFb, flash: flashUsername } = useFeedback();
  const { state: emailFb, flash: flashEmail } = useFeedback();
  const { state: avatarFb, flash: flashAvatar } = useFeedback();
  const [loadingUsername, setLoadingUsername] = useState(false);
  const [loadingEmail, setLoadingEmail] = useState(false);

  useEffect(() => {
    const storedUsername = getAuthUsername() ?? "";
    const storedAvatar = getAuthAvatarUrl();
    setUsername(storedUsername);
    setInitials(storedUsername?.[0]?.toUpperCase() ?? "?");
    if (storedAvatar) setAvatarUrl(storedAvatar);

    apiClient.get("/users/profile").then((res) => {
      setEmail(res.data.email ?? "");
      setOriginalEmail(res.data.email ?? "");
      setHasGoogle(res.data.hasGoogle ?? false);
      setHasGithub(res.data.hasGithub ?? false);
      setUsername(res.data.username ?? storedUsername);
      setOriginalUsername(res.data.username ?? storedUsername);
      setInitials((res.data.username ?? storedUsername)?.[0]?.toUpperCase() ?? "?");
      if (res.data.avatarUrl) setAvatarUrl(res.data.avatarUrl);
    }).catch(() => { });
  }, []);

  // ── Avatar Upload Handler ──────────────────────────────────────────────────
  const handleAvatarUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side pre-validation (mirrors server-side)
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      flashAvatar("error", "ONLY JPG, PNG, OR WEBP");
      return;
    }
    if (file.size > MAX_AVATAR_BYTES) {
      flashAvatar("error", "FILE TOO LARGE (2MB MAX)");
      return;
    }

    setAvatarLoading(true);
    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const res = await apiClient.post("/users/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const newUrl = res.data.avatarUrl as string;
      setAvatarUrl(newUrl);
      setAuthSession({
        userId: getAuthUserId(),
        username: getAuthUsername(),
        avatarUrl: newUrl,
      });
      flashAvatar("success", "AVATAR UPDATED");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "UPLOAD FAILED";
      flashAvatar("error", msg);
    } finally {
      setAvatarLoading(false);
      // Reset input so the same file can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, [flashAvatar]);

  const saveUsername = async () => {
    if (isGuest) return;
    const newUsername = username.trim();
    if (!newUsername) {
      return flashUsername("error", "USERNAME CANNOT BE EMPTY");
    }
    if (newUsername.length < 3) {
      return flashUsername("error", "MIN 3 CHARACTERS");
    }

    setLoadingUsername(true);
    try {
      await apiClient.put("/users/identity", { username: newUsername });
      setAuthSession({ userId: getAuthUserId(), username: newUsername });
      setOriginalUsername(newUsername);
      setUsername(newUsername);
      setInitials(newUsername[0]?.toUpperCase() ?? "?");
      flashUsername("success");
    } catch (err: unknown) {
      setUsername(originalUsername);
      const e = err as { response?: { data?: { message?: string } } };
      flashUsername("error", e?.response?.data?.message ?? "FAILED");
    } finally { setLoadingUsername(false); }
  };

  const saveEmail = async () => {
    if (isGuest) return;
    const newEmail = email.trim();
    if (!newEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      return flashEmail("error", "INVALID EMAIL FORMAT");
    }

    setLoadingEmail(true);
    try {
      await apiClient.put("/users/identity", { email: newEmail });
      setOriginalEmail(newEmail);
      setEmail(newEmail);
      flashEmail("success");
    } catch (err: unknown) {
      setEmail(originalEmail);
      const e = err as { response?: { data?: { message?: string } } };
      flashEmail("error", e?.response?.data?.message ?? "FAILED");
    } finally { setLoadingEmail(false); }
  };

  return (
    <div className="flex flex-col gap-6">
      <SectionHeader>MY PROFILE</SectionHeader>

      {/* Avatar */}
      <div className="flex items-center gap-4 p-4 bg-accent/[0.03] border border-accent/[0.08] rounded-xl">
        <button
          type="button"
          onClick={() => !isGuest && fileInputRef.current?.click()}
          disabled={isGuest || avatarLoading}
          aria-label="Upload avatar"
          className={`relative w-14 h-14 rounded-full bg-accent/15 border-2 border-accent/40 flex items-center justify-center text-[22px] font-black text-accent shadow-[0_0_20px_rgba(var(--accent-rgb),0.25)] shrink-0 overflow-hidden group transition-all duration-300 ${
            isGuest ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:border-accent/70 hover:shadow-[0_0_30px_rgba(var(--accent-rgb),0.4)]"
          }`}
        >
          {/* Avatar image or initial letter */}
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Your avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <span>{initials}</span>
          )}

          {/* Hover overlay — camera icon */}
          {!isGuest && !avatarLoading && (
            <div className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Camera size={18} className="text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.5)]" />
            </div>
          )}

          {/* Loading spinner overlay */}
          {avatarLoading && (
            <div className="absolute inset-0 rounded-full bg-black/70 flex items-center justify-center backdrop-blur-sm">
              <Loader2 size={22} className="text-accent animate-spin drop-shadow-[0_0_8px_rgba(var(--accent-rgb),0.8)]" />
            </div>
          )}
        </button>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_AVATAR_TYPES}
          className="hidden"
          onChange={handleAvatarUpload}
          aria-label="Choose avatar image"
          tabIndex={-1}
        />

        <div className="flex-1 min-w-0">
          <div className="text-[9px] tracking-[0.22em] text-accent/70 font-bold uppercase mb-0.5">
            Profile Picture
          </div>
          <div className="text-[11px] text-text-secondary tracking-[0.1em]">
            {isGuest ? "Sign in to upload an avatar" : "Click to upload — JPG, PNG, or WebP (2MB max)"}
          </div>
          {/* Avatar feedback */}
          {avatarFb.status === "success" && (
            <span className="text-[9px] text-green-400 tracking-[0.15em] font-bold animate-pulse mt-1 block" aria-live="polite" role="status">
              ✓ {avatarFb.message}
            </span>
          )}
          {avatarFb.status === "error" && (
            <span className="text-[9px] text-red-400 tracking-[0.15em] font-bold mt-1 block" aria-live="polite" role="status">
              ✕ {avatarFb.message}
            </span>
          )}
        </div>
      </div>

      {/* Display name */}
      <div className="flex flex-col gap-3">
        <SettingsInput label="Display Name" value={username} onChange={setUsername} placeholder="Enter username" disabled={isGuest} isGuest={isGuest} />
        <SaveButton onClick={saveUsername} loading={loadingUsername} feedback={usernameFb} isGuest={isGuest} disabled={username === originalUsername || !username.trim()} />
      </div>

      {/* Email */}
      <div className="flex flex-col gap-3">
        <SettingsInput label="Email Address" value={email} onChange={setEmail} type="email" placeholder="Enter email" disabled={isGuest} isGuest={isGuest} />
        <SaveButton onClick={saveEmail} loading={loadingEmail} feedback={emailFb} isGuest={isGuest} disabled={email === originalEmail || !email.trim()} />
      </div>

      {/* Connected accounts */}
      <div className="flex flex-col gap-3">
        <div className="text-[9px] tracking-[0.22em] text-accent/50 font-bold uppercase">
          Connected Accounts
        </div>
        <div className="flex flex-col gap-2">
          {[
            { label: "Google", connected: hasGoogle },
            { label: "GitHub", connected: hasGithub },
          ].map(({ label, connected }) => (
            <div
              key={label}
              className="flex items-center justify-between px-4 py-3 bg-bg-secondary border border-accent/10 rounded-lg"
            >
              <span className="text-[11px] font-bold tracking-[0.12em] text-text-secondary">{label}</span>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${connected ? "bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.7)]" : "bg-text-secondary/20"}`} />
                <span className={`text-[9px] tracking-[0.2em] font-bold ${connected ? "text-green-400" : "text-text-secondary/40"}`}>
                  {connected ? "LINKED" : "NOT LINKED"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
