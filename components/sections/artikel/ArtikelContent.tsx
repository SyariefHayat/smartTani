"use client";

import { MessageCircle, Share2 } from "lucide-react";
import { FaFacebook, FaWhatsapp } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Badge } from "@/components/ui/badge";

interface ArtikelContentProps {
  article: any;
}

export default function ArtikelContent({ article }: ArtikelContentProps) {
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
      <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
        <p className="text-xl font-medium text-gray-900 mb-8 italic border-l-4 border-[#1A6B2F] pl-6">
          {article.description}
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
          enim ad minim veniam, quis nostrud exercitation ullamco laboris
          nisi ut aliquip ex ea commodo consequat.
        </p>
        <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">Pentingnya Inovasi dalam Pertanian</h2>
        <p>
          Duis aute irure dolor in reprehenderit in voluptate velit esse
          cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
          cupidatat non proident, sunt in culpa qui officia deserunt mollit
          anim id est laborum.
        </p>
        <p className="mt-6">
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem
          accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
          quae ab illo inventore veritatis et quasi architecto beatae vitae
          dicta sunt explicabo.
        </p>
        <h3 className="text-xl font-bold text-gray-900 mt-10 mb-4">Langkah-langkah Praktis</h3>
        <p>
          Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit
          aut fugit, sed quia consequuntur magni dolores eos qui ratione
          voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem
          ipsum quia dolor sit amet, consectetur, adipisci velit.
        </p>
      </div>

      <div className="mt-12 border-t border-gray-100 pt-12">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-bold text-gray-900 mr-2">Tags:</span>
          {["Pertanian", "Inovasi", "PetaniMilenial", "SmartTani"].map((tag) => (
            <Badge key={tag} variant="secondary" className="hover:bg-gray-200 cursor-pointer">
              #{tag}
            </Badge>
          ))}
        </div>

        <div className="mt-12 rounded-2xl bg-gray-50 p-8">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-3">
              <Share2 className="h-6 w-6 text-[#1A6B2F]" />
              <span className="text-lg font-bold text-gray-900">Bagikan artikel ini:</span>
            </div>
            <div className="flex gap-4">
              {shareLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold text-white transition-transform hover:scale-105 ${link.color}`}
                >
                  <link.icon className="h-4 w-4" />
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
