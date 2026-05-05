import { useRouter } from "next/navigation";
import { useAuthState } from "../../../../../hooks/useAuthState";

export function useDashboardAuth() {
  const router = useRouter();
  const { username } = useAuthState();

  const handleLogout = () => {
    ["token", "jwtToken", "userId", "username"].forEach((k) =>
      localStorage.removeItem(k)
    );
    // Notify all mounted useAuthState subscribers in the same tab
    window.dispatchEvent(new Event("auth:changed"));
    router.push("/login");
  };

  return { username, handleLogout };
}
