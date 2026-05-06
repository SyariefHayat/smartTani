"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function FarmerDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = localStorage.getItem("smarttani-auth");
    if (!auth) {
      router.push("/login?redirect=/dashboard/farmer");
    } else {
      const userData = JSON.parse(auth);
      if (userData.role !== "petani") {
        router.push(
          `/dashboard/${userData.role === "petani" ? "farmer" : userData.role.replace("_", "-")}`,
        );
      } else {
        setLoading(false);
      }
    }
  }, [router]);

  if (loading) return null;

  return (
    <>
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50" />
      </div>
      <div className="min-h-screen flex-1 rounded-xl bg-muted/50 md:min-h-min" />
    </>
  );
}
