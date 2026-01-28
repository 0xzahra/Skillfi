import { GoogleGenAI, Chat, Content, Part, Modality } from "@google/genai";
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
        const cleanText = text.replace(/\[.*?\]\(.*?\)/g, '').replace(/\[.*?\]/g, '').substring(0, 400);
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
        case 'CREATIVE': stylePrompt = "wearing stylish smart-casual architectural attire, design studio background."; break;
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
    const prompt = `Create a hyper-realistic, cinematic product shot of: ${itemDescription}. Lighting: Studio, dramatic. Background: Minimalist luxury dark mode. Quality: 8k.`;

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

export const generateCVContent = async (userContext: string): Promise<string | null> => {
    const ai = getClient();
    const prompt = `
    Generate a professional, ATS-optimized Resume/CV content for: "${userContext}".
    
    Structure:
    1. Summary (Professional Profile)
    2. Core Competencies (Skills)
    3. Professional Experience (Create 2 realistic mock roles based on context)
    4. Education
    
    Output Format: Clean plain text with clear section headers. No markdown symbols like ** or #.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: { parts: [{ text: prompt }] }
        });
        return response.text;
    } catch (error) {
        console.error("CV Gen Error:", error);
        return null;
    }
};