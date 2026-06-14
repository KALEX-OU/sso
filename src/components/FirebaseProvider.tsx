"use client";

import React, { useEffect, useState } from "react";
import { auth } from "@/lib/firebase/client";
import { onAuthStateChanged, User } from "firebase/auth";

export default function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const [, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white font-sans px-4">
        <span className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white/20"></span>
      </div>
    );
  }

  return <>{children}</>;
}
export { auth };
