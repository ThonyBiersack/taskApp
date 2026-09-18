import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const askAI = async (konten) => {
    try {
        if (!konten) throw new Error("what do you need?");

        const prompt = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: `Break down this task into steps:
            ${konten} Return ONLY a valid JSON array with this exact format:
        [{"step": 1, "title":"...", "description": "..."}] No explanation, no markdown, just raw JSON.`,
        });
        return prompt.candidates[0].content.parts[0].text;
    } catch (error) {
        console.log('❌ ERROR:', error.message);
        throw error;
    }
}

export default askAI;