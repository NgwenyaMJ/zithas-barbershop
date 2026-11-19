"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, Scissors } from "lucide-react";

const links = [{ href: "/#services", label: "Services" }, { href: "/#about", label: "About" }, { href: "/queue", label: "Live queue" }, { href: "/track", label: "Track booking" }];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return <header className="sticky top-0 z-50 border-b border-white/10 bg-[#10100f]/95 backdrop-blur">
    <div className="container flex h-[76px] items-center justify-between">
      <Link href="/" className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-full border border-[#c9a66b]/60 text-[#c9a66b]"><Scissors size={19}/></span>
        <span><span className="block text-sm font-black tracking-[.19em]">ZITHAS</span><span className="block text-[9px] tracking-[.32em] text-[#c9a66b]">BARBERSHOP</span></span>
      </Link>
      <nav className="hidden items-center gap-8 text-sm text-[#c4c0b7] md:flex">
        {links.map(l => <Link key={l.href} href={l.href} className="transition hover:text-[#c9a66b]">{l.label}</Link>)}
      </nav>
      <div className="hidden md:block"><Link className="gold-button rounded-full px-5 py-3 text-sm font-bold" href="/book">Book appointment</Link></div>
      <button className="md:hidden" aria-label="Toggle navigation" onClick={() => setOpen(!open)}>{open ? <X/> : <Menu/>}</button>
    </div>
    {open && <nav className="container grid gap-4 border-t border-white/10 py-5 md:hidden">{links.map(l => <Link onClick={() => setOpen(false)} key={l.href} href={l.href}>{l.label}</Link>)}<Link className="gold-text" href="/book">Book appointment →</Link></nav>}
  </header>;
}
