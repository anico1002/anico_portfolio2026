"use client";

import { Mail, Linkedin } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { translations } from "@/lib/i18n";
import ScrollReveal from "./ScrollReveal";

interface ContactProps {
  profileContact?: { title: string; desc: string };
  email?: string;
  linkedin?: string;
}

export default function Contact({ profileContact, email, linkedin }: ContactProps) {
  const { locale } = useApp();
  const base = translations[locale].contact;
  const t = profileContact ? { ...base, ...profileContact } : base;
  const emailAddr = email ?? t.email;
  const linkedinUrl = linkedin ?? "https://es.linkedin.com/in/anico";

  return (
    <section
      id="contact"
      className="py-24 md:py-32 px-6 md:px-12 lg:px-24 bg-primary text-primary-foreground"
    >
      <div className="max-w-4xl mx-auto text-center">
        <ScrollReveal>
        <p className="text-primary-foreground/60 text-sm tracking-widest uppercase mb-4">
          {t.eyebrow}
        </p>
        <h2 className="font-display text-4xl md:text-6xl font-semibold mb-8">
          {t.title}
        </h2>
        <p className="text-primary-foreground/70 text-lg mb-12 max-w-xl mx-auto">
          {t.desc}
        </p>
        <div className="flex justify-center gap-6">
          <a
            href={`mailto:${emailAddr}`}
            className="w-12 h-12 border border-primary-foreground/30 rounded-full flex items-center justify-center hover:bg-primary-foreground hover:text-primary transition-all"
            aria-label="Email"
          >
            <Mail className="w-5 h-5" />
          </a>
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 border border-primary-foreground/30 rounded-full flex items-center justify-center hover:bg-primary-foreground hover:text-primary transition-all"
            aria-label="LinkedIn"
          >
            <Linkedin className="w-5 h-5" />
          </a>
        </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
