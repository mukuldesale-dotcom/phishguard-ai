import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export async function analyzeScamPsychology(text: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-5.1",
    messages: [
      {
        role: "system",
        content: `You are a cybersecurity expert helping students. Analyze the following message for scam or phishing attempts. 
Return a JSON object with EXACTLY these keys:
{
  "riskLevel": "Safe" | "Medium" | "High",
  "riskScore": number between 0 and 100,
  "tactics": array of strings (e.g. ["Urgency", "Fear", "Reward bait", "Authority", "Scarcity"]),
  "explanation": "Clear, student-friendly explanation of why it is safe or a scam.",
  "confidence": number between 0 and 100
}`
      },
      {
        role: "user",
        content: text
      }
    ],
    response_format: { type: "json_object" }
  });
  
  return JSON.parse(response.choices[0].message?.content || "{}");
}

export async function analyzeLink(url: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-5.1",
    messages: [
      {
        role: "system",
        content: `You are a cybersecurity expert. Analyze the given URL for phishing or scam indicators (e.g., suspicious keywords, http vs https, hyphen abuse, typosquatting). 
Return a JSON object with EXACTLY these keys:
{
  "riskLevel": "Safe" | "Medium" | "High",
  "riskScore": number between 0 and 100,
  "explanation": "Clear explanation of the risks found.",
  "confidence": number between 0 and 100
}`
      },
      {
        role: "user",
        content: url
      }
    ],
    response_format: { type: "json_object" }
  });
  
  return JSON.parse(response.choices[0].message?.content || "{}");
}

export async function generateSafeReply(text: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-5.1",
    messages: [
      {
        role: "system",
        content: `You are a digital safety coach. A student received a suspicious message and needs a polite, safe, identity-protecting reply to defuse the situation or decline without giving away personal info. Return only the suggested reply text.`
      },
      {
        role: "user",
        content: text
      }
    ]
  });
  
  return response.choices[0].message?.content || "Could not generate reply.";
}
