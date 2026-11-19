import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function db() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const required = ["reference","customer_name","phone","service_name","barber_name","booking_date","booking_time","price"];
    if (required.some(k => body[k] === undefined || body[k] === null || body[k] === "")) {
      return NextResponse.json({ error: "Please complete all required booking fields." }, { status: 400 });
    }
    if (String(body.customer_name).length > 100 || String(body.phone).length > 30) {
      return NextResponse.json({ error: "Some fields are too long." }, { status: 400 });
    }
    const client = db();
    if (!client) return NextResponse.json({ error: "Database is not configured yet. Add Supabase environment variables and run the SQL setup in supabase/schema.sql." }, { status: 503 });
    const { data, error } = await client.from("bookings").insert({
      reference: body.reference, customer_name: body.customer_name, phone: body.phone,
      service_name: body.service_name, barber_name: body.barber_name,
      booking_date: body.booking_date, booking_time: body.booking_time,
      status: "pending", price: body.price, notes: body.notes || null
    }).select("reference").single();
    if (error) throw error;
    return NextResponse.json({ reference: data.reference }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to create booking." }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const client = db();
  if (!client) return NextResponse.json({ error: "Database is not configured. Connect Supabase first." }, { status: 503 });
  const reference = request.nextUrl.searchParams.get("reference");
  if (reference) {
    const { data, error } = await client.from("bookings").select("reference,customer_name,service_name,barber_name,booking_date,booking_time,status").eq("reference", reference.toUpperCase()).single();
    if (error || !data) return NextResponse.json({ error: "No booking was found with that reference." }, { status: 404 });
    return NextResponse.json({ booking: data });
  }
  const { data, error } = await client.from("bookings").select("*").order("booking_date", { ascending: true }).order("booking_time", { ascending: true }).limit(100);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ bookings: data || [] });
}

export async function PATCH(request: NextRequest) {
  const client = db();
  if (!client) return NextResponse.json({ error: "Database is not configured." }, { status: 503 });
  const { id, status } = await request.json();
  const allowed = ["pending","confirmed","in_progress","completed","cancelled"];
  if (!id || !allowed.includes(status)) return NextResponse.json({ error: "Invalid update." }, { status: 400 });
  const { error } = await client.from("bookings").update({ status }).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
