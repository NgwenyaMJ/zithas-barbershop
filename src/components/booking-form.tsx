"use client";
import { useMemo, useState } from "react";
import { services, barbers } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

type Booking = { reference: string; customer_name: string; phone: string; service_name: string; barber_name: string; booking_date: string; booking_time: string; status: string; price: number };

export function BookingForm() {
  const [serviceId, setServiceId] = useState(services[0].id);
  const [barberId, setBarberId] = useState("any");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("10:00");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");
  const [reference, setReference] = useState("");
  const service = useMemo(() => services.find(s => s.id === serviceId)!, [serviceId]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    const ref = `ZTH-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const booking: Booking & { notes: string } = {
      reference: ref, customer_name: name.trim(), phone: phone.trim(),
      service_name: service.name, barber_name: barbers.find(b => b.id === barberId)?.name || "Any available barber",
      booking_date: date, booking_time: time, status: "pending", price: service.price, notes
    };
    try {
      const response = await fetch("/api/bookings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(booking) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not save booking");
      setReference(data.reference || ref);
      setMessage("Your booking request has been received.");
      setName(""); setPhone(""); setNotes("");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return <form onSubmit={submit} className="panel rounded-2xl p-6 md:p-8">
    {reference && <div className="mb-6 rounded-xl border border-[#c9a66b]/40 bg-[#c9a66b]/10 p-4"><p className="text-sm text-[#c9a66b]">Your booking reference</p><p className="mt-1 text-2xl font-black tracking-wider">{reference}</p><p className="mt-2 text-sm text-[#c4c0b7]">Keep this reference to track your booking.</p></div>}
    {message && !reference && <p role="status" className="mb-4 rounded-lg border border-[#c9a66b]/30 p-3 text-sm">{message}</p>}
    <div className="grid gap-5 md:grid-cols-2">
      <label className="text-sm text-[#c4c0b7]">Your name<input className="field mt-2" required minLength={2} value={name} onChange={e=>setName(e.target.value)} placeholder="Full name"/></label>
      <label className="text-sm text-[#c4c0b7]">Mobile number<input className="field mt-2" required value={phone} onChange={e=>setPhone(e.target.value)} placeholder="e.g. 071 234 5678"/></label>
      <label className="text-sm text-[#c4c0b7]">Choose a service<select className="field mt-2" value={serviceId} onChange={e=>setServiceId(e.target.value)}>{services.map(s=><option key={s.id} value={s.id}>{s.name} — {formatCurrency(s.price)}</option>)}</select></label>
      <label className="text-sm text-[#c4c0b7]">Preferred barber<select className="field mt-2" value={barberId} onChange={e=>setBarberId(e.target.value)}>{barbers.map(b=><option key={b.id} value={b.id}>{b.name}</option>)}</select></label>
      <label className="text-sm text-[#c4c0b7]">Date<input className="field mt-2" type="date" required min={new Date().toISOString().slice(0,10)} value={date} onChange={e=>setDate(e.target.value)}/></label>
      <label className="text-sm text-[#c4c0b7]">Preferred time<select className="field mt-2" value={time} onChange={e=>setTime(e.target.value)}>{["09:00","09:30","10:00","10:30","11:00","11:30","12:00","12:30","13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30"].map(t=><option key={t}>{t}</option>)}</select></label>
    </div>
    <label className="mt-5 block text-sm text-[#c4c0b7]">Additional notes <textarea className="field mt-2 min-h-24" value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Any style preferences? (optional)"/></label>
    <div className="mt-6 flex flex-wrap items-center justify-between gap-4"><p className="text-sm text-[#a7a39b]">Estimated total <strong className="ml-2 text-lg text-white">{formatCurrency(service.price)}</strong></p><button className="gold-button rounded-full px-7 py-3 font-bold">Request booking</button></div>
    <p className="mt-4 text-xs leading-5 text-[#858078]">A booking is pending until confirmed by the barbershop. Do not make payment through this demo.</p>
  </form>;
}
