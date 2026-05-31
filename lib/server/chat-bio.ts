import "server-only";

// Server-only long-form bio for the AI chat. NEVER imported by a client
// component. The `server-only` import above throws at build time if this
// file ends up bundled into client JS — defense in depth alongside the
// import discipline of only pulling this in from /api/chat.
//
// Write in first-person, conversational, declarative. Short paragraphs;
// the model will adapt the voice but cannot invent facts that aren't here.
// Each section is a separate export so updates land in one place.

/**
 * Origin + trajectory. Where you grew up / studied, how you got into
 * software, the throughline from then → now. Keep to 2–4 short paragraphs.
 *
 * Example beats (delete + replace with your own):
 *   - "I grew up in {place}, started coding when {moment}."
 *   - "First real project that taught me {lesson}."
 *   - "Joined FactSet as an intern in {year}; promoted to SWE III in 3 years."
 */
export const BACKGROUND = `
TODO: write your origin story here.
`.trim();

/**
 * How you think about your craft. Opinions, defaults, rules-of-thumb.
 * This is the section that makes the chat feel like *you* and not a
 * generic résumé. Don't be neutral — pick fights you care about.
 *
 * Example beats:
 *   - "I default to {language/framework} because {reason}."
 *   - "I'd rather ship a small thing end-to-end than design a big thing on paper."
 *   - "I write tests when {condition}, not because someone said to."
 */
export const WORK_STYLE = `
TODO: write your engineering philosophy / working style here.
`.trim();

/**
 * Deeper context on each project than what fits in lib/projects.ts.
 * The "why I built this", the part that didn't work, what you'd change.
 * This is what visitors will actually ask about.
 *
 * Format suggestion — one block per project, with a heading:
 *
 *   ## Chat with PDF
 *   Why I built it, what went wrong with the first cut, current users / revenue,
 *   what's coming in v2.
 *
 *   ## VoiceFlow
 *   …
 */
export const PROJECTS_DETAIL = `
TODO: write deeper context for each project here.
`.trim();

/**
 * Hiring availability + the kind of role/team you're looking for.
 * The AI will use this to answer "are you hiring?" / "are you looking?"
 * questions accurately. Be specific — vague answers waste recruiter time.
 *
 * Example beats:
 *   - "I'm at FactSet full-time; selectively open to {founder/staff/etc} roles."
 *   - "Most interested in: {AI infra, voice, dev tools, …}"
 *   - "Not interested in: {bigco frontend, ads, crypto, …}"
 *   - "Preferred contact: email — replies within {N} hours."
 */
export const HIRING = `
TODO: write your hiring availability + ideal role here.
`.trim();

/**
 * Opinions, hot takes, hobbies, things you read / watch / build for fun.
 * Optional but high-leverage — it's what makes a conversation feel human
 * after the visitor is done with the résumé questions.
 *
 * Example beats:
 *   - "I think {opinion about an industry topic}."
 *   - "Currently reading {book} for the {Nth} time."
 *   - "Outside code I {hobby}; it teaches me {thing}."
 *   - "Favorite engineering blog: {url}."
 */
export const OPINIONS = `
TODO: write opinions / hobbies / reading here.
`.trim();

// Sections the knowledge composer concatenates, in display order.
// Reorder freely; the model only sees the resulting block.
export const BIO_SECTIONS: { heading: string; body: string }[] = [
  { heading: "Background", body: BACKGROUND },
  { heading: "How I work", body: WORK_STYLE },
  { heading: "Projects (deeper context)", body: PROJECTS_DETAIL },
  { heading: "Hiring availability", body: HIRING },
  { heading: "Opinions & hobbies", body: OPINIONS },
];
