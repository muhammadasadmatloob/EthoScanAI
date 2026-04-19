import { GoogleGenAI } from "@google/genai";

if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
  throw new Error("NEXT_PUBLIC_GEMINI_API_KEY is not set");
}

export const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });

export const ETHICAL_AUDIT_PROMPT = `
You are a legal and UX expert specializing in ethical interface design.
Analyze the provided screenshot of a website or UI component.
Identify any "Dark Patterns" or deceptive UI patterns, specifically focusing on:
1. Misdirection (distracting users from the truth)
2. Social Proof Manipulation (fake testimonials, fake countdowns, fake "10 people are looking at this")
3. Forced Action (making it hard to cancel, mandatory subscriptions hidden in small print)
4. Hidden Costs (extras added at the final step)
5. Forced Continuity (free trials that start charging without warning)

Your output must be a JSON object with the following structure:
{
  "score": number (0-100, where 100 is perfectly ethical and 0 is extremely deceptive),
  "issue_list": Array<{
    "type": string (e.g., "Misdirection", "Fake Urgency", "Forced Continuity"),
    "severity": "low" | "medium" | "high",
    "description": string (one sentence explaining what is wrong),
    "recommendation": string (one sentence on how to fix it)
  }>,
  "summary": string (a high-level summary of the site's ethical status)
}
`;
