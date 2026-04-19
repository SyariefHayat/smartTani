import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MARKETPLACE_BANNER_MITRA } from "@/constants/marketplace";

const MitraBannerSection = () => {
  return (
    <div className="relative rounded-md p-6 text-white overflow-hidden">
      {/* Background image */}
      <Image
        src="/images/marketplace/sidebar.webp"
        alt=""
        fill
        sizes="100%"
        className="object-cover"
      />

      {/* Content */}
      <div className="relative z-10">
        <h4 className="text-heading-3 font-bold text-white leading-tight">
          {MARKETPLACE_BANNER_MITRA.heading}
        </h4>
        <p className="text-caption text-white/80 mt-2 mb-6 max-w-45">
          {MARKETPLACE_BANNER_MITRA.subtext}
        </p>
        <Button
          asChild
          variant="outline"
          className="border-white rounded-sm text-primary hover:bg-white"
        >
          <Link href="/signup?role=distributor">
            {MARKETPLACE_BANNER_MITRA.cta.label}
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default MitraBannerSection;
