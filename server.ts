import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "5mb" }));

  // API: Health check
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
      timestamp: new Date().toISOString()
    });
  });

  // API: Specialized Gemini AI Anti-Bullying Pedagogical Adaptation
  app.post("/api/adapt-activity", async (req, res) => {
    try {
      const {
        activityTitle,
        activityDescription,
        ageGroup,
        neurodiversityType,
        supportLevel,
        studentName,
        sensorySensitivities,
        specialInterests
      } = req.body;

      if (!activityTitle || !neurodiversityType) {
        return res.status(400).json({ error: "Título e tipo de neurodivergência são obrigatórios." });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(200).json({
          success: false,
          fallbackRequired: true,
          message: "GEMINI_API_KEY não configurada no servidor. Utilizando motor pedagógico offline nativo."
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build"
          }
        }
      });

      const prompt = `Você é um Especialista Sênior em Pedagogia Inclusiva, Desenho Universal para a Aprendizagem (DUA), Transtorno do Espectro Autista (TEA), TDAH, TOD e Mediação Escolar contra o Bullying.

Adapte a seguinte atividade escolar com foco prioritário em PREVENÇÃO E RESPOSTA AO BULLYING para uma criança com o perfil abaixo:

DADOS DA ATIVIDADE ORIGINAL:
- Título: ${activityTitle}
- Descrição/Proposta: ${activityDescription || "Atividade de conscientização e convivência social"}
- Faixa Etária/Ano Escolar: ${ageGroup || "Ensino Fundamental"}

PERFIL DO ALUNO:
- Aluno: ${studentName || "Aluno(a)"}
- Neurodivergência: ${neurodiversityType}
- Nível de Suporte: ${supportLevel || "Nível 1"}
- Sensibilidades Sensoriais: ${sensorySensitivities || "Sensibilidade auditiva a ruídos súbitos"}
- Interesses Especiais/Hiperfoco: ${specialInterests || "Geral / Desenhos / Dinossauros"}

Sua resposta DEVE ser um objeto JSON estritamente formatado com os seguintes campos:
{
  "adaptedTitle": "Título lúdico adaptado",
  "pedagogicalGoal": "Objetivo pedagógico inclusivo claro e mensurável",
  "antiBullyingObjective": "Objetivo específico de prevenção ao bullying, empatia ou autorregulação",
  "stepByStep": [
    "Passo 1 concreto com instrução direta e tempo estimado",
    "Passo 2 com apoio visual",
    "Passo 3 com mediação entre pares",
    "Passo 4 com encerramento seguro"
  ],
  "visualGuidelines": [
    "Diretriz visual específica (ex: cartões de comunicação, contraste, cronograma em tiras)",
    "Suporte pictográfico ou história social sugerida",
    "Sinalização de limites e regras de respeito visualmente claras"
  ],
  "sensoryGuidelines": [
    "Acomodação sensorial ambiental (ex: iluminação, nível de ruído)",
    "Estratégia de autorregulação (ex: cantinho calmo, pausas motoras proprioceptivas)",
    "Fidget ou recurso tátil permitido"
  ],
  "socialStoryScript": "História social curta ou roteiro de conversa social (script social) para ensinar a criança a reconhecer brincadeira versus bullying e saber a quem recorrer.",
  "bystanderGuideline": "Como os colegas da turma (espectadores) devem ser instruídos a apoiar e incluir esse aluno sem condescendência.",
  "teacherMediationTips": [
    "Dica prática 1 para o professor regente/mediador",
    "Dica prática 2 para evitar sobrecarga ou frustração",
    "Dica prática 3 para validação emocional"
  ],
  "evaluationMetric": "Critério qualitativo e observacional de sucesso na participação"
}

Responda APENAS com o JSON válido, sem texto introdutório ou markdown além do bloco json.`;

      // Candidate models for resilience (primary 3.8, fallback flash-latest, flash-lite)
      const candidateModels = ["gemini-3.8-flash", "gemini-flash-latest", "gemini-3.1-flash-lite"];
      let lastError: any = null;

      for (const model of candidateModels) {
        // Attempt with single retry on 503 / 429
        for (let attempt = 1; attempt <= 2; attempt++) {
          try {
            const response = await ai.models.generateContent({
              model,
              contents: prompt,
              config: {
                responseMimeType: "application/json",
                temperature: 0.3
              }
            });

            const responseText = response.text || "{}";
            const cleanText = responseText.replace(/```json\s*|\s*```/g, "").trim();
            const parsedData = JSON.parse(cleanText);
            return res.json({ success: true, data: parsedData, source: model });
          } catch (modelErr: any) {
            lastError = modelErr;
            const errMsg = String(modelErr?.message || "");
            const isTransient =
              errMsg.includes("503") ||
              errMsg.includes("high demand") ||
              errMsg.includes("UNAVAILABLE") ||
              errMsg.includes("429") ||
              errMsg.includes("RESOURCE_EXHAUSTED");

            if (isTransient && attempt === 1) {
              // Wait 700ms before retry
              await new Promise((resolve) => setTimeout(resolve, 700));
              continue;
            }
            // Otherwise break inner loop to try next candidate model
            break;
          }
        }
      }

      console.warn("Todos os modelos online Gemini atingiram limite temporário (503). Ativando Matriz Pedagógica Offline.");
      return res.status(200).json({
        success: false,
        fallbackRequired: true,
        message: "Serviço de IA temporariamente sob alta demanda (503). Matriz Heurística Pedagógica Offline ativada com sucesso.",
        error: lastError?.message
      });
    } catch (err: any) {
      console.warn("Erro geral na rota de adaptação. Recorrendo à matriz offline:", err);
      return res.status(200).json({
        success: false,
        fallbackRequired: true,
        message: "Erro inesperado ao consultar IA. Recorrendo à Matriz Heurística Offline.",
        error: err?.message
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`NeuroEduca server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
