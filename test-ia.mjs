import { GoogleGenerativeAI } from "@google/generative-ai";

// ⚠️ METS TA NOUVELLE CLÉ PERSO ICI
const apiKey = "AIzaSyDYFAOuUi7228FtcGxBpapGjGqKW9qfOkU"; 

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function run() {
  console.log("📡 Tentative de connexion à Google via Internet...");
  try {
    const result = await model.generateContent("Dis juste bonjour");
    console.log("✅ SUCCÈS ! L'IA a répondu :", result.response.text());
  } catch (error) {
    console.error("❌ ÉCHEC TOTAL.");
    console.error("Raison :", error.message);
    if (error.message.includes("fetch failed") || error.message.includes("404")) {
      console.log("👉 DIAGNOSTIC : Ton réseau bloque Google AI. Essaie la 4G.");
    }
  }
}

run();