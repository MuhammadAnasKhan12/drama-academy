/** Booking reference shown to parents, e.g. "DK-7Q2M4X". No 0/O/1/I to avoid confusion. */
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function newReference() {
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  return `DK-${Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("")}`;
}

export const newId = () => crypto.randomUUID();
