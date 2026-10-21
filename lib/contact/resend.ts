import "server-only";
import { Resend } from "resend";
import type { Mailer, StoredMessage } from "./types";

// The notification email to me: plain text only, so nothing the sender
// typed is ever interpreted as HTML. Reply goes straight to the sender.

export function emailText(message: StoredMessage): string {
  return [
    "New message from the portfolio contact form.",
    "",
    `Name: ${message.name}`,
    `Email: ${message.email}`,
    `Language: ${message.locale}`,
    `Time: ${message.time}`,
    `ID: ${message.id}`,
    "",
    "---",
    "",
    message.message,
  ].join("\n");
}

export function createResendMailer(config: { apiKey: string; from: string; to: string }): Mailer {
  const resend = new Resend(config.apiKey);
  return {
    async send(message) {
      const { error } = await resend.emails.send({
        from: config.from,
        to: config.to,
        replyTo: message.email,
        // The schema rejects control characters in the name, so it can't break the header.
        subject: `Portfolio: message from ${message.name}`,
        text: emailText(message),
      });
      if (error) throw new Error(`Resend ${error.name}: ${error.message}`);
    },
  };
}
