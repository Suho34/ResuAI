import { Analysis } from "@/types/resume";
import { OpenAI } from "openai";

export class AIService {
  private static client: OpenAI;

  static initialize() {
    if (!this.client) {
      this.client = new OpenAI({
        apiKey: process.env.OPENROUTER_API_KEY,
        baseURL: "https://openrouter.ai/api/v1",
      });
    }
  }

  static async analyzeResume(
    resumeText: string,
    jobRole: string
  ): Promise<Analysis> {
    this.initialize();

    const prompt = `You are an expert career coach and recruiter. Analyze the following resume for a candidate targeting a ${jobRole} role.

RESUME TEXT:
${resumeText.substring(0, 12000)} // Limit to avoid token limits

Provide a JSON response ONLY with this exact structure:
{
  "strengths": ["strength1", "strength2", "strength3"],
  "missingSkills": ["skill1", "skill2", "skill3"], 
  "atsTips": ["tip1", "tip2", "tip3"],
  "improvements": ["improvement1", "improvement2", "improvement3"],
  "score": 7
}

IMPORTANT: Return ONLY valid JSON, no other text.`;

    try {
      const response = await this.client.chat.completions.create({
        model: "x-ai/grok-4-fast:free",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        max_tokens: 2000,
      });

      const content = response.choices[0]?.message?.content;

      if (!content) {
        throw new Error("No response from AI");
      }

      // Parse JSON response
      return JSON.parse(content);
    } catch (error) {
      console.error("AI Analysis Error:", error);
      throw new Error(
        `AI analysis failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
}
