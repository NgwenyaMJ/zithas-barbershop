import Link from "next/link";
export function SiteFooter() {
  return <footer className="border-t border-white/10 bg-[#0b0b0a] py-10">
    <div className="container flex flex-col justify-between gap-6 text-sm text-[#a7a39b] md:flex-row md:items-center">
      <div><p className="font-bold tracking-[.2em] text-white">ZITHAS BARBERSHOP</p><p className="mt-2">Sharp cuts. Good energy. Every time.</p></div>
      <div className="flex flex-wrap gap-6"><Link href="/book">Book</Link><Link href="/queue">Queue</Link><Link href="/admin">Staff portal</Link></div>
      <p>© {new Date().getFullYear()} Zithas Barbershop</p>
    </div>
  </footer>;
}
