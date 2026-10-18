import React, { useState } from 'react';
import { 
  X, 
  Award, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  ChevronDown, 
  ChevronUp, 
  Filter,
  BarChart2,
  FileText
} from 'lucide-react';
import { sound } from '../utils/soundEffects';
import MathText from './MathText';

export default function ScoreReportModal({ 
  isOpen, 
  onClose, 
  score, 
  totalQuestions, 
  userAnswers, 
  questions, 
  onRetake 
}) {
  if (!isOpen) return null;

  const [filterMode, setFilterMode] = useState('all'); // 'all', 'wrong', 'correct'
  const [expandedQId, setExpandedQId] = useState(null);

  const percentage = Math.round((score / totalQuestions) * 100);
  const isPassed = percentage >= 60;

  // Calculate scores per topic
  const topicStats = {};
  questions.forEach(q => {
    if (!topicStats[q.topic]) {
      topicStats[q.topic] = { total: 0, correct: 0 };
    }
    topicStats[q.topic].total += 1;
    if (userAnswers[q.id] === q.correctAnswer) {
      topicStats[q.topic].correct += 1;
    }
  });

  const filteredQuestions = questions.filter(q => {
    const isCorrect = userAnswers[q.id] === q.correctAnswer;
    if (filterMode === 'wrong') return !isCorrect;
    if (filterMode === 'correct') return isCorrect;
    return true;
  });

  const toggleExpand = (qId) => {
    sound.playClick();
    setExpandedQId(expandedQId === qId ? null : qId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="bg-[#121216] border border-[#27272f] w-full max-w-4xl rounded-2xl p-6 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto shadow-2xl relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-[#17171c] hover:bg-[#202028] border border-[#27272f] text-gray-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header & Hero Score */}
        <div className="text-center space-y-3 pt-2">
          <div className="inline-flex p-3 rounded-full bg-red-500/10 border border-red-500/30 text-red-500 mb-1">
            <Award className="w-8 h-8" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-heading text-white">
            รายงานผลการสอบปลายภาค (Final Exam Analytics)
          </h2>
          <p className="text-xs font-mono text-gray-400">
            วิชาปัญญาประดิษฐ์และการประมวลผลภาพ • 75 ข้อสอบมาตรฐาน
          </p>
        </div>

        {/* Big Score Card */}
        <div className={`p-6 rounded-xl border text-center space-y-2 ${
          isPassed 
            ? 'bg-emerald-500/10 border-emerald-500/50 shadow-glow-emerald' 
            : 'bg-red-500/10 border-red-500/50 shadow-glow-red'
        }`}>
          <div className="text-5xl sm:text-6xl font-mono font-bold text-white tracking-tight">
            {score} <span className="text-2xl text-gray-400 font-sans">/ {totalQuestions}</span>
          </div>
          <div className="flex items-center justify-center gap-3 text-sm font-mono">
            <span className={`font-bold px-3 py-1 rounded-full text-xs ${
              isPassed ? 'bg-emerald-500 text-black' : 'bg-red-500 text-white'
            }`}>
              {isPassed ? '✓ สอบผ่านเกณฑ์ (PASS)' : '✗ ยังไม่ผ่านเกณฑ์ (เกณฑ์ 60%)'}
            </span>
            <span className="text-gray-300">
              คิดเป็น <strong>{percentage}%</strong>
            </span>
          </div>
        </div>

        {/* Breakdown by Topic */}
        <div className="space-y-3">
          <h4 className="font-heading text-sm text-gray-300 uppercase tracking-wider flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-red-500" />
            <span>คะแนนวิเคราะห์รายบทเรียน (Topic Mastery):</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Object.entries(topicStats).map(([topic, stat]) => {
              const topicPct = Math.round((stat.correct / stat.total) * 100);
              return (
                <div key={topic} className="p-3 bg-[#17171c] border border-[#27272f] rounded-lg space-y-1.5">
                  <div className="flex justify-between items-start text-xs font-mono">
                    <span className="text-gray-300 font-bold truncate pr-2">{topic}</span>
                    <span className={topicPct >= 60 ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                      {stat.correct}/{stat.total} ({topicPct}%)
                    </span>
                  </div>
                  <div className="w-full bg-[#121216] h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${topicPct >= 60 ? 'bg-emerald-500' : 'bg-red-500'}`}
                      style={{ width: `${topicPct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed Review Section Header & Filters */}
        <div className="space-y-4 pt-4 border-t border-[#27272f]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-heading text-base text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-red-500" />
                <span>เฉลยคำตอบพร้อมคำอธิบายละเอียดครบทุกข้อ</span>
              </h3>
              <p className="text-xs text-gray-400 font-mono">
                แสดง {filteredQuestions.length} จากทั้งหมด 75 ข้อ
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1.5 bg-[#17171c] p-1 rounded-lg border border-[#27272f] text-xs font-mono">
              <button
                onClick={() => setFilterMode('all')}
                className={`px-2.5 py-1 rounded transition ${filterMode === 'all' ? 'bg-[#27272f] text-white font-bold' : 'text-gray-400'}`}
              >
                ทั้งหมด (75)
              </button>
              <button
                onClick={() => setFilterMode('wrong')}
                className={`px-2.5 py-1 rounded transition ${filterMode === 'wrong' ? 'bg-red-500/20 text-red-400 font-bold' : 'text-gray-400'}`}
              >
                ข้อที่ตอบผิด ({totalQuestions - score})
              </button>
              <button
                onClick={() => setFilterMode('correct')}
                className={`px-2.5 py-1 rounded transition ${filterMode === 'correct' ? 'bg-emerald-500/20 text-emerald-400 font-bold' : 'text-gray-400'}`}
              >
                ข้อที่ตอบถูก ({score})
              </button>
            </div>
          </div>

          {/* Question List Accordion */}
          <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
            {filteredQuestions.map((q) => {
              const userAns = userAnswers[q.id];
              const isCorrect = userAns === q.correctAnswer;
              const isExpanded = expandedQId === q.id;

              return (
                <div 
                  key={q.id}
                  className={`border rounded-lg transition-all ${
                    isCorrect 
                      ? 'border-emerald-500/30 bg-[#141a16]' 
                      : 'border-red-500/30 bg-[#1c1416]'
                  }`}
                >
                  <div 
                    onClick={() => toggleExpand(q.id)}
                    className="p-3.5 flex items-start justify-between gap-3 cursor-pointer select-none"
                  >
                    <div className="flex items-start gap-3">
                      <span className={`w-6 h-6 rounded-full font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                        isCorrect ? 'bg-emerald-500 text-black' : 'bg-red-500 text-white'
                      }`}>
                        {q.id}
                      </span>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="badge-mono text-[10px] text-gray-400">
                            {q.topic}
                          </span>
                          <span className={`text-[10px] font-mono font-bold ${isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
                            {isCorrect ? '✓ ตอบถูก' : userAns === undefined ? '○ ไม่ได้ตอบ' : '✗ ตอบผิด'}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm font-sans text-gray-200 line-clamp-2">
                          <MathText>{q.question}</MathText>
                        </p>
                      </div>
                    </div>

                    <div className="text-gray-400 shrink-0 mt-1">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>

                  {/* Expanded Explanation */}
                  {isExpanded && (
                    <div className="p-4 border-t border-[#27272f] bg-[#0e0e12] space-y-3 text-xs font-sans animate-fadeIn">
                      <div className="space-y-1.5 font-sans">
                        {q.options.map((opt, oIdx) => {
                          const isOptCorrect = oIdx === q.correctAnswer;
                          const isOptUser = oIdx === userAns;
                          return (
                            <div 
                              key={oIdx}
                              className={`p-2 rounded flex items-start gap-2 ${
                                isOptCorrect 
                                  ? 'bg-emerald-500/20 text-emerald-200 font-semibold border border-emerald-500/40' 
                                  : isOptUser 
                                  ? 'bg-red-500/20 text-red-200 border border-red-500/40' 
                                  : 'text-gray-400'
                              }`}
                            >
                              <span className="font-mono">{String.fromCharCode(65 + oIdx)}.</span>
                              <span className="flex-1"><MathText>{opt}</MathText></span>
                              {isOptCorrect && <span className="text-[10px] font-mono text-emerald-400">[คำตอบที่ถูกต้อง]</span>}
                              {isOptUser && !isOptCorrect && <span className="text-[10px] font-mono text-red-400">[ที่คุณตอบ]</span>}
                            </div>
                          );
                        })}
                      </div>

                      <div className="bg-[#17171c] p-3 rounded border border-[#27272f] text-gray-300 leading-relaxed font-sans">
                        <strong className="text-amber-400 block mb-1">💡 คำอธิบายและวิธีทำอย่างละเอียด:</strong>
                        <MathText>{q.explanation}</MathText>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#27272f]">
          <button
            onClick={() => {
              sound.playClick();
              onRetake();
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-heading text-xs transition shadow-glow-red"
          >
            <RotateCcw className="w-4 h-4" />
            <span>ทำข้อสอบใหม่อีกครั้ง (Retake Exam)</span>
          </button>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-[#1a1a22] hover:bg-[#252530] border border-[#27272f] text-gray-300 font-sans text-xs font-semibold transition"
          >
            ปิดหน้ารายงานผล
          </button>
        </div>
      </div>
    </div>
  );
}
