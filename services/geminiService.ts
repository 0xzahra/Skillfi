
import { GoogleGenAI, Chat, Part, Modality } from "@google/genai";
import { getSystemInstruction } from "../constants";
import { LanguageCode } from "../types";

const getClient = () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        console.error("API_KEY is missing in environment variables.");
        throw new Error("API_KEY is missing");
    }
    return new GoogleGenAI({ apiKey });
};

// Initialize a persistent chat session
export const initializeChat = async (language: LanguageCode = 'en'): Promise<Chat> => {
    const ai = getClient();
    const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
            systemInstruction: getSystemInstruction(language),
            temperature: 0.7,
        }
    });
    return chat;
};

export const sendMessageToSkillfi = async (
    chat: Chat, 
    text: string, 
    attachment?: { data: string; mimeType: string }
): Promise<string> => {
    try {
        let responseText = "";
        const parts: Part[] = [];
        
        if (text && text.trim().length > 0) parts.push({ text: text });
        if (attachment) {
            parts.push({
                inlineData: {
                    mimeType: attachment.mimeType,
                    data: attachment.data
                }
            });
        }

        const result = await chat.sendMessage({ message: parts });
        responseText = result.text || "";
        
        // Append Grounding Sources if available
        const groundingChunks = result.candidates?.[0]?.groundingMetadata?.groundingChunks;
        if (groundingChunks) {
            const sources = groundingChunks
                .filter((c: any) => c.web?.uri && c.web?.title)
                .map((c: any) => `- [${c.web.title}](${c.web.uri})`)
                .join('\n');
            if (sources) responseText += `\n\n**Verified Sources:**\n${sources}`;
        }

        return responseText;
    } catch (error) {
        console.error("Gemini API Error:", error);
        return "Connection interrupted. Please retry.";
    }
};

export const generateSpeech = async (text: string): Promise<string | null> => {
    const ai = getClient();
    try {
        // Strip markdown links for speech
        const cleanText = text.replace(/\[.*?\]\(.*?\)/g, '').replace(/\[.*?\]/g, '').substring(0, 400);
        
        // Using 'Kore' for a more balanced, professional, and slightly warmer tone.
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: { parts: [{ text: cleanText }] },
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
                },
            },
        });
        return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
    } catch (error) {
        console.warn("Speech generation failed, falling back to browser TTS");
        return null;
    }
};

export const generateCareerAvatar = async (imageBase64: string, roleDescription: string): Promise<string | null> => {
    const ai = getClient();
    const prompt = `Transform into hyper-realistic, confident ${roleDescription}. Attire: High-end professional. 8k resolution.`;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    { inlineData: { data: imageBase64, mimeType: 'image/jpeg' } },
                    { text: prompt }
                ]
            }
        });
        return response.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData?.data || null;
    } catch (error) {
        return null;
    }
};

export const generateProfessionalHeadshot = async (
    imageBase64: string,
    style: 'CORPORATE' | 'MEDICAL' | 'CREATIVE' | 'TECH'
): Promise<string | null> => {
    const ai = getClient();
    let stylePrompt = "";
    switch(style) {
        case 'CORPORATE': stylePrompt = "wearing a tailored dark navy suit, white shirt, glass office background."; break;
        case 'MEDICAL': stylePrompt = "wearing pristine medical scrubs and white coat, hospital background."; break;
        case 'CREATIVE': stylePrompt = "wearing stylish smart-casual builder attire, design studio background."; break;
        case 'TECH': stylePrompt = "wearing premium minimalist t-shirt and blazer, dark server room background."; break;
    }

    const prompt = `Generate a professional LinkedIn headshot based on this person's facial features. Person should be ${stylePrompt} Expression: Confident leader. Quality: 8k, photorealistic, DSLR.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    { inlineData: { data: imageBase64, mimeType: 'image/jpeg' } },
                    { text: prompt }
                ]
            }
        });
        return response.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData?.data || null;
    } catch (error) {
        return null;
    }
};

export const generateItemVisual = async (itemDescription: string): Promise<string | null> => {
    const ai = getClient();
    // Enhanced prompt for luxury items
    const prompt = `Create a hyper-realistic, cinematic product shot of: ${itemDescription}. 
    If it is a watch or car, ensure brand details are accurate and lighting implies extreme luxury. 
    Lighting: Studio, dramatic, dark mode aesthetic with gold accents. Quality: 8k.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [{ text: prompt }] }
        });
        return response.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData?.data || null;
    } catch (error) {
        console.error("Item Gen Error:", error);
        return null;
    }
};

