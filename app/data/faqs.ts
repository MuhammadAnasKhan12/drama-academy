/**
 * ✏️ Frequently asked questions. `home: true` shows a question on the home page too.
 */
import type { Faq } from "./types";

export const faqs: (Faq & { home?: boolean })[] = [
  {
    category: "General",
    home: true,
    q: "My child has never done drama. Is that OK?",
    a: "Absolutely — most of our children started with no experience at all. Sessions are built around games, roleplay and teamwork, so nobody is put on the spot. Shy children are very welcome; it's often the quiet ones who surprise us most.",
  },
  {
    category: "Classes",
    home: true,
    q: "How much is the weekly class and how do I pay?",
    a: "The Wednesday Drama Club (4–5pm, ages 4–11) is £10.50 per session. You book the rest of the term online and pay for the sessions that are left — so joining mid-term is easy and you only pay for the weeks your child attends.",
  },
  {
    category: "Camps",
    home: true,
    q: "How much are the holiday clubs?",
    a: "Holiday clubs work out at £25 per day: half-term courses are 3 days for £75 and Easter and summer courses are 5 days for £125. Clubs run every school holiday except Christmas and are booked as a full course.",
  },
  {
    category: "Camps",
    home: true,
    q: "Where are the holiday clubs held?",
    a: "Holiday clubs take place at Canterbury Academy, Knight Avenue, Canterbury CT2 8QA. If anything changes we'll let you know in good time. The weekly Wednesday class is at Ash Village Hall.",
  },
  {
    category: "Safety",
    home: true,
    q: "Are your teachers DBS-checked?",
    a: "Yes. Every member of our team holds an enhanced DBS certificate and completes regular safeguarding training. We have a named Designated Safeguarding Lead.",
  },
  {
    category: "Shows",
    home: true,
    q: "Does every child get to perform?",
    a: "Yes! The autumn and summer terms end with a live performance, and every holiday club finishes with a showcase. Lines are matched to each child's age and confidence, so nobody feels overwhelmed.",
  },
  {
    category: "General",
    q: "Can I book for more than one child?",
    a: "Yes — add each child in the booking form and choose which classes or clubs each one is coming to. You'll pay for everything in one go.",
  },
  {
    category: "General",
    q: "What do you need to know about my child?",
    a: "Their name, date of birth, any allergies or specific needs, and whether you're happy for photos of them to appear on our social media. We only use this to run sessions safely.",
  },
  {
    category: "Classes",
    q: "What should my child wear?",
    a: "Comfy clothes they can move in, and trainers. Long hair tied back, please — and label everything!",
  },
  {
    category: "General",
    q: "Do you run themed workshops?",
    a: "Yes, we run themed workshops throughout the year. Dates are added to the booking page as soon as they're announced.",
  },
  {
    category: "General",
    q: "What is your cancellation policy?",
    a: "[PLACEHOLDER] Add the refund and cancellation policy here (and in the Terms & Conditions).",
  },
];
