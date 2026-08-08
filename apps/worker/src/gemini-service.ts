import { GoogleGenAI, Type, Schema } from '@google/genai';
import { fetchImageAsBase64, ImagePart } from './image-helper';

export interface EnrichmentInput {
  title?: string;
  description?: string;
  price?: number | string;
  images?: string[];
  category?: string;
}

export interface EnrichmentOutput {
  title: string;
  titleUrdu?: string;
  description: string;
  descriptionUrdu?: string;
  category: string;
  tags: string[];
  suggestedPrice?: number;
  aiConfidence?: number;
}

const productEnrichmentSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { 
      type: Type.STRING, 
      description: "Professional, SEO-friendly English title for the product." 
    },
    titleUrdu: { 
      type: Type.STRING, 
      description: "Urdu translation or script title for Pakistani customers (e.g. 'زنانہ لان سوٹ')." 
    },
    description: { 
      type: Type.STRING, 
      description: "Compelling product description highlighting features, material, quality, and usage." 
    },
    descriptionUrdu: { 
      type: Type.STRING, 
      description: "Urdu translation or script product description for local merchants and buyers." 
    },
    suggestedPrice: { 
      type: Type.NUMBER, 
      description: "Suggested retail price in PKR (Pakistani Rupees) based on market rates." 
    },
    category: { 
      type: Type.STRING, 
      description: "Primary product category (e.g. 'Women\\'s Fashion', 'Lawn Suits', 'Men\\'s Wear', 'Footwear', 'Electronics', 'Home & Decor', 'Beauty & Personal Care')." 
    },
    tags: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "Array of 5 to 8 relevant search tags/keywords in English and Urdu." 
    },
    aiConfidence: {
      type: Type.NUMBER,
      description: "Confidence score between 0.0 and 1.0 indicating accuracy of visual analysis."
    }
  },
  required: ["title", "description", "category", "tags"]
};

export class GeminiEnrichmentService {
  private ai: GoogleGenAI;

  constructor(apiKey: string) {
    this.ai = new GoogleGenAI({ apiKey });
  }

  /**
   * Enriches a product using Gemini 2.5 Flash (supporting text + image vision analysis).
   */
  async enrichProduct(input: EnrichmentInput): Promise<{ output: EnrichmentOutput; tokensUsed: number; costUsd: number }> {
    const parts: Array<{ text: string } | ImagePart> = [];

    // 1. Fetch image if provided
    let imagePart: ImagePart | null = null;
    if (input.images && input.images.length > 0) {
      const imageUrl = input.images[0];
      if (imageUrl && imageUrl.startsWith('http')) {
        imagePart = await fetchImageAsBase64(imageUrl);
      }
    }

    if (imagePart) {
      parts.push(imagePart);
    }

    // 2. Build prompt tailored for Pakistani e-commerce merchants
    const promptText = `You are an expert e-commerce product catalog manager for the Pakistani retail market.
Analyse the attached product photo (if provided) and the initial merchant details below to generate a complete, high-converting product catalog entry.

Merchant Inputs:
- Initial Title: ${input.title || 'Product'}
- Initial Description: ${input.description || 'N/A'}
- Current Price: ${input.price ? `PKR ${input.price}` : 'Not set (0)'}
- Initial Category: ${input.category || 'N/A'}

Instructions:
1. If an image is attached, inspect the item carefully (identify type, fabric/material, color, pattern, style, or brand).
2. Write a clear, attractive English title (e.g. "Unstitched 3-Piece Printed Lawn Suit with Chiffon Dupatta").
3. Write a matching Urdu title in Urdu script (e.g. "انسٹچڈ 3 پیس پرنٹڈ لان سوٹ").
4. Write a compelling, detailed English product description highlighting key features.
5. Write a helpful Urdu product description in Urdu script.
6. Categorise accurately into standard retail categories.
7. Recommend a realistic market price in PKR if current price is 0 or missing.
8. Provide 5-8 relevant tags for search indexing.
9. Output strictly in the specified JSON schema.`;

    parts.push({ text: promptText });

    // 3. Call Gemini 2.5 Flash
    const response = await this.ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: parts as any,
      config: {
        responseMimeType: 'application/json',
        responseSchema: productEnrichmentSchema,
      },
    });

    const outputText = response.text || '{}';
    let parsed: EnrichmentOutput;

    try {
      parsed = JSON.parse(outputText);
    } catch (e) {
      console.error('Failed to parse Gemini JSON output:', outputText);
      parsed = {
        title: input.title || 'Enriched Product',
        description: input.description || 'Quality product from our store.',
        category: input.category || 'General',
        tags: ['shopo', 'retail'],
        suggestedPrice: typeof input.price === 'number' ? input.price : Number(input.price) || 1000,
        aiConfidence: 0.5,
      };
    }

    // Calculate token usage & cost (Gemini 2.5 Flash: ~$0.000075 / 1k input tokens, ~$0.0003 / 1k output tokens)
    const usageMetadata = (response as any).usageMetadata;
    const promptTokens = usageMetadata?.promptTokenCount || 500;
    const candidatesTokens = usageMetadata?.candidatesTokenCount || 300;
    const totalTokens = promptTokens + candidatesTokens;
    const estimatedCostUsd = (promptTokens / 1000) * 0.000075 + (candidatesTokens / 1000) * 0.0003;

    return {
      output: {
        title: parsed.title || input.title || 'Enriched Product',
        titleUrdu: parsed.titleUrdu || undefined,
        description: parsed.description || input.description || '',
        descriptionUrdu: parsed.descriptionUrdu || undefined,
        category: parsed.category || input.category || 'General',
        tags: Array.isArray(parsed.tags) ? parsed.tags : [],
        suggestedPrice: parsed.suggestedPrice || (Number(input.price) || undefined),
        aiConfidence: parsed.aiConfidence || (imagePart ? 0.95 : 0.8),
      },
      tokensUsed: totalTokens,
      costUsd: Number(estimatedCostUsd.toFixed(6)),
    };
  }
}
