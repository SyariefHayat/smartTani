import { Metadata } from "next";
import { PRIVASI_META, PRIVASI_CONTENT } from "@/constants/privasi";

export const metadata: Metadata = {
  title: PRIVASI_META.title,
  description: PRIVASI_META.description,
};

export default function PrivasiPage() {
  return (
    <main className="min-h-screen bg-white">
      <article className="container-smarttani max-w-3xl mx-auto py-12 md:py-16 lg:py-20">
        {/* Header */}
        <header className="text-center mb-12">
          <p className="text-caption font-bold text-primary uppercase tracking-widest mb-3">
            Kebijakan Privasi
          </p>
          <h1 className="text-heading-1 md:text-display text-foreground mb-4">
            {PRIVASI_CONTENT.heading}
          </h1>
          <p className="text-body-sm text-muted-foreground max-w-xl mx-auto mb-3">
            {PRIVASI_CONTENT.intro}
          </p>
          <p className="text-caption text-muted-foreground">
            Terakhir diperbarui: {PRIVASI_CONTENT.lastUpdated}
          </p>
        </header>

        <hr className="border-border mb-10" />

        {/* Content */}
        <div className="space-y-10">
          {PRIVASI_CONTENT.sections.map((section, sectionIndex) => (
            <section key={sectionIndex}>
              <h2 className="text-heading-3 text-foreground mb-4">
                {section.title}
              </h2>
              <div className="space-y-4">
                {section.content.map((block, blockIndex) => (
                  <div key={blockIndex}>
                    {block.subtitle && (
                      <h3 className="text-body-sm font-bold text-foreground mb-1.5">
                        {block.subtitle}
                      </h3>
                    )}
                    <p className="text-body-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                      {block.text}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </article>
    </main>
  );
}
