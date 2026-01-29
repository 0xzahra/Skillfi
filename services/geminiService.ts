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
        // Strip markdown links for speech
        const cleanText = text.replace(/\[.*?\]\(.*?\)/g, '').replace(/\[.*?\]/g, '').substring(0, 400);
        
        // Use a prompt to guide the tone if the model allows, otherwise rely on the voice config
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: { parts: [{ text: cleanText }] },
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Fenrir' } }, // Fenrir is often deeper/more authoritative
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
    Generate a high-impact, CORPORATE RESUME (Resume style, not CV) for:
    "${userContext}".
    
    Structure the output as clean HTML suitable for exporting to a Word document.
    
    Requirements:
    - Style: Concise, Result-Oriented, 1-Page optimized.
    - Focus: Quantifiable achievements, strong action verbs.
    - Sections: Header, Summary (2 lines max), Skills (Tags), Experience (Bullets), Education, Projects.
    - Use standard HTML tags: <h1>, <h2>, <p>, <ul>, <li>, <strong>.
    - No external CSS classes, use inline styles for basic layout.
    - Do NOT wrap in markdown code blocks. Return raw HTML body content.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: { parts: [{ text: prompt }] }
        });
        return response.text;
    } catch (error) {
        console.error("Resume Gen Error:", error);
        return null;
    }
};

export const generateCVContent = async (userContext: string): Promise<string | null> => {
    const ai = getClient();
    const prompt = `
    Generate a comprehensive, ACADEMIC/EXECUTIVE CURRICULUM VITAE (CV) for:
    "${userContext}".
    
    Structure the output as clean HTML suitable for exporting to a Word document.
    
    Requirements:
    - Style: Academic, Detailed, Comprehensive.
    - Focus: Depth of expertise, research, publications, certifications.
    - Sections: Header, Detailed Profile, Education (include thesis/honors), Professional Experience, Publications/Research, Awards, Certifications, Skills, References.
    - Use standard HTML tags: <h1>, <h2>, <p>, <ul>, <li>, <strong>.
    - No external CSS classes, use inline styles for basic layout.
    - Do NOT wrap in markdown code blocks. Return raw HTML body content.
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

export interface GlobalSalary {
    country: string;
    amount: string; // e.g. "$120k/yr" or "₦500k/mo"
}

export interface CareerRole {
    role: string;
    skills: string[];
    action: string;
    salaries: GlobalSalary[];
}

export interface CareerRoadmap {
    web2: CareerRole;
    web3: CareerRole;
    advice: string;
}

export const generateCareerRoadmap = async (userContext: string): Promise<CareerRoadmap | null> => {
    const ai = getClient();
    const prompt = `
    Analyze this user context: "${userContext}".
    
    Recommend 2 specific professional paths ("Roles").
    
    1. 'web2': A SIMPLE, TRADITIONAL ROLE. Use standard titles everyone knows (e.g., Doctor, Pilot, Tailor, Teacher, Designer, Accountant, Chef, Nurse). Do not use complex corporate jargon.
    2. 'web3': A SPECIFIC WEB3 ROLE. Distinguish between roles clearly (e.g., 'Community Moderator' is different from 'Community Manager', 'Collab Manager' is different from 'Alpha Hunter').
    
    For EACH role, you must provide:
    - Exact Role Title (Simple & Clear).
    - 3 Hard Skills.
    - 1 specific First Step Action.
    - 'salaries': An array of 4 distinct global locations with their LOCAL currency and time period (yr/mo). 
       Example: { "country": "USA", "amount": "$120k/yr" }, { "country": "Nigeria", "amount": "₦500k/mo" }.
       Ensure you include a mix of regions (US/Europe, Africa/Asia).
    
    Return STRICT JSON format matching the interface:
    {
      "web2": { 
        "role": "Title", 
        "skills": ["A","B","C"], 
        "action": "Step",
        "salaries": [ { "country": "USA", "amount": "..." }, { "country": "India", "amount": "..." }, ... ]
      },
      "web3": { 
        "role": "Title", 
        "skills": ["A","B","C"], 
        "action": "Step",
        "salaries": [ { "country": "Remote (US)", "amount": "..." }, { "country": "Dubai", "amount": "..." }, ... ]
      },
      "advice": "One strategic sentence bridging both worlds."
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
        console.error("Roadmap Gen Error:", error);
        return null;
    }
};

export interface FinancialPersona {
    persona: string;
    analysis: string;
    tips: string[];
}

export const analyzeFinancialHealth = async (financialData: string): Promise<FinancialPersona | null> => {
    const ai = getClient();
    const prompt = `
    Act as a ruthless financial auditor. Analyze this data: "${financialData}".
    
    1. Assign a "Financial Persona" (e.g., The Bleeding Heart, The Accumulator, The Hedonist, The Strategist).
    2. Provide a 1-sentence brutal analysis of their situation.
    3. Provide 3 specific, tactical steps to optimize (Cut X, Invest in Y, Leverage Z).

    Return STRICT JSON:
    {
        "persona": "Title",
        "analysis": "Sentence",
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
        console.error("Finance Audit Error:", error);
        return null;
    }
};