// --- REAL TIME DATA FETCHING (SEARCH GROUNDED) ---

export interface RealScholarship {
    title: string;
    amount: string;
    deadline: string;
    source: string;
    description?: string;
    link?: string;
}

export const fetchLiveScholarships = async (): Promise<RealScholarship[]> => {
    const ai = getClient();
    const prompt = `
    Find 5 currently active and open scholarships for 2024/2025. 
    Focus on STEM, Arts, and Leadership.
    
    Format the output strictly as a list separated by "---".
    For each scholarship, follow this format:
    Title: [Scholarship Name]
    Amount: [Value]
    Deadline: [Date]
    Source: [Organization]
    Description: [1 sentence summary]
    ---
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: { parts: [{ text: prompt }] },
            config: {
                tools: [{ googleSearch: {} }] // Enable Google Search
            }
        });

        const text = response.text || "";
        const rawItems = text.split('---').map(s => s.trim()).filter(s => s.length > 20);
        
        return rawItems.map(item => {
            const getField = (key: string) => {
                const match = item.match(new RegExp(`${key}:\\s*(.*)`, 'i'));
                return match ? match[1].trim() : "TBD";
            };
            
            // Extract URL from grounding metadata if possible, otherwise rely on text
            // For now, we return the parsed text. The UI will render grounding links separately if needed.
            return {
                title: getField('Title'),
                amount: getField('Amount'),
                deadline: getField('Deadline'),
                source: getField('Source'),
                description: getField('Description')
            };
        }).slice(0, 5); // Ensure max 5

    } catch (error) {
        console.error("Scholarship Fetch Error:", error);
        return [];
    }
};

export interface MarketTickerData {
    name: string;
    symbol: string;
    price: string;
    change: string;
    exchanges: string[]; // List of exchanges
    description: string;
}

export const fetchMarketTicker = async (query: string): Promise<MarketTickerData | null> => {
    const ai = getClient();
    const prompt = `
    Search for current live market data for: "${query}".
    
    Return a STRICT JSON object with these fields:
    - name: Full asset name (e.g. Bitcoin, Apple Inc.)
    - symbol: Ticker symbol (e.g. BTC, AAPL)
    - price: Current price with currency symbol (e.g. $65,000)
    - change: 24h change with sign (e.g. +2.5%)
    - exchanges: Array of top 3 major exchanges/platforms where this is traded (e.g. ["Binance", "Coinbase", "Kraken"] or ["NYSE", "Robinhood"]).
    - description: One concise sentence explaining what this asset is.
    
    If data is not found, guess reasonable values based on latest knowledge or return generic placeholders, but try to be accurate using the search tool.
    Output JSON ONLY. No markdown.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: { parts: [{ text: prompt }] },
            config: {
                responseMimeType: 'application/json',
                tools: [{ googleSearch: {} }]
            }
        });

        const text = response.text || "{}";
        return JSON.parse(text);
    } catch (error) {
        console.error("Market Ticker Error:", error);
        return null;
    }
};

