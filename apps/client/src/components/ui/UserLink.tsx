import React from "react";
import Link from "next/link";

interface UserLinkProps {
  username: string;
  className?: string;
  children?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export function UserLink({ username, className, children, onClick }: UserLinkProps) {
  if (!username || username === "N/A") {
    return <span className={className}>{children ?? username}</span>;
  }

  return (
    <Link
      href={`/profile/${encodeURIComponent(username)}`}
      className={className}
      onClick={onClick}
    >
      {children ?? username}
    </Link>
  );
}
