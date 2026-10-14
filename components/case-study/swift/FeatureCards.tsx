"use client";

import { motion } from "framer-motion";
import HorizontalPin from "@/components/case-study/HorizontalPin";

/* «Everything you need. Nothing you don't.» (el titular de la landing de SwifT) como texto real, y sus
   cuatro funciones como cards que pasan de izquierda a derecha con el scroll. Copy de la landing
   (script.js), traducido y puesto al día con la v2.1: la tercera ya no es «Powered by Apple», sino el
   modelo que va dentro del Mac. Ilustraciones recreadas, en el violeta de la marca (#7c3aed). */

const V = "#7c3aed";

function Apps() {
  return (
    <div className="flex flex-wrap gap-2">
      {["Xcode", "Safari", "Slack", "Notas", "PDF", "Mail"].map((a, k) => (
        <motion.span
          key={a}
          className="rounded-full bg-[var(--case-bg)] px-3 py-1.5 t-small"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, delay: k * 0.18, ease: "easeInOut" }}
        >
          {a}
        </motion.span>
      ))}
    </div>
  );
}

function Flip() {
  return (
    <div className="flex items-center gap-4 text-[2.4rem] font-semibold tracking-tight">
      <span>ES</span>
      <motion.span
        className="flex h-14 w-14 items-center justify-center rounded-full text-white"
        style={{ background: V }}
        animate={{ rotate: [0, 0, 180, 180, 360] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", times: [0, 0.3, 0.5, 0.8, 1] }}
      >
        ↺
      </motion.span>
      <span>EN</span>
    </div>
  );
}

function OnDevice() {
  return (
    <div className="flex items-end gap-3">
      <div className="flex h-24 w-36 items-end justify-center rounded-t-[0.6rem] border-[3px] border-b-0 border-[var(--case-fg)] pb-2">
        <span className="rounded-[4px] px-2 py-1 text-[11px] font-semibold text-white" style={{ background: V }}>
          TranslateGemma 4B
        </span>
      </div>
      <div className="pb-1">
        <p className="t-label t-tag text-[var(--case-muted)]">Sin internet</p>
        <p className="t-small">2,49 GB · en tu Mac</p>
      </div>
    </div>
  );
}

function MenuBar() {
  return (
    <div className="flex h-9 w-full items-center justify-end gap-4 rounded-[0.5rem] bg-[var(--case-bg)] px-4 text-[12px] text-[var(--case-muted)]">
      <span>Wi-Fi</span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/maqueta/swift/brand/mark-black.svg" alt="SwifT" className="dark-invert h-4 w-4" />
      <span>9:41</span>
    </div>
  );
}

const CARDS = [
  { name: "Select & translate", body: "Seleccionas un texto en cualquier app —Xcode, Safari, Slack, un PDF—, pulsas ⌥⌘T y listo. En todo el sistema.", art: <Apps /> },
  { name: "Auto-flip", body: "¿Escribes en castellano y lo necesitas en inglés? Detecta la dirección y da la vuelta sola cuando hace falta.", art: <Flip /> },
  { name: "En tu Mac", body: "Desde la v2.1 traduce con su propia IA, dentro del Mac y sin internet. Apple y Google quedan de red.", art: <OnDevice /> },
  { name: "Stays out of your way", body: "Vive en la barra de menús. Sin icono en el Dock, sin pantallas de bienvenida, sin suscripción.", art: <MenuBar /> },
];

export default function FeatureCards() {
  return (
    <HorizontalPin
      head={
        <div className="grid grid-cols-12 gap-x-4 md:gap-x-6">
          <div className="col-span-12 md:col-span-7">
            <p className="t-label t-tag text-[var(--case-muted)]">Cuatro funciones</p>
            <p className="mt-4 t-h2">Everything you need. Nothing you don&rsquo;t.</p>
          </div>
          <p className="col-span-12 mt-6 t-body text-[var(--case-muted)] md:col-span-3 md:col-start-10 md:mt-24">
            El titular de la landing resume el producto: cada decisión fue una resta.
          </p>
        </div>
      }
    >
      {CARDS.map((c, k) => (
        <article
          key={c.name}
          className="flex min-h-[24rem] w-full shrink-0 flex-col justify-between rounded-[18px] bg-[var(--case-ph)] p-7 md:h-[30rem] md:w-[26rem] md:p-9"
        >
          <div className="flex min-h-[7rem] items-start">{c.art}</div>
          <div>
            <p className="t-label t-tag text-[var(--case-muted)]">0{k + 1}</p>
            <p className="mt-3 t-title">{c.name}</p>
            <p className="mt-3 t-body text-[var(--case-muted)]">{c.body}</p>
          </div>
        </article>
      ))}
    </HorizontalPin>
  );
}
