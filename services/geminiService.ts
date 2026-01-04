
import { GoogleGenAI } from "@google/genai";
import { SimulationState } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const getAiExplanation = async (state: SimulationState, query: string) => {
  const model = "gemini-3-flash-preview";
  
  const systemInstruction = `你是一位专业的生物学教师，正在向学生解释光合作用。
当前的模拟器状态是：
- 光照强度: ${state.lightIntensity}%
- 二氧化碳浓度: ${state.co2Level}%
- 温度: ${state.temperature}°C

光合作用公式：6CO2 + 6H2O + 光能 -> C6H12O6 + 6O2。
请结合当前的数值提供科学的、有趣的解释。如果某个限制因子（如光照太低）导致效率下降，请指出来。
使用简体中文回答，保持语气亲切和鼓励。`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: query,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "抱歉，我的生物大脑出了点小问题，请稍后再试。";
  }
};
