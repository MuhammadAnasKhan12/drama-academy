#!/usr/bin/env node
/**
 * Makes an admin sign-in entry for the ADMIN_USERS secret (see api/src/lib/auth.ts).
 *
 *   npm run admin:user              asks for an email and password, prints  email:pbkdf2.…
 *   npm run admin:user -- --secret  prints a random SESSION_SECRET
 *
 * The password itself is never printed or saved — only its PBKDF2 hash.
 */
import { pbkdf2Sync, randomBytes } from "node:crypto";
import { createInterface } from "node:readline";

const ITERATIONS = 100_000; // the most Cloudflare Workers allow
const MIN_LENGTH = 10;

if (process.argv.includes("--secret")) {
  console.log(randomBytes(32).toString("base64url"));
  process.exit(0);
}

const email = (await ask("Admin email: ")).trim().toLowerCase();
if (!/^[^\s@:,]+@[^\s@:,]+\.[^\s@:,]+$/.test(email)) fail("That doesn't look like an email address.");

const password = await ask(`Password (at least ${MIN_LENGTH} characters, hidden): `, true);
if (password.length < MIN_LENGTH) fail(`Use at least ${MIN_LENGTH} characters.`);
if ((await ask("Type it again: ", true)) !== password) fail("The passwords don't match.");

const salt = randomBytes(16);
const key = pbkdf2Sync(password, salt, ITERATIONS, 32, "sha256");
const entry = `${email}:pbkdf2.${ITERATIONS}.${salt.toString("base64url")}.${key.toString("base64url")}`;

console.log(`
Admin entry for ${email}:

${entry}

Put it in ADMIN_USERS. For several admins, join their entries with commas (no spaces):
  local:       api/.dev.vars      ADMIN_USERS=entry1,entry2
  production:  npx wrangler secret put ADMIN_USERS --config api/wrangler.jsonc   (paste the whole list)
`);

function ask(question, hidden = false) {
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    if (hidden) {
      // Print the question, then swallow everything typed until Enter
      rl._writeToOutput = (s) => {
        if (s.includes(question)) rl.output.write(question);
        else if (s.includes("\n") || s.includes("\r")) rl.output.write("\n");
      };
    }
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
