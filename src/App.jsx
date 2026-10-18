import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import OverviewTab from './components/OverviewTab';
import CheatSheetA4Tab from './components/CheatSheetA4Tab';
import LessonsTab from './components/LessonsTab';
import CalculatorsTab from './components/CalculatorsTab';
import NeuralNetworkTrainer from './components/NeuralNetworkTrainer';
import QuizTab from './components/QuizTab';
import ExamTab from './components/ExamTab';
import { sound } from './utils/soundEffects';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedUnit, setSelectedUnit] = useState('unit-1');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [streak, setStreak] = useState(3);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('ai_app_theme') || 'light';
  });
  const [fontSize, setFontSize] = useState(() => {
    return localStorage.getItem('ai_app_font_size') || 'normal';
  });
  const [bestScore, setBestScore] = useState(() => {
    const saved = localStorage.getItem('ai_exam_best_score');
    return saved !== null ? parseInt(saved, 10) : null;
  });

  useEffect(() => {
    // Apply theme to html element
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    localStorage.setItem('ai_app_theme', theme);
  }, [theme]);

  useEffect(() => {
    // Apply font size class to html element
    const root = document.documentElement;
    root.classList.remove('font-size-normal', 'font-size-large', 'font-size-xlarge');
    if (fontSize === 'large') {
      root.classList.add('font-size-large');
    } else if (fontSize === 'xlarge') {
      root.classList.add('font-size-xlarge');
    } else {
      root.classList.add('font-size-normal');
    }
    localStorage.setItem('ai_app_font_size', fontSize);
  }, [fontSize]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    // Load streak from localStorage or default
    const savedStreak = localStorage.getItem('ai_study_streak');
    if (savedStreak) {
      setStreak(parseInt(savedStreak, 10));
    } else {
      localStorage.setItem('ai_study_streak', '3');
    }
  }, []);

  const handleExamFinish = (score) => {
    if (bestScore === null || score > bestScore) {
      setBestScore(score);
      localStorage.setItem('ai_exam_best_score', score.toString());
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-[#f4f4f5] flex flex-col selection:bg-red-500 selection:text-white">
      {/* Sticky Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        streak={streak}
        examScore={bestScore}
        theme={theme}
        toggleTheme={toggleTheme}
        fontSize={fontSize}
        setFontSize={setFontSize}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        {activeTab === 'overview' && (
          <OverviewTab 
            setActiveTab={setActiveTab} 
            setSelectedUnit={setSelectedUnit} 
          />
        )}

        {activeTab === 'cheatsheet' && (
          <CheatSheetA4Tab />
        )}

        {activeTab === 'lessons' && (
          <LessonsTab 
            selectedUnit={selectedUnit} 
            setSelectedUnit={setSelectedUnit} 
            setActiveTab={setActiveTab} 
          />
        )}

        {activeTab === 'neural' && (
          <NeuralNetworkTrainer />
        )}

        {activeTab === 'calculators' && (
          <CalculatorsTab />
        )}

        {activeTab === 'quizzes' && (
          <QuizTab setActiveTab={setActiveTab} />
        )}

        {activeTab === 'exam' && (
          <ExamTab onExamFinish={handleExamFinish} />
        )}
      </main>

      {/* Editorial Footer (VoiceBox Style) */}
      <footer className="border-t border-[#27272f] bg-[#0e0e12] py-8 text-xs font-mono text-gray-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            <span className="font-heading text-gray-300 text-sm">AI FINAL EXAM PLATFORM</span>
            <span className="text-gray-600">|</span>
            <span>Comprehensive Syllabus Review 2026</span>
          </div>
          <div className="text-gray-400 text-center sm:text-right">
            <span>อ้างอิงเนื้อหาจากสไลด์บทที่ 9, 11, 13-1, 13-2, 13-3, 13-4, 14, 15</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
