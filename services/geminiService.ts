import { GoogleGenAI, Chat, Content } from "@google/genai";
import { SKILLFI_SYSTEM_INSTRUCTION } from "../constants";

const getClient = () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        console.error("API_KEY is missing in environment variables.");
        throw new Error("API_KEY is missing");
    }
    return new GoogleGenAI({ apiKey });
};

// Initialize a persistent chat session
export const initializeChat = async (): Promise<Chat> => {
    const ai = getClient();
    
    // Using gemini-2.5-flash-latest as it is robust for persona-based chat
    // or gemini-3-flash-preview as per guidelines for basic text tasks.
    // Using gemini-3-flash-preview as requested for text tasks.
    const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
            systemInstruction: SKILLFI_SYSTEM_INSTRUCTION,
            temperature: 0.7, // Balance between creativity and precision
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

        // Construct the message payload
        // Chat.sendMessage accepts a 'message' property which can be string or Part[]
        
        if (attachment) {
            // Multimodal request
            const parts = [
                { text: text },
                {
                    inlineData: {
                        mimeType: attachment.mimeType,
                        data: attachment.data
                    }
                }
            ];
            
            // For multimodal inputs, we might need to use a model that supports images/audio heavily
            // but gemini-3-flash-preview supports multimodal.
            
            const result = await chat.sendMessage({
                message: parts
            });
            responseText = result.text || "";
        } else {
            // Text only request
            const result = await chat.sendMessage({
                message: text
            });
            responseText = result.text || "";
        }

        return responseText;

    } catch (error) {
        console.error("Gemini API Error:", error);
        return "[Soft alert tone] Connection interrupted. Network congested. Please try again.";
    }
};