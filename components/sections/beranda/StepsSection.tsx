import { HOME_STEPS } from "@/constants";
import {
  ArrowRight,
  Handshake,
  Search,
  ShieldCheck,
  UserPlus,
} from "lucide-react";

const STEP_ICONS = [UserPlus, Search, ShieldCheck, Handshake];

export default function StepsSection() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 md:px-10 lg:px-12">
        {/* Header */}
        <div className="mb-20 flex flex-col items-center text-center">
          <h2 className="text-2xl font-extrabold text-[#17391f] md:text-3xl">
            Bagaimana Smarttani Bekerja?
          </h2>
          <p className="mt-4 text-sm font-medium text-[#5d7a64] md:text-base">
            4 langkah mudah untuk memulai
          </p>
        </div>

        {/* Steps Grid */}
        <div className="relative">
          {/* Arrow Desktop */}
          <div className="absolute top-12 left-0 hidden w-full px-20 lg:block">
            <div className="flex justify-between">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex-1 text-[#b5d296]/30">
                  <ArrowRight className="mx-auto size-10 stroke-[1.5]" />
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {HOME_STEPS.map((step, index) => {
              const Icon = STEP_ICONS[index] ?? UserPlus;
              return (
                <div key={step.step} className="relative flex flex-col items-start px-4">
                  <div className="mb-6 flex items-center gap-4">
                    <div className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                      {step.step}
                    </div>
                    <div className="flex size-14 items-center justify-center rounded-2xl bg-primary-light text-primary">
                      <Icon className="size-7" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-extrabold text-[#17391f]">
                      {step.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-[#5d7a64]">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
