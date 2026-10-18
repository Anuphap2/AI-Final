import React, { useState } from 'react';
import { 
  Calculator, 
  Layers, 
  Activity, 
  Cpu, 
  Maximize2, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  RefreshCw, 
  Binary, 
  Sliders,
  Info,
  Sparkles,
  HelpCircle,
  TrendingDown,
  BookOpen
} from 'lucide-react';
import { sound } from '../utils/soundEffects';
import MathText from './MathText';

export default function CalculatorsTab() {
  const [activeCalc, setActiveCalc] = useState('filesize');

  // 1. File Size State
  const [imgWidth, setImgWidth] = useState(1920);
  const [imgHeight, setImgHeight] = useState(1080);
  const [colorMode, setColorMode] = useState('24'); // bits per pixel

  // 2. Nyquist State
  const [signalFreq, setSignalFreq] = useState(25); // kHz
  const [samplingFreq, setSamplingFreq] = useState(60); // kHz

  // 3. Quantization State
  const [vMin, setVMin] = useState(0);
  const [vMax, setVMax] = useState(5);
  const [vIn, setVIn] = useState(3.2);
  const [quantBits, setQuantBits] = useState(3);

  // 4. Mean & Contrast 2x2 State
  const [p1, setP1] = useState(20);
  const [p2, setP2] = useState(60);
  const [p3, setP3] = useState(140);
  const [p4, setP4] = useState(220);

  // 5. Perceptron State
  const [x1, setX1] = useState(0.5);
  const [x2, setX2] = useState(0.8);
  const [w1, setW1] = useState(0.4);
  const [w2, setW2] = useState(-0.5);
  const [bias, setBias] = useState(0.1);

  // -------------------------------------------------------------
  // CALCULATIONS:
  // -------------------------------------------------------------

  // 1. File Size
  const totalPixels = imgWidth * imgHeight;
  const bitDepth = parseInt(colorMode, 10);
  const bytesPerPixel = bitDepth / 8;
  const totalBits = totalPixels * bitDepth;
  const totalBytes = totalBits / 8;
  const totalKB = totalBytes / 1024;
  const totalMB = totalKB / 1024;

  // 2. Nyquist
  const nyquistRate = signalFreq * 2;
  const isNyquistMet = samplingFreq >= nyquistRate;
  const isDanger = samplingFreq < nyquistRate;
  const apparentFreq = isDanger ? Math.abs(samplingFreq - signalFreq) : signalFreq;
  const samplingPeriodUs = (1000 / samplingFreq);

  // 3. Quantization
  const quantN = Math.pow(2, quantBits);
  const clampedVIn = Math.min(Math.max(vIn, vMin), vMax);
  const vRange = Math.max(vMax - vMin, 0.0001);
  const quantRatio = (clampedVIn - vMin) / vRange;
  const quantIndexFloat = quantRatio * (quantN - 1);
  const quantIndex = Math.round(quantIndexFloat);
  const deltaV = vRange / (quantN - 1);

  // 4. Mean & Contrast
  const pixels = [p1, p2, p3, p4];
  const meanB = pixels.reduce((a, b) => a + b, 0) / 4;
  const squaredDiffs = pixels.map(p => Math.pow(p - meanB, 2));
  const varianceSum = squaredDiffs.reduce((sum, val) => sum + val, 0);
  const varianceVal = varianceSum / 4;
  const contrastC = Math.sqrt(varianceVal);

  // 5. Perceptron
  const netZ = (w1 * x1) + (w2 * x2) + bias;
  const expTerm = Math.exp(-netZ);
  const sigmoidY = 1 / (1 + expTerm);
  const sigmoidDeriv = sigmoidY * (1 - sigmoidY);

  const calcTabs = [
    { id: 'filesize', label: 'Image File Size', sub: 'ขนาดไฟล์ภาพ & บิตเดปธ์', icon: Maximize2 },
    { id: 'nyquist', label: 'Nyquist Sampling', sub: 'การสุ่มตัวอย่าง & Aliasing', icon: Activity },
    { id: 'quant', label: 'Uniform Quantization', sub: 'การควอนไทซ์ระดับสี', icon: Binary },
    { id: 'contrast', label: 'Brightness & Contrast', sub: 'ค่าเฉลี่ยสว่าง & คอนทราสต์', icon: Sliders },
    { id: 'perceptron', label: 'Perceptron & Sigmoid', sub: 'นิวรอนเทียม & ฟังก์ชันกระตุ้น', icon: Cpu },
  ];

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Top Banner */}
      <div className="border border-slate-200 dark:border-[#27272f] bg-white dark:bg-[#121216] p-6 lg:p-8 rounded-xl shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-red-600 dark:text-red-400 font-bold uppercase tracking-widest mb-1">
              <Calculator className="w-4 h-4" />
              <span>Interactive Formula & Mathematical Lab (อิงสไลด์ AI ทุกบท)</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-heading text-slate-900 dark:text-white">
              ห้องทดลองคำนวณสูตร AI & Digital Image ละเอียดทีละขั้นตอน
            </h1>
            <p className="text-sm text-slate-600 dark:text-gray-300 mt-1 max-w-2xl leading-relaxed">
              ปรับค่าตัวแปรได้อิสระ พร้อมแสดงวิธีทำตามสูตรคณิตศาสตร์แบบ KaTeX ทีละสเต็ป แยกสิ่งที่โจทย์กำหนด การแทนค่า ผลลัพธ์ และเทคนิคทำข้อสอบ
            </p>
          </div>
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-[#17171c] border border-slate-200 dark:border-[#27272f] px-4 py-2 rounded-lg font-mono text-xs text-slate-700 dark:text-gray-300 shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span>Live KaTeX Engine Active</span>
          </div>
        </div>
      </div>

      {/* Calculator Selector Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5">
        {calcTabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeCalc === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                sound.playClick();
                setActiveCalc(tab.id);
              }}
              className={`text-left p-3.5 rounded-xl border transition-all ${
                isActive
                  ? 'bg-red-50 dark:bg-[#1e1e24] border-red-500 text-red-900 dark:text-white shadow-sm ring-2 ring-red-500/20'
                  : 'bg-white dark:bg-[#121216] border-slate-200 dark:border-[#27272f] text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon className={`w-4 h-4 ${isActive ? 'text-red-600 dark:text-red-500' : 'text-slate-400 dark:text-gray-500'}`} />
                <span className="font-mono text-xs font-bold truncate">{tab.label}</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-gray-400 line-clamp-1">{tab.sub}</p>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* CALCULATOR 1: Image File Size */}
      {/* ========================================================================= */}
      {activeCalc === 'filesize' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Column */}
          <div className="lg:col-span-5 border border-slate-200 dark:border-[#27272f] bg-white dark:bg-[#121216] p-6 rounded-xl space-y-6 shadow-sm">
            <h3 className="font-heading text-lg text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-[#27272f] pb-3">
              <Maximize2 className="w-5 h-5 text-red-500" />
              <span>พารามิเตอร์ขนาดภาพ (Image Dimensions & Depth)</span>
            </h3>

            {/* Presets */}
            <div>
              <label className="text-xs font-mono text-slate-600 dark:text-gray-400 uppercase tracking-wider block mb-2 font-bold">
                Preset ความละเอียดมาตรฐาน:
              </label>
              <div className="grid grid-cols-3 gap-1.5 text-xs font-mono">
                {[
                  { w: 640, h: 480, name: 'VGA (480p)' },
                  { w: 1280, h: 720, name: 'HD (720p)' },
                  { w: 1920, h: 1080, name: 'Full HD' },
                  { w: 1024, h: 768, name: 'XGA' },
                  { w: 2048, h: 1536, name: 'QXGA' },
                  { w: 3840, h: 2160, name: '4K UHD' }
                ].map(p => (
                  <button
                    key={p.name}
                    onClick={() => {
                      sound.playClick();
                      setImgWidth(p.w);
                      setImgHeight(p.h);
                    }}
                    className={`p-2 border rounded-md text-center transition font-semibold ${
                      imgWidth === p.w && imgHeight === p.h
                        ? 'bg-red-50 dark:bg-red-950/40 border-red-500 text-red-700 dark:text-red-300 font-bold'
                        : 'bg-slate-50 dark:bg-[#17171c] hover:bg-slate-100 dark:hover:bg-[#1f1f26] border-slate-200 dark:border-[#27272f] text-slate-700 dark:text-gray-300'
                    }`}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Width / Height */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-mono text-slate-600 dark:text-gray-400 block mb-1 font-bold">ความกว้าง W (pixels):</label>
                <input
                  type="number"
                  value={imgWidth}
                  onChange={(e) => setImgWidth(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-slate-50 dark:bg-[#0a0a0c] border border-slate-300 dark:border-[#27272f] px-3 py-2 rounded-lg font-mono text-sm text-slate-900 dark:text-white focus:outline-none focus:border-red-500"
                />
              </div>
              <div>
                <label className="text-xs font-mono text-slate-600 dark:text-gray-400 block mb-1 font-bold">ความสูง H (pixels):</label>
                <input
                  type="number"
                  value={imgHeight}
                  onChange={(e) => setImgHeight(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-slate-50 dark:bg-[#0a0a0c] border border-slate-300 dark:border-[#27272f] px-3 py-2 rounded-lg font-mono text-sm text-slate-900 dark:text-white focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            {/* Bit Depth / Color Mode */}
            <div>
              <label className="text-xs font-mono text-slate-600 dark:text-gray-400 uppercase tracking-wider block mb-2 font-bold">
                โหมดสีและความลึกบิต (Bit Depth: b):
              </label>
              <div className="space-y-2">
                {[
                  { value: '1', name: '1-bit Monochrome (ขาว-ดำ)', desc: '1 bit ต่อพิกเซล (2 สี: 0=ดำ, 1=ขาว)' },
                  { value: '8', name: '8-bit Grayscale (ระดับสีเทา)', desc: '8 bits (1 Byte) ต่อพิกเซล (256 ระดับ 0-255)' },
                  { value: '24', name: '24-bit True Color (RGB)', desc: '24 bits (3 Bytes) ต่อพิกเซล (16.7 ล้านสี: R=8, G=8, B=8)' },
                  { value: '32', name: '32-bit CMYK Color (งานพิมพ์)', desc: '32 bits (4 Bytes) ต่อพิกเซล (4.29 พันล้านสี: C,M,Y,K อย่างละ 8 bit)' },
                ].map(opt => (
                  <label
                    key={opt.value}
                    onClick={() => sound.playClick()}
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition ${
                      colorMode === opt.value
                        ? 'border-red-500 bg-red-50 dark:bg-red-500/10 text-slate-900 dark:text-white ring-1 ring-red-500'
                        : 'border-slate-200 dark:border-[#27272f] bg-slate-50 dark:bg-[#17171c] text-slate-700 dark:text-gray-300 hover:border-slate-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <input
                      type="radio"
                      name="colorMode"
                      value={opt.value}
                      checked={colorMode === opt.value}
                      onChange={() => setColorMode(opt.value)}
                      className="mt-1 accent-red-600"
                    />
                    <div>
                      <div className="text-sm font-bold">{opt.name}</div>
                      <div className="text-xs text-slate-500 dark:text-gray-400">{opt.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Results & Math Breakdown */}
          <div className="lg:col-span-7 space-y-6">
            {/* Quick Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="border border-slate-200 dark:border-[#27272f] bg-white dark:bg-[#121216] p-4 rounded-xl shadow-sm">
                <span className="text-[10px] font-mono text-slate-500 dark:text-gray-400 uppercase font-bold">พิกเซลทั้งหมด</span>
                <div className="text-lg font-mono font-bold text-slate-900 dark:text-white mt-1">
                  {totalPixels.toLocaleString()} <span className="text-xs text-slate-400">px</span>
                </div>
              </div>
              <div className="border border-slate-200 dark:border-[#27272f] bg-white dark:bg-[#121216] p-4 rounded-xl shadow-sm">
                <span className="text-[10px] font-mono text-slate-500 dark:text-gray-400 uppercase font-bold">ขนาดเป็น Bytes</span>
                <div className="text-lg font-mono font-bold text-sky-600 dark:text-cyan-400 mt-1">
                  {Math.round(totalBytes).toLocaleString()} <span className="text-xs text-slate-400">B</span>
                </div>
              </div>
              <div className="border border-slate-200 dark:border-[#27272f] bg-white dark:bg-[#121216] p-4 rounded-xl shadow-sm">
                <span className="text-[10px] font-mono text-slate-500 dark:text-gray-400 uppercase font-bold">ขนาดเป็น KB</span>
                <div className="text-lg font-mono font-bold text-amber-600 dark:text-amber-400 mt-1">
                  {totalKB.toFixed(2)} <span className="text-xs text-slate-400">KB</span>
                </div>
              </div>
              <div className="border border-red-500/40 bg-red-50 dark:bg-red-500/10 p-4 rounded-xl shadow-sm">
                <span className="text-[10px] font-mono text-red-600 dark:text-red-400 uppercase font-bold">ขนาดไฟล์ดิบ (MB)</span>
                <div className="text-2xl font-mono font-bold text-red-600 dark:text-red-500 mt-1">
                  {totalMB.toFixed(3)} <span className="text-xs text-red-500">MB</span>
                </div>
              </div>
            </div>

            {/* Step-by-Step Breakdown with KaTeX */}
            <div className="border border-slate-200 dark:border-[#27272f] bg-white dark:bg-[#121216] p-6 rounded-xl space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#27272f] pb-3">
                <h4 className="font-heading text-slate-900 dark:text-white text-base flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-red-500" />
                  <span>แสดงวิธีทำและขั้นตอนคำนวณอย่างละเอียด (Step-by-Step Solution)</span>
                </h4>
                <span className="badge-mono bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-800 px-2 py-0.5 rounded text-[10px]">
                  CH 13-2, 13-4 FORMULA
                </span>
              </div>

              {/* Given variables card */}
              <div className="p-3 bg-slate-50 dark:bg-[#17171c] rounded-lg border border-slate-200 dark:border-[#27272f] text-xs font-mono space-y-1">
                <span className="text-slate-500 dark:text-gray-400 font-bold block uppercase tracking-wider">
                  1. สิ่งที่โจทย์กำหนดให้ (Given Variables):
                </span>
                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="px-2 py-1 bg-white dark:bg-[#202028] border border-slate-200 dark:border-gray-700 rounded text-slate-800 dark:text-gray-200 flex items-center gap-1">
                    <span>ความกว้าง</span> <MathText>{`$W = ${imgWidth}\\text{ px}$`}</MathText>
                  </span>
                  <span className="px-2 py-1 bg-white dark:bg-[#202028] border border-slate-200 dark:border-gray-700 rounded text-slate-800 dark:text-gray-200 flex items-center gap-1">
                    <span>ความสูง</span> <MathText>{`$H = ${imgHeight}\\text{ px}$`}</MathText>
                  </span>
                  <span className="px-2 py-1 bg-white dark:bg-[#202028] border border-slate-200 dark:border-gray-700 rounded text-slate-800 dark:text-gray-200 flex items-center gap-1">
                    <span>ความลึกบิต</span> <MathText>{`$b = ${bitDepth}\\text{ bits/pixel}$`}</MathText> <span>({bytesPerPixel} Byte/px)</span>
                  </span>
                </div>
              </div>

              {/* Steps */}
              <div className="space-y-3 font-mono text-xs">
                {/* Step 1 */}
                <div className="bg-slate-50 dark:bg-[#17171c] p-3.5 rounded-lg border border-slate-200 dark:border-[#27272f] space-y-1">
                  <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-gray-200">
                    <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-gray-700 flex items-center justify-center text-[10px]">1</span>
                    <span>คำนวณจำนวนพิกเซลทั้งหมด (Total Pixels)</span>
                  </div>
                  <MathText>{"$$\\text{Total Pixels} = W \\times H = " + imgWidth + " \\times " + imgHeight + " = " + totalPixels.toLocaleString() + "\\text{ pixels}$$"}</MathText>
                  <p className="text-[11px] font-sans text-slate-600 dark:text-gray-400">
                    <strong>คำอธิบาย:</strong> คือจำนวนจุดภาพทั้งหมดบนระนาบสองมิติของเซนเซอร์รับภาพ
                  </p>
                </div>

                {/* Step 2 */}
                <div className="bg-slate-50 dark:bg-[#17171c] p-3.5 rounded-lg border border-slate-200 dark:border-[#27272f] space-y-1">
                  <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-gray-200">
                    <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-gray-700 flex items-center justify-center text-[10px]">2</span>
                    <span>คำนวณขนาดไฟล์ในหน่วยบิต (Size in Bits)</span>
                  </div>
                  <MathText>{"$$\\text{Size}_{\\text{bits}} = \\text{Total Pixels} \\times b = " + totalPixels.toLocaleString() + " \\times " + bitDepth + " = " + totalBits.toLocaleString() + "\\text{ bits}$$"}</MathText>
                  <p className="text-[11px] font-sans text-slate-600 dark:text-gray-400">
                    <strong>คำอธิบาย:</strong> แต่ละพิกเซลใช้หน่วยความจำ $b$ บิตในการจัดเก็บข้อมูลสีหรือระดับสีเทา
                  </p>
                </div>

                {/* Step 3 */}
                <div className="bg-slate-50 dark:bg-[#17171c] p-3.5 rounded-lg border border-slate-200 dark:border-[#27272f] space-y-1">
                  <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-gray-200">
                    <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-gray-700 flex items-center justify-center text-[10px]">3</span>
                    <span>แปลงเป็นหน่วยไบต์ (Size in Bytes โดยนำไปหารด้วย 8)</span>
                  </div>
                  <MathText>{"$$\\text{Size}_{\\text{Bytes}} = \\frac{\\text{Size}_{\\text{bits}}}{8} = \\frac{" + totalBits.toLocaleString() + "}{8} = " + Math.round(totalBytes).toLocaleString() + "\\text{ Bytes}$$"}</MathText>
                  <p className="text-[11px] font-sans text-slate-600 dark:text-gray-400">
                    <strong>คำอธิบาย:</strong> มาตรฐานคอมพิวเตอร์ 1 ไบต์ (Byte) เท่ากับ 8 บิต (bits)
                  </p>
                </div>

                {/* Step 4 */}
                <div className="bg-slate-50 dark:bg-[#17171c] p-3.5 rounded-lg border border-slate-200 dark:border-[#27272f] space-y-1">
                  <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-gray-200">
                    <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-gray-700 flex items-center justify-center text-[10px]">4</span>
                    <span>แปลงเป็นกิโลไบต์ (KB) และเมกะไบต์ (MB)</span>
                  </div>
                  <MathText>{"$$\\text{Size}_{\\text{KB}} = \\frac{" + Math.round(totalBytes).toLocaleString() + "}{1024} = " + totalKB.toFixed(2) + "\\text{ KB}$$"}</MathText>
                  <MathText>{"$$\\text{Size}_{\\text{MB}} = \\frac{" + totalKB.toFixed(2) + "}{1024} = \\frac{" + Math.round(totalBytes).toLocaleString() + "}{1,048,576} = " + totalMB.toFixed(4) + "\\text{ MB}$$"}</MathText>
                  <div className="p-2.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded text-amber-900 dark:text-amber-300 font-sans text-xs">
                    💡 <strong>จุดระวังในข้อสอบ:</strong> ในระบบคอมพิวเตอร์ดิจิทัล ใช้ฐาน 2 ดังนั้น 1 KB = 1,024 Bytes และ 1 MB = 1,024 &times; 1,024 = 1,048,576 Bytes (ห้ามหารด้วย 1,000 เด็ดขาด)
                  </div>
                </div>
              </div>

              {/* Final Conclusion Box */}
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-lg text-emerald-900 dark:text-emerald-300 font-sans text-xs flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong>สรุปคำตอบ:</strong> ภาพขนาด {imgWidth} &times; {imgHeight} พิกเซล ที่ความลึก {bitDepth}-bit มีขนาดไฟล์แบบไม่บีบอัดเท่ากับ <strong>{Math.round(totalBytes).toLocaleString()} Bytes</strong> หรือประมาณ <strong>{totalMB.toFixed(3)} MB</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CALCULATOR 2: Nyquist Sampling */}
      {/* ========================================================================= */}
      {activeCalc === 'nyquist' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 border border-slate-200 dark:border-[#27272f] bg-white dark:bg-[#121216] p-6 rounded-xl space-y-6 shadow-sm">
            <h3 className="font-heading text-lg text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-[#27272f] pb-3">
              <Activity className="w-5 h-5 text-red-500" />
              <span>พารามิเตอร์สัญญาณ & การสุ่มตัวอย่าง (Sampling)</span>
            </h3>

            {/* Presets */}
            <div>
              <label className="text-xs font-mono text-slate-600 dark:text-gray-400 uppercase tracking-wider block mb-2 font-bold">
                ตัวอย่างโจทย์จำลองในข้อสอบ:
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <button
                  onClick={() => {
                    sound.playClick();
                    setSignalFreq(25);
                    setSamplingFreq(60);
                  }}
                  className="p-2 rounded border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 text-left"
                >
                  <div className="font-bold">✓ สุ่มพอดี/เกินเกณฑ์</div>
                  <div className="text-[10px] text-emerald-600">fc=25kHz, fs=60kHz</div>
                </button>
                <button
                  onClick={() => {
                    sound.playClick();
                    setSignalFreq(30);
                    setSamplingFreq(45);
                  }}
                  className="p-2 rounded border border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-300 text-left"
                >
                  <div className="font-bold">⚠️ เกิด Aliasing ชัดเจน</div>
                  <div className="text-[10px] text-red-600">fc=30kHz, fs=45kHz</div>
                </button>
              </div>
            </div>

            {/* Signal Frequency */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-mono text-slate-700 dark:text-gray-300 font-bold">
                  ความถี่สูงสุดของสัญญาณ f_c (kHz):
                </label>
                <span className="font-mono text-sm text-sky-700 dark:text-cyan-400 font-bold">{signalFreq} kHz</span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                value={signalFreq}
                onChange={(e) => setSignalFreq(parseInt(e.target.value))}
                className="w-full accent-sky-600 cursor-pointer"
              />
              <span className="text-[11px] text-slate-500 dark:text-gray-400 block mt-1">
                ความถี่สูงสุดของสัญญาณภาพหรือคลื่นที่ต้องการบันทึก (Highest Signal Frequency)
              </span>
            </div>

            {/* Sampling Rate */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-mono text-slate-700 dark:text-gray-300 font-bold">
                  ความถี่ในการสุ่มตัวอย่าง f_s (kHz):
                </label>
                <span className="font-mono text-sm text-amber-700 dark:text-amber-400 font-bold">{samplingFreq} kHz</span>
              </div>
              <input
                type="range"
                min="1"
                max="200"
                value={samplingFreq}
                onChange={(e) => setSamplingFreq(parseInt(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
              <span className="text-[11px] text-slate-500 dark:text-gray-400 block mt-1">
                อัตราการชักตัวอย่างของเซนเซอร์กล้องหรือเครื่องสแกน (Sampling Frequency)
              </span>
            </div>

            {/* Quick adjust buttons */}
            <div className="flex gap-2 font-mono text-xs">
              <button
                onClick={() => setSamplingFreq(signalFreq * 2)}
                className="flex-1 py-2 px-2 bg-slate-100 dark:bg-[#17171c] hover:bg-slate-200 dark:hover:bg-[#202028] border border-slate-300 dark:border-[#27272f] rounded-lg text-slate-700 dark:text-gray-300 text-center font-semibold"
              >
                ตั้งค่าพอดี Nyquist (2f_c)
              </button>
              <button
                onClick={() => setSamplingFreq(Math.max(1, Math.round(signalFreq * 1.4)))}
                className="flex-1 py-2 px-2 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 border border-red-300 dark:border-red-500/30 rounded-lg text-red-700 dark:text-red-400 text-center font-semibold"
              >
                Undersampling (&lt; 2f_c)
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            {/* Status Alert Banner */}
            <div className={`p-5 rounded-xl border flex items-start gap-4 shadow-sm ${
              isDanger 
                ? 'bg-red-50 dark:bg-red-500/10 border-red-400 dark:border-red-500 text-red-950 dark:text-red-200' 
                : 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-400 dark:border-emerald-500 text-emerald-950 dark:text-emerald-200'
            }`}>
              {isDanger ? (
                <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-500 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              )}
              <div>
                <h4 className="font-heading text-lg font-bold">
                  {isDanger ? '⚠️ เกิดความผิดเพี้ยน Aliasing (Undersampling Failure)' : '✓ ผ่านเกณฑ์ Nyquist-Shannon Sampling Theorem'}
                </h4>
                <p className="text-xs mt-1 text-slate-700 dark:text-gray-300 leading-relaxed font-sans">
                  {isDanger 
                    ? `ความถี่สุ่มตัวอย่าง fs = ${samplingFreq} kHz ต่ำกว่าอัตรา Nyquist (${nyquistRate} kHz) สัญญาณความถี่สูงจะพับทับกลายเป็นความถี่ผิดเพี้ยนที่ ${apparentFreq} kHz ปรากฏเป็นริ้วลาย Moiré Pattern หรือรอยหยักบันไดบนภาพ!`
                    : `ความถี่สุ่มตัวอย่าง fs = ${samplingFreq} kHz มากกว่าหรือเท่ากับ 2 เท่าของ fc (${nyquistRate} kHz) ข้อมูลภาพสมบูรณ์และสามารถกู้คืนสัญญาณดั้งเดิมได้โดยไม่สูญเสียคุณภาพ`
                  }
                </p>
              </div>
            </div>

            {/* Calculations Breakdown */}
            <div className="border border-slate-200 dark:border-[#27272f] bg-white dark:bg-[#121216] p-6 rounded-xl space-y-4 font-mono text-xs shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#27272f] pb-3">
                <h4 className="font-heading text-slate-900 dark:text-white text-base font-sans flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-red-500" />
                  <span>ขั้นตอนการคำนวณและวิเคราะห์ตามทฤษฎี (จากสไลด์บทที่ 13-4 หน้า 4-5)</span>
                </h4>
                <span className="badge-mono bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 px-2 py-0.5 rounded border border-sky-300 text-[10px]">
                  NYQUIST-SHANNON
                </span>
              </div>

              {/* Given Info */}
              <div className="p-3 bg-slate-50 dark:bg-[#17171c] rounded-lg border border-slate-200 dark:border-[#27272f] text-xs font-mono space-y-1">
                <span className="text-slate-500 dark:text-gray-400 font-bold block uppercase tracking-wider">
                  1. ตัวแปรที่โจทย์กำหนด (Given):
                </span>
                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="px-2 py-1 bg-white dark:bg-[#202028] border border-slate-200 dark:border-gray-700 rounded text-slate-800 dark:text-gray-200 flex items-center gap-1">
                    <span>ความถี่สูงสุดของสัญญาณ</span> <MathText>{`$f_c = ${signalFreq}\\text{ kHz}$`}</MathText>
                  </span>
                  <span className="px-2 py-1 bg-white dark:bg-[#202028] border border-slate-200 dark:border-gray-700 rounded text-slate-800 dark:text-gray-200 flex items-center gap-1">
                    <span>ความถี่สุ่มตัวอย่าง</span> <MathText>{`$f_s = ${samplingFreq}\\text{ kHz}$`}</MathText>
                  </span>
                </div>
              </div>

              {/* Step 1: Nyquist Rate */}
              <div className="bg-slate-50 dark:bg-[#17171c] p-3.5 rounded-lg border border-slate-200 dark:border-[#27272f] space-y-1">
                <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-gray-200">
                  <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-gray-700 flex items-center justify-center text-[10px]">1</span>
                  <span>คำนวณอัตราสุ่มตัวอย่างขั้นต่ำตามทฤษฎีไนควิสต์ (Nyquist Rate)</span>
                </div>
                <MathText>{"$$f_{\\text{Nyquist}} = 2 \\times f_c = 2 \\times " + signalFreq + "\\text{ kHz} = " + nyquistRate + "\\text{ kHz}$$"}</MathText>
                <p className="text-[11px] font-sans text-slate-600 dark:text-gray-400">
                  <strong>คำอธิบาย:</strong> สัญญาณคลื่นไซน์ 1 คาบต้องการการวัดอย่างน้อย 2 จุด (จุดยอดคลื่นและจุดท้องคลื่น) เพื่อระบุความถี่ได้อย่างถูกต้อง
                </p>
              </div>

              {/* Step 2: Sampling Condition Check */}
              <div className="bg-slate-50 dark:bg-[#17171c] p-3.5 rounded-lg border border-slate-200 dark:border-[#27272f] space-y-1">
                <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-gray-200">
                  <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-gray-700 flex items-center justify-center text-[10px]">2</span>
                  <span>ตรวจสอบเงื่อนไขความถี่การสุ่มตัวอย่าง (f_s ≥ 2f_c)</span>
                </div>
                <MathText>{"$$f_s (" + samplingFreq + "\\text{ kHz}) " + (samplingFreq >= nyquistRate ? "\\ge" : "<") + " 2f_c (" + nyquistRate + "\\text{ kHz})$$"}</MathText>
                <div className={`p-2.5 rounded text-xs font-sans ${isDanger ? 'bg-red-100 text-red-900 border border-red-300' : 'bg-emerald-100 text-emerald-900 border border-emerald-300'}`}>
                  {isDanger ? (
                    <>⚠️ <strong>ผลการตรวจสอบ:</strong> เกิด <strong>Undersampling</strong> สัญญาณจะสะท้อนกลับ (Folded Frequency) ทำให้เกิด <strong>Aliasing</strong></>
                  ) : (
                    <>✓ <strong>ผลการตรวจสอบ:</strong> อัตราสุ่มตัวอย่างเพียงพอ สามารถกู้คืนรูปคลื่นเดิมได้อย่างสมบูรณ์ (Perfect Reconstruction)</>
                  )}
                </div>
              </div>

              {/* Step 3: Aliasing Calculation or Period */}
              <div className="bg-slate-50 dark:bg-[#17171c] p-3.5 rounded-lg border border-slate-200 dark:border-[#27272f] space-y-1">
                <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-gray-200">
                  <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-gray-700 flex items-center justify-center text-[10px]">3</span>
                  <span>{isDanger ? 'คำนวณความถี่ผิดเพี้ยนหลอกตา (Apparent Aliasing Frequency)' : 'คำนวณคาบเวลาการสุ่มตัวอย่าง (Sampling Period: Ts)'}</span>
                </div>
                {isDanger ? (
                  <>
                    <MathText>{"$$f_{\\text{apparent}} = |f_s - f_c| = |" + samplingFreq + " - " + signalFreq + "| = " + apparentFreq + "\\text{ kHz}$$"}</MathText>
                    <p className="text-[11px] font-sans text-slate-600 dark:text-gray-400">
                      <strong>คำอธิบาย:</strong> สัญญาณความถี่จริง {signalFreq} kHz จะถูกมองเห็นผิดเป็นคลื่นความถี่ต่ำ {apparentFreq} kHz ในภาพดิจิทัล
                    </p>
                  </>
                ) : (
                  <>
                    <MathText>{"$$T_s = \\frac{1}{f_s} = \\frac{1}{" + samplingFreq + "\\text{ kHz}} = " + samplingPeriodUs.toFixed(3) + "\\ \\mu\\text{s}$$"}</MathText>
                    <p className="text-[11px] font-sans text-slate-600 dark:text-gray-400">
                      <strong>คำอธิบาย:</strong> เซนเซอร์รับภาพจะทำการสุ่มตัวอย่างทุกๆ {samplingPeriodUs.toFixed(3)} ไมโครวินาที
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CALCULATOR 3: Uniform Quantization */}
      {/* ========================================================================= */}
      {activeCalc === 'quant' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 border border-slate-200 dark:border-[#27272f] bg-white dark:bg-[#121216] p-6 rounded-xl space-y-5 shadow-sm">
            <h3 className="font-heading text-lg text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-[#27272f] pb-3">
              <Binary className="w-5 h-5 text-red-500" />
              <span>พารามิเตอร์การควอนไทซ์ (สไลด์ 13-4 หน้า 6)</span>
            </h3>

            {/* Presets */}
            <div>
              <label className="text-xs font-mono text-slate-600 dark:text-gray-400 uppercase tracking-wider block mb-2 font-bold">
                ตัวอย่างโจทย์ในข้อสอบ:
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <button
                  onClick={() => {
                    sound.playClick();
                    setVMin(0);
                    setVMax(5);
                    setVIn(3.2);
                    setQuantBits(3);
                  }}
                  className="p-2 rounded border border-purple-300 dark:border-purple-700 bg-purple-50 dark:bg-purple-950/30 text-purple-800 dark:text-purple-300 text-left"
                >
                  <div className="font-bold">ตัวอย่างในสไลด์ 13-4</div>
                  <div className="text-[10px] text-purple-600">V=3.2V, 0-5V, 3-bit</div>
                </button>
                <button
                  onClick={() => {
                    sound.playClick();
                    setVMin(0);
                    setVMax(10);
                    setVIn(7.8);
                    setQuantBits(4);
                  }}
                  className="p-2 rounded border border-slate-300 dark:border-gray-700 bg-slate-50 dark:bg-[#17171c] text-slate-800 dark:text-gray-300 text-left"
                >
                  <div className="font-bold">โจทย์ประยุกต์ 4-bit</div>
                  <div className="text-[10px] text-slate-500">V=7.8V, 0-10V, 4-bit</div>
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-mono text-slate-700 dark:text-gray-300 block mb-1 font-bold">แรงดันสัญญาณเข้า Vn (Volt):</label>
              <input
                type="number"
                step="0.1"
                value={vIn}
                onChange={(e) => setVIn(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-50 dark:bg-[#0a0a0c] border border-slate-300 dark:border-[#27272f] px-3 py-2 rounded-lg font-mono text-sm text-slate-900 dark:text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-mono text-slate-700 dark:text-gray-300 block mb-1 font-bold">V_min (Volt):</label>
                <input
                  type="number"
                  step="0.5"
                  value={vMin}
                  onChange={(e) => setVMin(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-50 dark:bg-[#0a0a0c] border border-slate-300 dark:border-[#27272f] px-3 py-2 rounded-lg font-mono text-sm text-slate-900 dark:text-white focus:outline-none focus:border-red-500"
                />
              </div>
              <div>
                <label className="text-xs font-mono text-slate-700 dark:text-gray-300 block mb-1 font-bold">V_max (Volt):</label>
                <input
                  type="number"
                  step="0.5"
                  value={vMax}
                  onChange={(e) => setVMax(parseFloat(e.target.value) || 1)}
                  className="w-full bg-slate-50 dark:bg-[#0a0a0c] border border-slate-300 dark:border-[#27272f] px-3 py-2 rounded-lg font-mono text-sm text-slate-900 dark:text-white focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-mono text-slate-700 dark:text-gray-300 block mb-2 font-bold">
                ความลึกของบิต (Bit Depth: b):
              </label>
              <div className="grid grid-cols-4 gap-2 font-mono text-xs">
                {[1, 2, 3, 4].map(b => (
                  <button
                    key={b}
                    onClick={() => {
                      sound.playClick();
                      setQuantBits(b);
                    }}
                    className={`py-2 rounded-lg border text-center transition font-semibold ${
                      quantBits === b 
                        ? 'border-red-500 bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-white font-bold ring-1 ring-red-500' 
                        : 'border-slate-200 dark:border-[#27272f] bg-slate-50 dark:bg-[#17171c] text-slate-600 dark:text-gray-400'
                    }`}
                  >
                    {b} bit ({Math.pow(2, b)} ระดับ)
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            {/* Big Result Card */}
            <div className="border border-red-500/40 bg-gradient-to-br from-red-50 to-white dark:from-[#17171c] dark:to-[#121216] p-6 rounded-xl shadow-sm">
              <span className="text-xs font-mono text-red-600 dark:text-red-400 uppercase tracking-widest block mb-1 font-bold">
                ดัชนีระดับขั้นที่แปลงได้ (Quantized Index: rn)
              </span>
              <div className="flex items-baseline gap-4 mt-2">
                <span className="text-5xl font-mono font-black text-red-600 dark:text-white">{quantIndex}</span>
                <span className="text-sm font-mono text-slate-600 dark:text-gray-400">
                  (จากช่วง 0 ถึง {quantN - 1} | รหัสไบนารี: <strong>{quantIndex.toString(2).padStart(quantBits, '0')}₂</strong>)
                </span>
              </div>
            </div>

            {/* Formula Step-by-Step with KaTeX */}
            <div className="border border-slate-200 dark:border-[#27272f] bg-white dark:bg-[#121216] p-6 rounded-xl space-y-4 font-mono text-xs shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#27272f] pb-3">
                <h4 className="font-heading text-slate-900 dark:text-white text-base font-sans flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-red-500" />
                  <span>ขั้นตอนการคำนวณตามสูตรสไลด์ 13-4 หน้า 6</span>
                </h4>
                <span className="badge-mono bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 px-2 py-0.5 rounded border border-purple-300 text-[10px]">
                  UNIFORM QUANTIZATION
                </span>
              </div>

              {/* Formula Banner */}
              <div className="bg-slate-50 dark:bg-[#17171c] p-3 rounded-lg border border-slate-200 dark:border-[#27272f]">
                <MathText>{"$$r_n = \\text{round}\\left( \\frac{V_n - V_{\\min}}{V_{\\max} - V_{\\min}} \\times (N - 1) \\right)$$"}</MathText>
              </div>

              {/* Steps */}
              <div className="space-y-3">
                <div className="bg-slate-50 dark:bg-[#17171c] p-3 rounded-lg border border-slate-200 dark:border-[#27272f] space-y-1">
                  <div className="font-bold text-slate-800 dark:text-gray-200">ขั้นที่ 1: คำนวณจำนวนระดับควอนไทซ์ทั้งหมด (N)</div>
                  <MathText>{"$$N = 2^b = 2^{" + quantBits + "} = " + quantN + "\\text{ ระดับ (รหัสดัชนีช่วง 0 ถึง " + (quantN - 1) + ")}$$"}</MathText>
                </div>

                <div className="bg-slate-50 dark:bg-[#17171c] p-3 rounded-lg border border-slate-200 dark:border-[#27272f] space-y-1">
                  <div className="font-bold text-slate-800 dark:text-gray-200">ขั้นที่ 2: คำนวณอัตราส่วนตำแหน่งของสัญญาณ (Normalized Ratio)</div>
                  <MathText>{"$$\\text{Ratio} = \\frac{V_n - V_{\\min}}{V_{\\max} - V_{\\min}} = \\frac{" + clampedVIn + " - " + vMin + "}{" + vMax + " - " + vMin + "} = \\frac{" + (clampedVIn - vMin).toFixed(2) + "}{" + vRange.toFixed(2) + "} = " + quantRatio.toFixed(4) + "$$"}</MathText>
                </div>

                <div className="bg-slate-50 dark:bg-[#17171c] p-3 rounded-lg border border-slate-200 dark:border-[#27272f] space-y-1">
                  <div className="font-bold text-slate-800 dark:text-gray-200">ขั้นที่ 3: สเกลค่าเข้าสู่ช่วงดัชนีระดับขั้นเต็ม (N - 1)</div>
                  <MathText>{"$$\\text{Scaled} = \\text{Ratio} \\times (N - 1) = " + quantRatio.toFixed(4) + " \\times (" + quantN + " - 1) = " + quantRatio.toFixed(4) + " \\times " + (quantN - 1) + " = " + quantIndexFloat.toFixed(3) + "$$"}</MathText>
                </div>

                <div className="bg-slate-50 dark:bg-[#17171c] p-3 rounded-lg border border-slate-200 dark:border-[#27272f] space-y-1">
                  <div className="font-bold text-slate-800 dark:text-gray-200">ขั้นที่ 4: ปัดเศษเป็นจำนวนเต็มตามกฎ Uniform Quantization</div>
                  <MathText>{"$$r_n = \\text{round}(" + quantIndexFloat.toFixed(3) + ") = " + quantIndex + "$$"}</MathText>
                  <p className="text-[11px] font-sans text-slate-600 dark:text-gray-400">
                    แปลงเป็นเลขฐานสองความยาว {quantBits} บิต: <strong>{quantIndex.toString(2).padStart(quantBits, '0')}₂</strong>
                  </p>
                </div>
              </div>

              {/* Exam Tip */}
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-lg text-amber-900 dark:text-amber-300 font-sans text-xs">
                💡 <strong>ข้อสังเกตสำคัญในสไลด์อาจารย์:</strong> ต้องคูณด้วย (N - 1) ไม่ใช่ N เพราะระดับสีดิจิทัลเริ่มนับจาก 0 ถึง N - 1 (ตัวอย่างภาพ 3 บิต มีระดับ 0 ถึง 7 รวม 8 ระดับ)
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CALCULATOR 4: Mean Brightness & Contrast */}
      {/* ========================================================================= */}
      {activeCalc === 'contrast' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 border border-slate-200 dark:border-[#27272f] bg-white dark:bg-[#121216] p-6 rounded-xl space-y-5 shadow-sm">
            <h3 className="font-heading text-lg text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-[#27272f] pb-3">
              <Sliders className="w-5 h-5 text-red-500" />
              <span>ภาพจำลองขนาด 2x2 พิกเซล (Grayscale 0-255)</span>
            </h3>

            {/* Presets */}
            <div>
              <label className="text-xs font-mono text-slate-600 dark:text-gray-400 uppercase tracking-wider block mb-2 font-bold">
                ตัวอย่างเมทริกซ์ภาพจำลอง:
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                <button
                  onClick={() => {
                    sound.playClick();
                    setP1(20); setP2(60); setP3(140); setP4(220);
                  }}
                  className="p-2 rounded border border-slate-300 dark:border-gray-700 bg-slate-50 dark:bg-[#17171c] text-slate-800 dark:text-gray-300 text-center font-bold"
                >
                  สไลด์ 13-4 หน้า 7
                </button>
                <button
                  onClick={() => {
                    sound.playClick();
                    setP1(0); setP2(0); setP3(255); setP4(255);
                  }}
                  className="p-2 rounded border border-slate-300 dark:border-gray-700 bg-slate-50 dark:bg-[#17171c] text-slate-800 dark:text-gray-300 text-center font-bold"
                >
                  High Contrast
                </button>
                <button
                  onClick={() => {
                    sound.playClick();
                    setP1(120); setP2(122); setP3(125); setP4(128);
                  }}
                  className="p-2 rounded border border-slate-300 dark:border-gray-700 bg-slate-50 dark:bg-[#17171c] text-slate-800 dark:text-gray-300 text-center font-bold"
                >
                  Low Contrast
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'พิกเซล (0,0)', val: p1, set: setP1 },
                { label: 'พิกเซล (0,1)', val: p2, set: setP2 },
                { label: 'พิกเซล (1,0)', val: p3, set: setP3 },
                { label: 'พิกเซล (1,1)', val: p4, set: setP4 },
              ].map((p, i) => (
                <div key={i} className="border border-slate-200 dark:border-[#27272f] bg-slate-50 dark:bg-[#17171c] p-3.5 rounded-xl space-y-2">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-slate-600 dark:text-gray-400 font-bold">{p.label}</span>
                    <span className="text-slate-900 dark:text-white font-black">{p.val}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="255"
                    value={p.val}
                    onChange={(e) => p.set(parseInt(e.target.value))}
                    className="w-full accent-red-600 cursor-pointer"
                  />
                  <div
                    className="h-10 rounded-lg border border-slate-300 dark:border-gray-700 shadow-inner flex items-center justify-center font-mono text-xs font-bold"
                    style={{ 
                      backgroundColor: `rgb(${p.val}, ${p.val}, ${p.val})`,
                      color: p.val > 128 ? '#000' : '#fff'
                    }}
                  >
                    RGB({p.val}, {p.val}, {p.val})
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-slate-200 dark:border-[#27272f] bg-white dark:bg-[#121216] p-5 rounded-xl shadow-sm">
                <span className="text-xs font-mono text-slate-500 dark:text-gray-400 uppercase font-bold">ค่าเฉลี่ยความสว่าง (B)</span>
                <div className="text-3xl font-mono font-bold text-slate-900 dark:text-white mt-1">
                  {meanB.toFixed(1)} <span className="text-xs text-slate-400">/ 255</span>
                </div>
              </div>
              <div className="border border-red-500/40 bg-red-50 dark:bg-red-500/10 p-5 rounded-xl shadow-sm">
                <span className="text-xs font-mono text-red-600 dark:text-red-400 uppercase font-bold">คอนทราสต์ (Contrast: C)</span>
                <div className="text-3xl font-mono font-bold text-red-600 dark:text-red-500 mt-1">
                  {contrastC.toFixed(2)}
                </div>
              </div>
            </div>

            {/* Calculations Breakdown */}
            <div className="border border-slate-200 dark:border-[#27272f] bg-white dark:bg-[#121216] p-6 rounded-xl space-y-4 font-mono text-xs shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#27272f] pb-3">
                <h4 className="font-heading text-slate-900 dark:text-white text-base font-sans flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-red-500" />
                  <span>ขั้นตอนการคำนวณตามสูตร (สไลด์ 13-4 หน้า 7)</span>
                </h4>
                <span className="badge-mono bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 px-2 py-0.5 rounded border border-teal-300 text-[10px]">
                  CH 13-4 MATRIX
                </span>
              </div>

              {/* Step 1: Mean Brightness */}
              <div className="bg-slate-50 dark:bg-[#17171c] p-3.5 rounded-lg border border-slate-200 dark:border-[#27272f] space-y-1">
                <div className="font-bold text-slate-800 dark:text-gray-200">ขั้นที่ 1: คำนวณค่าเฉลี่ยความสว่าง (Mean Brightness: B)</div>
                <MathText>{"$$B = \\frac{1}{M \\times N} \\sum_{x=0}^{M-1} \\sum_{y=0}^{N-1} f(x, y)$$"}</MathText>
                <MathText>{"$$B = \\frac{" + p1 + " + " + p2 + " + " + p3 + " + " + p4 + "}{4} = \\frac{" + (p1 + p2 + p3 + p4) + "}{4} = " + meanB.toFixed(2) + "$$"}</MathText>
              </div>

              {/* Step 2: Squared Differences */}
              <div className="bg-slate-50 dark:bg-[#17171c] p-3.5 rounded-lg border border-slate-200 dark:border-[#27272f] space-y-1">
                <div className="font-bold text-slate-800 dark:text-gray-200">ขั้นที่ 2: คำนวณผลต่างกำลังสองของแต่ละพิกเซลกับค่าเฉลี่ย (f(x, y) - B)²</div>
                <div className="text-[11px] space-y-0.5 text-slate-700 dark:text-gray-300">
                  <p>• ({p1} - {meanB.toFixed(1)})² = {squaredDiffs[0].toFixed(1)}</p>
                  <p>• ({p2} - {meanB.toFixed(1)})² = {squaredDiffs[1].toFixed(1)}</p>
                  <p>• ({p3} - {meanB.toFixed(1)})² = {squaredDiffs[2].toFixed(1)}</p>
                  <p>• ({p4} - {meanB.toFixed(1)})² = {squaredDiffs[3].toFixed(1)}</p>
                </div>
                <MathText>{"$$\\sum (f(x, y) - B)^2 = " + varianceSum.toFixed(2) + "$$"}</MathText>
              </div>

              {/* Step 3: Contrast */}
              <div className="bg-slate-50 dark:bg-[#17171c] p-3.5 rounded-lg border border-slate-200 dark:border-[#27272f] space-y-1">
                <div className="font-bold text-slate-800 dark:text-gray-200">ขั้นที่ 3: คำนวณคอนทราสต์ (Contrast: C) จาก Standard Deviation</div>
                <MathText>{"$$C = \\sqrt{ \\frac{1}{M \\times N} \\sum (f(x, y) - B)^2 } = \\sqrt{ \\frac{" + varianceSum.toFixed(2) + "}{4} } = \\sqrt{" + varianceVal.toFixed(2) + "} = " + contrastC.toFixed(3) + "$$"}</MathText>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CALCULATOR 5: Perceptron & Sigmoid */}
      {/* ========================================================================= */}
      {activeCalc === 'perceptron' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 border border-slate-200 dark:border-[#27272f] bg-white dark:bg-[#121216] p-6 rounded-xl space-y-4 shadow-sm">
            <h3 className="font-heading text-lg text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-[#27272f] pb-3">
              <Cpu className="w-5 h-5 text-red-500" />
              <span>พารามิเตอร์นิวรอน (Inputs, Weights, Bias)</span>
            </h3>

            {/* Presets */}
            <div>
              <label className="text-xs font-mono text-slate-600 dark:text-gray-400 uppercase tracking-wider block mb-2 font-bold">
                ตัวอย่างโจทย์ในข้อสอบ:
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <button
                  onClick={() => {
                    sound.playClick();
                    setX1(0.5); setX2(0.8);
                    setW1(0.4); setW2(-0.5);
                    setBias(0.1);
                  }}
                  className="p-2 rounded border border-purple-300 dark:border-purple-700 bg-purple-50 dark:bg-purple-950/30 text-purple-800 dark:text-purple-300 text-left font-bold"
                >
                  ตัวอย่างสไลด์ 14 (Net=-0.1)
                </button>
                <button
                  onClick={() => {
                    sound.playClick();
                    setX1(1.0); setX2(1.0);
                    setW1(0.8); setW2(0.6);
                    setBias(-0.5);
                  }}
                  className="p-2 rounded border border-slate-300 dark:border-gray-700 bg-slate-50 dark:bg-[#17171c] text-slate-800 dark:text-gray-300 text-left font-bold"
                >
                  Positive Activation
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-mono text-slate-700 dark:text-gray-300 block mb-1 font-bold">Input x1:</label>
                <input
                  type="number"
                  step="0.1"
                  value={x1}
                  onChange={(e) => setX1(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-50 dark:bg-[#0a0a0c] border border-slate-300 dark:border-[#27272f] px-3 py-1.5 rounded-lg font-mono text-sm text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="text-xs font-mono text-slate-700 dark:text-gray-300 block mb-1 font-bold">Weight w1:</label>
                <input
                  type="number"
                  step="0.1"
                  value={w1}
                  onChange={(e) => setW1(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-50 dark:bg-[#0a0a0c] border border-slate-300 dark:border-[#27272f] px-3 py-1.5 rounded-lg font-mono text-sm text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-mono text-slate-700 dark:text-gray-300 block mb-1 font-bold">Input x2:</label>
                <input
                  type="number"
                  step="0.1"
                  value={x2}
                  onChange={(e) => setX2(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-50 dark:bg-[#0a0a0c] border border-slate-300 dark:border-[#27272f] px-3 py-1.5 rounded-lg font-mono text-sm text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="text-xs font-mono text-slate-700 dark:text-gray-300 block mb-1 font-bold">Weight w2:</label>
                <input
                  type="number"
                  step="0.1"
                  value={w2}
                  onChange={(e) => setW2(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-50 dark:bg-[#0a0a0c] border border-slate-300 dark:border-[#27272f] px-3 py-1.5 rounded-lg font-mono text-sm text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-mono text-slate-700 dark:text-gray-300 block mb-1 font-bold">Bias b:</label>
              <input
                type="number"
                step="0.1"
                value={bias}
                onChange={(e) => setBias(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-50 dark:bg-[#0a0a0c] border border-slate-300 dark:border-[#27272f] px-3 py-1.5 rounded-lg font-mono text-sm text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-slate-200 dark:border-[#27272f] bg-white dark:bg-[#121216] p-5 rounded-xl shadow-sm">
                <span className="text-xs font-mono text-slate-500 dark:text-gray-400 uppercase font-bold">ผลรวมสุทธิ Net Input (z)</span>
                <div className="text-3xl font-mono font-bold text-sky-600 dark:text-cyan-400 mt-1">
                  {netZ.toFixed(3)}
                </div>
              </div>
              <div className="border border-red-500/40 bg-red-50 dark:bg-red-500/10 p-5 rounded-xl shadow-sm">
                <span className="text-xs font-mono text-red-600 dark:text-red-400 uppercase font-bold">Sigmoid Output (y)</span>
                <div className="text-3xl font-mono font-bold text-red-600 dark:text-red-500 mt-1">
                  {sigmoidY.toFixed(4)}
                </div>
              </div>
            </div>

            <div className="border border-slate-200 dark:border-[#27272f] bg-white dark:bg-[#121216] p-6 rounded-xl space-y-4 font-mono text-xs shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#27272f] pb-3">
                <h4 className="font-heading text-slate-900 dark:text-white text-base font-sans flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-red-500" />
                  <span>ขั้นตอนการคำนวณ (สไลด์บทที่ 14 หน้า 11-14)</span>
                </h4>
                <span className="badge-mono bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 px-2 py-0.5 rounded border border-indigo-300 text-[10px]">
                  PERCEPTRON & SIGMOID
                </span>
              </div>

              {/* Step 1: Net input */}
              <div className="bg-slate-50 dark:bg-[#17171c] p-3.5 rounded-lg border border-slate-200 dark:border-[#27272f] space-y-1">
                <div className="font-bold text-slate-800 dark:text-gray-200">ขั้นที่ 1: รวมสัญญาณถ่วงน้ำหนัก (Net Input: z)</div>
                <MathText>{"$$z = (w_1 \\cdot x_1) + (w_2 \\cdot x_2) + b$$"}</MathText>
                <MathText>{"$$z = (" + w1 + " \\times " + x1 + ") + (" + w2 + " \\times " + x2 + ") + (" + bias + ") = " + (w1 * x1).toFixed(2) + " + " + (w2 * x2).toFixed(2) + " + " + bias + " = " + netZ.toFixed(3) + "$$"}</MathText>
              </div>

              {/* Step 2: Sigmoid */}
              <div className="bg-slate-50 dark:bg-[#17171c] p-3.5 rounded-lg border border-slate-200 dark:border-[#27272f] space-y-1">
                <div className="font-bold text-slate-800 dark:text-gray-200">ขั้นที่ 2: แปลงค่าผ่านฟังก์ชันกระตุ้น Sigmoid</div>
                <MathText>{"$$f(z) = \\frac{1}{1 + e^{-z}} = \\frac{1}{1 + e^{-(" + netZ.toFixed(3) + ")}} = \\frac{1}{1 + " + expTerm.toFixed(5) + "} = " + sigmoidY.toFixed(4) + "$$"}</MathText>
                <p className="text-[11px] font-sans text-slate-600 dark:text-gray-400">
                  <strong>การตัดสินใจ:</strong> มีค่าความน่าจะเป็นเท่ากับ {(sigmoidY * 100).toFixed(2)}% ({sigmoidY >= 0.5 ? 'Active / Class 1' : 'Inactive / Class 0'})
                </p>
              </div>

              {/* Step 3: Sigmoid Derivative */}
              <div className="bg-slate-50 dark:bg-[#17171c] p-3.5 rounded-lg border border-slate-200 dark:border-[#27272f] space-y-1">
                <div className="font-bold text-slate-800 dark:text-gray-200">ขั้นที่ 3: คำนวณอนุพันธ์ของ Sigmoid สำหรับ Backpropagation</div>
                <MathText>{"$$f'(z) = f(z) \\cdot (1 - f(z)) = " + sigmoidY.toFixed(4) + " \\times (1 - " + sigmoidY.toFixed(4) + ") = " + sigmoidDeriv.toFixed(4) + "$$"}</MathText>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
