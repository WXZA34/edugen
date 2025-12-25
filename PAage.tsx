"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle, ArrowRight, RefreshCw, Home, ArrowUp, ArrowDown, BookOpen, BrainCircuit, History } from "lucide-react";

// Types pour la gestion des erreurs
type Mistake = { question: string; userRep: string; correct: string };
type FinishCallback = (s: number, t: number, m: Mistake[]) => void;

// ==========================================
// 1. JEU QCM
// ==========================================
const QcmGame = ({ data, onFinish }: { data: any, onFinish: FinishCallback }) => {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState<Mistake[]>([]);
  const currentQ = data.questions[index];

  const handleNext = () => {
    const isCorrect = selected === currentQ.answer;
    const newScore = isCorrect ? score + 1 : score;
    const newMistakes = isCorrect ? mistakes : [...mistakes, { question: currentQ.question, userRep: selected || "Aucune", correct: currentQ.answer }];

    if (index + 1 < data.questions.length) {
      setScore(newScore);
      setMistakes(newMistakes);
      setIndex(index + 1);
      setSelected(null);
    } else {
      onFinish(newScore, data.questions.length, newMistakes);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
      <div className="text-sm text-gray-400 mb-4 uppercase font-bold tracking-wider">Question {index + 1} / {data.questions.length}</div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">{currentQ.question}</h2>
      <div className="space-y-3">
        {currentQ.options.map((opt: string, i: number) => {
          let style = "border-2 border-gray-100 hover:border-blue-300 hover:bg-blue-50";
          if (selected) {
            if (opt === currentQ.answer) style = "bg-green-100 border-green-500 text-green-800";
            else if (selected === opt) style = "bg-red-100 border-red-500 text-red-800";
            else style = "opacity-50 grayscale";
          }
          return (
            <button key={i} onClick={() => !selected && setSelected(opt)} disabled={!!selected}
              className={`w-full text-left p-4 rounded-xl font-medium transition-all ${style}`}>
              {opt}
            </button>
          );
        })}
      </div>
      {selected && (
        <button onClick={handleNext} className="mt-6 w-full bg-gray-900 text-white py-3 rounded-xl font-bold hover:scale-[1.02] transition">
          Suivant <ArrowRight className="inline w-5 h-5 ml-2"/>
        </button>
      )}
    </div>
  );
};

// ==========================================
// 2. JEU VRAI / FAUX
// ==========================================
const TrueFalseGame = ({ data, onFinish }: { data: any, onFinish: FinishCallback }) => {
  const [index, setIndex] = useState(0);
  const [answered, setAnswered] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState<Mistake[]>([]);
  const currentQ = data.questions[index];

  const handleAnswer = (choice: boolean) => setAnswered(choice);

  const handleNext = () => {
    const isCorrect = (answered === currentQ.isTrue);
    const newScore = isCorrect ? score + 1 : score;
    const newMistakes = isCorrect ? mistakes : [...mistakes, { question: currentQ.statement, userRep: answered ? "Vrai" : "Faux", correct: currentQ.isTrue ? "Vrai" : "Faux" }];

    if (index + 1 < data.questions.length) {
      setScore(newScore);
      setMistakes(newMistakes);
      setIndex(index + 1);
      setAnswered(null);
    } else {
      onFinish(newScore, data.questions.length, newMistakes);
    }
  };

  const isCorrect = answered !== null && (answered === currentQ.isTrue);

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-xl mx-auto text-center">
      <div className="text-sm text-purple-500 font-bold mb-6">AFFIRMATION {index + 1} / {data.questions.length}</div>
      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-8 min-h-[120px] flex items-center justify-center">
        <h2 className="text-xl font-medium text-gray-800 italic">"{currentQ.statement}"</h2>
      </div>
      
      {answered === null ? (
        <div className="grid grid-cols-2 gap-4">
          <button onClick={() => handleAnswer(true)} className="p-6 bg-green-50 border-2 border-green-200 rounded-xl hover:bg-green-100 text-green-700 font-bold text-xl hover:scale-105 transition">VRAI</button>
          <button onClick={() => handleAnswer(false)} className="p-6 bg-red-50 border-2 border-red-200 rounded-xl hover:bg-red-100 text-red-700 font-bold text-xl hover:scale-105 transition">FAUX</button>
        </div>
      ) : (
        <div className={`p-4 rounded-xl animate-fade-in ${isCorrect ? "bg-green-100 text-green-900" : "bg-red-100 text-red-900"}`}>
          <p className="font-bold text-lg mb-1">{isCorrect ? "Bien joué !" : "Raté !"}</p>
          <p>{currentQ.correction}</p>
          <button onClick={handleNext} className="mt-4 w-full bg-gray-900 text-white py-3 rounded-lg font-bold hover:scale-[1.02] transition">Continuer</button>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 3. JEU PHRASES À TROUS
// ==========================================
const BlanksGame = ({ data, onFinish }: { data: any, onFinish: FinishCallback }) => {
  const [index, setIndex] = useState(0);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState<Mistake[]>([]);
  const currentS = data.sentences[index];

  const handleNext = () => {
    const isCorrect = selectedWord === currentS.missingWord;
    const newScore = isCorrect ? score + 1 : score;
    const newMistakes = isCorrect ? mistakes : [...mistakes, { question: currentS.textWithHole, userRep: selectedWord || "?", correct: currentS.missingWord }];

    if (index + 1 < data.sentences.length) {
      setScore(newScore);
      setMistakes(newMistakes);
      setIndex(index + 1);
      setSelectedWord(null);
    } else {
      onFinish(newScore, data.sentences.length, newMistakes);
    }
  };

  const parts = currentS.textWithHole.split("___"); 

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
      <div className="text-sm text-blue-500 font-bold mb-4 uppercase">Complète la phrase {index + 1} / {data.sentences.length}</div>
      <div className="text-2xl leading-relaxed text-gray-800 mb-8 font-serif">
        {parts[0]}
        <span className={`inline-block border-b-4 px-2 min-w-[100px] text-center font-bold ${selectedWord ? (selectedWord === currentS.missingWord ? "border-green-500 text-green-600" : "border-red-500 text-red-600") : "border-gray-300 text-gray-400"}`}>
          {selectedWord || "?"}
        </span>
        {parts[1]}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {currentS.options.map((word: string, i: number) => (
          <button key={i} onClick={() => !selectedWord && setSelectedWord(word)} disabled={!!selectedWord}
            className={`p-3 rounded-lg border-2 font-medium transition-all ${selectedWord === word ? (word === currentS.missingWord ? "bg-green-500 text-white border-green-500" : "bg-red-500 text-white border-red-500") : "bg-white border-gray-200 hover:border-blue-400 text-gray-700"} ${selectedWord && selectedWord !== word ? "opacity-30" : ""}`}>
            {word}
          </button>
        ))}
      </div>
      {selectedWord && <button onClick={handleNext} className="mt-8 w-full bg-gray-900 text-white py-3 rounded-xl font-bold">Suivant</button>}
    </div>
  );
};

// ==========================================
// 4. JEU ASSOCIATION
// ==========================================
const AssociationGame = ({ data, onFinish }: { data: any, onFinish: FinishCallback }) => {
  const [pairs] = useState<any[]>(data.pairs);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matches, setMatches] = useState<string[]>([]);
  const [errors, setErrors] = useState<number>(0);

  const handleLeftClick = (item: string) => {
    if (!matches.includes(item)) setSelectedLeft(item);
  };

  const handleRightClick = (rightItem: string) => {
    if (!selectedLeft) return;
    const pair = pairs.find(p => p.left === selectedLeft && p.right === rightItem);
    
    if (pair) {
      const newMatches = [...matches, selectedLeft, rightItem];
      setMatches(newMatches);
      setSelectedLeft(null);
      if (newMatches.length >= pairs.length * 2) {
        const finalScore = Math.max(0, 10 - errors); 
        onFinish(finalScore, 10, []); 
      }
    } else {
      setErrors(errors + 1);
      alert("Ce n'est pas la bonne paire !");
      setSelectedLeft(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-6 text-center">Relie les éléments correspondants</h2>
      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-4">
          {pairs.map((p, i) => (
            <button key={i} onClick={() => handleLeftClick(p.left)} disabled={matches.includes(p.left)}
              className={`w-full p-4 rounded-xl border-2 font-medium transition-all ${matches.includes(p.left) ? "bg-gray-100 border-transparent text-gray-300 scale-95" : selectedLeft === p.left ? "bg-blue-100 border-blue-500 text-blue-800 scale-105" : "bg-white border-gray-200 hover:border-blue-300"}`}>
              {p.left}
            </button>
          ))}
        </div>
        <div className="space-y-4">
          {[...pairs].sort(() => Math.random() - 0.5).map((p, i) => (
            <button key={i} onClick={() => handleRightClick(p.right)} disabled={matches.includes(p.right)}
              className={`w-full p-4 rounded-xl border-2 font-medium transition-all ${matches.includes(p.right) ? "bg-green-50 border-green-200 text-green-300 scale-95" : "bg-white border-gray-200 hover:border-purple-300"}`}>
              {p.right}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 5. JEU CLASSEMENT (Ordering)
// ==========================================
const OrderingGame = ({ data, onFinish }: { data: any, onFinish: FinishCallback }) => {
  const [items, setItems] = useState<any[]>(data.items);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const moveItem = (index: number, direction: -1 | 1) => {
    if (submitted) return;
    const newItems = [...items];
    const targetIndex = index + direction;
    if (targetIndex >= 0 && targetIndex < newItems.length) {
      [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
      setItems(newItems);
    }
  };

  const handleValidate = () => {
    const currentOrderIds = items.map(i => i.id);
    let correctCount = 0;
    currentOrderIds.forEach((id, idx) => { if (id === data.correctOrder[idx]) correctCount++; });
    
    setSubmitted(true);
    setScore(correctCount);
    const mistakes = correctCount < items.length ? [{ question: "Ordre incorrect", userRep: "Ton ordre", correct: "Voir correction" }] : [];
    onFinish(correctCount, items.length, mistakes);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-6 text-center">Mets ces éléments dans l'ordre</h2>
      <div className="space-y-2 mb-8">
        {items.map((item, index) => {
            const isCorrectPosition = submitted && item.id === data.correctOrder[index];
            const isWrongPosition = submitted && !isCorrectPosition;
            return (
            <div key={item.id} className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${isCorrectPosition ? "bg-green-50 border-green-500" : isWrongPosition ? "bg-red-50 border-red-200" : "bg-white border-gray-200"}`}>
                <span className="font-bold text-gray-400 w-6">#{index + 1}</span>
                <div className="flex-1 font-medium">{item.content}</div>
                {!submitted && (
                <div className="flex flex-col gap-1">
                    <button onClick={() => moveItem(index, -1)} disabled={index === 0} className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"><ArrowUp size={18}/></button>
                    <button onClick={() => moveItem(index, 1)} disabled={index === items.length - 1} className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"><ArrowDown size={18}/></button>
                </div>
                )}
            </div>
            );
        })}
      </div>
      {!submitted ? (
        <button onClick={handleValidate} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition">Valider l'ordre</button>
      ) : (
        <div className="text-center text-xl font-bold">{score === items.length ? "Parfait ! 🏆" : `Score : ${score}/${items.length}`}</div>
      )}
    </div>
  );
};

// ==========================================
// 6. JEU TEXTE
// ==========================================
const TextGame = ({ data, onFinish }: { data: any, onFinish: FinishCallback }) => {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState<Mistake[]>([]);
  const currentQ = data.questions[index];

  const handleNext = () => {
    const isCorrect = selected === currentQ.answer;
    const newScore = isCorrect ? score + 1 : score;
    const newMistakes = isCorrect ? mistakes : [...mistakes, { question: currentQ.question, userRep: selected || "Rien", correct: currentQ.answer }];

    if (index + 1 < data.questions.length) {
      setScore(newScore);
      setMistakes(newMistakes);
      setIndex(index + 1);
      setSelected(null);
    } else {
      onFinish(newScore, data.questions.length, newMistakes);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 max-w-6xl mx-auto">
      <div className="w-full md:w-1/2 bg-white rounded-2xl shadow-lg p-8 h-fit border-l-4 border-purple-500">
        <h3 className="text-gray-500 font-bold uppercase text-xs mb-2 flex items-center gap-2"><BookOpen size={16}/> Document</h3>
        <div className="prose prose-slate max-w-none leading-relaxed text-justify text-gray-700 font-serif">{data.textContent}</div>
      </div>
      <div className="w-full md:w-1/2 bg-white rounded-2xl shadow-xl p-8 h-fit">
        <div className="text-sm text-gray-400 mb-4 uppercase font-bold tracking-wider">Question {index + 1} / {data.questions.length}</div>
        <h2 className="text-xl font-bold text-gray-800 mb-6">{currentQ.question}</h2>
        <div className="space-y-3">
            {currentQ.options.map((opt: string, i: number) => {
            let style = "border-2 border-gray-100 hover:border-blue-300 hover:bg-blue-50";
            if (selected) {
                if (opt === currentQ.answer) style = "bg-green-100 border-green-500 text-green-800";
                else if (selected === opt) style = "bg-red-100 border-red-500 text-red-800";
                else style = "opacity-50 grayscale";
            }
            return (
                <button key={i} onClick={() => !selected && setSelected(opt)} disabled={!!selected}
                className={`w-full text-left p-4 rounded-xl font-medium transition-all ${style}`}>{opt}</button>
            );
            })}
        </div>
        {selected && <button onClick={handleNext} className="mt-6 w-full bg-gray-900 text-white py-3 rounded-xl font-bold hover:scale-[1.02] transition">Suivant</button>}
      </div>
    </div>
  );
};


// ==========================================
// COMPOSANT PRINCIPAL (LOGIQUE FEEDBACK & HISTORY)
// ==========================================
export default function ExercisePage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [finalResult, setFinalResult] = useState<{score: number, total: number, mistakes: Mistake[]} | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loadingFeedback, setLoadingFeedback] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("courseData");
    if (saved) setData(JSON.parse(saved));
    else router.push("/");
  }, [router]);

  // Fonction appelée à la fin du jeu
  const handleFinish = (score: number, total: number, mistakes: Mistake[]) => {
    setFinalResult({ score, total, mistakes });

    // --- SAUVEGARDE DANS L'HISTORIQUE ---
    const historyItem = {
      date: new Date().toISOString(),
      quizData: data,
      score,
      total,
      mistakesCount: mistakes.length
    };
    
    const existingHistory = JSON.parse(localStorage.getItem("eduGen_history") || "[]");
    const newHistory = [...existingHistory, historyItem];
    localStorage.setItem("eduGen_history", JSON.stringify(newHistory));
  };

  // Appel API pour l'aide-mémoire
  const generateFeedback = async () => {
    if (!finalResult || finalResult.mistakes.length === 0) return;
    setLoadingFeedback(true);
    try {
      const res = await fetch("/api/generate-feedback", {
        method: "POST",
        body: JSON.stringify({ 
          topic: data.topic, 
          mistakes: finalResult.mistakes,
          feedbackLang: data.feedbackLang // 👈 AJOUT DE LA LANGUE ICI
        })
      });
      const json = await res.json();
      setFeedback(json.feedback);
    } catch (e) {
      alert("Erreur lors de la génération du feedback");
    } finally {
      setLoadingFeedback(false);
    }
  };

  if (!data) return <div className="min-h-screen flex items-center justify-center animate-pulse">Chargement... ⏳</div>;

  // --- ECRAN DE FIN ---
  if (finalResult) {
    const percentage = Math.round((finalResult.score / finalResult.total) * 100);
    return (
      <div className="min-h-screen bg-gray-50 p-4 font-sans">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-xl animate-bounce-in">
          
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">{percentage >= 50 ? "🎉" : "📚"}</div>
            <h1 className="text-3xl font-bold mb-2">Exercice Terminé !</h1>
            <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
              {percentage}%
            </div>
            <p className="text-gray-400">Score : {finalResult.score} / {finalResult.total}</p>
          </div>

          {/* SECTION FEEDBACK IA */}
          {finalResult.mistakes.length > 0 ? (
            <div className="mb-8">
              {!feedback ? (
                <button 
                  onClick={generateFeedback} 
                  disabled={loadingFeedback}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-4 rounded-xl font-bold shadow-lg hover:scale-[1.02] transition"
                >
                  {loadingFeedback ? "Analyse de tes erreurs... 🧠" : "✨ Générer mon Aide-Mémoire IA"}
                </button>
              ) : (
                <div className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded-r-xl">
                  <h3 className="font-bold text-purple-900 mb-2 flex items-center gap-2"><BrainCircuit size={20}/> L'avis du Prof IA :</h3>
                  <div className="prose text-purple-800 whitespace-pre-wrap leading-relaxed">
                    {feedback}
                  </div>
                </div>
              )}
            </div>
          ) : (
             <div className="bg-green-50 text-green-800 p-6 rounded-xl text-center font-medium mb-8">
               Incroyable ! Aucune erreur. Tu maîtrises le sujet à la perfection. 🌟
             </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => window.location.reload()} className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200">
              <RefreshCw size={20}/> Rejouer
            </button>
            <Link href="/history" className="flex items-center justify-center gap-2 bg-blue-50 text-blue-600 py-3 rounded-xl font-bold hover:bg-blue-100">
              <History size={20}/> Historique
            </Link>
            <Link href="/" className="col-span-2 flex items-center justify-center gap-2 bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-gray-800">
              <Home size={20}/> Nouveau Sujet
            </Link>
          </div>

        </div>
      </div>
    );
  }

  // --- AFFICHAGE DU JEU ---
  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 font-sans">
      <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between">
        <Link href="/" className="text-slate-400 hover:text-slate-600 flex items-center gap-1 font-bold">← Retour</Link>
        <span className="bg-white px-3 py-1 rounded-full text-xs font-bold text-slate-500 shadow-sm uppercase tracking-wide">Mode : {data.type}</span>
      </div>

      {data.type === 'qcm' && <QcmGame data={data} onFinish={handleFinish} />}
      {data.type === 'trueFalse' && <TrueFalseGame data={data} onFinish={handleFinish} />}
      {data.type === 'blanks' && <BlanksGame data={data} onFinish={handleFinish} />}
      {data.type === 'association' && <AssociationGame data={data} onFinish={(s, t) => handleFinish(s, t, [])} />}
      {data.type === 'ordering' && <OrderingGame data={data} onFinish={(s, t, m) => handleFinish(s, t, m || [])} />}
      {data.type === 'text' && <TextGame data={data} onFinish={handleFinish} />}
    </div>
  );
}