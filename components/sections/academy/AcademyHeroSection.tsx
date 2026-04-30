"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ACADEMY_HERO } from "@/constants/academy";
import { Monitor, Users, Award, ArrowRight } from "lucide-react";

const ICON_MAP = [Monitor, Users, Award];

const AcademyHeroSection = () => {
  const scrollToModel = () => {
    const element = document.getElementById("academy-model");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative flex items-start md:items-center overflow-hidden min-h-[720px] md:min-h-[460px] lg:min-h-[420px]">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <picture className="block w-full h-full">
          <source
            media="(min-width: 1024px)"
            srcSet={ACADEMY_HERO.bgImageDesktop}
          />
          <source
            media="(min-width: 768px) and (max-width: 1023px)"
            srcSet={ACADEMY_HERO.bgImageTablet}
          />
          <source
            media="(min-width: 480px) and (max-width: 767px)"
            srcSet={ACADEMY_HERO.bgImageSmallTablet}
          />
          <source
            media="(max-width: 479px)"
            srcSet={ACADEMY_HERO.bgImageMobile}
          />
          <img
            src={ACADEMY_HERO.bgImageDesktop}
            alt="Hero Background"
            className="w-full h-full object-cover object-center"
          />
        </picture>
      </div>
    </section>
  );
};

export default AcademyHeroSection;
