import { useState, useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";
import { useRouter } from "next/navigation";

export function useAuth() {
  const [name, setName] = useState("");
  const router = useRouter();
  
  const [localStorageUserName, setLocalStorageUserName] = useLocalStorage(
    "userName",
    "",
    { initializeWithValue: false }
  );

  useEffect(() => {
    if (localStorageUserName) {
      setName(localStorageUserName);
    }
  }, [localStorageUserName]);

  const handleLogin = (name: string) => {
    if (name.trim()) {
      setLocalStorageUserName(name.trim());
      router.push("/dashboard");
    }
  };

  const reset = () => {
    setLocalStorageUserName("");
    setName("");
  };

  const continueToApp = () => {
    router.push("/dashboard");
  };

  return {
    name,
    setName,
    localStorageUserName,
    handleLogin,
    reset,
    continueToApp,
  };
}
