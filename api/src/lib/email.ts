import { buildCatalogue, money } from "~/lib/booking/catalogue";
import { site } from "~/lib/site";
import type { Env } from "../env";
import type { FullBooking } from "./bookings";

/**
 * Emails via Resend (https://resend.com). Only the academy is emailed (a notification for each new
 * paid booking) — parents are not sent confirmation emails. Without RESEND_API_KEY (e.g. locally)
 * the email is printed to the terminal instead.
 */
async function send(env: Env, to: string, subject: string, html: string) {
  if (!env.RESEND_API_KEY) {
    console.log(`[email not sent — no RESEND_API_KEY] to=${to} subject="${subject}"`);
    return;
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: env.EMAIL_FROM, to: [to], subject, html, reply_to: site.contact.email }),
  });
  if (!res.ok) console.error(`Resend error ${res.status}: ${await res.text()}`);
}

const esc = (s: string) => s.replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]!);

/** Item titles/dates; uses a past date so finished clubs still resolve */
function titles() {
  const items = buildCatalogue(new Date("2000-01-01"));
  return new Map(items.map((i) => [i.id, `${i.title} (${i.when}, ${i.time}, ${site.venues[i.venue].name})`]));
}

function linesTable(b: FullBooking) {
  const t = titles();
  const rows = b.children
    .flatMap((c) =>
      c.items.map((id) => {
        const price = b.lines.find((l) => l.childId === c.id && l.itemId === id)?.pricePence ?? 0;
        return `<tr><td style="padding:6px 0">${esc(c.firstName)} — ${esc(t.get(id) ?? id)}</td><td style="padding:6px 0;text-align:right">${money(price)}</td></tr>`;
      }),
    )
    .join("");
  return `<table style="width:100%;border-collapse:collapse;font-size:15px">${rows}<tr><td style="padding-top:10px;border-top:2px solid #1a1630"><strong>Total paid</strong></td><td style="padding-top:10px;border-top:2px solid #1a1630;text-align:right"><strong>${money(b.totalPence)}</strong></td></tr></table>`;
}

const wrap = (body: string) =>
  `<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#1a1630;line-height:1.5">${body}<p style="color:#4a4566;font-size:13px;margin-top:28px">${esc(site.name)} · ${esc(site.contact.email)} · ${esc(site.contact.phone)}</p></div>`;

export function sendAdminNotification(env: Env, b: FullBooking) {
  const needs = b.children
    .filter((c) => !/^\s*(none|n\/a|no)\.?\s*$/i.test(c.needs))
    .map((c) => `<li><strong>${esc(c.firstName)}:</strong> ${esc(c.needs)}</li>`)
    .join("");
  const html = wrap(`
    <h1 style="font-size:20px">New booking ${esc(b.reference)} — ${money(b.totalPence)}</h1>
    <p><strong>${esc(b.parent.firstName)} ${esc(b.parent.lastName)}</strong> · ${esc(b.parent.phone)} · ${esc(b.parent.email)}</p>
    ${linesTable(b)}
    ${needs ? `<p><strong>Allergies / needs:</strong></p><ul>${needs}</ul>` : ""}
    <p>Full details are in the admin area.</p>`);
  return send(env, env.ADMIN_NOTIFY_EMAIL, `New booking ${b.reference}`, html);
}
