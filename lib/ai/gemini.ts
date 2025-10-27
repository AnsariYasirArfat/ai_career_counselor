import { Content, GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from "./prompts";

type Role = "USER" | "ASSISTANT";

export type PlainMessage = {
  role: Role;
  content: string;
};
const MAX_CHARS = 50000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
const DEFAULT_MODEL = process.env.AI_MODEL;

const genAI = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

function getRecentContents(
  messages: PlainMessage[],
  maxChars: number = MAX_CHARS
): Content[] {
  let accumulatedChars = 0;
  const contents: Content[] = [];

  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i];
    const role = msg.role === "USER" ? "user" : "model";
    const parts = [{ text: msg.content ?? "" }];
    accumulatedChars += msg.content.length;

    if (accumulatedChars > maxChars) {
      break;
    }
    contents.push({
      role,
      parts,
    });
  }

  return contents.reverse();
}

export async function generateCareerReply(
  messages: PlainMessage[],
  model: string = DEFAULT_MODEL!
): Promise<string> {
  if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is missing");

  const contents = getRecentContents(messages);

  try {
    const response = await genAI.models.generateContent({
      model,
      config: {
        systemInstruction: { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
      },
      contents,
    });

    const text = response?.text || "";
    return (
      text.trim() ||
      "I’m here to help. Could you share a bit more about your goals or current situation?"
    );
  } catch (error) {
    console.error("AI Generation failed:: ", error);
    throw new Error("AI service temporarily unavailable. Please try again.");
  }
}

export async function* generateCareerStreamResponse(
  messages: PlainMessage[],
  model: string = DEFAULT_MODEL!
): AsyncGenerator<string, void, unknown> {
  if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is missing");
  const contents = getRecentContents(messages);

  try {
    const response = await genAI.models.generateContentStream({
      model,
      config: {
        systemInstruction: { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
      },
      contents,
    });

    for await (const chunk of response) {
      if (chunk.text) {
        yield chunk.text;
      }
    }
  } catch (error) {
    console.error("AI streaming failed:: ", error);
    throw new Error("AI service temporarily unavailable. Please try again.");
  }
}

export async function generateAutoSessionTitle(
  userFirstInput: string,
  model: string = DEFAULT_MODEL!
) {
  if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is missing");
  const TITLE_PROMPT = `You are a title generator for AI career counseling sessions.
  
  Given the user's first message, create a concise, engaging session title (3-8 words) that captures the main topic.
  
  Guidelines:
  - If career-related (e.g., jobs, skills, resume, interviews, goals), make it descriptive and motivational (e.g., "Tech Career Path Exploration" for "How do I start in tech?").
  - If non-career (e.g., general chat), create a neutral, open title redirecting to careers (e.g., "Career Guidance Kickoff" for "Hi, what's up?").
  - Keep it short, professional, no questions, use keywords from message.
  - Always career-focused if possible—assume context is counseling.
  
  User message: "${userFirstInput}"
  
  Output ONLY the title, nothing else.`;
  
  try {
    const response = await genAI.models.generateContent({
      model,
      contents: TITLE_PROMPT.trim(),
    });

    const title = response.text || "New Career Counseling Session";
    return title;
  } catch (error) {
    console.error("Error generating session title:", error);
    return "New Career Counseling Session";
  }
}
