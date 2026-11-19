import { BookingForm } from "@/components/booking-form";
export default function BookPage() {
  return <main className="container py-16 md:py-24"><div className="mx-auto max-w-3xl"><p className="eyebrow">Make it official</p><h1 className="mt-3 text-4xl font-black md:text-5xl">Book your <span className="gold-text">appointment.</span></h1><p className="mt-4 leading-7 text-[#a7a39b]">Choose your service, preferred barber and a time. We'll confirm your request.</p><div className="mt-10"><BookingForm/></div></div></main>;
}
