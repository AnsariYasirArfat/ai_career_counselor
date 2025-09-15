import { GoogleGenerativeAI } from "@google/generative-ai";

type Role = "USER" | "ASSISTANT";

export type PlainMessage = {
  role: Role;
  content: string;
};

const DEFAULT_MODEL = process.env.AI_MODEL || "gemini-1.5-flash";
const TIMEOUT_MS = Number(process.env.AI_TIMEOUT_MS || 20000);

const SYSTEM_PROMPT = `
You are an expert, empathetic career counselor AI assistant.
- Give clear, actionable guidance on careers, skills, learning paths, and job search strategies.
- Ask clarifying questions when details are missing.
- Keep answers concise and practical.
`;

export async function generateCareerReply(
  messages: PlainMessage[],
  modelName: string = DEFAULT_MODEL
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is missing");

  const MAX_CHARS = 8000;
  let acc = 0;
  const recent = [];
  for (let i = messages.length - 1; i >= 0; i--) {
    const m = messages[i];
    acc += m.content.length;
    if (acc > MAX_CHARS) break;
    recent.push(m);
  }
  recent.reverse();

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: modelName,
    systemInstruction: {
      role: "user",
      parts: [{ text: SYSTEM_PROMPT }],
    },
  });

  const contents = recent.map((m) => ({
    role: m.role === "USER" ? "user" : "model",
    parts: [{ text: m.content }],
  }));

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const result = await model.generateContent(
      { contents },
      { signal: controller.signal as any }
    );
    const text = result?.response?.text?.() || "";
    return (
      text.trim() ||
      "I’m here to help. Could you share a bit more about your goals or current situation?"
    );
  } finally {
    clearTimeout(timeout);
  }
}
