"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const auth = localStorage.getItem("smarttani-auth");
    if (!auth) {
      router.push("/login?redirect=/dashboard");
    } else {
      const userData = JSON.parse(auth);
      const role = userData.role;
      
      switch (role) {
        case "petani":
          router.push("/dashboard/farmer");
          break;
        case "investor":
          router.push("/dashboard/investor");
          break;
        case "distributor":
          router.push("/dashboard/distributor");
          break;
        case "mitra_bisnis":
          router.push("/dashboard/mitra-bisnis");
          break;
        case "admin_perusahaan":
          router.push("/dashboard/admin-perusahaan");
          break;
        case "academy":
          router.push("/dashboard/academy");
          break;
        default:
          router.push("/dashboard/profile");
      }
    }
  }, [router]);

  return null;
}
