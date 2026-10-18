import React from 'react';
import { 
  BookOpen, 
  HelpCircle, 
  FileCheck2, 
  Volume2, 
  VolumeX, 
  Flame, 
  Sparkles,
  Calculator,
  Terminal,
  Compass,
  Cpu,
  Sun,
  Moon,
  Type,
  Printer
} from 'lucide-react';
import { sound } from '../utils/soundEffects';

export default function Header({ 
  activeTab, 
  setActiveTab, 
  soundEnabled, 
  setSoundEnabled,
  streak = 3,
  examScore = null,
  theme = 'light',
  toggleTheme,
  fontSize = 'normal',
  setFontSize
}) {
  const navTabs = [
    { id: 'overview', label: 'ภาพรวมวิชา', sub: 'Overview', icon: Compass },
    { id: 'cheatsheet', label: 'ใบจดสรุป A4', sub: 'A4 Cheat Sheet (หน้า-หลัง)', icon: Printer, badge: 'A4 EXAM', highlight: true },
    { id: 'lessons', label: 'ทฤษฎี & สูตร', sub: 'Lessons & Theory', icon: BookOpen },
    { id: 'neural', label: 'แล็บ Backprop', sub: 'Neural Node Lab', icon: Cpu, badge: 'HOT' },
    { id: 'calculators', label: 'ห้องทดลองสูตร', sub: 'Calculators Lab', icon: Calculator },
    { id: 'quizzes', label: 'แบบฝึกหัดย่อย', sub: 'Unit Quizzes', icon: HelpCircle },
    { id: 'exam', label: 'ข้อสอบปลายภาค (75 ข้อ)', sub: 'Final Exam 75 Qs', icon: FileCheck2 },
  ];

  const handleTabClick = (tabId) => {
    sound.playClick();
    setActiveTab(tabId);
  };

  const handleSoundToggle = () => {
    const newState = sound.toggle();
    setSoundEnabled(newState);
    if (newState) {
      sound.playClick();
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-[#0a0a0c]/95 backdrop-blur-md border-b border-slate-200 dark:border-[#27272f] transition-colors">
      {/* Top micro-bar */}
      <div className="bg-slate-100 dark:bg-[#121216] border-b border-slate-200 dark:border-[#27272f]/60 px-3 sm:px-4 py-1.5 text-[11px] font-mono text-slate-600 dark:text-gray-400 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-red-600 dark:text-red-500 font-bold uppercase tracking-wider text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
            AI Final Prep
          </span>
          <span className="hidden md:inline text-slate-300 dark:text-gray-600">|</span>
          <span className="hidden md:inline text-slate-500 dark:text-gray-400">เนื้อหาครอบคลุมทุกบทเรียนในสไลด์ 9, 11, 13, 14, 15</span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2.5 ml-auto shrink-0">
          <div className="flex items-center gap-1 text-amber-600 dark:text-amber-500 font-bold text-xs">
            <Flame className="w-3.5 h-3.5 fill-amber-500 dark:fill-amber-400 text-amber-500" />
            <span className="hidden xs:inline">Streak:</span> <span>{streak}d</span>
          </div>
          {examScore !== null && (
            <div className="text-emerald-600 dark:text-emerald-400 font-bold hidden lg:inline">
              Best: {examScore}/75 ({Math.round((examScore / 75) * 100)}%)
            </div>
          )}
          <button
            onClick={handleSoundToggle}
            className="flex items-center gap-1 text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white transition px-1.5 py-0.5 rounded bg-white dark:bg-gray-800/60 border border-slate-200 dark:border-transparent"
            title="เปิด/ปิดเสียงเอฟเฟกต์"
          >
            {soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-slate-400 dark:text-gray-400" />
            )}
            <span className="text-[10px] uppercase font-mono hidden sm:inline">{soundEnabled ? 'Sound' : 'Mute'}</span>
          </button>

          {/* Font Size Adjuster Buttons */}
          {setFontSize && (
            <div className="flex items-center gap-0.5 sm:gap-1 bg-white dark:bg-[#1f1f26] px-1 py-0.5 rounded-md border border-slate-200 dark:border-gray-700 text-[11px] font-mono shadow-2xs">
              <Type className="w-3 h-3 text-red-500 shrink-0 hidden xs:inline" />
              <button
                onClick={() => { sound.playClick(); setFontSize('normal'); }}
                className={`px-1.5 py-0.5 rounded font-bold transition text-xs ${
                  fontSize === 'normal' 
                    ? 'bg-red-600 text-white shadow-2xs' 
                    : 'text-slate-600 dark:text-gray-400 hover:text-slate-950 dark:hover:text-white'
                }`}
                title="ขนาดตัวอักษรปกติ (100%)"
              >
                A
              </button>
              <button
                onClick={() => { sound.playClick(); setFontSize('large'); }}
                className={`px-1.5 py-0.5 rounded font-bold transition text-xs ${
                  fontSize === 'large' 
                    ? 'bg-red-600 text-white shadow-2xs' 
                    : 'text-slate-600 dark:text-gray-400 hover:text-slate-950 dark:hover:text-white'
                }`}
                title="ขนาดตัวอักษรใหญ่ (115%)"
              >
                A+
              </button>
              <button
                onClick={() => { sound.playClick(); setFontSize('xlarge'); }}
                className={`px-1.5 py-0.5 rounded font-bold transition text-xs leading-none ${
                  fontSize === 'xlarge' 
                    ? 'bg-red-600 text-white shadow-2xs' 
                    : 'text-slate-600 dark:text-gray-400 hover:text-slate-950 dark:hover:text-white'
                }`}
                title="ขนาดตัวอักษรใหญ่พิเศษ (130%)"
              >
                A++
              </button>
            </div>
          )}

          {/* Theme Toggle Button */}
          {toggleTheme && (
            <button
              onClick={() => { sound.playClick(); toggleTheme(); }}
              className="flex items-center gap-1 px-2 py-1 rounded-md border border-slate-200 dark:border-gray-700 bg-white dark:bg-[#1f1f26] hover:bg-slate-100 dark:hover:bg-[#272733] text-slate-700 dark:text-gray-200 transition text-[11px] font-mono shadow-2xs"
              title="เปลี่ยนธีม สว่าง / มืด (Light / Dark Theme)"
            >
              {theme === 'light' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                  <span className="font-bold text-amber-900 hidden sm:inline">ธีมสว่าง (Light)</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400" />
                  <span className="font-bold text-indigo-300 hidden sm:inline">ธีมมืด (Dark)</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 flex flex-col lg:flex-row items-center justify-between py-2 sm:py-2.5 gap-2">
        {/* Brand Logo & Title */}
        <div 
          onClick={() => handleTabClick('overview')}
          className="cursor-pointer flex items-center gap-2.5 group self-start lg:self-auto shrink-0"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-red-600 flex items-center justify-center text-white font-heading text-base sm:text-lg shadow-glow-red border border-red-400 group-hover:scale-105 transition-transform">
            AI
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-heading text-sm sm:text-base tracking-tight text-slate-900 dark:text-white group-hover:text-red-500 transition-colors">
                AI MASTERY
              </span>
              <span className="badge-mono bg-red-100 dark:bg-[#1f1f27] text-red-700 dark:text-red-400 border border-red-300 dark:border-red-500/30 px-1.5 py-0.2 rounded text-[9px]">
                FINAL PREP
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-gray-400 -mt-0.5 hidden xs:block">
              ปัญญาประดิษฐ์ & การประมวลผลภาพดิจิทัล
            </p>
          </div>
        </div>

        {/* Tab Buttons - Carefully proportioned to fit on 1280px screen */}
        <nav className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0 scrollbar-none">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`flex items-center gap-1.5 px-2 sm:px-2.5 lg:px-3 py-1.5 rounded-lg font-sans text-xs sm:text-[13px] font-semibold whitespace-nowrap transition-all border shrink-0 ${
                  isActive
                    ? 'bg-red-600 text-white border-red-600 shadow-md ring-2 ring-red-500/20'
                    : tab.highlight
                    ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/40 hover:bg-red-500/20'
                    : 'bg-white dark:bg-[#121216] text-slate-700 dark:text-gray-300 border-slate-200 dark:border-[#27272f] hover:border-slate-400 dark:hover:border-gray-500 hover:text-slate-950 dark:hover:text-white'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : tab.highlight ? 'text-red-500' : 'text-slate-500 dark:text-gray-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="text-[9px] font-bold px-1 rounded bg-amber-400 text-amber-950">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
