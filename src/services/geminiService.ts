import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

/**
 * Analyzes a system error and suggests a fix using Gemini.
 */
export async function analyzeError(errorLog: any) {
  const model = "gemini-3-flash-preview";
  const prompt = `
    You are an AI Maintenance Agent for a SaaS application called MUBUSLINK AI.
    A system error has occurred. Analyze the following error log and suggest a technical fix.
    
    Error Log:
    ${JSON.stringify(errorLog, null, 2)}
    
    Provide your response in the following JSON format:
    {
      "analysis": "A brief explanation of why the error occurred.",
      "suggestedFix": "A step-by-step technical fix.",
      "severity": "Low | Medium | High",
      "autoFixable": boolean
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini analysis failed:", error);
    return {
      analysis: "Failed to analyze error with AI.",
      suggestedFix: "Check logs manually.",
      severity: "High",
      autoFixable: false
    };
  }
}

/**
 * Performs a general system health check.
 */
export async function runSystemHealthCheck(systemState: any) {
  const model = "gemini-3-flash-preview";
  const prompt = `
    Analyze the current state of the MUBUSLINK AI system and provide a health report.
    System State:
    ${JSON.stringify(systemState, null, 2)}
    
    Provide a health score (0-100) and recommendations for optimization.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt
    });

    return response.text;
  } catch (error) {
    console.error("Health check failed:", error);
    return "Unable to perform health check at this time.";
  }
}

export async function getAIWritingFeedback(text: string) {
  const model = "gemini-3-flash-preview";
  const prompt = `Analyze this text and provide concise, actionable feedback to improve it: "${text}"`;
  try {
    const response = await ai.models.generateContent({ model, contents: prompt });
    return response.text;
  } catch (error) {
    console.error(error);
    return "Unable to generate feedback.";
  }
}

export async function iterateOnText(text: string, instructions: string) {
  const model = "gemini-3-flash-preview";
  const prompt = `Rewrite this text based on these instructions: "${instructions}". Original text: "${text}"`;
  try {
    const response = await ai.models.generateContent({ model, contents: prompt });
    return response.text;
  } catch (error) {
    console.error(error);
    return text;
  }
}

export async function aiWritingTool(text: string, tool: 'summarize' | 'grammar' | 'expand' | 'shorten' | 'tone', extra?: string) {
  const model = "gemini-3-flash-preview";
  let prompt = "";
  
  switch(tool) {
    case 'summarize': prompt = `Provide a concise summary of this text: "${text}"`; break;
    case 'grammar': prompt = `Fix all grammar and spelling errors in this text while keeping the meaning identical: "${text}"`; break;
    case 'expand': prompt = `Expand on this text with more details and depth while maintaining the core message: "${text}"`; break;
    case 'shorten': prompt = `Make this text more concise without losing any key information: "${text}"`; break;
    case 'tone': prompt = `Change the tone of this text to ${extra || 'professional'}: "${text}"`; break;
  }

  try {
    const response = await ai.models.generateContent({ model, contents: prompt });
    return response.text;
  } catch (error) {
    console.error(error);
    return text;
  }
}

export async function runSEOAudit(urlOrText: string) {
  const model = "gemini-3-flash-preview";
  const prompt = `Perform a comprehensive SEO audit on the following content or reference: "${urlOrText}".
    Identify:
    1. Primary Keyword effectiveness
    2. Meta title and description quality
    3. Heading structure (H1, H2, H3)
    4. Readability and UX
    5. Actionable improvements for ranking
    
    Format the response in JSON:
    {
      "healthScore": number,
      "findings": [{ "category": string, "issue": string, "impact": "High" | "Medium" | "Low", "fix": string }],
      "metaOptimizations": { "title": string, "description": string }
    }`;
  
  try {
    const response = await ai.models.generateContent({ 
      model, 
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function proactiveSuggestion(text: string) {
  const model = "gemini-3-flash-preview";
  const prompt = `Based on this snippet, give a tiny, one-sentence proactive tip for the writer: "${text}"`;
  try {
    const response = await ai.models.generateContent({ model, contents: prompt });
    return response.text;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function generateSEOSalesContent(topic: string, type: string, tone: string, keywords: string) {
  const model = "gemini-3-flash-preview";
  const prompt = `Generate high-converting ${type} content about "${topic}". Tone: ${tone}. Keywords to include: ${keywords}. Format in Markdown.`;
  try {
    const response = await ai.models.generateContent({ model, contents: prompt });
    return response.text;
  } catch (error) {
    console.error(error);
    return "Unable to generate content.";
  }
}

export async function getPerformanceScore(content: string) {
  const model = "gemini-3-flash-preview";
  const prompt = `Analyze this content and provide a performance score in JSON format:
    {
      "overallScore": number,
      "seoScore": number,
      "conversionScore": number,
      "readabilityScore": number,
      "suggestions": string[]
    }
    Content: "${content}"`;
  try {
    const response = await ai.models.generateContent({ 
      model, 
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error(error);
    return null;
  }
}
