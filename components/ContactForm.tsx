"use client";

import { useCallback, useState } from "react";

const MESSAGE_MAX = 600;

function SpeechBubbleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M10 8h32c2.2 0 4 1.8 4 4v18c0 2.2-1.8 4-4 4h-14l-10 8v-8h-8c-2.2 0-4-1.8-4-4V12c0-2.2 1.8-4 4-4z"
        fill="currentColor"
        opacity={0.95}
      />
      <circle cx="18" cy="20" r="2" fill="#001021" opacity={0.35} />
      <circle cx="24" cy="20" r="2" fill="#001021" opacity={0.35} />
      <circle cx="30" cy="20" r="2" fill="#001021" opacity={0.35} />
    </svg>
  );
}

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">(
    "idle",
  );
  const [statusText, setStatusText] = useState("");

  const msgLen = message.length;

  const onSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setStatusText("");

      const body = {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        subject: subject.trim(),
        message: message.slice(0, MESSAGE_MAX).trim(),
      };

      if (!body.name || !body.email || !body.subject || !body.message) {
        setStatus("err");
        setStatusText("Please fill in name, email, subject, and message.");
        return;
      }

      setStatus("loading");

      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        if (!res.ok) {
          setStatus("err");
          setStatusText(
            data.error || "Something went wrong. Please try again later.",
          );
          return;
        }
        setStatus("ok");
        setStatusText("Thanks — we received your message.");
        setName("");
        setEmail("");
        setPhone("");
        setSubject("");
        setMessage("");
      } catch {
        setStatus("err");
        setStatusText("Network error. Check your connection and try again.");
      }
    },
    [name, email, phone, subject, message],
  );

  return (
    <div className="contactFormWrap">
      <div className="contactIntro">
        <SpeechBubbleIcon className="contactIntroIcon" />
        <div className="contactIntroText">
          <h2>Let&apos;s talk</h2>
          <p>
            Tell us a little about your context and we&apos;ll follow up by
            email.
          </p>
        </div>
      </div>

      <form className="contactForm" onSubmit={onSubmit} noValidate>
        <div className="contactField">
          <label htmlFor="contact-name">Name</label>
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            maxLength={120}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="contactField">
          <label htmlFor="contact-email">Email</label>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            maxLength={254}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="contactField">
          <label htmlFor="contact-phone">Phone</label>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            maxLength={40}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="contactField">
          <label htmlFor="contact-subject">Subject</label>
          <input
            id="contact-subject"
            name="subject"
            type="text"
            maxLength={200}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
        </div>
        <div className="contactField">
          <label htmlFor="contact-message">Message</label>
          <textarea
            id="contact-message"
            name="message"
            maxLength={MESSAGE_MAX}
            value={message}
            onChange={(e) => setMessage(e.target.value.slice(0, MESSAGE_MAX))}
            required
          />
          <div className="contactCharCount">
            {msgLen} / {MESSAGE_MAX}
          </div>
        </div>

        <button
          type="submit"
          className="contactSubmit"
          disabled={status === "loading"}
        >
          {status === "loading" ? "Sending…" : "Submit"}
        </button>

        {status !== "idle" ? (
          <p
            className={`contactFormStatus ${
              status === "ok" ? "isOk" : status === "err" ? "isError" : ""
            }`}
            role="status"
          >
            {statusText}
          </p>
        ) : null}
      </form>
    </div>
  );
}
