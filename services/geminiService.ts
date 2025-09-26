import { GoogleGenAI, Type } from "@google/genai";
import { ComplianceStandard, Region, ReviewResult } from "../types.ts";

const PROMPT_INSTRUCTIONS_REVIEW: Record<ComplianceStandard, string> = {
  [ComplianceStandard.FDA_MARKETING]: "You are an expert FDA compliance officer specializing in drug and medical device marketing regulations (e.g., 21 CFR Part 202).",
  [ComplianceStandard.HIPAA_PRIVACY]: "You are a HIPAA Privacy and Security Officer.",
  [ComplianceStandard.FTC_ADVERTISING]: "You are an FTC enforcement attorney specializing in health product advertising."
};

const PROMPT_INSTRUCTIONS_GENERATE: Record<ComplianceStandard, string> = {
    [ComplianceStandard.FDA_MARKETING]: "You are an expert healthcare marketing copywriter specializing in creating FDA-compliant content for drugs and medical devices.",
    [ComplianceStandard.HIPAA_PRIVACY]: "You are a communications expert specializing in healthcare operations, tasked with generating patient-facing communications that strictly adhere to HIPAA privacy rules.",
    [ComplianceStandard.FTC_ADVERTISING]: "You are a specialized advertising copywriter creating marketing materials for health products that comply with FTC truth-in-advertising laws."
  };

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    isCompliant: { type: Type.BOOLEAN, description: "A boolean indicating if the text is fully compliant." },
    summary: { type: Type.STRING, description: "A one-sentence executive summary of the compliance review." },
    issues: {
      type: Type.ARRAY,
      description: "An array of identified compliance issues. If no issues, this is an empty array.",
      items: {
        type: Type.OBJECT,
        properties: {
          originalText: { type: Type.STRING, description: "The exact non-compliant phrase from the original text." },
          issue: { type: Type.STRING, description: "A short, clear title for the compliance issue (e.g., 'Unsubstantiated Efficacy Claim')." },
          explanation: { type: Type.STRING, description: "A detailed explanation of why the text is non-compliant, citing the relevant regulation or principle." },
          suggestion: { type: Type.STRING, description: "A compliant alternative phrasing for the identified issue." },
          severity: { type: Type.STRING, description: "The severity of the issue: 'High', 'Medium', or 'Low'." },
        },
        required: ["originalText", "issue", "explanation", "suggestion", "severity"]
      }
    },
  },
  required: ["isCompliant", "summary", "issues"]
};

const getRegionSpecifics = (region: Region): string => {
    const specifics = {
        [Region.USA]: "Focus on regulations specific to the United States. Use American English spelling and conventions.",
        [Region.EU]: "Focus on regulations specific to the European Union (e.g., GDPR, EMA guidelines). Use British English spelling and conventions.",
        [Region.JPAC]: "Focus on regulations common in the Japan and Asia-Pacific regions, acknowledging variations but adhering to general principles of patient safety and advertising standards. Use clear and simple international English.",
        [Region.MIDDLE_EAST]: "Focus on regulations common in the Middle East, adhering to general principles of patient safety, cultural sensitivities, and advertising standards. Use clear and simple international English."
    }
    return specifics[region];
}

export const reviewContent = async (apiKey: string, content: string, standard: ComplianceStandard, region: Region): Promise<ReviewResult> => {
  const ai = new GoogleGenAI({ apiKey });

  const systemInstruction = `${PROMPT_INSTRUCTIONS_REVIEW[standard]} ${getRegionSpecifics(region)}`;
  const userPrompt = `Please review the following content for compliance issues based on my system instruction:\n\n---\n\n${content}\n\n---\n\nProvide your analysis in the specified JSON format. If no issues are found, the 'issues' array must be empty.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.2,
      },
    });
    return JSON.parse(response.text.trim()) as ReviewResult;
  } catch (error) {
    console.error("Gemini API call failed (review):", error);
    throw new Error("Failed to parse review response from AI. The model may have returned an unexpected format.");
  }
};

export const generateContent = async (apiKey: string, prompt: string, standard: ComplianceStandard, region: Region): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey });
  
    const systemInstruction = `${PROMPT_INSTRUCTIONS_GENERATE[standard]} ${getRegionSpecifics(region)}`;
    const userPrompt = `Based on my system instruction, please generate marketing content based on the following topic or instruction:\n\n---\n\n${prompt}\n\n---\n\nEnsure the generated content is engaging, clear, and fully compliant. Do not include any placeholder text like "[Product Name]". Be creative and write the full content.`;
  
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: userPrompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });
      return response.text.trim();
    } catch (error) {
      console.error("Gemini API call failed (generate):", error);
      throw new Error("Failed to generate content from AI.");
    }
  };