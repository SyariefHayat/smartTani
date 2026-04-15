import React from "react";
import { DISTRIBUTOR_HERO } from "@/constants/distributor";

const DistributorHeroSection = () => {
  return (
    <section className="py-16">
      <div className="container">
        <h1>{DISTRIBUTOR_HERO.heading}</h1>
        <p>{DISTRIBUTOR_HERO.subtext}</p>
      </div>
    </section>
  );
};

export default DistributorHeroSection;
