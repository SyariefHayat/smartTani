import { CONTACT_LOCATIONS } from "@/constants/contact";
import { CheckCircle2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ContactLocationSection() {
  return (
    <section className="pb-10 md:pb-14">
      <div className="container-smarttani">
        <div className="group relative overflow-hidden rounded-3xl border border-slate-200 shadow-lg transition-all hover:shadow-xl min-h-[480px] md:min-h-[520px]">

          {/* Google Maps Full Background */}
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d31679.56831668499!2d112.49909760000001!3d-7.015628799999981!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sid!4v1776331594170!5m2!1sen!2sid"
            className="absolute inset-0 h-full w-full"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />

          {/* Floating Content Card */}
          <div className="absolute inset-0 z-10 flex items-center p-6 md:p-10 lg:p-14">
            <div className="w-full max-w-sm rounded-2xl border border-slate-200/80 bg-[#F8FAFC] p-8 shadow-xl md:p-10">

              <h2 className="text-heading-1 font-bold text-foreground">
                {CONTACT_LOCATIONS.heading}
              </h2>
              <p className="mt-3 text-body-sm text-muted-foreground md:text-body">
                {CONTACT_LOCATIONS.subtext}
              </p>

              <div className="mt-6 space-y-3">
                {CONTACT_LOCATIONS.bullets.map((bullet) => (
                  <div key={bullet} className="flex items-center gap-3">
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary-light">
                      <CheckCircle2 className="size-4 text-primary" />
                    </div>
                    <span className="text-body-sm font-semibold text-foreground md:text-body">
                      {bullet}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Button className="w-full rounded-xl bg-primary px-8 py-6 text-body-sm font-bold text-white hover:bg-primary-dark shadow-lg shadow-primary/10 transition-all cursor-pointer">
                  {CONTACT_LOCATIONS.button}
                  <ExternalLink className="ml-2 size-5" />
                </Button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
