import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Flag, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw,
  Send,
  HelpCircle,
  Bookmark,
  Layers,
  Award
} from 'lucide-react';
import { finalExamQuestions } from '../data/finalExam75';
import { sound } from '../utils/soundEffects';
import { triggerConfetti } from '../utils/confetti';
import ScoreReportModal from './ScoreReportModal';
import MathText from './MathText';

export default function ExamTab({ onExamFinish }) {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { [qId]: optionIndex }
  const [flaggedQuestions, setFlaggedQuestions] = useState({}); // { [qId]: boolean }
  const [timeLeft, setTimeLeft] = useState(90 * 60); // 90 minutes in seconds
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [filterMode, setFilterMode] = useState('all'); // 'all', 'flagged', 'unanswered'
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [showScoreReport, setShowScoreReport] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const totalQuestions = finalExamQuestions.length; // 75
  const currentQ = finalExamQuestions[currentQIndex];

  // Timer countdown effect
  useEffect(() => {
    if (!isTimerRunning || showScoreReport) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning, showScoreReport]);

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectAnswer = (optionIdx) => {
    sound.playClick();
    setUserAnswers(prev => ({
      ...prev,
      [currentQ.id]: optionIdx
    }));
  };

  const handleClearAnswer = () => {
    sound.playClick();
    setUserAnswers(prev => {
      const copy = { ...prev };
      delete copy[currentQ.id];
      return copy;
    });
  };

  const handleToggleFlag = () => {
    sound.playClick();
    setFlaggedQuestions(prev => ({
      ...prev,
      [currentQ.id]: !prev[currentQ.id]
    }));
  };

  const handleGoToQuestion = (index) => {
    sound.playClick();
    setCurrentQIndex(index);
  };

  const handleNext = () => {
    sound.playClick();
    if (currentQIndex < totalQuestions - 1) {
      setCurrentQIndex(currentQIndex + 1);
    }
  };

  const handlePrev = () => {
    sound.playClick();
    if (currentQIndex > 0) {
      setCurrentQIndex(currentQIndex - 1);
    }
  };

  const handleJumpToNextUnanswered = () => {
    sound.playClick();
    let nextIdx = -1;
    for (let i = currentQIndex + 1; i < totalQuestions; i++) {
      if (userAnswers[finalExamQuestions[i].id] === undefined) {
        nextIdx = i;
        break;
      }
    }
    if (nextIdx === -1) {
      for (let i = 0; i < currentQIndex; i++) {
        if (userAnswers[finalExamQuestions[i].id] === undefined) {
          nextIdx = i;
          break;
        }
      }
    }
    if (nextIdx !== -1) {
      setCurrentQIndex(nextIdx);
    }
  };

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target?.tagName)) return;
      if (showSubmitConfirm || showScoreReport) return;

      if (e.key === 'ArrowRight' && currentQIndex < totalQuestions - 1) {
        sound.playClick();
        setCurrentQIndex(prev => prev + 1);
      } else if (e.key === 'ArrowLeft' && currentQIndex > 0) {
        sound.playClick();
        setCurrentQIndex(prev => prev - 1);
      } else if (['1', '2', '3', '4'].includes(e.key)) {
        handleSelectAnswer(parseInt(e.key, 10) - 1);
      } else if (['a', 'b', 'c', 'd', 'A', 'B', 'C', 'D'].includes(e.key)) {
        const mapping = { a: 0, b: 1, c: 2, d: 3 };
        handleSelectAnswer(mapping[e.key.toLowerCase()]);
      } else if (e.key === 'f' || e.key === 'F') {
        handleToggleFlag();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentQIndex, totalQuestions, showSubmitConfirm, showScoreReport]);

  const handleSubmitExam = () => {
    // Calculate final score
    let score = 0;
    finalExamQuestions.forEach(q => {
      if (userAnswers[q.id] === q.correctAnswer) {
        score += 1;
      }
    });

    setFinalScore(score);
    setIsTimerRunning(false);
    setShowSubmitConfirm(false);
    setShowScoreReport(true);

    if (onExamFinish) {
      onExamFinish(score);
    }

    if (score >= Math.round(totalQuestions * 0.6)) {
      sound.playVictory();
      triggerConfetti();
    } else {
      sound.playIncorrect();
    }
  };

  const handleRetakeExam = () => {
    setUserAnswers({});
    setFlaggedQuestions({});
    setTimeLeft(90 * 60);
    setIsTimerRunning(true);
    setCurrentQIndex(0);
    setShowScoreReport(false);
  };

  // Stats
  const answeredCount = Object.keys(userAnswers).length;
  const unansweredCount = totalQuestions - answeredCount;
  const flaggedCount = Object.values(flaggedQuestions).filter(Boolean).length;

  const isLowTime = timeLeft < 600; // less than 10 mins

  // Filtered Question Indices for navigation list
  const filteredIndices = finalExamQuestions.map((q, idx) => idx).filter(idx => {
    const qId = finalExamQuestions[idx].id;
    if (filterMode === 'flagged') return flaggedQuestions[qId];
    if (filterMode === 'unanswered') return userAnswers[qId] === undefined;
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Exam Header Bar */}
      <div className="border border-[#27272f] bg-[#121216] p-4 sm:p-5 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sticky top-20 z-30 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="badge-mono bg-red-500/10 text-red-500 border border-red-500/30 px-2 py-0.5 rounded text-xs">
              COMPREHENSIVE FINAL EXAM
            </span>
            <span className="text-gray-500 text-xs font-mono">|</span>
            <span className="text-gray-300 text-xs font-mono">75 ข้อ (100% ครอบคลุมทุกบทเรียน)</span>
          </div>
          <h2 className="text-lg sm:text-xl font-heading text-white mt-1">
            การทดสอบวัดผลปลายภาควิชาปัญญาประดิษฐ์
          </h2>
        </div>

        {/* Timer & Submit Button */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          {/* Timer Display */}
          <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg border font-mono text-sm font-bold ${
            isLowTime 
              ? 'bg-red-500/20 border-red-500 text-red-400 animate-pulse' 
              : 'bg-[#17171c] border-[#27272f] text-cyan-400'
          }`}>
            <Clock className="w-4 h-4" />
            <span>{formatTime(timeLeft)}</span>
          </div>

          {/* Quick Counter */}
          <div className="hidden sm:flex items-center gap-2 font-mono text-xs text-gray-400 bg-[#17171c] px-3 py-1.5 rounded-lg border border-[#27272f]">
            <span>ตอบแล้ว: <strong className="text-white">{answeredCount}</strong>/{totalQuestions}</span>
            {flaggedCount > 0 && (
              <span className="text-amber-400 flex items-center gap-1">
                <Flag className="w-3 h-3 fill-amber-400" /> {flaggedCount}
              </span>
            )}
          </div>

          {/* Finish & Submit Button */}
          <button
            onClick={() => {
              sound.playClick();
              setShowSubmitConfirm(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-heading text-xs transition shadow-glow-red"
          >
            <Send className="w-3.5 h-3.5" />
            <span>ส่งข้อสอบ</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Question Column */}
        <div className="lg:col-span-8 space-y-6">
          <div className="border border-slate-200 dark:border-[#27272f] bg-white dark:bg-[#121216] rounded-xl p-5 sm:p-8 space-y-6 shadow-2xs">
            {/* Question Meta Bar */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#27272f] pb-3 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400 font-bold border border-red-300 dark:border-red-500/20">
                  ข้อ {currentQIndex + 1} จาก {totalQuestions}
                </span>
                <span className="text-slate-500 dark:text-gray-400 hidden sm:inline">• {currentQ.topic}</span>
              </div>

              {/* Flag Toggle Button */}
              <button
                onClick={handleToggleFlag}
                className={`flex items-center gap-1.5 px-3 py-1 rounded transition border ${
                  flaggedQuestions[currentQ.id]
                    ? 'bg-amber-100 dark:bg-amber-500/20 border-amber-400 dark:border-amber-500 text-amber-900 dark:text-amber-400 font-bold'
                    : 'bg-slate-100 dark:bg-[#17171c] border-slate-200 dark:border-[#27272f] text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Flag className={`w-3.5 h-3.5 ${flaggedQuestions[currentQ.id] ? 'fill-amber-500 text-amber-500 dark:fill-amber-400' : ''}`} />
                <span>{flaggedQuestions[currentQ.id] ? 'ปักธงไว้แล้ว' : 'ปักธงทบทวน'}</span>
              </button>
            </div>

            {/* Question Text */}
            <div className="text-base sm:text-lg font-sans font-medium text-slate-900 dark:text-white leading-relaxed">
              <MathText>{currentQ.question}</MathText>
            </div>

            {/* Options List */}
            <div className="space-y-3 pt-2">
              {currentQ.options.map((opt, oIdx) => {
                const isSelected = userAnswers[currentQ.id] === oIdx;
                return (
                  <button
                    key={oIdx}
                    onClick={() => handleSelectAnswer(oIdx)}
                    className={`w-full text-left p-4 rounded-lg border transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'border-red-500 bg-red-50 dark:bg-red-500/10 text-slate-900 dark:text-white shadow-2xs ring-1 ring-red-500/30'
                        : 'border-slate-200 dark:border-[#27272f] bg-slate-50 dark:bg-[#17171c] text-slate-800 dark:text-gray-300 hover:border-slate-400 dark:hover:border-gray-500 hover:bg-slate-100 dark:hover:bg-[#1f1f26]'
                    }`}
                  >
                    <span className={`w-6 h-6 rounded-full font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 border ${
                      isSelected
                        ? 'bg-red-600 text-white border-red-500'
                        : 'bg-white dark:bg-[#121216] text-slate-500 dark:text-gray-400 border-slate-300 dark:border-[#27272f]'
                    }`}>
                      {String.fromCharCode(65 + oIdx)}
                    </span>
                    <span className="text-sm font-sans flex-1"><MathText>{opt}</MathText></span>
                  </button>
                );
              })}
            </div>

            {/* Bottom Question Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-slate-200 dark:border-[#27272f] gap-3">
              <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
                <button
                  onClick={handlePrev}
                  disabled={currentQIndex === 0}
                  className="flex items-center gap-1 px-4 py-2 rounded-lg bg-slate-100 dark:bg-[#17171c] hover:bg-slate-200 dark:hover:bg-[#202028] disabled:opacity-30 border border-slate-300 dark:border-[#27272f] text-xs font-mono text-slate-700 dark:text-gray-300 transition"
                  title="ปุ่มลัด: ลูกศรซ้าย ←"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>ข้อย้อนหลัง</span>
                </button>

                {userAnswers[currentQ.id] !== undefined && (
                  <button
                    onClick={handleClearAnswer}
                    className="text-xs font-mono text-slate-500 hover:text-red-500 transition px-2"
                  >
                    ล้างคำตอบ
                  </button>
                )}
              </div>

              {/* Center keyboard hint */}
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-500 dark:text-gray-400 bg-slate-100/60 dark:bg-[#1a1a20] px-2.5 py-1 rounded-md border border-slate-200 dark:border-gray-800">
                <span className="font-bold text-slate-600 dark:text-gray-300">คีย์บอร์ดลัด:</span>
                <span className="px-1.5 py-0.5 rounded bg-white dark:bg-[#25252e] border border-slate-300 dark:border-gray-700 text-[10px] font-bold">← / →</span>
                <span className="hidden sm:inline">เปลี่ยนข้อ</span>
                <span className="text-slate-300 dark:text-gray-600">|</span>
                <span className="px-1.5 py-0.5 rounded bg-white dark:bg-[#25252e] border border-slate-300 dark:border-gray-700 text-[10px] font-bold">1-4</span>
                <span className="hidden sm:inline">ตอบ</span>
                <span className="text-slate-300 dark:text-gray-600">|</span>
                <span className="px-1.5 py-0.5 rounded bg-white dark:bg-[#25252e] border border-slate-300 dark:border-gray-700 text-[10px] font-bold">F</span>
                <span className="hidden sm:inline">ปักธง</span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                {unansweredCount > 0 && (
                  <button
                    onClick={handleJumpToNextUnanswered}
                    className="px-3 py-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-mono font-bold transition flex items-center gap-1"
                    title="ข้ามไปยังข้อถัดไปที่ยังไม่ได้เลือกคำตอบ"
                  >
                    <span>ข้อที่ยังไม่ตอบ ⚡</span>
                  </button>
                )}

                <button
                  onClick={handleNext}
                  disabled={currentQIndex === totalQuestions - 1}
                  className="flex items-center gap-1 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white disabled:opacity-30 text-xs font-mono font-bold transition shadow-sm"
                  title="ปุ่มลัด: ลูกศรขวา →"
                >
                  <span>ข้อถัดไป</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Question Navigation Grid (Right Column) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="border border-slate-200 dark:border-[#27272f] bg-white dark:bg-[#121216] rounded-xl p-4 sm:p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#27272f] pb-3">
              <h3 className="font-heading text-sm text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-red-500" />
                <span>กระดานข้อสอบ (75 ข้อ)</span>
              </h3>
              {unansweredCount > 0 && (
                <button
                  onClick={handleJumpToNextUnanswered}
                  className="text-[11px] font-mono text-amber-600 dark:text-amber-400 font-bold hover:underline"
                >
                  หาข้อว่าง ({unansweredCount})
                </button>
              )}
            </div>

            {/* Filter mode */}
            <div className="grid grid-cols-3 gap-1 bg-slate-100 dark:bg-[#17171c] p-1 rounded-lg border border-slate-200 dark:border-[#27272f] text-[11px] font-mono">
              <button
                onClick={() => setFilterMode('all')}
                className={`py-1.5 rounded-md text-center transition font-semibold ${filterMode === 'all' ? 'bg-white dark:bg-[#27272f] text-slate-900 dark:text-white shadow-sm font-bold' : 'text-slate-500 dark:text-gray-400'}`}
              >
                ทั้งหมด (75)
              </button>
              <button
                onClick={() => setFilterMode('unanswered')}
                className={`py-1.5 rounded-md text-center transition font-semibold ${filterMode === 'unanswered' ? 'bg-white dark:bg-[#27272f] text-slate-900 dark:text-white shadow-sm font-bold' : 'text-slate-500 dark:text-gray-400'}`}
              >
                ยังไม่ตอบ ({unansweredCount})
              </button>
              <button
                onClick={() => setFilterMode('flagged')}
                className={`py-1.5 rounded-md text-center transition font-semibold ${filterMode === 'flagged' ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-400 shadow-sm font-bold' : 'text-slate-500 dark:text-gray-400'}`}
              >
                ปักธง ({flaggedCount})
              </button>
            </div>

            {/* Status Legend */}
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 dark:text-gray-400 px-1">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-emerald-500"></span>
                <span>ตอบแล้ว</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-amber-500"></span>
                <span>ปักธง</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-slate-200 dark:bg-[#17171c] border border-slate-300 dark:border-[#27272f]"></span>
                <span>ยังไม่ตอบ</span>
              </span>
            </div>

            {/* Grid of 75 Questions - Compact Matrix Layout */}
            <div className="grid grid-cols-5 sm:grid-cols-8 lg:grid-cols-8 xl:grid-cols-10 gap-1.5 max-h-[460px] overflow-y-auto p-1 font-mono text-xs">
              {filteredIndices.map(idx => {
                const q = finalExamQuestions[idx];
                const isCurrent = idx === currentQIndex;
                const isAnswered = userAnswers[q.id] !== undefined;
                const isFlagged = flaggedQuestions[q.id];

                let btnClass = 'bg-slate-100 dark:bg-[#17171c] border-slate-200 dark:border-[#27272f] text-slate-600 dark:text-gray-400 hover:border-slate-400 dark:hover:border-gray-500 hover:text-slate-900 dark:hover:text-white';
                if (isCurrent) {
                  btnClass = 'ring-2 ring-red-500 text-red-600 dark:text-white font-black bg-red-100 dark:bg-red-600/20 border-red-500 shadow-2xs';
                } else if (isFlagged) {
                  btnClass = 'bg-amber-100 dark:bg-amber-500/20 border-amber-400 dark:border-amber-500 text-amber-900 dark:text-amber-400 font-bold';
                } else if (isAnswered) {
                  btnClass = 'bg-emerald-100 dark:bg-emerald-500/20 border-emerald-400 dark:border-emerald-500/50 text-emerald-900 dark:text-emerald-300 font-semibold';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => handleGoToQuestion(idx)}
                    className={`h-8 rounded-md border text-[11px] font-bold transition-all flex items-center justify-center relative ${btnClass}`}
                  >
                    <span>{q.id}</span>
                    {isFlagged && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 absolute top-0.5 right-0.5"></span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-white dark:bg-[#121216] border border-slate-200 dark:border-[#27272f] max-w-md w-full rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-red-600 dark:text-red-500">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="font-heading text-lg text-slate-900 dark:text-white">ยืนยันการส่งข้อสอบ?</h3>
            </div>

            <div className="text-xs font-mono space-y-2 bg-slate-50 dark:bg-[#17171c] p-3.5 rounded-xl border border-slate-200 dark:border-[#27272f]">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-gray-400">ตอบแล้วทั้งหมด:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">{answeredCount} ข้อ</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-gray-400">ยังไม่ได้ตอบ:</span>
                <span className={unansweredCount > 0 ? 'text-red-600 dark:text-red-400 font-bold' : 'text-slate-400 dark:text-gray-400'}>
                  {unansweredCount} ข้อ
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-gray-400">ปักธงทบทวนไว้:</span>
                <span className="text-amber-600 dark:text-amber-400 font-bold">{flaggedCount} ข้อ</span>
              </div>
            </div>

            {unansweredCount > 0 && (
              <p className="text-xs text-amber-700 dark:text-amber-300 font-sans bg-amber-50 dark:bg-amber-950/30 p-2.5 rounded-lg border border-amber-200 dark:border-amber-900/40">
                ⚠️ คุณยังมีข้อสอบที่ยังไม่ได้ตอบอีก {unansweredCount} ข้อ แน่ใจหรือไม่ว่าต้องการส่งตรวจคำตอบในตอนนี้?
              </p>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowSubmitConfirm(false)}
                className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-[#1a1a22] hover:bg-slate-200 dark:hover:bg-[#22222c] border border-slate-300 dark:border-[#27272f] text-slate-700 dark:text-gray-300 text-xs font-semibold transition"
              >
                กลับไปทำต่อ
              </button>
              <button
                onClick={handleSubmitExam}
                className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-heading text-xs transition shadow-glow-red"
              >
                ยืนยันส่งข้อสอบทันที
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Post-Exam Score & Solution Report Modal */}
      <ScoreReportModal
        isOpen={showScoreReport}
        onClose={() => setShowScoreReport(false)}
        score={finalScore}
        totalQuestions={totalQuestions}
        userAnswers={userAnswers}
        questions={finalExamQuestions}
        onRetake={handleRetakeExam}
      />
    </div>
  );
}
