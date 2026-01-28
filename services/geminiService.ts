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
    
    // Using gemini-3-flash-preview for the main conversational intelligence
    // Removed googleSearch from default tools to avoid 'Permission Denied' on standard keys
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
        
        if (attachment) {
            const parts: Part[] = [];
            
            // Only add text part if there is actual text content
            if (text && text.trim().length > 0) {
                parts.push({ text: text });
            }
            
            parts.push({
                inlineData: {
                    mimeType: attachment.mimeType,
                    data: attachment.data
                }
            });
            
            const result = await chat.sendMessage({
                message: parts
            });
            responseText = result.text || "";
            
            // Append Grounding Sources if available
            const groundingChunks = result.candidates?.[0]?.groundingMetadata?.groundingChunks;
            if (groundingChunks) {
                const sources = groundingChunks
                    .filter((c: any) => c.web?.uri && c.web?.title)
                    .map((c: any) => `- [${c.web.title}](${c.web.uri})`)
                    .join('\n');
                
                if (sources) {
                    responseText += `\n\n**Verified Sources:**\n${sources}`;
                }
            }

        } else {
            const result = await chat.sendMessage({
                message: text
            });
            responseText = result.text || "";

            // Append Grounding Sources if available
            const groundingChunks = result.candidates?.[0]?.groundingMetadata?.groundingChunks;
            if (groundingChunks) {
                const sources = groundingChunks
                    .filter((c: any) => c.web?.uri && c.web?.title)
                    .map((c: any) => `- [${c.web.title}](${c.web.uri})`)
                    .join('\n');
                
                if (sources) {
                    responseText += `\n\n**Verified Sources:**\n${sources}`;
                }
            }
        }

        return responseText;

    } catch (error) {
        console.error("Gemini API Error:", error);
        return "[Soft alert tone] I encountered a connection issue. Please try sending your message again.";
    }
};

// Generate High-Quality Neural Speech
export const generateSpeech = async (text: string): Promise<string | null> => {
    const ai = getClient();
    try {
        // Clean text for speech (remove markdown links and visual cues)
        const cleanText = text.replace(/\[.*?\]\(.*?\)/g, '').replace(/\[.*?\]/g, '').substring(0, 400); // Limit length for speed

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: { parts: [{ text: cleanText }] },
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Kore' }, // Kore is deep and authoritative
                    },
                },
            },
        });
        
        // Return base64 string of raw PCM data
        return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
    } catch (error) {
        console.error("TTS Error", error);
        return null;
    }
};

// New function to generate a Vision Board image based on the latest context
export const generateVisionBoard = async (context: string): Promise<string | null> => {
    const ai = getClient();
    
    // Simplified prompt for cleaner, less complex results
    const imagePrompt = `
    A minimalistic and elegant abstract representation of this career path: ${context.substring(0, 200)}. 
    Style: sleek high-tech minimal line art, dark background #0a0a0a, single glowing neon blue accent. 
    Focus on clarity, geometry, and upward growth. No text, no cluttered details, no faces.
    `;

    try {
        // Using gemini-2.5-flash-image for generation as per guidelines
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    { text: imagePrompt }
                ]
            },
            config: {
                // Config for image generation
            }
        });

        // Parse response for image
        if (response.candidates?.[0]?.content?.parts) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    return part.inlineData.data;
                }
            }
        }
        return null;
    } catch (error) {
        console.error("Image Gen Error:", error);
        return null;
    }
};

// Generate a Career Avatar based on user photo and role description
export const generateCareerAvatar = async (
    imageBase64: string, 
    roleDescription: string
): Promise<string | null> => {
    const ai = getClient();

    // Prompt engineered for hyper-realism and professional role adaptation
    const prompt = `
    Transform this person into a hyper-realistic, confident ${roleDescription}.
    Attire: High-end professional, futuristic yet practical for the role.
    Setting: A sleek, modern high-tech environment matching the profession.
    Lighting: Cinematic, dramatic lighting, 8k resolution, highly detailed face.
    Style: Photorealistic, professional portrait.
    `;

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

        // Parse response for the generated image
        if (response.candidates?.[0]?.content?.parts) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    return part.inlineData.data;
                }
            }
        }
        return null;

    } catch (error) {
        console.error("Career Avatar Gen Error:", error);
        return null;
    }
};