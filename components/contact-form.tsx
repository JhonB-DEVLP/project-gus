"use client";

import { useActionState, useEffect, useRef, useState, type ReactNode } from "react";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import { EMAIL_MAX, MESSAGE_MAX, NAME_MAX } from "@/lib/contact/limits";
import { initialContactState, type ContactState } from "@/lib/contact/state";
import { isContactField, type ContactField } from "@/lib/contact/types";
import { buttonBase, buttonClass } from "./button";

// Client because of useActionState (pending, field errors and success
// without a reload). Without JS the form still posts to the action and the
// page renders the returned state.

type ContactFormProps = {
  action: (state: ContactState, formData: FormData) => Promise<ContactState>;
  copy: Dictionary["contact"];
};

const label = "font-mono text-label uppercase";
const control = "w-full rounded-control border bg-surface px-3 text-body text-fg";
// Error: a 2px red edge drawn with a ring, so the box doesn't change size.
const controlState = (invalid: boolean) => (invalid ? "border-error ring-1 ring-error" : "border-field");
const ids: Record<ContactField, string> = { name: "c-name", email: "c-email", message: "c-message" };

export function ContactForm({ action, copy }: ContactFormProps) {
  const [state, formAction, pending] = useActionState(action, initialContactState);
  const summaryRef = useRef<HTMLDivElement>(null);
  const result = state.result;
  const fields = result && !result.ok && result.error === "validation" ? result.fields : {};

  // After a failed validation, focus the summary so it is read first.
  useEffect(() => {
    if (state.result && !state.result.ok && state.result.error === "validation") summaryRef.current?.focus();
  }, [state]);

  const errorFor = (field: ContactField): string | undefined => {
    const key = fields[field];
    return isContactField(key) ? copy.err[key] : undefined;
  };
  const invalid = (["name", "email", "message"] as const).filter((field) => errorFor(field));

  return (
    <div className="flex flex-col gap-6">
      {/* Always in the DOM, so the success is announced when it appears. */}
      <div role="status">
        {result?.ok ? (
          <Notice tone="ok" code={copy.sent.code} title={copy.sent.title}>
            {copy.sent.text.replace("{name}", state.sentName)}
          </Notice>
        ) : null}
      </div>

      {result && !result.ok && result.error === "rate_limited" ? (
        <div role="alert">
          <Notice tone="error" code={copy.rateLimited.code} title={copy.rateLimited.title}>
            {copy.rateLimited.text.replace("{minutes}", String(Math.max(1, Math.ceil(result.retryAfterSeconds / 60))))}
          </Notice>
        </div>
      ) : null}

      {result && !result.ok && result.error === "server" ? (
        <div role="alert">
          <Notice tone="error" code={copy.server.code} title={copy.server.title}>
            {copy.server.text}
          </Notice>
        </div>
      ) : null}

      {invalid.length > 0 ? (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          aria-labelledby="c-summary"
          className="flex flex-col gap-2 rounded-control border border-error bg-surface p-4"
        >
          <p id="c-summary" className="font-mono text-label text-error uppercase">
            {copy.err.code} · {copy.err.summary}
          </p>
          <ul className="flex flex-col gap-1">
            {invalid.map((field) => (
              <li key={field}>
                <a href={`#${ids[field]}`} className="underline underline-offset-4 hover:text-error">
                  {errorFor(field)}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {/* Remounts on every reply, so the fields show what the action returned:
          the text after an error, empty after a success. */}
      <form key={state.version} action={formAction} noValidate className="flex flex-col gap-5">
        <Field id={ids.name} label={copy.field.name} error={errorFor("name")} errorCode={copy.err.code}>
          {(describedBy) => (
            <input
              id={ids.name}
              name="name"
              type="text"
              autoComplete="name"
              required
              maxLength={NAME_MAX}
              defaultValue={state.values.name}
              aria-invalid={errorFor("name") ? true : undefined}
              aria-describedby={describedBy}
              className={`${control} min-h-12 ${controlState(Boolean(errorFor("name")))}`}
            />
          )}
        </Field>

        <Field id={ids.email} label={copy.field.email} error={errorFor("email")} errorCode={copy.err.code}>
          {(describedBy) => (
            <input
              id={ids.email}
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              required
              maxLength={EMAIL_MAX}
              placeholder={copy.field.emailPlaceholder}
              defaultValue={state.values.email}
              aria-invalid={errorFor("email") ? true : undefined}
              aria-describedby={describedBy}
              className={`${control} min-h-12 placeholder:text-muted ${controlState(Boolean(errorFor("email")))}`}
            />
          )}
        </Field>

        <MessageField
          copy={copy}
          error={errorFor("message")}
          defaultValue={state.values.message}
          className={`${control} py-3 leading-normal resize-y ${controlState(Boolean(errorFor("message")))}`}
        />

        {/* Honeypot: hidden from people and screen readers, filled by bots. */}
        <div aria-hidden="true" className="sr-only">
          <label htmlFor="c-company">{copy.field.company}</label>
          <input id="c-company" name="company" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
        </div>

        <button
          type="submit"
          disabled={pending}
          className={`min-h-13 w-full lg:w-auto lg:self-start ${pending ? `${buttonBase} border-transparent bg-rule text-fg` : buttonClass("solid")}`}
        >
          {pending ? copy.sending : copy.submit}
        </button>
      </form>
    </div>
  );
}

function Field({
  id,
  label: text,
  error,
  errorCode,
  extra,
  children,
}: {
  id: string;
  label: string;
  error: string | undefined;
  errorCode: string;
  extra?: { id: string; node: ReactNode };
  children: (describedBy: string | undefined) => ReactNode;
}) {
  const errorId = `${id}-err`;
  const describedBy = [error ? errorId : null, extra?.id ?? null].filter(Boolean).join(" ") || undefined;
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className={label}>
        {text}
      </label>
      {children(describedBy)}
      {error ? (
        <p id={errorId} className="font-mono text-label text-error">
          {errorCode} · {error}
        </p>
      ) : null}
      {extra?.node}
    </div>
  );
}

// The message field with its "62 / 2000" counter.
function MessageField({
  copy,
  error,
  defaultValue,
  className,
}: {
  copy: Dictionary["contact"];
  error: string | undefined;
  defaultValue: string;
  className: string;
}) {
  const [length, setLength] = useState(defaultValue.length);
  const id = ids.message;
  const counterId = `${id}-count`;
  const counter = (
    <p id={counterId} className="text-right font-mono text-label text-muted tabular-nums">
      {copy.count.replace("{count}", String(length)).replace("{max}", String(MESSAGE_MAX))}
    </p>
  );

  return (
    <Field id={id} label={copy.field.message} error={error} errorCode={copy.err.code} extra={{ id: counterId, node: counter }}>
      {(describedBy) => (
        <textarea
          id={id}
          name="message"
          rows={5}
          required
          maxLength={MESSAGE_MAX}
          defaultValue={defaultValue}
          onChange={(event) => setLength(event.currentTarget.value.length)}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={className}
        />
      )}
    </Field>
  );
}

function Notice({ tone, code, title, children }: { tone: "ok" | "error"; code: string; title: string; children: ReactNode }) {
  const color = tone === "ok" ? "border-accent text-accent" : "border-error text-error";
  return (
    <div className={`flex flex-col gap-2 rounded-control border bg-surface p-4 ${color}`}>
      <p className="font-mono text-label uppercase">
        {code} · {title}
      </p>
      <p className="text-fg">{children}</p>
    </div>
  );
}
