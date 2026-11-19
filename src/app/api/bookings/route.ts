import { NextRequest, NextResponse } from "next/server";
import {
  createServiceRoleClient,
  getStaffAuthorization,
  type StaffAuthorization
} from "@/lib/supabase/server";

function db() {
  return createServiceRoleClient();
}

const BOOKING_STATUSES = [
  "pending",
  "confirmed",
  "in_progress",
  "completed",
  "cancelled"
] as const;

type BookingStatus = (typeof BOOKING_STATUSES)[number];

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function staffErrorResponse(authorization: StaffAuthorization) {
  if (authorization.kind === "unauthenticated") {
    return NextResponse.json({ error: "Authentication is required." }, { status: 401 });
  }

  if (authorization.kind === "forbidden") {
    return NextResponse.json({ error: "You are not authorized for this operation." }, { status: 403 });
  }

  return NextResponse.json({ error: "Service is temporarily unavailable." }, { status: 503 });
}

function isValidStatus(value: unknown): value is BookingStatus {
  return typeof value === "string" && BOOKING_STATUSES.includes(value as BookingStatus);
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
    const { data, error } = await client
      .from("bookings")
      .select("customer_name,service_name,barber_name,booking_date,booking_time,status")
      .eq("reference", reference.toUpperCase())
      .single();

    if (error || !data) return NextResponse.json({ error: "No booking was found with that reference." }, { status: 404 });
    return NextResponse.json({ booking: data });
  }

  const authorization = await getStaffAuthorization();
  if (authorization.kind !== "authorized") {
    return staffErrorResponse(authorization);
  }

  const { data, error } = await client
    .from("bookings")
    .select("id,reference,customer_name,service_name,barber_name,booking_date,booking_time,status")
    .order("booking_date", { ascending: true })
    .order("booking_time", { ascending: true })
    .limit(100);

  if (error) {
    console.error("Unable to load staff bookings.", error);
    return NextResponse.json({ error: "Unable to load bookings." }, { status: 500 });
  }

  return NextResponse.json({ bookings: data || [] });
}

export async function PATCH(request: NextRequest) {
  const authorization = await getStaffAuthorization();
  if (authorization.kind !== "authorized") {
    return staffErrorResponse(authorization);
  }

  const client = db();
  if (!client) return NextResponse.json({ error: "Service is temporarily unavailable." }, { status: 503 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid update request." }, { status: 400 });
  }

  if (
    !body ||
    typeof body !== "object" ||
    !("id" in body) ||
    !("status" in body) ||
    typeof body.id !== "string" ||
    !UUID_PATTERN.test(body.id) ||
    !isValidStatus(body.status)
  ) {
    return NextResponse.json({ error: "Invalid update request." }, { status: 400 });
  }

  const { data, error } = await client
    .from("bookings")
    .update({ status: body.status })
    .eq("id", body.id)
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("Unable to update booking status.", error);
    return NextResponse.json({ error: "Unable to update booking." }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "Booking not found." }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