export const fetchBatchStockPrices = async (tickers: string[]): Promise<Record<string, { price: number; change: number }> | null> => {
    const ai = getClient();
    const prompt = `
    Get the current live market price and 24h percentage change for these tickers: ${tickers.join(', ')}.
    
    Return a STRICT JSON object where keys are the ticker symbols (exactly as provided) and values are objects with 'price' (number) and 'change' (number).
    Example: { "BTC": { "price": 65000, "change": 2.5 }, "AAPL": { "price": 180.5, "change": -0.5 } }
    
    Use Google Search to ensure data is current.
    Output JSON ONLY.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: { parts: [{ text: prompt }] },
            config: {
                responseMimeType: 'application/json',
                tools: [{ googleSearch: {} }]
            }
        });
        return JSON.parse(response.text || "{}");
    } catch (error) {
        console.error("Batch Price Fetch Error:", error);
        return null;
    }
};

// --- NEW FEATURES ---

export interface ContentPack {
    linkedin: string;
    twitter: string[];
    tiktok: string;
}

export const generateContentPack = async (rawIdea: string): Promise<ContentPack | null> => {
    const ai = getClient();
    const prompt = `
    You are a viral content strategist. Take this raw idea: "${rawIdea}"
    
    Create 3 distinct assets in valid JSON format:
    1. 'linkedin': A professional, authority-building post (max 200 words).
    2. 'twitter': A viral thread (array of 3-5 tweets).
    3. 'tiktok': A visual script for a 30s video (include scene directions).

    Output STRICT JSON. No markdown.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: { parts: [{ text: prompt }] },
            config: { responseMimeType: 'application/json' }
        });
        
        const text = response.text || "{}";
        return JSON.parse(text);
    } catch (error) {
        console.error("Content Nuke Error:", error);
        return null;
    }
};

export const generatePitchDeck = async (topic: string): Promise<{title: string, bullet: string}[] | null> => {
    const ai = getClient();
    const prompt = `
    Create a 10-slide investor pitch deck structure for: "${topic}".
    Return a JSON array of objects, each with 'title' and 'bullet' (one key punchline).
    Output STRICT JSON.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: { parts: [{ text: prompt }] },
            config: { responseMimeType: 'application/json' }
        });
        return JSON.parse(response.text || "[]");
    } catch (error) {
        console.error("Pitch Deck Error:", error);
        return null;
    }
};

export const generatePortfolioHTML = async (userContext: string): Promise<string | null> => {
    const ai = getClient();
    const prompt = `
    Generate a modern, futuristic, single-page personal portfolio website HTML for a user with this context: "${userContext}".
    
    Requirements:
    - Use Tailwind CSS via CDN (<script src="https://cdn.tailwindcss.com"></script>) for styling.
    - Dark mode, cyber/tech aesthetics (black background, neon accents).
    - Sections: Hero (Name, Role), About, Skills (as tags), Proof of Work (2 mock projects), Contact.
    - Fully responsive.
    - Return ONLY valid HTML code string. Do not include markdown code blocks like \`\`\`html.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: { parts: [{ text: prompt }] }
        });
        let html = response.text || "";
        // Cleanup potential markdown blocks
        html = html.replace(/```html/g, '').replace(/```/g, '');
        return html;
    } catch (error) {
        console.error("Portfolio Gen Error:", error);
        return null;
    }
};

export const generateResumeContent = async (userContext: string): Promise<string | null> => {
    const ai = getClient();
    const prompt = `
    Act as a Senior HR Hiring Manager and Professional Resume Writer.
    Objective: Create a top-tier, corporate-ready resume for this user: "${userContext}".
    
    Format using HTML for structure (<h3>, <ul>, <li>, <p>, <strong>).
    Do NOT use markdown. Return raw HTML suitable for a div.
    Structure:
    - Summary
    - Professional Experience
    - Education
    - Skills
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: { parts: [{ text: prompt }] }
        });
        let html = response.text || "";
        html = html.replace(/```html/g, '').replace(/```/g, '');
        return html;
    } catch (error) {
        console.error("Resume Gen Error:", error);
        return null;
    }
};

// --- NEW EXPORTS TO FIX ERRORS ---

