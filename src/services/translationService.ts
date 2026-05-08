import { GoogleGenAI, Type } from "@google/genai";

export interface TranslationResult {
  language: string;
  content: string;
  seoMeta?: {
    title: string;
    description: string;
    keywords: string[];
  };
}

export async function translateContent(
  text: string, 
  targetLanguages: string[], 
  includeSEO: boolean = false
): Promise<TranslationResult[]> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Translate the following text into these languages: ${targetLanguages.join(', ')}. 
    ${includeSEO ? 'Also provide translated SEO meta tags (title, description, keywords) for each language.' : ''}
    
    Text to translate:
    ${text}
    
    Return the result as a JSON array of objects with the following structure:
    {
      "language": "Language Name",
      "content": "Translated Text",
      "seoMeta": {
        "title": "Translated Title",
        "description": "Translated Description",
        "keywords": ["keyword1", "keyword2"]
      }
    }`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            language: { type: Type.STRING },
            content: { type: Type.STRING },
            seoMeta: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                keywords: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                }
              }
            }
          },
          required: ["language", "content"]
        }
      }
    }
  });

  try {
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Failed to parse translation response:", error);
    return [];
  }
}
