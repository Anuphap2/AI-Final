import React, { useState } from 'react';
import { 
  BookOpen, 
  Calculator, 
  HelpCircle, 
  ArrowRight, 
  ChevronRight, 
  CheckCircle2, 
  Bookmark, 
  FileText,
  Boxes,
  Cpu,
  Eye,
  Layers,
  Network
} from 'lucide-react';
import { lessonsData } from '../data/lessonsData';
import { sound } from '../utils/soundEffects';
import RichLessonContent from './RichLessonContent';
import MathText from './MathText';

export default function LessonsTab({ selectedUnit, setSelectedUnit, setActiveTab }) {
  const [activeUnitId, setActiveUnitId] = useState(selectedUnit || 'unit-1');

  const unitIcons = {
    "unit-1": Boxes,
    "unit-2": Cpu,
    "unit-3": Eye,
    "unit-4": Layers,
    "unit-5": Network,
    "unit-6": BookOpen,
  };

  const currentUnit = lessonsData.find(u => u.id === activeUnitId) || lessonsData[0];
  const CurrentIcon = unitIcons[currentUnit.id] || BookOpen;

  const handleUnitChange = (id) => {
    sound.playClick();
    setActiveUnitId(id);
    if (setSelectedUnit) setSelectedUnit(id);
  };

  const handleOpenCalculator = () => {
    sound.playClick();
    setActiveTab('calculators');
  };

  const handleOpenQuiz = () => {
    sound.playClick();
    setActiveTab('quizzes');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn pb-12">
      {/* Sidebar Unit Navigation */}
      <div className="lg:col-span-4 space-y-4">
        <div className="border border-[#27272f] bg-[#121216] p-4 rounded-lg">
          <div className="flex items-center justify-between mb-3 border-b border-[#27272f] pb-2">
            <h3 className="font-heading text-sm text-white uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-red-500" />
              <span>สารบัญ 6 บทเรียน AI</span>
            </h3>
            <span className="badge-mono text-gray-400 text-[10px]">CH 09-15</span>
          </div>

          <div className="space-y-1.5">
            {lessonsData.map((unit) => {
              const Icon = unitIcons[unit.id] || BookOpen;
              const isActive = unit.id === activeUnitId;
              return (
                <button
                  key={unit.id}
                  onClick={() => handleUnitChange(unit.id)}
                  className={`w-full text-left p-3 rounded-md transition-all flex items-start gap-3 border ${
                    isActive
                      ? 'bg-[#1a1a24] border-red-500 text-white shadow-glow-red'
                      : 'bg-[#17171c] border-transparent text-gray-400 hover:text-gray-200 hover:bg-[#1e1e24]'
                  }`}
                >
                  <div className={`p-2 rounded mt-0.5 shrink-0 ${
                    isActive ? 'bg-red-500 text-white' : 'bg-[#121216] text-gray-500 border border-[#27272f]'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-mono uppercase ${isActive ? 'text-red-400' : 'text-gray-500'}`}>
                        {unit.badge}
                      </span>
                      <span className="text-[10px] font-mono text-gray-500">{unit.readTime}</span>
                    </div>
                    <div className="font-sans font-bold text-xs truncate mt-0.5 text-white">
                      {unit.titleTh}
                    </div>
                    <p className="text-[11px] text-gray-400 truncate mt-0.5">{unit.title}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Tools Box */}
        <div className="border border-[#27272f] bg-[#121216] p-4 rounded-lg space-y-3">
          <h4 className="font-heading text-xs text-gray-300 uppercase tracking-wider">เครื่องมือฝึกฝน</h4>
          <button
            onClick={handleOpenCalculator}
            className="w-full flex items-center justify-between p-2.5 rounded bg-[#17171c] hover:bg-red-600/20 border border-[#27272f] text-gray-300 hover:text-white hover:border-red-500/40 text-xs font-mono transition"
          >
            <span className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-red-500" />
              <span>ห้องทดลองคำนวณสด</span>
            </span>
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={handleOpenQuiz}
            className="w-full flex items-center justify-between p-2.5 rounded bg-[#17171c] hover:bg-amber-600/20 border border-[#27272f] text-gray-300 hover:text-white hover:border-amber-500/40 text-xs font-mono transition"
          >
            <span className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-500" />
              <span>ทำแบบฝึกหัดประจำบทนี้</span>
            </span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Lesson Reader Column */}
      <div className="lg:col-span-8 space-y-8">
        {/* Unit Header Card */}
        <div className="border border-[#27272f] bg-gradient-to-br from-[#17171c] to-[#101014] p-6 sm:p-8 rounded-xl relative overflow-hidden">
          <div className="relative z-10 space-y-3">
            <div className="flex items-center gap-2">
              <span className="badge-mono bg-red-500/10 text-red-400 border border-red-500/30 px-2 py-0.5 rounded text-xs">
                {currentUnit.badge}
              </span>
              <span className="text-gray-500 text-xs font-mono">|</span>
              <span className="text-gray-400 text-xs font-mono">สไลด์: {currentUnit.slideSource}</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-red-500 text-white shadow-glow-red">
                <CurrentIcon className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-heading text-white">
                  {currentUnit.titleTh}
                </h1>
                <p className="text-xs sm:text-sm font-mono text-gray-400">{currentUnit.title}</p>
              </div>
            </div>

            <p className="text-sm text-gray-300 leading-relaxed border-t border-[#27272f] pt-3">
              {currentUnit.summary}
            </p>
          </div>
        </div>

        {/* Sections Content */}
        <div className="space-y-8">
          {currentUnit.sections.map((sec, idx) => (
            <div 
              key={sec.id}
              className="border border-[#27272f] bg-[#121216] rounded-xl p-6 sm:p-8 space-y-6"
            >
              <h2 className="text-xl font-heading text-white border-b border-[#27272f] pb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                <span>{sec.title}</span>
              </h2>

              {/* Render formatted rich content */}
              <RichLessonContent content={sec.content} />

              {/* Key Concepts Box */}
              {sec.keyConcepts && sec.keyConcepts.length > 0 && (
                <div className="border border-slate-200 dark:border-[#27272f] bg-slate-50 dark:bg-[#17171c] p-4 sm:p-5 rounded-xl space-y-3 shadow-xs">
                  <h4 className="font-mono text-xs sm:text-sm text-red-600 dark:text-red-400 font-bold uppercase tracking-wider flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-red-500" />
                    <span>หัวใจสำคัญที่ต้องจำ (Key Concepts):</span>
                  </h4>
                  <ul className="space-y-2 font-sans text-xs sm:text-sm text-slate-800 dark:text-gray-200">
                    {sec.keyConcepts.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className="text-red-500 font-bold mt-0.5">•</span>
                        <span><MathText>{item}</MathText></span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Step-by-Step Calculation Worked Example */}
              {sec.calculationExample && (
                <div className="border border-red-500/30 bg-red-50/20 dark:bg-[#16161c] rounded-xl p-5 sm:p-6 space-y-4 font-mono text-xs shadow-sm">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#27272f] pb-3">
                    <span className="font-heading text-red-600 dark:text-red-400 text-sm sm:text-base font-sans flex items-center gap-2 font-bold">
                      <Calculator className="w-4 h-4 text-red-500" />
                      <span>{sec.calculationExample.title}</span>
                    </span>
                    <span className="badge-mono bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-500/30 px-2 py-0.5 rounded text-[10px] font-bold">
                      WORKED EXAMPLE
                    </span>
                  </div>

                  <div className="bg-white dark:bg-[#0e0e12] p-4 rounded-lg border border-slate-200 dark:border-[#27272f] text-slate-900 dark:text-gray-100 font-sans text-xs sm:text-sm leading-relaxed">
                    <strong className="text-red-600 dark:text-red-400 font-bold">โจทย์:</strong> <MathText>{sec.calculationExample.problem}</MathText>
                  </div>

                  {/* Steps */}
                  <div className="space-y-3">
                    {sec.calculationExample.steps.map((st, sIdx) => (
                      <div key={sIdx} className="bg-white dark:bg-[#121216] p-4 rounded-lg border border-slate-200 dark:border-[#27272f] space-y-2 shadow-2xs">
                        <div className="text-slate-800 dark:text-gray-200 font-bold text-xs sm:text-sm flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-gray-800 flex items-center justify-center text-[10px] text-slate-700 dark:text-gray-300 font-bold border border-slate-300 dark:border-gray-700">
                            {sIdx + 1}
                          </span>
                          <MathText>{st.step}</MathText>
                        </div>
                        <div className="text-slate-900 dark:text-cyan-300 font-bold text-xs sm:text-sm font-mono overflow-x-auto">
                          <MathText>{st.formula.startsWith('$') ? st.formula : `$$${st.formula}$$`}</MathText>
                        </div>
                        <div className="text-slate-700 dark:text-gray-300 text-xs sm:text-sm leading-relaxed font-sans bg-slate-50 dark:bg-[#17171e] p-2.5 rounded border border-slate-100 dark:border-gray-800">
                          <MathText>{st.calc.includes('$') ? st.calc : (st.calc.includes('=') && !st.calc.includes('\n') ? `$$${st.calc}$$` : st.calc)}</MathText>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Final Result */}
                  <div className="p-3.5 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-300 dark:border-emerald-500/30 rounded-lg text-emerald-900 dark:text-emerald-300 font-bold font-sans text-xs sm:text-sm flex items-start gap-2 shadow-2xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span>คำตอบสรุป: </span>
                      <MathText>{sec.calculationExample.result}</MathText>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Navigation between units */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-[#27272f] gap-2 flex-wrap">
          <button
            onClick={() => {
              const currentIdx = lessonsData.findIndex(u => u.id === activeUnitId);
              if (currentIdx > 0) {
                handleUnitChange(lessonsData[currentIdx - 1].id);
              }
            }}
            disabled={lessonsData.findIndex(u => u.id === activeUnitId) === 0}
            className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-[#17171c] hover:bg-slate-200 dark:hover:bg-[#202028] disabled:opacity-30 border border-slate-300 dark:border-[#27272f] text-xs font-mono text-slate-700 dark:text-gray-300 transition"
          >
            ← บทก่อนหน้า
          </button>
          <button
            onClick={handleOpenQuiz}
            className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-heading text-xs transition shadow-sm"
          >
            ทำแบบฝึกหัดบทนี้ →
          </button>
          <button
            onClick={() => {
              const currentIdx = lessonsData.findIndex(u => u.id === activeUnitId);
              if (currentIdx < lessonsData.length - 1) {
                handleUnitChange(lessonsData[currentIdx + 1].id);
              }
            }}
            disabled={lessonsData.findIndex(u => u.id === activeUnitId) === lessonsData.length - 1}
            className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-[#17171c] hover:bg-slate-200 dark:hover:bg-[#202028] disabled:opacity-30 border border-slate-300 dark:border-[#27272f] text-xs font-mono text-slate-700 dark:text-gray-300 transition"
          >
            บทถัดไป →
          </button>
        </div>
      </div>
    </div>
  );
}
