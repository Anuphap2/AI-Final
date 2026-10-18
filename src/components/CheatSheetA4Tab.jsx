import React, { useState } from 'react';
import {
  Printer,
  Copy,
  Check,
  Search,
  FileText,
  Sparkles,
  Layers,
  Info
} from 'lucide-react';
import MathText from './MathText';
import { sound } from '../utils/soundEffects';

export default function CheatSheetA4Tab() {
  const [viewMode, setViewMode] = useState('both'); // 'both' | 'p1' | 'p2'
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handlePrint = () => {
    sound.playClick();
    window.print();
  };

  const handleCopyAll = () => {
    sound.playSuccess();
    const textContent = `=== AI FINAL EXAM 1-A4 CHEAT SHEET (หน้า-หลัง) ===\n\n` +
      `[หน้า 1 - ด้านหน้า]\n` +
      `1. PATTERN RECOGNITION: Feature, Classifier, Supervised, Unsupervised, Clustering, Label, Abstraction\n` +
      `   - Euclidean: d = sqrt(sum((xi - yi)^2))\n` +
      `   - Manhattan: d = sum(|xi - yi|)\n` +
      `   - Min-Max: x' = (x - xmin) / (xmax - xmin)\n` +
      `2. ROBOTICS: Types (Cartesian, SCARA, Articulated, Delta, Mobile/AMR, UAV), Components (Sensors, Actuators, Controller, Power, End-Effector, Kinematics), Languages (C/C++, Python, ROS/ROS2, MATLAB, URDF)\n` +
      `3. IMAGE PROCESSING: Brightness g=f+c, Mean Intensity, Aspect Ratio AR=W/H, Anti-Aliasing (SSAA, MSAA, FXAA), Additive RGB (Light) vs Subtractive CMYK (Ink), Animation (Persistence of vision >16fps, 12/24/30/60 fps, Tweening), File Size = (W*H*bpp)/(8*1024*1024) MB\n\n` +
      `[หน้า 2 - ด้านหลัง]\n` +
      `4. NEURAL NETWORKS & DEEP LEARNING: Input, Hidden, Output, Weights, Biases, Net input z=sum(wx)+b, Activation a=f(z)\n` +
      `   - Sigmoid: 1/(1+e^-z), S-Curve, (0,1), derivative s(1-s), Vanishing gradient\n` +
      `   - Binary Step: f=1 if z>=theta else 0\n` +
      `   - ReLU: max(0,z), avoids vanishing gradient, Dying ReLU\n` +
      `   - Softmax: e^zi / sum(e^zj), multi-class probability sum=1\n` +
      `   - Weight update: Optimizer (GD, SGD, Adam), Backprop, Delta Rule dw = eta * delta * x\n` +
      `   - Training: Epoch, Batch Size, Iterations\n` +
      `   - Semi-Supervised, Reinforcement Learning (Agent, Env, State, Action, Reward, Policy)\n` +
      `   - Data Mining KDD: Cleaning -> Integration -> Selection -> Transformation -> Mining -> Evaluation -> Presentation\n` +
      `5. EXPERT SYSTEMS: Rule-Based (Forward vs Backward Chaining), Fuzzy (Membership degree, Defuzzification COG), Case-Based Reasoning (4R: Retrieve, Reuse, Revise, Retain), Deterministic vs Probabilistic (CF), Static vs Dynamic, Knowledge Acquisition & Bottleneck.`;

    navigator.clipboard.writeText(textContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Control Banner - Hidden on print */}
      <div className="no-print bg-white dark:bg-[#121216] border border-slate-200 dark:border-[#27272f] rounded-2xl p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/50">
                A4 EXAM CHEAT SHEET
              </span>
              <span className="text-xs font-mono text-slate-500 dark:text-gray-400">
                1 แผ่น A4 (หน้า-หลัง = 2 หน้าพอดี)
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 dark:text-white">
              ใบจดสรุป 1 แผ่น A4 หน้า-หลัง (สำหรับนำเข้าห้องสอบ)
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-400 mt-1">
              ครอบคลุมหัวข้อพิเศษที่อาจารย์ระบุออกสอบ: Pattern Recognition, หุ่นยนต์และภาษา, การคำนวณภาพดิจิทัล (ความสว่าง, Aspect Ratio, Anti-Aliasing, RGB/CMYK, แอนิเมชัน, ขนาดไฟล์), โครงข่ายประสาทเทียม & Deep Learning (Sigmoid, S-Curve, Binary Step, ReLU, Softmax, Backprop, RL, Data Mining) และ Expert Systems (Fuzzy, Rule-Based, CBR, Deterministic, Knowledge Acquisition)
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full lg:w-auto">
            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white shadow-md shadow-red-600/20 active:scale-95 transition"
            >
              <Printer className="w-4 h-4" />
              <span>สั่งพิมพ์ A4 หน้า-หลัง / บันทึก PDF</span>
            </button>
            <button
              onClick={handleCopyAll}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl font-mono text-xs font-bold border border-slate-200 dark:border-[#27272f] bg-slate-50 dark:bg-[#1a1a22] text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-[#22222d] transition"
              title="คัดลอกข้อความสรุปทั้งหมด"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'คัดลอกแล้ว!' : 'Copy Text'}</span>
            </button>
          </div>
        </div>

        {/* View Mode & Search Filter */}
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-[#27272f] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-[#1a1a22] p-1 rounded-xl w-full sm:w-auto">
            <button
              onClick={() => { sound.playClick(); setViewMode('both'); }}
              className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${viewMode === 'both'
                  ? 'bg-white dark:bg-[#252530] text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-gray-400 hover:text-slate-900'
                }`}
            >
              <Layers className="w-3.5 h-3.5 text-red-500" />
              <span>ดูทั้ง 2 หน้า (หน้า-หลัง)</span>
            </button>
            <button
              onClick={() => { sound.playClick(); setViewMode('p1'); }}
              className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${viewMode === 'p1'
                  ? 'bg-white dark:bg-[#252530] text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-gray-400 hover:text-slate-900'
                }`}
            >
              <FileText className="w-3.5 h-3.5 text-blue-500" />
              <span>หน้า 1 (ด้านหน้า)</span>
            </button>
            <button
              onClick={() => { sound.playClick(); setViewMode('p2'); }}
              className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${viewMode === 'p2'
                  ? 'bg-white dark:bg-[#252530] text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-gray-400 hover:text-slate-900'
                }`}
            >
              <FileText className="w-3.5 h-3.5 text-purple-500" />
              <span>หน้า 2 (ด้านหลัง)</span>
            </button>
          </div>

          {/* Quick Filter Search */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="ค้นหาคีย์เวิร์ด (เช่น Sigmoid, Fuzzy)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl text-xs bg-white dark:bg-[#1a1a22] border border-slate-200 dark:border-gray-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-red-500"
            />
          </div>
        </div>

        {/* Print instructions banner */}
        <div className="mt-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 rounded-xl p-2.5 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
          <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong>คำแนะนำในการกด Print หรือ Save to PDF:</strong> ในหน้าต่างสั่งพิมพ์ของบราวเซอร์ ให้เลือก <strong>Destination: Save as PDF</strong> (หรือเครื่องพิมพ์), <strong>Layout: Portrait (แนวตั้ง)</strong>, <strong>Margins: Minimum หรือ 5mm</strong>, และ <strong>ติ๊กถูก Background graphics (กราฟิกพื้นหลัง)</strong> เพื่อให้เส้นกรอบและเฉดสีคมชัดตรงตามหน้ากระดาษจริง
          </div>
        </div>
      </div>

      {/* =========================================================================
          PRINTABLE A4 PAGES CONTAINER
          ========================================================================= */}
      <div className="print-container flex flex-col items-center gap-8">

        {/* =======================================================================
            PAGE 1: ด้านหน้า (Front Side)
            Topics: Pattern Recognition, Robotics & Languages, Image Processing
            ======================================================================= */}
        {(viewMode === 'both' || viewMode === 'p1') && (
          <div className="a4-page bg-white text-slate-950 rounded-2xl shadow-xl border border-slate-300 dark:border-slate-700 p-4 sm:p-5 max-w-[210mm] w-full text-[11px] leading-[1.3] font-sans">

            {/* Page Header */}
            <div className="border-b-2 border-slate-900 pb-1.5 mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="bg-red-600 text-white font-black px-1.5 py-0.5 rounded text-[10px] font-mono tracking-wider">
                  AI FINAL
                </span>
                <span className="font-heading font-black text-xs sm:text-sm tracking-tight text-slate-900">
                  ใบจดสรุปเนื้อหาและสูตรคำนวณเตรียมสอบปลายภาค [หน้า 1/2: ด้านหน้า]
                </span>
              </div>
              <div className="text-[10px] font-mono text-slate-600 font-bold">
                1 A4 SHEET (FRONT) • PATTERN RECOGNITION / ROBOTICS / IMAGE PROC
              </div>
            </div>

            {/* 3-Column Grid for Page 1 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">

              {/* COLUMN 1: PATTERN RECOGNITION */}
              <div className="space-y-1.5">
                <div className="bg-red-50 border border-red-300 rounded-md p-1.5">
                  <div className="font-heading font-bold text-red-900 text-[11px] flex items-center justify-between border-b border-red-200 pb-0.5 mb-1">
                    <span>1. การรู้จำแบบ (Pattern Recognition)</span>
                    <span className="text-[9px] font-mono text-red-700">Ch 09</span>
                  </div>
                  <ul className="space-y-0.5 text-[10px] text-slate-800 list-disc list-inside">
                    <li>
                      <strong>Pattern:</strong> รูปแบบหรือโครงสร้างที่มีระเบียบและสามารถวัดได้
                    </li>
                    <li>
                      <strong>Feature (คุณลักษณะ):</strong> ตัวเลขตัวแทนข้อมูลสกัดจากข้อมูลดิบ เช่น กว้าง, ยาว, สีเฉลี่ย (<MathText>{'$X = [x_1, x_2, ..., x_n]^T$'}</MathText>)
                    </li>
                    <li>
                      <strong>Feature Space:</strong> ปริภูมิหลายมิติที่แต่ละแกนแทน 1 คุณลักษณะ ข้อมูลแต่ละชิ้นคือจุดพิกัดใน Space
                    </li>
                    <li>
                      <strong>Classifier (ตัวจำแนก):</strong> โมเดล/อัลกอริทึมแบ่งข้อมูลเข้า Class ตาม Decision Boundary เช่น K-NN, Decision Tree, Naive Bayes, SVM
                    </li>
                    <li>
                      <strong>Supervised Learning:</strong> มี Input + Ground Truth Label (สอนด้วยเฉลย) เช่น Classification, Regression
                    </li>
                    <li>
                      <strong>Unsupervised Learning:</strong> ไม่มี Label ให้โมเดลหา Pattern ซ่อนเร้นเอง เช่น Clustering, PCA
                    </li>
                    <li>
                      <strong>Clustering (การจัดกลุ่ม):</strong> จัดข้อมูลที่คล้ายกันให้อยู่กลุ่มเดียวกัน (K-Means: กำหนด <MathText>{'$k$'}</MathText> ศูนย์กลาง {'->'} วัดระยะ {'->'} จัดกลุ่ม {'->'} ปรับ Centroid ซ้ำจนลู่เข้า)
                    </li>
                    <li>
                      <strong>Label (ป้ายกำกับ):</strong> คำตอบจริง (Ground Truth) ของคลาส เช่น แมว/หมา, ปกติ/เป็นโรค
                    </li>
                    <li>
                      <strong>Abstraction (ภาวะนามธรรม):</strong> การตัดทอนรายละเอียดที่ไม่จำเป็นออก เหลือเฉพาะแก่นสารสำคัญ (Feature Selection / PCA) ช่วยลดมิติและแก้ <em>Curse of Dimensionality</em>
                    </li>
                  </ul>

                  {/* Math Formulas */}
                  <div className="mt-1 pt-1 border-t border-red-200 text-[9.5px]">
                    <div className="font-bold text-red-800">สูตรคำนวณระยะทาง & ปรับสเกล:</div>
                    <div className="bg-white p-1 rounded border border-red-200 my-0.5 font-mono">
                      <strong>Euclidean:</strong> <MathText>{'$d = \\sqrt{\\sum_{i=1}^n (x_i - y_i)^2}$'}</MathText>
                      <br /><span className="text-slate-500 text-[9px]">(ระยะทางตรงบนระนาบเรขาคณิต)</span>
                    </div>
                    <div className="bg-white p-1 rounded border border-red-200 my-0.5 font-mono">
                      <strong>Manhattan:</strong> <MathText>{'$d = \\sum_{i=1}^n |x_i - y_i|$'}</MathText>
                      <br /><span className="text-slate-500 text-[9px]">(ระยะทางตามแนวแกนเลี้ยวฉาก 90°)</span>
                    </div>
                    <div className="bg-white p-1 rounded border border-red-200 my-0.5 font-mono">
                      <strong>Min-Max Scaling:</strong> <MathText>{'$x\' = \\frac{x - x_{\\min}}{x_{\\max} - x_{\\min}} \\in [0, 1]$'}</MathText>
                    </div>
                  </div>
                </div>

                {/* Subsumption vs Deliberative */}
                <div className="bg-slate-50 border border-slate-300 rounded-md p-1.5 text-[9.5px]">
                  <div className="font-bold text-slate-900 border-b border-slate-200 pb-0.5 mb-0.5">
                    สถาปัตยกรรมการควบคุม (Architecture):
                  </div>
                  <p className="text-slate-700">
                    • <strong>Subsumption (Brooks):</strong> ควบคุมแบบปฏิกิริยาตอบสนอง (Reactive) ลำดับชั้นจากล่างขึ้นบน ไม่พึ่งพาแบบจำลองโลก สะท้อนไว
                    <br />• <strong>Deliberative:</strong> มีแผนที่และโมเดลโลก (Sense-Plan-Act) คิดละเอียดแต่วิเคราะห์ช้า
                  </p>
                </div>
              </div>

              {/* COLUMN 2: ROBOTICS & LANGUAGES */}
              <div className="space-y-1.5">
                <div className="bg-blue-50 border border-blue-300 rounded-md p-1.5">
                  <div className="font-heading font-bold text-blue-900 text-[11px] flex items-center justify-between border-b border-blue-200 pb-0.5 mb-1">
                    <span>2. วิทยาการหุ่นยนต์ (Robotics)</span>
                    <span className="text-[9px] font-mono text-blue-700">Ch 11</span>
                  </div>

                  {/* Robot Types */}
                  <div className="text-[10px]">
                    <strong className="text-blue-950">ประเภทของหุ่นยนต์ (Robot Types):</strong>
                    <ul className="list-disc list-inside space-y-0.5 text-[9.5px] text-slate-800 mt-0.5">
                      <li><strong>Cartesian / Gantry:</strong> เคลื่อนที่ 3 แกนสไลด์ X-Y-Z เป็นรูปกล่องสี่เหลี่ยม แม่นยำสูง (เช่น เครื่อง 3D Printer, CNC)</li>
                      <li><strong>SCARA:</strong> 4 แกน เคลื่อนที่เร็วระนาบแนวนอน เหมาะกับงานประกอบ Pick & Place ชิ้นส่วนอิเล็กทรอนิกส์</li>
                      <li><strong>Articulated (แขนกลข้อต่อหมุน):</strong> 6-axis เลียนแบบแขนมนุษย์ หมุนได้อิสระ เหมาะกับงานเชื่อม, พ่นสี, ประกอบรถยนต์</li>
                      <li><strong>Delta (Parallel Robot):</strong> แขนกลแมงมุม 3 แขนต่อร่วม ขยับเร็วยิ่งยวด เหมาะกับจัดเรียงอาหารและยา</li>
                      <li><strong>Mobile / AGV / AMR:</strong> หุ่นยนต์เคลื่อนที่ (AGV ตามรางแม่เหล็ก, AMR ใช้ LiDAR+SLAM นำทางอิสระ)</li>
                      <li><strong>Aerial / UAV:</strong> อากาศยานไร้คนขับ (โดรนสำรวจ/ส่งของ)</li>
                    </ul>
                  </div>

                  {/* Components */}
                  <div className="mt-1 pt-1 border-t border-blue-200 text-[9.5px]">
                    <strong className="text-blue-950">ส่วนประกอบหลัก 6 ด้าน (Components):</strong>
                    <ol className="list-decimal list-inside space-y-0.5 text-slate-800 mt-0.5">
                      <li><strong>Sensors (รับรู้):</strong> Encoder (วัดมุมหมุน), IMU/Gyro (วัดความเอียง), LiDAR, กล้อง Vision, Ultrasonic, Force sensor</li>
                      <li><strong>Actuators (ขับเคลื่อน):</strong> Servo Motor (คุมตำแหน่งแม่นยำ), Stepper, DC, Hydraulic (งานหนักมาก), Pneumatic (เร็วสูง)</li>
                      <li><strong>Controller / Brain:</strong> MCU (STM32, Arduino), SBC (Raspberry Pi, Jetson), PLC (งานอุตสาหกรรม)</li>
                      <li><strong>End-Effector (มือจับ):</strong> Gripper (ก้ามปู), Suction Cup (สูญญากาศ), หัวเชื่อม, หัวพ่นสี</li>
                      <li><strong>Kinematics (กลไก):</strong> Links (ท่อนแขน) และ Joints (ข้อต่อหมุน R หรือยืดหด P), องศาอิสระ (DOF)</li>
                      <li><strong>Power:</strong> LiPo Battery, Power Supply</li>
                    </ol>
                  </div>

                  {/* Languages */}
                  <div className="mt-1 pt-1 border-t border-blue-200 text-[9.5px]">
                    <strong className="text-blue-950">ภาษา & เครื่องมือพัฒนาหุ่นยนต์:</strong>
                    <ul className="list-disc list-inside space-y-0.5 text-slate-800 mt-0.5">
                      <li><strong>C / C++:</strong> เร็วที่สุด สำหรับ Firmware ระดับล่าง, Real-time Motor Control, Driver อุปกรณ์</li>
                      <li><strong>Python:</strong> ภาษายอดนิยมสำหรับ AI, Computer Vision (OpenCV), Path Planning, ROS scripting</li>
                      <li><strong>ROS / ROS 2:</strong> Middleware มาตรฐานโลก สื่อสารข้าม Node ด้วย Publish/Subscribe Topics, Services, Actions</li>
                      <li><strong>MATLAB / Simulink:</strong> จำลองพลศาสตร์ ออกแบบ Control Loop (PID, State-Space)</li>
                      <li><strong>URDF:</strong> ไฟล์ XML อธิบายโมเดล 3D และ Kinematics ของหุ่นยนต์</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* COLUMN 3: IMAGE PROCESSING CALCULATIONS */}
              <div className="space-y-1.5">
                <div className="bg-emerald-50 border border-emerald-300 rounded-md p-1.5">
                  <div className="font-heading font-bold text-emerald-900 text-[11px] flex items-center justify-between border-b border-emerald-200 pb-0.5 mb-1">
                    <span>3. การประมวลผลภาพดิจิทัล (Image Math)</span>
                    <span className="text-[9px] font-mono text-emerald-700">Ch 13</span>
                  </div>

                  {/* Brightness & Aspect Ratio */}
                  <div className="space-y-1 text-[9.5px]">
                    <div className="bg-white p-1 rounded border border-emerald-200">
                      <strong>1) Brightness (การปรับความสว่าง):</strong>
                      <div className="font-mono text-[9px] mt-0.5"><MathText>{'$g(x,y) = f(x,y) + c$'}</MathText></div>
                      <span className="text-slate-600 text-[8.5px]">
                        <MathText>{'$c > 0$'}</MathText> สว่างขึ้น, <MathText>{'$c < 0$'}</MathText> มืดลง (Clamping ใน <MathText>{'$[0, 255]$'}</MathText>)
                      </span>
                      <div className="font-mono text-[8.5px] mt-0.5">
                        ความสว่างเฉลี่ย: <MathText>{'$\\mu = \\frac{1}{M \\cdot N} \\sum_{x} \\sum_{y} f(x,y)$'}</MathText>
                      </div>
                    </div>

                    <div className="bg-white p-1 rounded border border-emerald-200">
                      <strong>2) Aspect Ratio (อัตราส่วนภาพ):</strong>
                      <div className="font-mono text-[9px] mt-0.5">
                        <MathText>{'$AR = \\frac{\\text{Width}}{\\text{Height}} = \\frac{W}{H}$'}</MathText> (เช่น 16:9, 4:3)
                      </div>
                      <span className="text-slate-600 text-[8.5px]">
                        <strong>คำนวณย่อ-ขยายไม่ให้ภาพเบี้ยว:</strong>
                        <br />• ถ้ารู้ <MathText>{'$W_{\\text{new}} \\rightarrow H_{\\text{new}} = W_{\\text{new}} / AR$'}</MathText>
                        <br />• ถ้ารู้ <MathText>{'$H_{\\text{new}} \\rightarrow W_{\\text{new}} = H_{\\text{new}} \\times AR$'}</MathText>
                        <br />• <em>Letterbox:</em> แถบดำบน-ล่าง / <em>Pillarbox:</em> แถบดำซ้าย-ขวา
                      </span>
                    </div>

                    <div className="bg-white p-1 rounded border border-emerald-200">
                      <strong>3) Anti-Aliasing (การลดรอยหยัก):</strong>
                      <span className="text-slate-600 text-[8.5px] block">
                        • <strong>Aliasing (Jaggies):</strong> รอยหยักฟันปลาจากการสุ่มพิกเซลความถี่ต่ำกว่าเส้นต่อเนื่อง
                        <br />• <strong>SSAA:</strong> เรนเดอร์ความละเอียดสูงกว่าจอ 2x-4x แล้วเกลี่ยสีลงมา (เนียนสุด แต่กินสเปก)
                        <br />• <strong>MSAA:</strong> สุ่มตัวอย่างเฉพาะขอบวัตถุ (Edges)
                        <br />• <strong>Post-Process (FXAA):</strong> เบลอขอบรอยหยักด้วยฟิลเตอร์ ทำงานไวมาก
                      </span>
                    </div>

                    {/* Additive vs Subtractive */}
                    <div className="bg-white p-1 rounded border border-emerald-200 text-[8.5px]">
                      <strong className="text-emerald-950 block text-[9px]">4) Additive RGB vs Subtractive CMYK:</strong>
                      <table className="w-full mt-0.5 border-collapse text-[8px]">
                        <thead>
                          <tr className="bg-emerald-100/70 border-b border-emerald-300">
                            <th className="p-0.5 text-left">คุณสมบัติ</th>
                            <th className="p-0.5 text-left">Additive (แสง)</th>
                            <th className="p-0.5 text-left">Subtractive (สาร/หมึก)</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-emerald-100">
                            <td className="p-0.5 font-bold">แม่สี</td>
                            <td className="p-0.5">RGB (Red, Green, Blue)</td>
                            <td className="p-0.5">CMYK (Cyan, Magenta, Yellow, Black)</td>
                          </tr>
                          <tr className="border-b border-emerald-100">
                            <td className="p-0.5 font-bold">จุดเริ่มต้น</td>
                            <td className="p-0.5">มืด/ดำ (RGB 0,0,0)</td>
                            <td className="p-0.5">กระดาษขาว (สะท้อนแสง)</td>
                          </tr>
                          <tr className="border-b border-emerald-100">
                            <td className="p-0.5 font-bold">กลไก</td>
                            <td className="p-0.5">ปล่อยแสงรวมกัน</td>
                            <td className="p-0.5">ดูดกลืน (หักลบ) แสง</td>
                          </tr>
                          <tr>
                            <td className="p-0.5 font-bold">ผลรวม 100%</td>
                            <td className="p-0.5 font-bold text-blue-700">แสงสีขาว (White)</td>
                            <td className="p-0.5 font-bold text-slate-800">สีดำคล้ำ (Dark/Black)</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Animation & File Size */}
                    <div className="bg-white p-1 rounded border border-emerald-200 text-[8.5px]">
                      <strong className="text-emerald-950 block text-[9px]">5) การสร้างภาพเคลื่อนไหว (Animation):</strong>
                      <span className="text-slate-700">
                        • <strong>Persistence of Vision:</strong> ภาพติดตาค้าง 1/16 วินาที ({'>='} 16 fps จึงเห็นต่อเนื่อง)
                        <br />• <strong>Frame Rates:</strong> 12 fps (วาดมือ Shoot on 2s), 24 fps (ภาพยนตร์), 30 fps (TV/Web), 60 fps (เกมลื่นไหล)
                        <br />• <strong>Keyframe & Tweening:</strong> สร้างภาพหลัก และแทรกเฟรมกลาง (In-betweening)
                      </span>
                    </div>

                    <div className="bg-white p-1 rounded border border-emerald-200 text-[8.5px]">
                      <strong className="text-emerald-950 block text-[9px]">6) การคำนวณขนาดไฟล์ภาพ (Raw Image Size):</strong>
                      <div className="font-mono text-[8px] bg-slate-100 p-0.5 rounded my-0.5">
                        Bytes = (Width × Height × BitDepth) / 8
                        <br />KB = Bytes / 1024,  MB = KB / 1024
                      </div>
                      <span className="text-slate-600 text-[8px]">
                        <strong>ตัวอย่าง:</strong> ภาพ 1920×1080 พิกเซล, 24-bit True Color (3 Bytes/px)
                        <br />Bytes = 1920 × 1080 × 3 = 6,220,800 Bytes
                        <br />= 6,220,800 / (1024 × 1024) ≈ <strong>5.93 MB</strong>
                      </span>
                    </div>

                  </div>
                </div>
              </div>

            </div>

            {/* Page 1 Footer */}
            <div className="mt-2 pt-1 border-t border-slate-300 flex items-center justify-between text-[9px] font-mono text-slate-500">
              <span>AI FINAL EXAM PREPARATION • มหาวิทยาลัย</span>
              <span className="font-bold text-slate-700">[ พลิกไปด้านหลัง {'->'} หน้า 2/2 ]</span>
              <span>PAGE 1 OF 2</span>
            </div>

          </div>
        )}

        {/* =======================================================================
            PAGE 2: ด้านหลัง (Back Side)
            Topics: Neural Networks & Deep Learning Math, Expert Systems, Knowledge Acquisition
            ======================================================================= */}
        {(viewMode === 'both' || viewMode === 'p2') && (
          <div className="a4-page bg-white text-slate-950 rounded-2xl shadow-xl border border-slate-300 dark:border-slate-700 p-4 sm:p-5 max-w-[210mm] w-full text-[11px] leading-[1.3] font-sans">

            {/* Page Header */}
            <div className="border-b-2 border-slate-900 pb-1.5 mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="bg-purple-600 text-white font-black px-1.5 py-0.5 rounded text-[10px] font-mono tracking-wider">
                  AI FINAL
                </span>
                <span className="font-heading font-black text-xs sm:text-sm tracking-tight text-slate-900">
                  ใบจดสรุปเนื้อหาและสูตรคำนวณเตรียมสอบปลายภาค [หน้า 2/2: ด้านหลัง]
                </span>
              </div>
              <div className="text-[10px] font-mono text-slate-600 font-bold">
                1 A4 SHEET (BACK) • NEURAL NETWORKS / DEEP LEARNING / EXPERT SYSTEMS
              </div>
            </div>

            {/* 2-Column Grid for Page 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">

              {/* COLUMN 1: NEURAL NETWORKS & DEEP LEARNING */}
              <div className="space-y-1.5">
                <div className="bg-purple-50 border border-purple-300 rounded-md p-1.5">
                  <div className="font-heading font-bold text-purple-900 text-[11px] flex items-center justify-between border-b border-purple-200 pb-0.5 mb-1">
                    <span>4. โครงข่ายประสาทเทียม & ดีพเลิร์นนิง (Neural & Deep Learning)</span>
                    <span className="text-[9px] font-mono text-purple-700">Ch 14</span>
                  </div>

                  {/* Components & Applications */}
                  <div className="text-[9.5px] space-y-1">
                    <p className="text-slate-800">
                      <strong>Deep Learning ใช้กับอะไรบ้าง:</strong> Computer Vision (ตรวจจับวัตถุ, จำแนกภาพ CNN, YOLO), NLP / Large Language Models (แปลภาษา, แชตบอต LLM), การแพทย์ (วิเคราะห์ภาพ X-Ray, AlphaFold ทำนายโครงสร้างโปรตีน), ยานยนต์ไร้คนขับ, ระบบจำแนกเสียงพูด (Whisper)
                    </p>

                    <div className="bg-white p-1 rounded border border-purple-200">
                      <strong className="text-purple-950">ส่วนประกอบ 7 ด้านของ Neural Network:</strong>
                      <ol className="list-decimal list-inside space-y-0.5 text-[9px] text-slate-800 mt-0.5">
                        <li><strong>Input Layer:</strong> รับข้อมูล Feature (<MathText>{'$x_i$'}</MathText>) ป้อนเข้าโครงข่าย (ไม่มีการคำนวณ)</li>
                        <li><strong>Hidden Layer:</strong> สกัด Representation เชิงลึกแบบไม่เป็นเส้นตรง (Non-linear)</li>
                        <li><strong>Output Layer:</strong> คำนวณผลลัพธ์สุดท้าย (<MathText>{'$\\hat{y}$'}</MathText>) เพื่อเปรียบเทียบกับคำตอบจริง (<MathText>{'$t$'}</MathText>)</li>
                        <li><strong>Weights (<MathText>{'$w_{ij}$'}</MathText>):</strong> ค่าน้ำหนักถ่วง ปรับความแรงของสัญญาณไซแนปส์</li>
                        <li><strong>Biases (<MathText>{'$b$'}</MathText>):</strong> ค่าเอนเอียง ปรับให้อินพุตเลื่อนจุดทำงานได้แม้ <MathText>{'$x=0$'}</MathText></li>
                        <li><strong>Net Input (<MathText>{'$z$'}</MathText>):</strong> ผลรวมถ่วงน้ำหนัก: <MathText>{'$z = \\sum_{i=1}^n w_i x_i + b$'}</MathText></li>
                        <li><strong>Activation (<MathText>{'$a$'}</MathText>):</strong> ผลลัพธ์หลังผ่านฟังก์ชันกระตุ้น: <MathText>{'$a = f(z)$'}</MathText></li>
                      </ol>
                    </div>

                    {/* Weight Adjustment Function (Optimizer) */}
                    <div className="bg-white p-1 rounded border border-purple-200">
                      <strong className="text-purple-950">ฟังก์ชันที่ใช้ปรับ Weight เรียกว่าอะไร & สูตรคำนวณ:</strong>
                      <p className="text-[9px] text-slate-800 mt-0.5">
                        • เรียกว่า <strong>"Optimizer"</strong> (เช่น Gradient Descent, SGD, Adam, RMSprop)
                        <br />• ใช้อัลกอริทึม <strong>Backpropagation</strong> ผ่านกฎลูกโซ่ (Chain Rule) เพื่อคำนวณ <MathText>{'$\\frac{\\partial E}{\\partial w}$'}</MathText>
                        <br />• <strong>สูตรปรับค่าน้ำหนัก (Delta Rule):</strong>
                      </p>
                      <div className="font-mono text-[9px] bg-purple-100/60 p-1 rounded my-0.5">
                        <MathText>{'$w_{\\text{new}} = w_{\\text{old}} - \\eta \\frac{\\partial E}{\\partial w} = w_{\\text{old}} + \\Delta w$'}</MathText>
                        <br /><MathText>{'$\\Delta w = \\eta \\cdot \\delta \\cdot x$'}</MathText>
                      </div>
                      <span className="text-[8.5px] text-slate-600 block">
                        - Output Node Error: <MathText>{'$\\delta_o = (t - y) \\cdot f\'(z_o)$'}</MathText>
                        <br />- Hidden Node Error: <MathText>{'$\\delta_h = \\left( \\sum \\delta_o w_{ho} \\right) \\cdot f\'(z_h)$'}</MathText>
                        <br />- <MathText>{'$\\eta$'}</MathText> (Eta) = Learning Rate (อัตราการเรียนรู้)
                      </span>
                    </div>

                    {/* Activation Functions Table */}
                    <div className="bg-white p-1 rounded border border-purple-200">
                      <strong className="text-purple-950 block text-[9px]">ตารางเปรียบเทียบ Activation Functions สำคัญ:</strong>
                      <table className="w-full mt-0.5 border-collapse text-[8px]">
                        <thead>
                          <tr className="bg-purple-100/70 border-b border-purple-300">
                            <th className="p-0.5 text-left">ฟังก์ชัน</th>
                            <th className="p-0.5 text-left">สูตร f(z)</th>
                            <th className="p-0.5 text-left">ช่วงค่า (Range)</th>
                            <th className="p-0.5 text-left">อนุพันธ์ & จุดเด่น/จุดด้อย</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-purple-100">
                            <td className="p-0.5 font-bold">Sigmoid (S-Curve)</td>
                            <td className="p-0.5 font-mono"><MathText>{'$\\frac{1}{1 + e^{-z}}$'}</MathText></td>
                            <td className="p-0.5 font-mono">(0, 1)</td>
                            <td className="p-0.5">
                              <MathText>{'$f\'(z) = \\sigma(1-\\sigma)$'}</MathText>
                              <br /><span className="text-red-700">ข้อเสีย: Vanishing Gradient เมื่อ |z| มาก</span>
                            </td>
                          </tr>
                          <tr className="border-b border-purple-100">
                            <td className="p-0.5 font-bold">Binary Step (Threshold)</td>
                            <td className="p-0.5 font-mono">1 if z {'>='} 0 else 0</td>
                            <td className="p-0.5 font-mono">&#123;0, 1&#125;</td>
                            <td className="p-0.5">
                              ความชัน f'(z) = 0 เกือบทุกที่
                              <br /><span className="text-red-700">ใช้กับ Backprop ไม่ได้ (หาอนุพันธ์ไม่ได้)</span>
                            </td>
                          </tr>
                          <tr className="border-b border-purple-100">
                            <td className="p-0.5 font-bold">ReLU</td>
                            <td className="p-0.5 font-mono"><MathText>{'$\\max(0, z)$'}</MathText></td>
                            <td className="p-0.5 font-mono">[0, ∞)</td>
                            <td className="p-0.5">
                              f'=1 ถ้า z{'>'}0, ไวมาก ไม่มีปัญหา Vanishing ฝั่งบวก
                              <br /><span className="text-amber-800">ข้อควรระวัง: Dying ReLU ถ้า z ≤ 0 ตลอด</span>
                            </td>
                          </tr>
                          <tr>
                            <td className="p-0.5 font-bold">Softmax</td>
                            <td className="p-0.5 font-mono"><MathText>{'$\\frac{e^{z_i}}{\\sum e^{z_j}}$'}</MathText></td>
                            <td className="p-0.5 font-mono">(0, 1), รวม=1</td>
                            <td className="p-0.5 font-bold text-blue-700">
                              ใช้ที่ Output Layer สำหรับ Multi-Class Classification (แปลงคะแนนเป็นความน่าจะเป็น)
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Learning Types & Training Terms */}
                    <div className="bg-white p-1 rounded border border-purple-200 text-[8.5px]">
                      <strong className="text-purple-950 block text-[9px]">การเรียนรู้เสริม & พารามิเตอร์การเทรน:</strong>
                      <span className="text-slate-800 block">
                        • <strong>Semi-Supervised Learning:</strong> ใช้ข้อมูล Labeled ปริมาณน้อย ร่วมกับ Unlabeled ปริมาณมาก (ประหยัดเวลาติดฉลาก)
                        <br />• <strong>Reinforcement Learning (RL):</strong> <strong>Agent</strong> กระทำ <strong>Action</strong> ใน <strong>Environment</strong> ได้รับ <strong>State</strong> และ <strong>Reward/Penalty</strong> เพื่อสร้าง <strong>Policy (<MathText>{'$\\pi$'}</MathText>)</strong> สะสมรางวัลสูงสุด
                        <br />• <strong>Epoch:</strong> การวนเทรนผ่านข้อมูลครบทุกตัว 1 รอบเต็ม
                        <br />• <strong>Batch Size:</strong> จำนวนข้อมูลที่ป้อนต่อการคำนวณ Gradient 1 ครั้ง
                        <br />• <strong>Iteration:</strong> รอบอัปเดตน้ำหนักต่อ Epoch (Iteration = N / Batch Size)
                      </span>
                    </div>

                    {/* Data Mining KDD */}
                    <div className="bg-white p-1 rounded border border-purple-200 text-[8.5px]">
                      <strong className="text-purple-950 block text-[9px]">Data Mining & KDD Process (7 ขั้นตอนการค้นหาความรู้):</strong>
                      <p className="text-slate-700 mt-0.5">
                        1. Cleaning (ตัด Noise) {'->'} 2. Integration (รวมแหล่งข้อมูล) {'->'} 3. Selection (คัดเลือกข้อมูล) {'->'} 4. Transformation (แปลงสเกล/Normalizing) {'->'} 5. Data Mining (ใช้อัลกอริทึมค้นหา Pattern) {'->'} 6. Pattern Evaluation (ประเมินความถูกต้อง) {'->'} 7. Knowledge Presentation (แสดงผลองค์ความรู้)
                      </p>
                    </div>

                  </div>
                </div>
              </div>

              {/* COLUMN 2: EXPERT SYSTEMS & KNOWLEDGE ACQUISITION */}
              <div className="space-y-1.5">
                <div className="bg-amber-50 border border-amber-300 rounded-md p-1.5">
                  <div className="font-heading font-bold text-amber-900 text-[11px] flex items-center justify-between border-b border-amber-200 pb-0.5 mb-1">
                    <span>5. ระบบผู้เชี่ยวชาญ & วิศวกรรมความรู้ (Expert Systems)</span>
                    <span className="text-[9px] font-mono text-amber-700">Ch 15</span>
                  </div>

                  <div className="text-[9.5px] space-y-1">
                    {/* Rule-Based Systems */}
                    <div className="bg-white p-1 rounded border border-amber-200">
                      <strong className="text-amber-950">1) Rule-Based System (ระบบอิงกฎ):</strong>
                      <p className="text-[9px] text-slate-800 mt-0.5">
                        • โครงสร้าง: <strong>Knowledge Base</strong> (กฎ IF-THEN) + <strong>Working Memory</strong> (ข้อเท็จจริงปัจจุบัน) + <strong>Inference Engine</strong> (กลไกการอนุมาน)
                        <br />• <strong>Forward Chaining (Data-Driven):</strong> จาก Facts {'->'} กฎถูก Fire {'->'} ได้ข้อสรุป (เหมาะกับงาน Monitoring, Planning, Synthesis)
                        <br />• <strong>Backward Chaining (Goal-Driven):</strong> จาก Goal (เป้าหมาย/สมมติฐาน) {'->'} ย้อนกลับไปตรวจเงื่อนไข IF (เหมาะกับงาน Diagnosis วินิจฉัยโรค, Troubleshooting)
                      </p>
                    </div>

                    {/* Fuzzy Expert System */}
                    <div className="bg-white p-1 rounded border border-amber-200">
                      <strong className="text-amber-950">2) Fuzzy Expert System (ระบบตรรกศาสตร์ฟัซซี):</strong>
                      <p className="text-[9px] text-slate-800 mt-0.5">
                        • จัดการความคลุมเครือ (Vagueness) ในภาษา เช่น "ค่อนข้างร้อน", "เร็วปานกลาง"
                        <br />• มีระดับความเป็นสมาชิก (Degree of Membership) <MathText>{'$\\mu(x) \\in [0, 1]$'}</MathText>
                        <br />• <strong>3 ขั้นตอนหลัก:</strong>
                        <br />&nbsp;&nbsp;1. <em>Fuzzification:</em> แปลงค่า Crisp Input เป็น Fuzzy Set ด้วย Membership Function (เช่น กราฟสามเหลี่ยม/สี่เหลี่ยมคางหมู)
                        <br />&nbsp;&nbsp;2. <em>Rule Evaluation:</em> ประเมินกฎฟัซซี (Fuzzy AND = min, Fuzzy OR = max)
                        <br />&nbsp;&nbsp;3. <em>Defuzzification:</em> แปลง Fuzzy Output กลับเป็นค่าจริงคมชัด (Crisp Output) นิยมวิธี <strong>Center of Gravity (COG / Centroid)</strong>
                      </p>
                    </div>

                    {/* Case-Based Reasoning (CBR) */}
                    <div className="bg-white p-1 rounded border border-amber-200">
                      <strong className="text-amber-950">3) Case-Based Reasoning (CBR - การให้เหตุผลอิงกรณี):</strong>
                      <p className="text-[9px] text-slate-800 mt-0.5">
                        • แก้ปัญหาใหม่โดยเปรียบเทียบกับกรณีปัญหาในอดีตที่เคยแก้สำเร็จแล้ว (Solving new problems by adapting past solutions)
                        <br />• <strong>วงจร 4R Cycle:</strong>
                        <br />&nbsp;&nbsp;1. <strong>Retrieve (ดึง):</strong> ค้นหากรณีในอดีตที่คล้ายที่สุดจาก Case Base
                        <br />&nbsp;&nbsp;2. <strong>Reuse (ใช้ซ้ำ):</strong> นำวิธีแก้ปัญหาของกรณีเดิมมาปรับใช้
                        <br />&nbsp;&nbsp;3. <strong>Revise (ปรับปรุง):</strong> ปรับแต่งวิธีแก้ให้เข้ากับบริบทใหม่ หรือทดสอบ
                        <br />&nbsp;&nbsp;4. <strong>Retain (เก็บรักษา):</strong> บันทึกเคสที่แก้สำเร็จเป็นความรู้ใหม่ใน Case Base
                      </p>
                    </div>

                    {/* Deterministic vs Probabilistic */}
                    <div className="bg-white p-1 rounded border border-amber-200">
                      <strong className="text-amber-950">4) Deterministic vs Probabilistic System:</strong>
                      <p className="text-[9px] text-slate-800 mt-0.5">
                        • <strong>Deterministic System:</strong> กฎตายตัว Input เดิมจะได้ Output เดิม 100% เสมอ ไม่มีความสุ่ม (เช่น ตรรกศาสตร์แบบดั้งเดิม)
                        <br />• <strong>Probabilistic System:</strong> ข้อมูลมีความไม่แน่นอน/ไม่สมบูรณ์ ใช้ทฤษฎีความน่าจะเป็น หรือ <strong>Certainty Factor (CF)</strong> ช่วง [-1.0, +1.0]
                        <br />&nbsp;&nbsp;<em>สูตรรวม CF:</em> <MathText>{'$CF_{\\text{comb}} = CF_1 + CF_2(1 - CF_1)$'}</MathText> เมื่อ CF {'>'} 0
                      </p>
                    </div>

                    {/* Static vs Dynamic */}
                    <div className="bg-white p-1 rounded border border-amber-200">
                      <strong className="text-amber-950">5) Static System vs Dynamic System:</strong>
                      <p className="text-[9px] text-slate-800 mt-0.5">
                        • <strong>Static System:</strong> สภาพแวดล้อมคงที่ ไม่แปรเปลี่ยนตามเวลา การตัดสินใจไม่ขึ้นกับเวลา (Time-invariant)
                        <br />• <strong>Dynamic System:</strong> สภาพแวดล้อมเปลี่ยนแปลงตามกาลเวลาตลอดเวลา (Time-variant) ระบบต้องตรวจจับและปรับตัวตามสถานะเรียลไทม์ (เช่น ควบคุมหุ่นยนต์เคลื่อนที่)
                      </p>
                    </div>

                    {/* Knowledge Acquisition & Bottleneck */}
                    <div className="bg-white p-1 rounded border border-amber-200">
                      <strong className="text-amber-950">6) Data Collection & Knowledge Acquisition:</strong>
                      <p className="text-[9px] text-slate-800 mt-0.5">
                        • <strong>Knowledge Acquisition:</strong> กระบวนการสกัด ดึง และจัดโครงสร้างความรู้จากผู้เชี่ยวชาญมนุษย์แปลงเป็น Knowledge Base ผ่านบุคคลที่เรียกว่า <em>Knowledge Engineer</em>
                        <br />• <strong>The Knowledge Engineering Bottleneck:</strong> ปัญหาคอขวดที่ยากที่สุด เนื่องจากผู้เชี่ยวชาญมีความรู้โดยสัญชาตญาณ (Tacit Knowledge) ที่อธิบายเป็นคำพูดหรือกฎ IF-THEN ตายตัวได้ยาก
                        <br />• <strong>เทคนิคการสกัดความรู้:</strong> สัมภาษณ์เชิงโครงสร้าง (Structured Interview), คิดออกเสียง (Protocol Analysis), สังเกตการณ์ (Observation), และการสกัดกฎอัตโนมัติด้วย ML (Rule Induction)
                      </p>
                    </div>

                  </div>
                </div>

                {/* Quick Exam Tips Note */}
                <div className="bg-slate-100 border border-slate-300 rounded-md p-1.5 text-[9px] text-slate-700">
                  <div className="font-bold text-slate-900 border-b border-slate-200 pb-0.5 mb-0.5 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>จุดหลอกที่พบบ่อยในข้อสอบ AI:</span>
                  </div>
                  • Sigmoid output อยู่ใน (0, 1) ไม่ใช่ [-1, 1] (Tanh ต่างหากที่ได้ [-1, 1])
                  <br />• Perceptron ชั้นเดียว (Single Layer) แก้ปัญหา XOR ไม่ได้ ต้องใช้ Multi-Layer Perceptron (MLP)
                  <br />• Forward Chaining เริ่มจาก Facts (Data-Driven), Backward Chaining เริ่มจาก Goal
                  <br />• Additive ผสมได้สีขาว (White), Subtractive ผสมได้สีดำ (Dark/Black)
                  <br />• ขนาดไฟล์ภาพดิบ 24-bit ใช้ 3 Bytes ต่อพิกเซล (เพราะ 24 bits / 8 = 3 Bytes)
                </div>

              </div>

            </div>

            {/* Page 2 Footer */}
            <div className="mt-2 pt-1 border-t border-slate-300 flex items-center justify-between text-[9px] font-mono text-slate-500">
              <span>AI FINAL EXAM PREPARATION • มหาวิทยาลัย</span>
              <span className="font-bold text-emerald-700">[ จบเอกสารสรุป 1 แผ่น A4 หน้า-หลัง ครบถ้วน 100% ]</span>
              <span>PAGE 2 OF 2</span>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
