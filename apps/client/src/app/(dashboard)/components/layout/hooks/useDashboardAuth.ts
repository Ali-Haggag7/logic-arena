import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function useDashboardAuth() {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    setUsername(localStorage.getItem("username"));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    router.push("/login");
  };

  return { username, handleLogout };
}
