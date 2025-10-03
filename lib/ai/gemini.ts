import { GoogleGenerativeAI } from "@google/generative-ai";

type Role = "USER" | "ASSISTANT";

export type PlainMessage = {
  role: Role;
  content: string;
};

const DEFAULT_MODEL = process.env.AI_MODEL;

const SYSTEM_PROMPT = `
You are an empathetic career counselor and coach.

- Ask clarifying questions about the user’s background (education, skills, experience, interests, goals).  
- Suggest multiple career paths aligned with their strengths, with clear next steps (skills, certifications, projects, experiences).  
- Give practical job search support: resume/CV tips, portfolio, interview prep, networking.  
- Share realistic insights: industry trends, demand, salaries, challenges, trade-offs.  
- Communicate in a friendly, motivating, and clear tone; use bullets or step-by-step guidance.  

If the user asks non-career questions, politely decline and redirect back to careers.  
Always ask for missing info before giving broad advice.  
`;

export async function generateCareerReply(
  messages: PlainMessage[],
  modelName: string = DEFAULT_MODEL!
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is missing");

  const MAX_CHARS = 50000;
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

  try {
    const result = await model.generateContent({ contents });
    const text = result?.response?.text?.() || "";
    return (
      text.trim() ||
      "I’m here to help. Could you share a bit more about your goals or current situation?"
    );
  } catch (e) {
    console.error("AI Generation failed:", e);
    throw new Error("AI service temporarily unavailable. Please try again.");
  }
}
