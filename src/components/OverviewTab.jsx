import React from 'react';
import { 
  BookOpen, 
  HelpCircle, 
  FileCheck2, 
  Calculator, 
  ArrowRight, 
  CheckCircle, 
  Cpu, 
  Eye, 
  Layers, 
  Network, 
  Boxes, 
  Flame,
  Award,
  Printer
} from 'lucide-react';
import { lessonsData } from '../data/lessonsData';
import { sound } from '../utils/soundEffects';

export default function OverviewTab({ setActiveTab, setSelectedUnit }) {
  const unitIcons = {
    "unit-1": Boxes,
    "unit-2": Cpu,
    "unit-3": Eye,
    "unit-4": Layers,
    "unit-5": Network,
    "unit-6": BookOpen,
  };

  const handleGoToLesson = (unitId) => {
    sound.playClick();
    if (setSelectedUnit) setSelectedUnit(unitId);
    setActiveTab('lessons');
  };

  const handleStartExam = () => {
    sound.playClick();
    setActiveTab('exam');
  };

  const handleOpenCalculators = () => {
    sound.playClick();
    setActiveTab('calculators');
  };

  return (
    <div className="space-y-10 animate-fadeIn pb-12">
      {/* Hero Section */}
      <div className="border border-[#27272f] bg-gradient-to-b from-[#17171c] to-[#0e0e12] rounded-xl p-6 sm:p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 font-mono text-xs">
            <Flame className="w-3.5 h-3.5" />
            <span>AI FINAL EXAM MASTERY SUITE</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-heading text-white tracking-tight leading-tight">
            เตรียมสอบปลายภาควิชา AI <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-amber-400">
              ทฤษฎี & การคำนวณครบทุกมิติ
            </span>
          </h1>
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            สรุปเนื้อหาเชิงลึกจากสไลด์อาจารย์ทุกบท (บทที่ 9, 11, 13-1, 13-2, 13-3, 13-4, 14, 15)
            พร้อมสูตรคำนวณแบบแสดงวิธีทำทีละขั้น ห้องทดลองคำนวณสด และข้อสอบปลายภาคเสมือนจริงครบ <strong>75 ข้อ</strong> พร้อมเฉลยละเอียด
          </p>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={handleStartExam}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-red-600 hover:bg-red-500 text-white font-heading text-sm transition shadow-glow-red"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>เริ่มทำข้อสอบ 75 ข้อ</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
            <button
              onClick={handleOpenCalculators}
              className="flex items-center gap-2 px-5 py-3 rounded-lg bg-[#1a1a22] hover:bg-[#23232e] border border-[#2e2e38] text-gray-200 font-sans text-sm font-semibold transition"
            >
              <Calculator className="w-4 h-4 text-red-400" />
              <span>ห้องทดลองคำนวณสูตร</span>
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setActiveTab('cheatsheet');
              }}
              className="flex items-center gap-2 px-5 py-3 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 font-sans text-sm font-bold transition shadow-xs"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>ใบจดสรุป 1 A4 หน้า-หลัง (นำเข้าสอบ)</span>
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setActiveTab('neural');
              }}
              className="flex items-center gap-2 px-5 py-3 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-300 font-sans text-sm font-semibold transition"
            >
              <Cpu className="w-4 h-4 text-purple-400" />
              <span>แล็บโหนด Backprop (คำนวณสด)</span>
            </button>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8 pt-8 border-t border-[#27272f]/80 font-mono">
          <div className="p-3 bg-[#121216] border border-[#27272f] rounded-lg">
            <span className="text-xs text-gray-400 block">บทเรียนทั้งหมด</span>
            <span className="text-2xl font-bold text-white mt-1 block">6 หมวดหมู่</span>
            <span className="text-[11px] text-gray-500">ตรงตามไฟล์สไลด์</span>
          </div>
          <div className="p-3 bg-[#121216] border border-[#27272f] rounded-lg">
            <span className="text-xs text-gray-400 block">สูตรคำนวณหลัก</span>
            <span className="text-2xl font-bold text-cyan-400 mt-1 block">15+ สูตร</span>
            <span className="text-[11px] text-gray-500">แสดงวิธีคิดทีละขั้น</span>
          </div>
          <div className="p-3 bg-[#121216] border border-[#27272f] rounded-lg">
            <span className="text-xs text-gray-400 block">แบบฝึกหัดย่อย</span>
            <span className="text-2xl font-bold text-amber-400 mt-1 block">18 ข้อ</span>
            <span className="text-[11px] text-gray-500">เฉลยทันทีพร้อมคำใบ้</span>
          </div>
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
            <span className="text-xs text-red-400 block font-semibold">ข้อสอบปลายภาค</span>
            <span className="text-2xl font-bold text-red-500 mt-1 block">75 ข้อ</span>
            <span className="text-[11px] text-red-400">จับเวลา & วิเคราะห์ผล</span>
          </div>
        </div>
      </div>

      {/* 6 Unit Cards Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-heading text-white">โครงสร้างเนื้อหา 6 หน่วยการเรียนรู้</h2>
            <p className="text-xs text-gray-400">คลิกที่บทเรียนเพื่ออ่านทฤษฎีและดูตัวอย่างการคำนวณอย่างละเอียด</p>
          </div>
          <span className="badge-mono text-gray-500 text-xs hidden sm:inline">SYLLABUS 2026</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lessonsData.map((unit) => {
            const Icon = unitIcons[unit.id] || BookOpen;
            return (
              <div
                key={unit.id}
                className="border border-[#27272f] bg-[#121216] rounded-lg p-5 flex flex-col justify-between hover:border-red-500/60 hover:shadow-glow-red transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="badge-mono bg-[#1a1a22] text-red-400 border border-red-500/20 px-2 py-0.5 rounded text-[11px]">
                      {unit.badge}
                    </span>
                    <span className="text-[11px] font-mono text-gray-500">{unit.readTime}</span>
                  </div>

                  <div className="flex items-start gap-3 mb-2">
                    <div className="p-2.5 rounded-md bg-[#1a1a22] border border-[#27272f] text-red-500 group-hover:bg-red-500 group-hover:text-white transition-colors shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-heading text-base text-white group-hover:text-red-400 transition-colors">
                        {unit.titleTh}
                      </h3>
                      <p className="text-xs font-mono text-gray-400 line-clamp-1">{unit.title}</p>
                    </div>
                  </div>

                  <p className="text-xs text-gray-400 mt-2 line-clamp-3 leading-relaxed">
                    {unit.summary}
                  </p>

                  <div className="mt-3 text-[11px] font-mono text-gray-500 border-t border-[#27272f]/60 pt-2 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-500"></span>
                    <span className="truncate">ไฟล์: {unit.slideSource}</span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-[#27272f] flex items-center gap-2">
                  <button
                    onClick={() => handleGoToLesson(unit.id)}
                    className="flex-1 py-2 px-3 rounded bg-[#1a1a22] hover:bg-red-600 hover:text-white border border-[#2e2e38] text-xs font-semibold text-gray-200 transition text-center flex items-center justify-center gap-1.5"
                  >
                    <span>อ่านทฤษฎี & สูตร</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      sound.playClick();
                      setActiveTab('quizzes');
                    }}
                    className="p-2 rounded bg-[#17171c] hover:bg-[#202028] border border-[#27272f] text-gray-400 hover:text-white transition"
                    title="ทำแบบทดสอบย่อยบทนี้"
                  >
                    <HelpCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Formula Cheat Sheet Summary */}
      <div className="border border-[#27272f] bg-[#121216] rounded-xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-[#27272f] pb-4">
          <div>
            <h2 className="text-xl font-heading text-white flex items-center gap-2">
              <Calculator className="w-5 h-5 text-red-500" />
              <span>สรุปสูตรคำนวณสำคัญที่ต้องจำเข้าห้องสอบ</span>
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              รวบรวมสมการทางคณิตศาสตร์จากทุกสไลด์เพื่อทบทวนอย่างรวดเร็ว
            </p>
          </div>
          <button
            onClick={handleOpenCalculators}
            className="text-xs font-mono text-red-400 hover:text-red-300 underline hidden sm:inline"
          >
            เปิดเครื่องคำนวณสด →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
          {/* Card 1 */}
          <div className="p-4 bg-[#17171c] border border-[#27272f] rounded-lg space-y-2">
            <span className="text-red-400 font-bold block">1. Uncompressed File Size (บท 13-2, 13-3)</span>
            <div className="bg-[#0e0e12] p-2.5 rounded border border-[#27272f] text-gray-200">
              Bits = Width x Height x Bit_Depth<br />
              Bytes = Bits / 8<br />
              MB = Bytes / (1024 x 1024)
            </div>
            <p className="text-[11px] text-gray-400 font-sans">
              1-bit=2 สี, 8-bit=256 สี, 24-bit=16.7 ล้านสี (3 Bytes), 32-bit=4 Bytes
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-4 bg-[#17171c] border border-[#27272f] rounded-lg space-y-2">
            <span className="text-cyan-400 font-bold block">2. Nyquist-Shannon Sampling (บท 13-4)</span>
            <div className="bg-[#0e0e12] p-2.5 rounded border border-[#27272f] text-gray-200">
              fs ≥ 2 * f_max (Nyquist Rate)<br />
              Sampling Period Ts = 1 / fs
            </div>
            <p className="text-[11px] text-gray-400 font-sans">
              หาก fs &lt; 2fc จะเกิด Aliasing (คลื่นแทรกผิดเพี้ยน Moiré Pattern)
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-4 bg-[#17171c] border border-[#27272f] rounded-lg space-y-2">
            <span className="text-amber-400 font-bold block">3. Uniform Quantization (บท 13-4)</span>
            <div className="bg-[#0e0e12] p-2.5 rounded border border-[#27272f] text-gray-200">
              rn = round( ((Vn - Vmin) / (Vmax - Vmin)) * (N - 1) )<br />
              โดยที่ N = 2^b (จำนวนระดับขั้น)
            </div>
            <p className="text-[11px] text-gray-400 font-sans">
              แปลงแรงดันต่อเนื่องเป็นดัชนีระดับขั้น 0 ถึง N - 1
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-4 bg-[#17171c] border border-[#27272f] rounded-lg space-y-2">
            <span className="text-emerald-400 font-bold block">4. Mean Brightness & Contrast (บท 13-4)</span>
            <div className="bg-[#0e0e12] p-2.5 rounded border border-[#27272f] text-gray-200">
              B = (1/MN) * Σ f(x,y)<br />
              C = sqrt( (1/MN) * Σ (f(x,y) - B)^2 )
            </div>
            <p className="text-[11px] text-gray-400 font-sans">
              B คือค่าเฉลี่ยความสว่าง | C คือส่วนเบี่ยงเบนมาตรฐาน (คอนทราสต์)
            </p>
          </div>

          {/* Card 5 */}
          <div className="p-4 bg-[#17171c] border border-[#27272f] rounded-lg space-y-2">
            <span className="text-purple-400 font-bold block">5. Perceptron & Sigmoid (บท 14)</span>
            <div className="bg-[#0e0e12] p-2.5 rounded border border-[#27272f] text-gray-200">
              z = Σ (wi * xi) + b<br />
              f(z) = 1 / (1 + e^-z)<br />
              f'(z) = f(z) * (1 - f(z))
            </div>
            <p className="text-[11px] text-gray-400 font-sans">
              รวมสัญญาณถ่วงน้ำหนักและแปลงด้วยฟังก์ชันซิกมอยด์ (0 ถึง 1)
            </p>
          </div>

          {/* Card 6 */}
          <div className="p-4 bg-[#17171c] border border-[#27272f] rounded-lg space-y-2">
            <span className="text-rose-400 font-bold block">6. Backpropagation Update (บท 14)</span>
            <div className="bg-[#0e0e12] p-2.5 rounded border border-[#27272f] text-gray-200">
              δk = (tk - ok) * ok * (1 - ok)<br />
              Δwij = η * δj * oi<br />
              w_new = w_old + Δwij
            </div>
            <p className="text-[11px] text-gray-400 font-sans">
              การปรับค่าน้ำหนักเพื่อลดค่าความคลาดเคลื่อนด้วย Gradient Descent
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
