import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export async function generateReportSummary(contextData: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Atue como um consultor de gestão eclesiástica. Analise os seguintes dados da igreja e gere um resumo executivo curto (máximo 3 frases) destacando crescimento, finanças e pontos de atenção. Use negrito para números importantes. Dados: ${contextData}`,
    });
    return response.text;
  } catch (error) {
    console.error("Erro na IA:", error);
    return "Não foi possível gerar o resumo.";
  }
}

export async function generateLessonTopics(classProfile: string, topic: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Atue como um coordenador pedagógico de Escola Bíblica Dominical. Gere 3 sugestões de tópicos de aula para uma classe com o seguinte perfil: "${classProfile}". O tema geral é "${topic}". Para cada sugestão, inclua um título cativante e uma breve descrição de 1 frase. Retorne em formato de lista markdown.`,
    });
    return response.text;
  } catch (error) {
    console.error("Erro na IA:", error);
    return "Não foi possível gerar sugestões no momento.";
  }
}
