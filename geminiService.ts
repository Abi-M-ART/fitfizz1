
import { GoogleGenAI, Modality } from "@google/genai";

// Initialize AI client with the provided API key
const getAIClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Basic Text Tasks (Summarization, simple Q&A)
 */
export const getFastChatResponse = async (message: string) => {
  const ai = getAIClient();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: message,
    });
    return response.text || "I'm sorry, I couldn't process that.";
  } catch (error) {
    console.error("Fast Chat API Error:", error);
    throw new Error("Failed to connect to the fitness intelligence server.");
  }
};

/**
 * Complex Tasks (Advanced reasoning, coding, medical data interpretation)
 */
export const getComplexChatResponse = async (message: string) => {
  const ai = getAIClient();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: message,
      config: {
        thinkingConfig: { thinkingBudget: 32768 }
      },
    });
    return {
      text: response.text || "Analysis incomplete.",
      thinking: "Deep reasoning engine optimized for health data interpretation."
    };
  } catch (error) {
    console.error("Complex Chat API Error:", error);
    return { text: "The reasoning server is currently under high load.", thinking: "" };
  }
};

/**
 * Audio Transcription for Voice Commands
 */
export const transcribeAudio = async (base64Audio: string) => {
  const ai = getAIClient();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          { inlineData: { data: base64Audio, mimeType: "audio/wav" } },
          { text: "Transcribe the following health query precisely." }
        ]
      },
    });
    return response.text || "";
  } catch (error) {
    console.error("Transcription API Error:", error);
    return null;
  }
};

/**
 * Text-to-Speech for Health Guidance
 */
export const generateSpeech = async (text: string) => {
  const ai = getAIClient();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  } catch (error) {
    console.error("TTS API Error:", error);
    return null;
  }
};

/**
 * Medical Report Analysis with Search Grounding
 */
export const analyzeReport = async (imageData: string, mimeType: string) => {
  const ai = getAIClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          { inlineData: { data: imageData.split(',')[1], mimeType: mimeType } },
          { text: "Analyze this medical report thoroughly. Extract key health metrics, compare them to standard healthy ranges, and suggest lifestyle adjustments for weight loss and overall health. Maintain a supportive but professional tone." },
        ],
      },
      config: {
        thinkingConfig: { thinkingBudget: 16000 },
        tools: [{ googleSearch: {} }] // Use search to verify medical ranges and latest guidelines
      }
    });
    return {
      text: response.text || "Report analysis failed to generate meaningful insights.",
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error) {
    console.error("Analysis API Error:", error);
    return {
      text: "The medical analysis server is currently unreachable. Please try again shortly.",
      sources: []
    };
  }
};

/**
 * Intelligent Chatbot with Web Grounding
 */
export const getSmartChatResponse = async (message: string) => {
  const ai = getAIClient();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: message,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: "You are the FitFizz AI Coach. Provide evidence-based fitness and nutrition advice. Always cite your sources when providing health statistics or news. If asked about local foods, suggest the healthiest preparations."
      },
    });
    
    return {
      text: response.text || "Connection stable, but no data returned.",
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error) {
    console.error("Smart Assistant API Error:", error);
    return { text: "Our coaching network is experiencing connectivity issues.", sources: [] };
  }
};

/**
 * Edit images using Gemini 2.5 Flash Image (Nano Banana)
 */
export const editImageWithGemini = async (base64Data: string, mimeType: string, prompt: string) => {
  const ai = getAIClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image data returned from Gemini.");
  } catch (error) {
    console.error("Image Edit API Error:", error);
    throw error;
  }
};
