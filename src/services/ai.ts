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

export async function generateDashboardInsights(stats: any, memberData: any, socialData: any) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Atue como um consultor estratégico de igreja. Analise os seguintes dados do dashboard e gere um insight curto e acionável (máximo 2 frases) sobre uma tendência positiva ou um ponto de atenção. Fale diretamente com o pastor.
      
      Dados:
      Estatísticas Gerais: ${JSON.stringify(stats)}
      Crescimento de Membros: ${JSON.stringify(memberData)}
      Ação Social: ${JSON.stringify(socialData)}`,
    });
    return response.text;
  } catch (error) {
    console.error("Erro na IA:", error);
    return "Não foi possível gerar insights no momento.";
  }
}

export async function generateFinancialAnalysis(transactions: any[], monthlyData: any[]) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Atue como um consultor financeiro de igreja. Analise as transações recentes e o fluxo de caixa mensal. Gere uma análise curta (máximo 3 frases) identificando padrões de gastos ou oportunidades de economia.
      
      Transações Recentes: ${JSON.stringify(transactions.slice(0, 10))}
      Fluxo de Caixa Mensal: ${JSON.stringify(monthlyData)}`,
    });
    return response.text;
  } catch (error) {
    console.error("Erro na IA:", error);
    return "Não foi possível gerar a análise financeira.";
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
