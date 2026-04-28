import { NextResponse } from "next/server";
import { Resend } from "resend";

const MESSAGE_MAX = 600;

function clip(s: string, max: number) {
  return s.trim().slice(0, max);
}

export async function POST(req: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "Email is not configured yet (missing RESEND_API_KEY on the server).",
      },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  const b = body as Record<string, unknown>;
  const name = clip(String(b.name ?? ""), 120);
  const email = clip(String(b.email ?? ""), 254);
  const phone = clip(String(b.phone ?? ""), 40);
  const subject = clip(String(b.subject ?? ""), 200);
  const message = clip(String(b.message ?? ""), MESSAGE_MAX);

  if (!name || !email || !subject || !message) {
    return NextResponse.json(
      { error: "Name, email, subject, and message are required." },
      { status: 400 },
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
  }

  const to = process.env.CONTACT_TO_EMAIL;
  if (!to) {
    return NextResponse.json(
      { error: "Missing CONTACT_TO_EMAIL for inbound messages." },
      { status: 503 },
    );
  }

  const from =
    process.env.RESEND_FROM_EMAIL?.trim() ||
    "Converent Website <onboarding@resend.dev>";

  const text = [
    `Name: ${name}`,
    `Email: ${email}`,
    phone ? `Phone: ${phone}` : null,
    "",
    `Subject: ${subject}`,
    "",
    message,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: [to],
      replyTo: email,
      subject: `[Converent] ${subject}`,
      text,
    });

    if (error) {
      return NextResponse.json(
        { error: error.message || "Resend rejected the message." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Send failed.";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
