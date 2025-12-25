"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { History, Globe, Brain, Search, Sparkles, Snowflake, Book, MessageCircle, Hash } from "lucide-react";

// --- LES RÈGLES DU PDF ---
const GRAMMAR_TOPICS = [
  "Adverbs (Position & Types)", "Tenses & Aspects (Simple, Continuous, Perfect)",
  "Collocations (go/get/make...)", "Conditionals (If clauses 1, 2, 3)",
  "Future Forms (Will, Going to, V-ing)", "Had better / Would rather",
  "Modals (can, must, should, etc.)", "Phrasal Verbs", "Causative Verbs",
  "Adjectives (Order & -ed/-ing)", "Articles (A, The, Ø)", "Comparatives & Superlatives",
  "Countable vs Uncountable", "Quantifiers (Some, Any, Much, Many...)",
  "Active vs Passive Voice", "Gerunds (Verb + ing)", "Idiomatic Structures",
  "Linking Words", "Prepositions", "Word Order & Syntax", "Used to vs Be used to",
  "False Friends (Cognates)", "Do vs Make", "Spelling Traps"
];

export default function Home() {
  const [keyword, setKeyword] = useState("");
  const [level, setLevel] = useState("Intermédiaire");
  const [language, setLanguage] = useState("Français");
  const [exerciseType, setExerciseType] = useState("qcm");
  const [feedbackLang, setFeedbackLang] = useState("Français");
  
  // NOUVEAU : State pour le nombre de questions (Défaut 5)
  const [questionCount, setQuestionCount] = useState(5);
  
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSearch = async () => {
    const finalKeyword = exerciseType === "grammar" && !keyword ? GRAMMAR_TOPICS[0] : keyword;
    
    if (!finalKeyword.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/generate-theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          keyword: finalKeyword, 
          level, 
          language: exerciseType === "grammar" ? "Anglais" : language,
          exerciseType,
          feedbackLang,
          questionCount // On envoie le nombre choisi
        }), 
      });
      const data = await response.json();
      if (data.id) {
        localStorage.setItem("courseData", JSON.stringify(data));
        router.push(`/exercise/${data.id}`);
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de la génération.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
      <div className="snow"></div>

      <Link href="/history" className="absolute top-6 right-6 flex items-center gap-2 bg-white/5 border border-white/10 text-slate-200 px-5 py-3 rounded-full font-bold hover:bg-white/20 hover:text-white transition-all z-50">
        <History size={20} />
        <span className="hidden sm:inline">Mon Historique</span>
      </Link>

      <div className="w-full max-w-5xl z-10 text-center space-y-12 relative">
        <div className="animate-fade-in-up">
          <div className="flex justify-center mb-4">
              <div className="bg-blue-500/20 p-4 rounded-full shadow-[0_0_30px_rgba(59,130,246,0.5)] border border-blue-500/30 backdrop-blur-md">
                <Snowflake className="text-white animate-spin-slow" size={48} />
              </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight drop-shadow-2xl">
            EduGEN <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-500">Winter</span>
          </h1>
        </div>

        <div className="space-y-6 max-w-4xl mx-auto">
          
          {/* LIGNE 1 : OPTIONS */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4"> {/* Changé en 4 colonnes */}
            
            {/* Mode */}
            <div className="bg-slate-900/60 backdrop-blur-md border border-slate-700 p-2 rounded-2xl transition shadow-lg">
              <label className="flex items-center gap-2 text-xs font-bold text-blue-300 uppercase tracking-wider mb-1 px-2">
                <Search size={14} /> Mode
              </label>
              <select value={exerciseType} onChange={(e) => {
                  setExerciseType(e.target.value);
                  if(e.target.value === "grammar") { setKeyword(GRAMMAR_TOPICS[0]); setLanguage("Anglais"); } 
                  else { setKeyword(""); }
                }} className="w-full bg-transparent text-white font-medium p-2 outline-none cursor-pointer border-none">
                <option className="bg-slate-900 text-gray-300" value="qcm">QCM Standard</option>
                <option className="bg-slate-900 text-blue-300 font-bold" value="grammar">🇬🇧 Grammar Drill</option>
                <option className="bg-slate-900 text-gray-300" value="trueFalse">Vrai / Faux</option>
                <option className="bg-slate-900 text-gray-300" value="association">Association</option>
                <option className="bg-slate-900 text-gray-300" value="ordering">Classement</option>
                <option className="bg-slate-900 text-gray-300" value="blanks">Phrases à trous</option>
                <option className="bg-slate-900 text-gray-300" value="text">Mini Texte</option>
              </select>
            </div>

            {/* Niveau */}
            <div className="bg-slate-900/60 backdrop-blur-md border border-slate-700 p-2 rounded-2xl transition shadow-lg">
              <label className="flex items-center gap-2 text-xs font-bold text-blue-300 uppercase tracking-wider mb-1 px-2">
                <Brain size={14} /> Niveau
              </label>
              <select value={level} onChange={(e) => setLevel(e.target.value)} className="w-full bg-transparent text-white font-medium p-2 outline-none cursor-pointer border-none">
                <option className="bg-slate-900 text-gray-300" value="Débutant">Débutant ⛄</option>
                <option className="bg-slate-900 text-gray-300" value="Intermédiaire">Intermédiaire 🎿</option>
                <option className="bg-slate-900 text-gray-300" value="Expert">Expert 🏔️</option>
              </select>
            </div>

            {/* NOUVEAU : Nombre de questions */}
            <div className="bg-slate-900/60 backdrop-blur-md border border-slate-700 p-2 rounded-2xl transition shadow-lg">
              <label className="flex items-center gap-2 text-xs font-bold text-yellow-400 uppercase tracking-wider mb-1 px-2">
                <Hash size={14} /> Quantité
              </label>
              <input 
                type="number" 
                min="5" 
                max="50" 
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="w-full bg-transparent text-white font-medium p-2 outline-none border-none"
              />
            </div>

            {/* Langue / Feedback */}
            <div className="bg-slate-900/60 backdrop-blur-md border border-slate-700 p-2 rounded-2xl transition shadow-lg">
              {exerciseType === "grammar" ? (
                 <>
                  <label className="flex items-center gap-2 text-xs font-bold text-green-400 uppercase tracking-wider mb-1 px-2">
                    <MessageCircle size={14} /> Feedback
                  </label>
                  <select value={feedbackLang} onChange={(e) => setFeedbackLang(e.target.value)} className="w-full bg-transparent text-white font-medium p-2 outline-none cursor-pointer border-none">
                    <option className="bg-slate-900 text-gray-300" value="Français">Français 🇫🇷</option>
                    <option className="bg-slate-900 text-gray-300" value="Anglais">English 🇬🇧</option>
                  </select>
                 </>
              ) : (
                <>
                  <label className="flex items-center gap-2 text-xs font-bold text-blue-300 uppercase tracking-wider mb-1 px-2">
                    <Globe size={14} /> Langue
                  </label>
                  <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full bg-transparent text-white font-medium p-2 outline-none cursor-pointer border-none">
                    <option className="bg-slate-900 text-gray-300" value="Français">Français 🇫🇷</option>
                    <option className="bg-slate-900 text-gray-300" value="Anglais">English 🇬🇧</option>
                    <option className="bg-slate-900 text-gray-300" value="Espagnol">Español 🇪🇸</option>
                  </select>
                </>
              )}
            </div>

          </div>

          {/* LIGNE 2 : INPUT */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow group">
              <div className="absolute inset-0 bg-blue-500/10 rounded-2xl blur-lg group-hover:bg-blue-500/20 transition"></div>
              <div className="relative bg-slate-900/80 backdrop-blur-xl border border-slate-600 rounded-2xl flex items-center p-2 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-500/30 transition shadow-2xl">
                {exerciseType === "grammar" ? (
                  <>
                    <Book className="text-green-400 ml-4" size={24} />
                    <select value={keyword} onChange={(e) => setKeyword(e.target.value)} className="w-full p-4 bg-transparent border-none focus:outline-none text-xl text-white cursor-pointer">
                      {GRAMMAR_TOPICS.map((topic, index) => (
                        <option key={index} value={topic} className="bg-slate-900">{topic}</option>
                      ))}
                    </select>
                  </>
                ) : (
                  <>
                    <Search className="text-slate-400 ml-4" size={24} />
                    <input type="text" className="w-full p-4 bg-transparent border-none focus:outline-none text-xl text-white placeholder-slate-500" placeholder="Sujet (ex: Noël, Ski, Napoléon...)" value={keyword} onChange={(e) => setKeyword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()} />
                  </>
                )}
              </div>
            </div>

            <button onClick={handleSearch} disabled={loading || (!keyword && exerciseType !== "grammar")} className={`px-10 py-4 rounded-2xl font-bold text-xl shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all flex items-center justify-center gap-3 md:w-auto w-full border border-blue-400/30 ${loading ? "bg-slate-800 text-slate-400 cursor-not-allowed" : "bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:scale-105 hover:shadow-[0_0_40px_rgba(6,182,212,0.5)]"}`}>
              {loading ? "..." : <><Sparkles size={24}/> GO</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}