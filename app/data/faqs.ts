/**
 * ✏️ Frequently asked questions. `home: true` shows a question on the home page too.
 */
import type { Faq } from "./types";

export const faqs: (Faq & { home?: boolean })[] = [
  {
    category: "General",
    home: true,
    q: "My child has never done drama. Is that OK?",
    a: "Absolutely — most of our students started with no experience at all. Classes are built around games and teamwork, so nobody is put on the spot. Shy children are very welcome; it's often the quiet ones who surprise us most.",
  },
  {
    category: "Classes",
    home: true,
    q: "How does the free trial work?",
    a: "Fill in the short form and we'll get back to you within two working days to book your child into their age group. Come along, join in, and only sign up for the term if they love it. No payment details needed.",
  },
  {
    category: "Safety",
    home: true,
    q: "Are your teachers DBS-checked?",
    a: "Yes. Every member of our team holds an enhanced DBS certificate, completes safeguarding training every year, and most hold paediatric first aid qualifications. We have a named Designated Safeguarding Lead.",
  },
  {
    category: "Classes",
    home: true,
    q: "What if we miss a session or join mid-term?",
    a: "You're welcome to join at any point — we'll simply charge for the weeks remaining. We don't refund missed sessions, but we always help children catch up on anything they've missed.",
  },
  {
    category: "Camps",
    home: true,
    q: "Can I book individual days at holiday camp?",
    a: "Yes, single days can be booked when spaces allow, though most children love staying for the whole week so they can perform in the Friday showcase.",
  },
  {
    category: "Shows",
    home: true,
    q: "Does every child get to be in the show?",
    a: "Every child who'd like to perform gets a part — and a moment to shine. Lines are matched to each child's age and confidence, so nobody feels overwhelmed.",
  },
  {
    category: "Classes",
    q: "What should my child wear?",
    a: "Comfy clothes they can move in, and trainers or bare feet (we'll let you know). Long hair tied back, please. Please label everything — you'd be amazed how many identical hoodies we find!",
  },
  {
    category: "General",
    q: "Where do I drop off and pick up?",
    a: "Please bring your child to the main hall door, where a teacher will sign them in. At the end of class we only release children to a parent or a named adult on your registration form.",
  },
  {
    category: "General",
    q: "Do you offer sibling discounts?",
    a: "Yes — 10% off for each additional brother or sister on termly classes and holiday camps.",
  },
  {
    category: "Safety",
    q: "Can I use childcare vouchers or Tax-Free Childcare for camps?",
    a: "[PLACEHOLDER] Confirm whether you're Ofsted-registered for Tax-Free Childcare and update this answer.",
  },
];