export const generateCVContent = async (userContext: string): Promise<string | null> => {
    const ai = getClient();
    const prompt = `
    Act as an Academic Registrar. Create a comprehensive Academic CV for: "${userContext}".
    Format as clean HTML (<h3>, <ul>, <li>).
    Focus on Research, Publications, and Academic Honors.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: { parts: [{ text: prompt }] }
        });
        let html = response.text || "";
        html = html.replace(/```html/g, '').replace(/```/g, '');
        return html;
    } catch (error) {
        console.error("CV Gen Error:", error);
        return null;
    }
};

export const proofreadDocument = async (base64Data: string, mimeType: string, type: 'CV' | 'RESUME'): Promise<string | null> => {
    const ai = getClient();
    const prompt = `
    Review this ${type} document. 
    1. Extract the text.
    2. Improve the grammar, flow, and impact verbs.
    3. Return the IMPROVED version as clean HTML structure.
    `;

    try {
        // Using Gemini 2.5 Flash for vision capability
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image', 
            contents: {
                parts: [
                    { inlineData: { data: base64Data, mimeType: mimeType } },
                    { text: prompt }
                ]
            }
        });
        let html = response.text || "";
        html = html.replace(/```html/g, '').replace(/```/g, '');
        return html;
    } catch (error) {
        console.error("Proofread Error:", error);
        return null;
    }
};

export interface CareerRoadmap {
    advice: string;
    web2: { role: string; skills: string[]; action: string; salaries: {country: string, amount: string}[] };
    web3: { role: string; skills: string[]; action: string; salaries: {country: string, amount: string}[] };
    fitScore: number;
    gapAnalysis: string[];
}

export const generateCareerRoadmap = async (context: string): Promise<CareerRoadmap | null> => {
    const ai = getClient();
    const prompt = `
    Analyze this user profile: "${context}".
    Suggest two distinct career paths (Web2 and Web3).
    
    Calculate a 'fitScore' (0-100) indicating how ready they are for these roles based on their current skills.
    Provide a 'gapAnalysis' list of 3 specific missing skills or actions needed to reach 100%.

    Return JSON format:
    {
      "advice": "One sentence strategic summary.",
      "fitScore": 75,
      "gapAnalysis": ["Learn Solidity", "Build Portfolio", "Network on Twitter"],
      "web2": {
        "role": "Job Title",
        "skills": ["Skill1", "Skill2", "Skill3"],
        "action": "Next specific step to take.",
        "salaries": [{"country": "USA", "amount": "$100k"}, {"country": "UK", "amount": "£70k"}]
      },
      "web3": {
        "role": "Job Title",
        "skills": ["Skill1", "Skill2", "Skill3"],
        "action": "Next specific step to take.",
        "salaries": [{"country": "Global", "amount": "$120k USDC"}]
      }
    }
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: { parts: [{ text: prompt }] },
            config: { responseMimeType: 'application/json' }
        });
        return JSON.parse(response.text || "{}");
    } catch (error) {
        console.error("Roadmap Error:", error);
        return null;
    }
};

export interface FinancialPersona {
    persona: string;
    analysis: string;
    tips: string[];
}

export const analyzeFinancialHealth = async (data: string): Promise<FinancialPersona | null> => {
    const ai = getClient();
    const prompt = `
    Analyze this financial snapshot: "${data}".
    Determine the user's "Financial Persona" (e.g., The Saver, The High Roller, The Strategist).
    
    Return JSON:
    {
        "persona": "Name of Persona",
        "analysis": "1-2 sentence psychological analysis.",
        "tips": ["Tip 1", "Tip 2", "Tip 3"]
    }
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: { parts: [{ text: prompt }] },
            config: { responseMimeType: 'application/json' }
        });
        return JSON.parse(response.text || "{}");
    } catch (error) {
        console.error("Finance Analysis Error:", error);
        return null;
    }
};

export interface ForbesProfile {
    name: string;
    category: string;
    headline: string;
    description: string;
    company?: string;
}

export const fetchForbesRealTime = async (): Promise<ForbesProfile[]> => {
    const ai = getClient();
    const prompt = `
    Find 5 trending Forbes 30 Under 30 profiles from the current or recent year across Technology, Finance, Art, and Science.
    
    Return a STRICT JSON array of objects with these fields:
    - name: Name of the person.
    - category: 'Consumer Technology', 'Finance', 'Art & Style', or 'Science'.
    - headline: A catchy 3-5 word headline about their achievement.
    - description: A brief 2-sentence bio and why they are on the list.
    - company: Their company or affiliation.
    
    Output JSON ONLY.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: { parts: [{ text: prompt }] },
            config: {
                responseMimeType: 'application/json',
                tools: [{ googleSearch: {} }]
            }
        });
        
        const text = response.text || "[]";
        return JSON.parse(text);
    } catch (error) {
        console.error("Forbes Fetch Error:", error);
        return [];
    }
};
