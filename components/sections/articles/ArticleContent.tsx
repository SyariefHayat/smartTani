"use client";

import { MessageCircle, Share2 } from "lucide-react";
import { FaFacebook, FaWhatsapp } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Badge } from "@/components/ui/badge";

interface ArticleContentProps {
  article: any;
}

export default function ArticleContent({ article }: ArticleContentProps) {
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const encodedTitle = encodeURIComponent(article.title);

  const shareLinks = [
    {
      label: "WhatsApp",
      icon: FaWhatsapp,
      href: `https://wa.me/?text=${encodedTitle}%20${currentUrl}`,
      color: "bg-[#25D366]",
    },
    {
      label: "Twitter/X",
      icon: FaXTwitter,
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${currentUrl}`,
      color: "bg-[#000000]",
    },
    {
      label: "Facebook",
      icon: FaFacebook,
      href: `https://www.facebook.com/sharer.php?u=${currentUrl}`,
      color: "bg-[#1877F2]",
    },
  ];

  return (
    <div className="max-w-4xl py-12">
      <div className="prose prose-lg max-w-none text-[#5d7a64] leading-relaxed">
        <p className="text-xl font-bold text-[#17391f] mb-10 leading-relaxed md:text-2xl border-l-4 border-primary pl-6 py-2 bg-primary-light/30 rounded-r-2xl not-italic">
          {article.description}
        </p>
        <p className="font-medium">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
          enim ad minim veniam, quis nostrud exercitation ullamco laboris
          nisi ut aliquip ex ea commodo consequat.
        </p>
        <h2 className="text-2xl font-extrabold text-[#17391f] mt-12 mb-6">Pentingnya Inovasi dalam Pertanian</h2>
        <p className="font-medium">
          Duis aute irure dolor in reprehenderit in voluptate velit esse
          cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
          cupidatat non proident, sunt in culpa qui officia deserunt mollit
          anim id est laborum.
        </p>
        <p className="mt-6 font-medium">
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem
          accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
          quae ab illo inventore veritatis et quasi architecto beatae vitae
          dicta sunt explicabo.
        </p>
        <h3 className="text-xl font-extrabold text-[#17391f] mt-10 mb-4">Langkah-langkah Praktis</h3>
        <p className="font-medium">
          Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit
          aut fugit, sed quia consequuntur magni dolores eos qui ratione
          voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem
          ipsum quia dolor sit amet, consectetur, adipisci velit.
        </p>
      </div>

      <div className="mt-12 border-t border-slate-100 pt-12">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#17391f] mr-2">Tags:</span>
          {["Budidaya", "Inovasi", "PetaniMilenial", "SmartTani"].map((tag) => (
            <Badge key={tag} variant="secondary" className="rounded-xl bg-slate-50 px-4 py-2 text-[10px] font-extrabold uppercase tracking-wider text-[#5d7a64] transition-all hover:bg-primary hover:text-white cursor-pointer border border-slate-100">
              #{tag}
            </Badge>
          ))}
        </div>

        <div className="mt-12 rounded-3xl bg-slate-50 p-10 border border-slate-100 shadow-sm">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
            <div className="flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/20">
                <Share2 className="size-6" />
              </div>
              <span className="text-lg font-extrabold text-[#17391f]">Bagikan artikel ini:</span>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              {shareLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-center gap-3 rounded-2xl px-8 py-3.5 text-xs font-extrabold text-white transition-all hover:scale-105 shadow-lg ${link.color} uppercase tracking-wider`}
                >
                  <link.icon className="size-5" />
                  <span className="hidden sm:inline">{link.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
