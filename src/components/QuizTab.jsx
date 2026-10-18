import React, { useState, useEffect } from 'react';
import { 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  Lightbulb, 
  RotateCcw, 
  ArrowRight, 
  Award,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { unitQuizzes } from '../data/unitQuizzes';
import { sound } from '../utils/soundEffects';
import { triggerConfetti } from '../utils/confetti';
import MathText from './MathText';

export default function QuizTab({ setActiveTab }) {
  const [activeUnitKey, setActiveUnitKey] = useState('unit-1');
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { [qId]: optionIndex }
  const [showHints, setShowHints] = useState({}); // { [qId]: boolean }
  const [isCompleted, setIsCompleted] = useState(false);

  const currentQuiz = unitQuizzes[activeUnitKey] || unitQuizzes['unit-1'];
  const questions = currentQuiz.questions;
  const currentQ = questions[currentQIndex];

  const unitMetas = {
    'unit-1': { ch: 'CH 09', label: 'Pattern Recognition' },
    'unit-2': { ch: 'CH 11', label: 'Robotics & Control' },
    'unit-3': { ch: 'CH 13', label: 'Vision & Color' },
    'unit-4': { ch: 'CH 14', label: 'Neural Networks' },
    'unit-5': { ch: 'CH 15', label: 'Deep Learning CNN' },
    'unit-6': { ch: 'CH 14-LAB', label: 'Backprop Detailed' },
  };

  const handleSelectOption = (qId, optionIdx) => {
    if (selectedAnswers[qId] !== undefined) return; // already answered
    const isCorrect = optionIdx === currentQ.correctAnswer;
    if (isCorrect) {
      sound.playCorrect();
    } else {
      sound.playIncorrect();
    }

    const updated = { ...selectedAnswers, [qId]: optionIdx };
    setSelectedAnswers(updated);

    // If this was the last question, check if all answered
    if (Object.keys(updated).length === questions.length) {
      setIsCompleted(true);
      // Check score
      const correctCount = questions.filter(q => updated[q.id] === q.correctAnswer).length;
      if (correctCount === questions.length) {
        sound.playVictory();
        triggerConfetti();
      }
    }
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't intercept if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      if (['1', '2', '3', '4'].includes(e.key)) {
        const optIdx = parseInt(e.key, 10) - 1;
        if (optIdx < currentQ.options.length) {
          handleSelectOption(currentQ.id, optIdx);
        }
      } else if (['a', 'b', 'c', 'd', 'A', 'B', 'C', 'D'].includes(e.key)) {
        const optIdx = e.key.toUpperCase().charCodeAt(0) - 65;
        if (optIdx < currentQ.options.length) {
          handleSelectOption(currentQ.id, optIdx);
        }
      } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
        if (currentQIndex < questions.length - 1) {
          handleNext();
        }
      } else if (e.key === 'ArrowLeft') {
        if (currentQIndex > 0) {
          handlePrev();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentQIndex, currentQ, questions, selectedAnswers]);

  const handleToggleHint = (qId) => {
    sound.playClick();
    setShowHints(prev => ({ ...prev, [qId]: !prev[qId] }));
  };

  const handleNext = () => {
    sound.playClick();
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
    }
  };

  const handlePrev = () => {
    sound.playClick();
    if (currentQIndex > 0) {
      setCurrentQIndex(currentQIndex - 1);
    }
  };

  const handleReset = () => {
    sound.playClick();
    setSelectedAnswers({});
    setShowHints({});
    setCurrentQIndex(0);
    setIsCompleted(false);
  };

  const handleUnitSelect = (key) => {
    sound.playClick();
    setActiveUnitKey(key);
    setSelectedAnswers({});
    setShowHints({});
    setCurrentQIndex(0);
    setIsCompleted(false);
  };

  // Score stats
  const answeredCount = Object.keys(selectedAnswers).length;
  const correctCount = questions.filter(q => selectedAnswers[q.id] === q.correctAnswer).length;

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn pb-12">
      {/* Unit Selector Bar */}
      <div className="border border-slate-200 dark:border-[#27272f] bg-white dark:bg-[#121216] p-4 rounded-xl shadow-2xs">
        <label className="text-xs font-mono text-slate-500 dark:text-gray-400 uppercase tracking-wider block mb-2.5">
          เลือกบทเรียนสำหรับฝึกทำแบบทดสอบย่อย (6 บทเรียน):
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {Object.keys(unitQuizzes).map((key) => {
            const isActive = activeUnitKey === key;
            const meta = unitMetas[key] || { ch: key, label: '' };
            return (
              <button
                key={key}
                onClick={() => handleUnitSelect(key)}
                className={`p-2.5 rounded-lg border text-left transition-all flex flex-col justify-between ${
                  isActive
                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-500/10 text-amber-900 dark:text-amber-400 font-bold shadow-xs ring-1 ring-amber-400/30'
                    : 'border-slate-200 dark:border-[#27272f] bg-slate-50 dark:bg-[#17171c] text-slate-700 dark:text-gray-400 hover:text-slate-950 dark:hover:text-gray-200 hover:border-slate-300 dark:hover:border-gray-600'
                }`}
              >
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-500">
                  {meta.ch}
                </span>
                <span className="text-xs truncate font-medium mt-0.5">
                  {meta.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Quiz Card */}
      <div className="border border-slate-200 dark:border-[#27272f] bg-white dark:bg-[#121216] rounded-xl p-5 sm:p-8 space-y-6 shadow-2xs">
        {/* Quiz Header & Progress */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-[#27272f] gap-3">
          <div>
            <span className="text-xs font-mono text-amber-600 dark:text-amber-400 uppercase tracking-widest block font-bold">
              UNIT PRACTICE DRILL
            </span>
            <h2 className="text-lg sm:text-xl font-heading text-slate-900 dark:text-white mt-0.5">
              {currentQuiz.unitTitle}
            </h2>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="text-slate-500 dark:text-gray-400">
              ข้อที่ <strong className="text-slate-900 dark:text-white">{currentQIndex + 1}</strong> จาก {questions.length}
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">
              ถูก: {correctCount}/{answeredCount}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-[#1e1e24] h-2 rounded-full overflow-hidden">
          <div 
            className="bg-amber-500 h-full transition-all duration-300"
            style={{ width: `${((currentQIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>

        {/* Question Content */}
        <div className="space-y-6">
          <div className="text-base sm:text-lg font-sans font-medium text-slate-900 dark:text-white leading-relaxed">
            <MathText>{currentQ.question}</MathText>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQ.options.map((opt, oIdx) => {
              const isAnswered = selectedAnswers[currentQ.id] !== undefined;
              const isSelected = selectedAnswers[currentQ.id] === oIdx;
              const isCorrectOpt = oIdx === currentQ.correctAnswer;

              let btnStyle = 'border-slate-200 dark:border-[#27272f] bg-slate-50 dark:bg-[#17171c] text-slate-800 dark:text-gray-200 hover:border-slate-400 dark:hover:border-gray-500 hover:bg-slate-100 dark:hover:bg-[#1f1f26]';
              if (isAnswered) {
                if (isCorrectOpt) {
                  btnStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/20 text-emerald-900 dark:text-emerald-200 shadow-xs';
                } else if (isSelected) {
                  btnStyle = 'border-red-500 bg-red-50 dark:bg-red-500/20 text-red-900 dark:text-red-200';
                } else {
                  btnStyle = 'border-slate-200 dark:border-[#27272f] bg-white dark:bg-[#121216] text-slate-400 dark:text-gray-500 opacity-60';
                }
              }

              return (
                <button
                  key={oIdx}
                  onClick={() => handleSelectOption(currentQ.id, oIdx)}
                  disabled={isAnswered}
                  className={`w-full text-left p-4 rounded-lg border transition-all flex items-start gap-3 ${btnStyle}`}
                >
                  <span className={`w-6 h-6 rounded-full font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 border ${
                    isAnswered && isCorrectOpt
                      ? 'bg-emerald-600 text-white border-emerald-500'
                      : isAnswered && isSelected
                      ? 'bg-red-600 text-white border-red-500'
                      : 'bg-white dark:bg-[#121216] text-slate-600 dark:text-gray-400 border-slate-300 dark:border-[#27272f]'
                  }`}>
                    {String.fromCharCode(65 + oIdx)}
                  </span>
                  <span className="text-sm font-sans flex-1"><MathText>{opt}</MathText></span>
                  {isAnswered && isCorrectOpt && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  )}
                  {isAnswered && isSelected && !isCorrectOpt && (
                    <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Hint Card Toggle */}
          <div className="pt-2">
            {selectedAnswers[currentQ.id] === undefined && (
              <button
                onClick={() => handleToggleHint(currentQ.id)}
                className="flex items-center gap-1.5 text-xs font-mono text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition font-semibold"
              >
                <Lightbulb className="w-4 h-4" />
                <span>{showHints[currentQ.id] ? 'ซ่อนคำใบ้' : 'ขอคำใบ้ (Hint)'}</span>
              </button>
            )}

            {showHints[currentQ.id] && (
              <div className="mt-2 p-3 bg-amber-50 dark:bg-amber-500/10 border border-amber-300 dark:border-amber-500/30 rounded-lg text-xs font-sans text-amber-900 dark:text-amber-200 animate-fadeIn">
                💡 <strong>คำใบ้:</strong> <MathText>{currentQ.hint}</MathText>
              </div>
            )}
          </div>

          {/* Explanation Box (Shows after answering) */}
          {selectedAnswers[currentQ.id] !== undefined && (
            <div className="border border-slate-200 dark:border-[#27272f] bg-slate-50 dark:bg-[#17171c] p-4 sm:p-5 rounded-lg space-y-2 animate-fadeIn">
              <div className="flex items-center gap-2 text-xs font-mono uppercase font-bold text-slate-700 dark:text-gray-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>คำอธิบายเฉลยและวิธีคิดอย่างละเอียด:</span>
              </div>
              <p className="text-sm text-slate-700 dark:text-gray-300 leading-relaxed font-sans">
                <MathText>{currentQ.explanation}</MathText>
              </p>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-[#27272f]">
            <button
              onClick={handlePrev}
              disabled={currentQIndex === 0}
              className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-[#17171c] hover:bg-slate-200 dark:hover:bg-[#202028] disabled:opacity-30 border border-slate-300 dark:border-[#27272f] text-xs font-mono text-slate-700 dark:text-gray-300 transition"
            >
              ← ข้อย้อนหลัง
            </button>

            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-mono text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>เริ่มทำใหม่</span>
            </button>

            {currentQIndex < questions.length - 1 ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-heading text-xs transition shadow-sm"
              >
                <span>ข้อถัดไป</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => {
                  sound.playClick();
                  setActiveTab('exam');
                }}
                className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-heading text-xs transition shadow-glow-red"
              >
                <span>ไปสอบข้อสอบปลายภาค 75 ข้อ</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
