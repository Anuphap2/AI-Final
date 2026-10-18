import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  Play, 
  RotateCcw, 
  TrendingDown, 
  CheckCircle2, 
  Settings2, 
  Sparkles, 
  ArrowRight,
  Info,
  ChevronRight,
  Table,
  Sliders,
  Layers
} from 'lucide-react';
import MathText from './MathText';
import { sound } from '../utils/soundEffects';

export default function NeuralNetworkTrainer() {
  // Preset 1: Standard textbook example from lecture
  const defaultWeights = {
    w11: 0.15,
    w21: 0.20,
    w12: 0.25,
    w22: 0.30,
    bh1: 0.35,
    bh2: 0.35,
    wh1_o: 0.40,
    wh2_o: 0.45,
    bo: 0.60,
  };

  const [inputs, setInputs] = useState({ x1: 0.05, x2: 0.10 });
  const [target, setTarget] = useState(0.95);
  const [learningRate, setLearningRate] = useState(0.5);
  const [weights, setWeights] = useState(defaultWeights);
  const [initialWeights, setInitialWeights] = useState(defaultWeights);

  const [epochCount, setEpochCount] = useState(0);
  const [batchEpochInput, setBatchEpochInput] = useState(10);
  const [selectedNode, setSelectedNode] = useState('output'); // 'h1', 'h2', 'output', 'all'
  const [hoveredWeight, setHoveredWeight] = useState(null);
  const [showGlossary, setShowGlossary] = useState(true);
  const [history, setHistory] = useState([]); // [{ epoch, loss, y, w11, ... }]

  // Forward Pass Calculation Helper
  const forwardPass = (w, inp) => {
    // Hidden node 1:
    const zh1 = (w.w11 * inp.x1) + (w.w21 * inp.x2) + w.bh1;
    const ah1 = 1 / (1 + Math.exp(-zh1));

    // Hidden node 2:
    const zh2 = (w.w12 * inp.x1) + (w.w22 * inp.x2) + w.bh2;
    const ah2 = 1 / (1 + Math.exp(-zh2));

    // Output node:
    const zo = (w.wh1_o * ah1) + (w.wh2_o * ah2) + w.bo;
    const yHat = 1 / (1 + Math.exp(-zo));

    // Loss (MSE): 1/2 * (target - yHat)^2
    const error = target - yHat;
    const loss = 0.5 * Math.pow(error, 2);

    return { zh1, ah1, zh2, ah2, zo, yHat, error, loss };
  };

  // Backprop Step Helper: computes derivatives and updated weights
  const backpropStep = (w, inp, eta, t) => {
    const fwd = forwardPass(w, inp);

    // 1. Output Node Backprop:
    // delta_o = (target - yHat) * yHat * (1 - yHat) (ตามนิยามสไลด์บท 14 หน้า 18)
    // หรือ dE/dzo = -(target - yHat) * yHat * (1 - yHat)
    const delta_o = (t - fwd.yHat) * fwd.yHat * (1 - fwd.yHat);

    // Gradients for output weights:
    const dW_h1_o = eta * delta_o * fwd.ah1;
    const dW_h2_o = eta * delta_o * fwd.ah2;
    const dBo = eta * delta_o * 1.0;

    // 2. Hidden Node 1 Backprop:
    // delta_h1 = ah1 * (1 - ah1) * (delta_o * wh1_o)
    const delta_h1 = fwd.ah1 * (1 - fwd.ah1) * (delta_o * w.wh1_o);
    const dW_11 = eta * delta_h1 * inp.x1;
    const dW_21 = eta * delta_h1 * inp.x2;
    const dBh1 = eta * delta_h1 * 1.0;

    // 3. Hidden Node 2 Backprop:
    // delta_h2 = ah2 * (1 - ah2) * (delta_o * wh2_o)
    const delta_h2 = fwd.ah2 * (1 - fwd.ah2) * (delta_o * w.wh2_o);
    const dW_12 = eta * delta_h2 * inp.x1;
    const dW_22 = eta * delta_h2 * inp.x2;
    const dBh2 = eta * delta_h2 * 1.0;

    const newW = {
      w11: w.w11 + dW_11,
      w21: w.w21 + dW_21,
      w12: w.w12 + dW_12,
      w22: w.w22 + dW_22,
      bh1: w.bh1 + dBh1,
      bh2: w.bh2 + dBh2,
      wh1_o: w.wh1_o + dW_h1_o,
      wh2_o: w.wh2_o + dW_h2_o,
      bo: w.bo + dBo,
    };

    return {
      fwd,
      deltas: { delta_o, delta_h1, delta_h2 },
      changes: { dW_h1_o, dW_h2_o, dBo, dW_11, dW_21, dBh1, dW_12, dW_22, dBh2 },
      newW
    };
  };

  // Current forward values
  const currentFwd = forwardPass(weights, inputs);
  const currentDerivs = backpropStep(weights, inputs, learningRate, target);

  // Initialize history on mount or reset
  useEffect(() => {
    const initFwd = forwardPass(weights, inputs);
    setHistory([{
      epoch: 0,
      loss: initFwd.loss,
      y: initFwd.yHat,
      error: initFwd.error
    }]);
  }, []);

  const handleTrainOneEpoch = () => {
    sound.playClick();
    const result = backpropStep(weights, inputs, learningRate, target);
    const nextEpoch = epochCount + 1;
    setWeights(result.newW);
    setEpochCount(nextEpoch);

    const nextFwd = forwardPass(result.newW, inputs);
    setHistory(prev => [
      ...prev.slice(-30),
      {
        epoch: nextEpoch,
        loss: nextFwd.loss,
        y: nextFwd.yHat,
        error: nextFwd.error
      }
    ]);
  };

  const handleTrainBatchEpochs = (n) => {
    sound.playClick();
    let curW = { ...weights };
    let ep = epochCount;
    const newHist = [...history];

    for (let i = 0; i < n; i++) {
      const step = backpropStep(curW, inputs, learningRate, target);
      curW = step.newW;
      ep += 1;
      if (i === n - 1 || i % Math.max(1, Math.floor(n / 5)) === 0) {
        const fwd = forwardPass(curW, inputs);
        newHist.push({
          epoch: ep,
          loss: fwd.loss,
          y: fwd.yHat,
          error: fwd.error
        });
      }
    }

    setWeights(curW);
    setEpochCount(ep);
    setHistory(newHist.slice(-40));
  };

  const handleReset = () => {
    sound.playClick();
    setWeights(initialWeights);
    setEpochCount(0);
    const initFwd = forwardPass(initialWeights, inputs);
    setHistory([{
      epoch: 0,
      loss: initFwd.loss,
      y: initFwd.yHat,
      error: initFwd.error
    }]);
  };

  const handleApplyPreset = (type) => {
    sound.playClick();
    if (type === 'lecture') {
      const p = {
        w11: 0.15, w21: 0.20,
        w12: 0.25, w22: 0.30,
        bh1: 0.35, bh2: 0.35,
        wh1_o: 0.40, wh2_o: 0.45,
        bo: 0.60
      };
      setInputs({ x1: 0.05, x2: 0.10 });
      setTarget(0.95);
      setLearningRate(0.5);
      setWeights(p);
      setInitialWeights(p);
      setEpochCount(0);
      const initFwd = forwardPass(p, { x1: 0.05, x2: 0.10 });
      setHistory([{ epoch: 0, loss: initFwd.loss, y: initFwd.yHat, error: initFwd.error }]);
    } else if (type === 'xor_like') {
      const p = {
        w11: 0.5, w21: -0.6,
        w12: -0.4, w22: 0.7,
        bh1: -0.2, bh2: -0.1,
        wh1_o: 0.8, wh2_o: 0.9,
        bo: -0.5
      };
      setInputs({ x1: 1.0, x2: 0.0 });
      setTarget(1.0);
      setLearningRate(0.4);
      setWeights(p);
      setInitialWeights(p);
      setEpochCount(0);
      const initFwd = forwardPass(p, { x1: 1.0, x2: 0.0 });
      setHistory([{ epoch: 0, loss: initFwd.loss, y: initFwd.yHat, error: initFwd.error }]);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* Top Banner */}
      <div className="border border-[#27272f] bg-gradient-to-br from-[#17171c] to-[#0e0e12] p-6 sm:p-8 rounded-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-purple-400 uppercase tracking-widest mb-1">
              <Cpu className="w-4 h-4 text-purple-400" />
              <span>Multi-Layer Perceptron (MLP) & Backpropagation Lab</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-heading text-white">
              จำลองการฝึกโครงข่ายประสาทเทียมและการปรับค่าน้ำหนัก
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 mt-1 max-w-3xl">
              แสดงสถาปัตยกรรม <strong>Input Layer &rarr; Hidden Layer &rarr; Output Layer</strong> แยกคำนวณทีละ Node อย่างละเอียด พร้อมสูตรคณิตศาสตร์และตัวเลขจริงทุกขั้นตอน สามารถปรับจำนวน Epoch ได้ตามใจชอบเพื่อเตรียมสอบ
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#17171c] border border-[#27272f] px-4 py-2 rounded-lg font-mono text-xs">
            <span className="text-gray-400">สถานะ:</span>
            <span className="text-purple-400 font-bold">Epoch #{epochCount}</span>
            <span className="text-gray-600">|</span>
            <span className="text-emerald-400 font-bold">Loss: {currentFwd.loss.toFixed(6)}</span>
          </div>
        </div>
      </div>

      {/* Preset & Quick Toolbar */}
      <div className="border border-slate-200 dark:border-[#27272f] bg-white dark:bg-[#121216] p-4 rounded-xl flex flex-wrap items-center justify-between gap-3 font-mono text-xs shadow-2xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-slate-500 dark:text-gray-400 uppercase font-bold text-[11px]">ชุดตัวอย่าง:</span>
          <button
            onClick={() => handleApplyPreset('lecture')}
            className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-[#17171c] hover:bg-purple-50 dark:hover:bg-purple-600/20 border border-slate-200 dark:border-[#27272f] hover:border-purple-400 text-slate-700 dark:text-gray-200 transition font-sans font-medium"
          >
            ตัวอย่างจากสไลด์บทที่ 14 (Standard)
          </button>
          <button
            onClick={() => handleApplyPreset('xor_like')}
            className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-[#17171c] hover:bg-cyan-50 dark:hover:bg-cyan-600/20 border border-slate-200 dark:border-[#27272f] hover:border-cyan-400 text-slate-700 dark:text-gray-200 transition font-sans font-medium"
          >
            ตัวอย่างปัญหาลอจิก (Target=1.0)
          </button>
        </div>

        {/* Training Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleTrainOneEpoch}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold transition shadow-sm"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>ฝึก 1 Epoch</span>
          </button>

          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-[#17171c] border border-slate-300 dark:border-[#27272f] rounded-lg p-1">
            <span className="text-[11px] font-mono text-slate-600 dark:text-gray-400 pl-1.5 font-bold">Epochs:</span>
            <input
              type="number"
              min="1"
              max="1000"
              value={batchEpochInput}
              onChange={(e) => setBatchEpochInput(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-14 bg-white dark:bg-[#0a0a0c] border border-slate-300 dark:border-gray-700 rounded px-1.5 py-1 text-center font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-purple-500 text-xs"
            />
            <button
              onClick={() => handleTrainBatchEpochs(batchEpochInput)}
              className="px-3 py-1 bg-purple-100 dark:bg-purple-950/60 hover:bg-purple-200 dark:hover:bg-purple-900 border border-purple-300 dark:border-purple-700/50 text-purple-900 dark:text-purple-200 transition font-bold text-xs rounded shadow-2xs"
            >
              ฝึก +{batchEpochInput} Epochs
            </button>
          </div>

          <button
            onClick={handleReset}
            className="flex items-center gap-1 px-3 py-2 rounded-lg bg-slate-100 dark:bg-[#17171c] hover:bg-slate-200 dark:hover:bg-[#22222a] border border-slate-300 dark:border-[#27272f] text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition"
            title="รีเซ็ตค่าน้ำหนักเริ่มต้น"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>เริ่มใหม่</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Parameters & Interactive Architecture Diagram */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Network Hyperparameters & Inputs */}
        <div className="lg:col-span-4 space-y-4">
          <div className="border border-[#27272f] bg-[#121216] p-5 rounded-xl space-y-4">
            <h3 className="font-heading text-sm text-white uppercase tracking-wider flex items-center gap-2 border-b border-[#27272f] pb-2">
              <Sliders className="w-4 h-4 text-purple-400" />
              <span>พารามิเตอร์อินพุตและเป้าหมาย</span>
            </h3>

            {/* Inputs x1, x2 */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-mono text-gray-400 block mb-1">
                  Input x1:
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={inputs.x1}
                  onChange={(e) => setInputs(prev => ({ ...prev, x1: parseFloat(e.target.value) || 0 }))}
                  className="w-full bg-[#0a0a0c] border border-[#27272f] px-3 py-1.5 rounded font-mono text-sm text-white focus:border-purple-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-mono text-gray-400 block mb-1">
                  Input x2:
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={inputs.x2}
                  onChange={(e) => setInputs(prev => ({ ...prev, x2: parseFloat(e.target.value) || 0 }))}
                  className="w-full bg-[#0a0a0c] border border-[#27272f] px-3 py-1.5 rounded font-mono text-sm text-white focus:border-purple-500"
                />
              </div>
            </div>

            {/* Target and Learning Rate */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-mono text-gray-400 block mb-1">
                  Target (tk):
                </label>
                <input
                  type="number"
                  step="0.05"
                  value={target}
                  onChange={(e) => setTarget(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#0a0a0c] border border-[#27272f] px-3 py-1.5 rounded font-mono text-sm text-emerald-400 font-bold focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-mono text-gray-400 block mb-1">
                  Learning Rate (η):
                </label>
                <input
                  type="number"
                  step="0.05"
                  min="0.01"
                  max="2.0"
                  value={learningRate}
                  onChange={(e) => setLearningRate(parseFloat(e.target.value) || 0.1)}
                  className="w-full bg-[#0a0a0c] border border-[#27272f] px-3 py-1.5 rounded font-mono text-sm text-cyan-400 font-bold focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Live Metrics Summary */}
            <div className="bg-[#17171c] p-3 rounded-lg border border-[#27272f] space-y-1.5 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Output ที่ทำนายได้ (ŷ):</span>
                <span className="text-purple-300 font-bold">{currentFwd.yHat.toFixed(6)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">เป้าหมายจริง (Target):</span>
                <span className="text-emerald-400 font-bold">{target}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">ความคลาดเคลื่อน (tk - ŷ):</span>
                <span className="text-rose-400 font-bold">{currentFwd.error.toFixed(6)}</span>
              </div>
              <div className="flex justify-between border-t border-[#27272f] pt-1">
                <span className="text-gray-400">Loss E = ½(t - ŷ)²:</span>
                <span className="text-amber-400 font-bold">{currentFwd.loss.toFixed(6)}</span>
              </div>
            </div>
          </div>

          {/* Interactive Weight Matrix Table */}
          <div className="border border-[#27272f] bg-[#121216] p-4 rounded-xl space-y-3 font-mono text-xs">
            <h4 className="font-heading text-xs text-white uppercase tracking-wider flex items-center justify-between">
              <span>ตารางค่าน้ำหนักปัจจุบัน</span>
              <span className="text-[10px] text-gray-500">Epoch #{epochCount}</span>
            </h4>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-[#17171c] p-2 rounded border border-[#27272f]">
                <span className="text-gray-500 text-[10px] block">w11 (i1&rarr;h1)</span>
                <span className="text-white font-bold">{weights.w11.toFixed(5)}</span>
              </div>
              <div className="bg-[#17171c] p-2 rounded border border-[#27272f]">
                <span className="text-gray-500 text-[10px] block">w21 (i2&rarr;h1)</span>
                <span className="text-white font-bold">{weights.w21.toFixed(5)}</span>
              </div>
              <div className="bg-[#17171c] p-2 rounded border border-[#27272f]">
                <span className="text-gray-500 text-[10px] block">bias h1</span>
                <span className="text-gray-300">{weights.bh1.toFixed(5)}</span>
              </div>

              <div className="bg-[#17171c] p-2 rounded border border-[#27272f]">
                <span className="text-gray-500 text-[10px] block">w12 (i1&rarr;h2)</span>
                <span className="text-white font-bold">{weights.w12.toFixed(5)}</span>
              </div>
              <div className="bg-[#17171c] p-2 rounded border border-[#27272f]">
                <span className="text-gray-500 text-[10px] block">w22 (i2&rarr;h2)</span>
                <span className="text-white font-bold">{weights.w22.toFixed(5)}</span>
              </div>
              <div className="bg-[#17171c] p-2 rounded border border-[#27272f]">
                <span className="text-gray-500 text-[10px] block">bias h2</span>
                <span className="text-gray-300">{weights.bh2.toFixed(5)}</span>
              </div>

              <div className="bg-purple-500/10 p-2 rounded border border-purple-500/30">
                <span className="text-purple-400 text-[10px] block">wh1_o (h1&rarr;o)</span>
                <span className="text-purple-300 font-bold">{weights.wh1_o.toFixed(5)}</span>
              </div>
              <div className="bg-purple-500/10 p-2 rounded border border-purple-500/30">
                <span className="text-purple-400 text-[10px] block">wh2_o (h2&rarr;o)</span>
                <span className="text-purple-300 font-bold">{weights.wh2_o.toFixed(5)}</span>
              </div>
              <div className="bg-purple-500/10 p-2 rounded border border-purple-500/30">
                <span className="text-purple-400 text-[10px] block">bias o</span>
                <span className="text-purple-300 font-bold">{weights.bo.toFixed(5)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Visual Network Diagram & Detailed Node Math Inspector */}
        <div className="lg:col-span-8 space-y-6">
          {/* Visual Architecture Canvas / SVG representation */}
          <div className="border border-[#27272f] bg-[#121216] p-6 rounded-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#27272f] pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-400" />
                <h3 className="font-heading text-sm text-white uppercase tracking-wider">
                  แผนภาพโครงข่ายประสาทเทียม (คลิกที่ Node เพื่อตรวจวิธีคำนวณ)
                </h3>
              </div>
              <span className="text-[11px] font-mono text-gray-400">
                เลือกดู: <strong className="text-white uppercase">{selectedNode}</strong>
              </span>
            </div>

            {/* Interactive Neural Network SVG with explicit Connection Lines & Weights */}
            <div className="relative w-full bg-white dark:bg-[#0a0a0c] rounded-xl border border-gray-200 dark:border-[#27272f] p-4 shadow-sm select-none">
              <svg viewBox="0 0 880 445" className="w-full h-auto min-h-[390px] font-mono">
                <defs>
                  <marker id="arrow-cyan" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 1 L 10 5 L 0 9 z" fill="#0284c7" />
                  </marker>
                  <marker id="arrow-purple" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 1 L 10 5 L 0 9 z" fill="#8b5cf6" />
                  </marker>
                  <marker id="arrow-rose" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 1 L 10 5 L 0 9 z" fill="#e11d48" />
                  </marker>
                  <marker id="arrow-amber" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 1 L 10 5 L 0 9 z" fill="#d97706" />
                  </marker>
                  <marker id="arrow-gray" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 1 L 10 5 L 0 9 z" fill="#94a3b8" />
                  </marker>
                </defs>

                {/* Layer Title Headers */}
                <text x="140" y="28" textAnchor="middle" className="text-xs font-bold fill-sky-700 dark:fill-sky-400 uppercase tracking-wider font-sans">
                  Input Layer (2 Features)
                </text>
                <text x="450" y="28" textAnchor="middle" className="text-xs font-bold fill-purple-700 dark:fill-purple-400 uppercase tracking-wider font-sans">
                  Hidden Layer (Sigmoid)
                </text>
                <text x="760" y="28" textAnchor="middle" className="text-xs font-bold fill-rose-700 dark:fill-rose-400 uppercase tracking-wider font-sans">
                  Output Layer (Sigmoid)
                </text>

                {/* SYNAPSE / WEIGHT CONNECTION LINES */}
                {/* Line 1: i1 -> h1 (w11) */}
                <line
                  x1="178" y1="130"
                  x2="404" y2="130"
                  stroke={selectedNode === 'h1' || hoveredWeight === 'w11' ? '#8b5cf6' : '#94a3b8'}
                  strokeWidth={selectedNode === 'h1' || hoveredWeight === 'w11' ? '3.5' : '2'}
                  strokeOpacity={selectedNode === 'h1' || hoveredWeight === 'w11' ? '1' : '0.6'}
                  markerEnd={selectedNode === 'h1' || hoveredWeight === 'w11' ? 'url(#arrow-purple)' : 'url(#arrow-gray)'}
                  className="transition-all"
                />

                {/* Line 2: i1 -> h2 (w12) */}
                <line
                  x1="170" y1="146"
                  x2="410" y2="292"
                  stroke={selectedNode === 'h2' || hoveredWeight === 'w12' ? '#8b5cf6' : '#94a3b8'}
                  strokeWidth={selectedNode === 'h2' || hoveredWeight === 'w12' ? '3.5' : '2'}
                  strokeOpacity={selectedNode === 'h2' || hoveredWeight === 'w12' ? '1' : '0.6'}
                  markerEnd={selectedNode === 'h2' || hoveredWeight === 'w12' ? 'url(#arrow-purple)' : 'url(#arrow-gray)'}
                  className="transition-all"
                />

                {/* Line 3: i2 -> h1 (w21) */}
                <line
                  x1="170" y1="294"
                  x2="410" y2="148"
                  stroke={selectedNode === 'h1' || hoveredWeight === 'w21' ? '#8b5cf6' : '#94a3b8'}
                  strokeWidth={selectedNode === 'h1' || hoveredWeight === 'w21' ? '3.5' : '2'}
                  strokeOpacity={selectedNode === 'h1' || hoveredWeight === 'w21' ? '1' : '0.6'}
                  markerEnd={selectedNode === 'h1' || hoveredWeight === 'w21' ? 'url(#arrow-purple)' : 'url(#arrow-gray)'}
                  className="transition-all"
                />

                {/* Line 4: i2 -> h2 (w22) */}
                <line
                  x1="178" y1="310"
                  x2="404" y2="310"
                  stroke={selectedNode === 'h2' || hoveredWeight === 'w22' ? '#8b5cf6' : '#94a3b8'}
                  strokeWidth={selectedNode === 'h2' || hoveredWeight === 'w22' ? '3.5' : '2'}
                  strokeOpacity={selectedNode === 'h2' || hoveredWeight === 'w22' ? '1' : '0.6'}
                  markerEnd={selectedNode === 'h2' || hoveredWeight === 'w22' ? 'url(#arrow-purple)' : 'url(#arrow-gray)'}
                  className="transition-all"
                />

                {/* Line 5: h1 -> o1 (wh1_o) */}
                <line
                  x1="494" y1="144"
                  x2="702" y2="204"
                  stroke={selectedNode === 'output' || selectedNode === 'h1' || hoveredWeight === 'wh1_o' ? '#e11d48' : '#94a3b8'}
                  strokeWidth={selectedNode === 'output' || selectedNode === 'h1' || hoveredWeight === 'wh1_o' ? '3.5' : '2'}
                  strokeOpacity={selectedNode === 'output' || selectedNode === 'h1' || hoveredWeight === 'wh1_o' ? '1' : '0.6'}
                  markerEnd={selectedNode === 'output' || selectedNode === 'h1' || hoveredWeight === 'wh1_o' ? 'url(#arrow-rose)' : 'url(#arrow-gray)'}
                  className="transition-all"
                />

                {/* Line 6: h2 -> o1 (wh2_o) */}
                <line
                  x1="494" y1="296"
                  x2="702" y2="236"
                  stroke={selectedNode === 'output' || selectedNode === 'h2' || hoveredWeight === 'wh2_o' ? '#e11d48' : '#94a3b8'}
                  strokeWidth={selectedNode === 'output' || selectedNode === 'h2' || hoveredWeight === 'wh2_o' ? '3.5' : '2'}
                  strokeOpacity={selectedNode === 'output' || selectedNode === 'h2' || hoveredWeight === 'wh2_o' ? '1' : '0.6'}
                  markerEnd={selectedNode === 'output' || selectedNode === 'h2' || hoveredWeight === 'wh2_o' ? 'url(#arrow-rose)' : 'url(#arrow-gray)'}
                  className="transition-all"
                />

                {/* BIAS INPUT LINES */}
                {/* Bias for h1 */}
                <line
                  x1="450" y1="62"
                  x2="450" y2="84"
                  stroke={selectedNode === 'h1' ? '#d97706' : '#94a3b8'}
                  strokeWidth="2"
                  markerEnd="url(#arrow-amber)"
                />
                {/* Bias for h2 */}
                <line
                  x1="450" y1="390"
                  x2="450" y2="356"
                  stroke={selectedNode === 'h2' ? '#d97706' : '#94a3b8'}
                  strokeWidth="2"
                  markerEnd="url(#arrow-amber)"
                />
                {/* Bias for o1 */}
                <line
                  x1="760" y1="120"
                  x2="760" y2="162"
                  stroke={selectedNode === 'output' ? '#d97706' : '#94a3b8'}
                  strokeWidth="2"
                  markerEnd="url(#arrow-amber)"
                />

                {/* WEIGHT VALUE PILLS / BADGES */}
                {/* Badge w11 */}
                <g
                  className="cursor-pointer transition-transform"
                  onMouseEnter={() => setHoveredWeight('w11')}
                  onMouseLeave={() => setHoveredWeight(null)}
                  onClick={() => { sound.playClick(); setSelectedNode('h1'); }}
                >
                  <rect
                    x="240" y="96" width="102" height="24" rx="12"
                    className={`${hoveredWeight === 'w11' || selectedNode === 'h1' ? 'fill-purple-50 dark:fill-purple-950 stroke-purple-600' : 'fill-white dark:fill-[#1b1b22] stroke-gray-300 dark:stroke-[#343442]'} stroke-[1.5] filter drop-shadow-sm`}
                  />
                  <text x="291" y="112" textAnchor="middle" className="text-[11px] font-bold fill-purple-900 dark:fill-purple-200">
                    w11: {weights.w11.toFixed(4)}
                  </text>
                </g>

                {/* Badge w12 */}
                <g
                  className="cursor-pointer transition-transform"
                  onMouseEnter={() => setHoveredWeight('w12')}
                  onMouseLeave={() => setHoveredWeight(null)}
                  onClick={() => { sound.playClick(); setSelectedNode('h2'); }}
                >
                  <rect
                    x="215" y="172" width="102" height="24" rx="12"
                    className={`${hoveredWeight === 'w12' || selectedNode === 'h2' ? 'fill-purple-50 dark:fill-purple-950 stroke-purple-600' : 'fill-white dark:fill-[#1b1b22] stroke-gray-300 dark:stroke-[#343442]'} stroke-[1.5] filter drop-shadow-sm`}
                  />
                  <text x="266" y="188" textAnchor="middle" className="text-[11px] font-bold fill-purple-900 dark:fill-purple-200">
                    w12: {weights.w12.toFixed(4)}
                  </text>
                </g>

                {/* Badge w21 */}
                <g
                  className="cursor-pointer transition-transform"
                  onMouseEnter={() => setHoveredWeight('w21')}
                  onMouseLeave={() => setHoveredWeight(null)}
                  onClick={() => { sound.playClick(); setSelectedNode('h1'); }}
                >
                  <rect
                    x="300" y="246" width="102" height="24" rx="12"
                    className={`${hoveredWeight === 'w21' || selectedNode === 'h1' ? 'fill-purple-50 dark:fill-purple-950 stroke-purple-600' : 'fill-white dark:fill-[#1b1b22] stroke-gray-300 dark:stroke-[#343442]'} stroke-[1.5] filter drop-shadow-sm`}
                  />
                  <text x="351" y="262" textAnchor="middle" className="text-[11px] font-bold fill-purple-900 dark:fill-purple-200">
                    w21: {weights.w21.toFixed(4)}
                  </text>
                </g>

                {/* Badge w22 */}
                <g
                  className="cursor-pointer transition-transform"
                  onMouseEnter={() => setHoveredWeight('w22')}
                  onMouseLeave={() => setHoveredWeight(null)}
                  onClick={() => { sound.playClick(); setSelectedNode('h2'); }}
                >
                  <rect
                    x="240" y="322" width="102" height="24" rx="12"
                    className={`${hoveredWeight === 'w22' || selectedNode === 'h2' ? 'fill-purple-50 dark:fill-purple-950 stroke-purple-600' : 'fill-white dark:fill-[#1b1b22] stroke-gray-300 dark:stroke-[#343442]'} stroke-[1.5] filter drop-shadow-sm`}
                  />
                  <text x="291" y="338" textAnchor="middle" className="text-[11px] font-bold fill-purple-900 dark:fill-purple-200">
                    w22: {weights.w22.toFixed(4)}
                  </text>
                </g>

                {/* Badge wh1_o */}
                <g
                  className="cursor-pointer transition-transform"
                  onMouseEnter={() => setHoveredWeight('wh1_o')}
                  onMouseLeave={() => setHoveredWeight(null)}
                  onClick={() => { sound.playClick(); setSelectedNode('output'); }}
                >
                  <rect
                    x="545" y="140" width="118" height="24" rx="12"
                    className={`${hoveredWeight === 'wh1_o' || selectedNode === 'output' ? 'fill-rose-50 dark:fill-rose-950 stroke-rose-600' : 'fill-white dark:fill-[#1b1b22] stroke-gray-300 dark:stroke-[#343442]'} stroke-[1.5] filter drop-shadow-sm`}
                  />
                  <text x="604" y="156" textAnchor="middle" className="text-[11px] font-bold fill-rose-900 dark:fill-rose-200">
                    wh1_o: {weights.wh1_o.toFixed(4)}
                  </text>
                </g>

                {/* Badge wh2_o */}
                <g
                  className="cursor-pointer transition-transform"
                  onMouseEnter={() => setHoveredWeight('wh2_o')}
                  onMouseLeave={() => setHoveredWeight(null)}
                  onClick={() => { sound.playClick(); setSelectedNode('output'); }}
                >
                  <rect
                    x="545" y="278" width="118" height="24" rx="12"
                    className={`${hoveredWeight === 'wh2_o' || selectedNode === 'output' ? 'fill-rose-50 dark:fill-rose-950 stroke-rose-600' : 'fill-white dark:fill-[#1b1b22] stroke-gray-300 dark:stroke-[#343442]'} stroke-[1.5] filter drop-shadow-sm`}
                  />
                  <text x="604" y="294" textAnchor="middle" className="text-[11px] font-bold fill-rose-900 dark:fill-rose-200">
                    wh2_o: {weights.wh2_o.toFixed(4)}
                  </text>
                </g>

                {/* BIAS PILLS */}
                {/* Bias h1 pill */}
                <g className="cursor-pointer" onClick={() => { sound.playClick(); setSelectedNode('h1'); }}>
                  <rect x="402" y="38" width="96" height="22" rx="11" className="fill-amber-50 dark:fill-amber-950 stroke-amber-500 stroke-1" />
                  <text x="450" y="53" textAnchor="middle" className="text-[10px] font-bold fill-amber-900 dark:fill-amber-300">
                    bh1: {weights.bh1.toFixed(4)}
                  </text>
                </g>

                {/* Bias h2 pill */}
                <g className="cursor-pointer" onClick={() => { sound.playClick(); setSelectedNode('h2'); }}>
                  <rect x="402" y="394" width="96" height="22" rx="11" className="fill-amber-50 dark:fill-amber-950 stroke-amber-500 stroke-1" />
                  <text x="450" y="409" textAnchor="middle" className="text-[10px] font-bold fill-amber-900 dark:fill-amber-300">
                    bh2: {weights.bh2.toFixed(4)}
                  </text>
                </g>

                {/* Bias o pill */}
                <g className="cursor-pointer" onClick={() => { sound.playClick(); setSelectedNode('output'); }}>
                  <rect x="714" y="96" width="92" height="22" rx="11" className="fill-amber-50 dark:fill-amber-950 stroke-amber-500 stroke-1" />
                  <text x="760" y="111" textAnchor="middle" className="text-[10px] font-bold fill-amber-900 dark:fill-amber-300">
                    bo: {weights.bo.toFixed(4)}
                  </text>
                </g>

                {/* LAYER 1: INPUT NODES */}
                {/* Node i1 */}
                <g>
                  <circle cx="140" cy="130" r="38" className="fill-sky-50 dark:fill-sky-950 stroke-sky-500 stroke-2 drop-shadow-sm" />
                  <text x="140" y="122" textAnchor="middle" className="text-xs font-bold fill-sky-800 dark:fill-sky-300">Node i1</text>
                  <text x="140" y="142" textAnchor="middle" className="text-xs font-black fill-slate-900 dark:fill-white font-mono">{inputs.x1}</text>
                </g>

                {/* Node i2 */}
                <g>
                  <circle cx="140" cy="310" r="38" className="fill-sky-50 dark:fill-sky-950 stroke-sky-500 stroke-2 drop-shadow-sm" />
                  <text x="140" y="302" textAnchor="middle" className="text-xs font-bold fill-sky-800 dark:fill-sky-300">Node i2</text>
                  <text x="140" y="322" textAnchor="middle" className="text-xs font-black fill-slate-900 dark:fill-white font-mono">{inputs.x2}</text>
                </g>

                {/* LAYER 2: HIDDEN NODES */}
                {/* Node h1 */}
                <g
                  className="cursor-pointer group"
                  onClick={() => { sound.playClick(); setSelectedNode('h1'); }}
                >
                  {selectedNode === 'h1' && (
                    <circle cx="450" cy="130" r="52" className="fill-purple-500/15 stroke-purple-500 stroke-2 animate-pulse" />
                  )}
                  <circle
                    cx="450" cy="130" r="44"
                    className={`${selectedNode === 'h1' ? 'fill-purple-100 dark:fill-purple-900/60 stroke-purple-600 dark:stroke-purple-400 stroke-[2.5]' : 'fill-purple-50 dark:fill-purple-950 stroke-purple-500/80 stroke-2'} drop-shadow-md group-hover:stroke-purple-600 transition-all`}
                  />
                  <text x="450" y="112" textAnchor="middle" className="text-xs font-bold fill-purple-900 dark:fill-purple-200">Node h1</text>
                  <text x="450" y="128" textAnchor="middle" className="text-[11px] font-mono fill-slate-600 dark:fill-slate-300">z: {currentFwd.zh1.toFixed(3)}</text>
                  <text x="450" y="146" textAnchor="middle" className="text-xs font-mono font-black fill-slate-900 dark:fill-white">a: {currentFwd.ah1.toFixed(4)}</text>
                </g>

                {/* Node h2 */}
                <g
                  className="cursor-pointer group"
                  onClick={() => { sound.playClick(); setSelectedNode('h2'); }}
                >
                  {selectedNode === 'h2' && (
                    <circle cx="450" cy="310" r="52" className="fill-purple-500/15 stroke-purple-500 stroke-2 animate-pulse" />
                  )}
                  <circle
                    cx="450" cy="310" r="44"
                    className={`${selectedNode === 'h2' ? 'fill-purple-100 dark:fill-purple-900/60 stroke-purple-600 dark:stroke-purple-400 stroke-[2.5]' : 'fill-purple-50 dark:fill-purple-950 stroke-purple-500/80 stroke-2'} drop-shadow-md group-hover:stroke-purple-600 transition-all`}
                  />
                  <text x="450" y="292" textAnchor="middle" className="text-xs font-bold fill-purple-900 dark:fill-purple-200">Node h2</text>
                  <text x="450" y="308" textAnchor="middle" className="text-[11px] font-mono fill-slate-600 dark:fill-slate-300">z: {currentFwd.zh2.toFixed(3)}</text>
                  <text x="450" y="326" textAnchor="middle" className="text-xs font-mono font-black fill-slate-900 dark:fill-white">a: {currentFwd.ah2.toFixed(4)}</text>
                </g>

                {/* LAYER 3: OUTPUT NODE */}
                {/* Node o1 */}
                <g
                  className="cursor-pointer group"
                  onClick={() => { sound.playClick(); setSelectedNode('output'); }}
                >
                  {selectedNode === 'output' && (
                    <circle cx="760" cy="220" r="66" className="fill-rose-500/15 stroke-rose-500 stroke-2 animate-pulse" />
                  )}
                  <circle
                    cx="760" cy="220" r="56"
                    className={`${selectedNode === 'output' ? 'fill-rose-100 dark:fill-rose-900/60 stroke-rose-600 dark:stroke-rose-400 stroke-[2.5]' : 'fill-rose-50 dark:fill-rose-950 stroke-rose-500/80 stroke-2'} drop-shadow-md group-hover:stroke-rose-600 transition-all`}
                  />
                  <text x="760" y="194" textAnchor="middle" className="text-xs font-bold fill-rose-900 dark:fill-rose-200">Node o1 (Output)</text>
                  <text x="760" y="212" textAnchor="middle" className="text-[11px] font-mono fill-slate-600 dark:fill-slate-300">z: {currentFwd.zo.toFixed(3)}</text>
                  <text x="760" y="233" textAnchor="middle" className="text-sm font-mono font-black fill-slate-900 dark:fill-white">ŷ: {currentFwd.yHat.toFixed(4)}</text>
                  <text x="760" y="252" textAnchor="middle" className="text-[10px] font-mono font-bold fill-emerald-600 dark:fill-emerald-400">Target: {target}</text>
                </g>
              </svg>

              {/* Explanatory Legend */}
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-[#27272f] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-sky-500 border border-sky-600"></span>
                    <span className="text-gray-700 dark:text-gray-300">Input Nodes (x1, x2)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-purple-500 border border-purple-600"></span>
                    <span className="text-gray-700 dark:text-gray-300">Hidden Nodes & Weights</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-rose-500 border border-rose-600"></span>
                    <span className="text-gray-700 dark:text-gray-300">Output Node & Weights</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-amber-500 border border-amber-600"></span>
                    <span className="text-gray-700 dark:text-gray-300">Bias Nodes</span>
                  </div>
                </div>
                <div className="text-gray-500 dark:text-gray-400 text-[11px]">
                  💡 คลิกที่ Node หรือคลิกที่เส้น Weight เพื่อดูสูตรการคำนวณและการอัปเดตแบบละเอียดด้านล่าง
                </div>
              </div>
            </div>
          </div>

          {/* Node Math Inspector Tabs */}
          <div className="border border-slate-200 dark:border-[#27272f] bg-white dark:bg-[#121216] p-5 sm:p-6 rounded-xl space-y-6 shadow-sm">
            {/* COMPREHENSIVE VARIABLE GLOSSARY / DICTIONARY */}
            <div className="border border-purple-200 dark:border-purple-900/40 bg-purple-50/60 dark:bg-[#161320] rounded-xl p-4 sm:p-5 space-y-3 shadow-2xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-600 animate-ping"></span>
                  <h4 className="font-heading text-sm text-purple-950 dark:text-purple-200 uppercase tracking-wider">
                    📖 พจนานุกรมสรุปความหมายตัวแปรทั้งหมด (Variable Dictionary)
                  </h4>
                </div>
                <button
                  onClick={() => setShowGlossary(!showGlossary)}
                  className="text-xs font-mono font-bold text-purple-700 dark:text-purple-300 hover:underline px-2 py-1 rounded bg-purple-100 dark:bg-purple-900/40"
                >
                  {showGlossary ? '▲ ซ่อนตาราง' : '▼ เปิดดูตัวแปรทุกตัว'}
                </button>
              </div>

              {showGlossary && (
                <div className="overflow-x-auto pt-1">
                  <table className="w-full text-left text-xs font-sans border-collapse">
                    <thead>
                      <tr className="border-b border-purple-200 dark:border-purple-800/60 text-purple-950 dark:text-purple-300 font-mono text-[11px]">
                        <th className="py-2 px-2.5">ตัวแปร</th>
                        <th className="py-2 px-2.5">ชื่อทางการ (English)</th>
                        <th className="py-2 px-2.5">ความหมายและบทบาทหน้าที่ (ภาษาไทย)</th>
                        <th className="py-2 px-2.5">ค่าปัจจุบันในระบบ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-purple-100 dark:divide-purple-900/30 text-slate-800 dark:text-gray-200">
                      <tr>
                        <td className="py-2 px-2.5 font-bold font-mono text-sky-700 dark:text-sky-400">x1, x2</td>
                        <td className="py-2 px-2.5 font-mono">Input Features</td>
                        <td className="py-2 px-2.5">ข้อมูลนำเข้าที่เป็นตัวเลขคุณลักษณะ (Features) ป้อนเข้าเครือข่ายประสาท</td>
                        <td className="py-2 px-2.5 font-mono font-bold text-sky-600 dark:text-sky-300">x1={inputs.x1}, x2={inputs.x2}</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-2.5 font-bold font-mono text-purple-700 dark:text-purple-400">w11, w21, w12, w22</td>
                        <td className="py-2 px-2.5 font-mono">Hidden Weights (wij)</td>
                        <td className="py-2 px-2.5">ค่าน้ำหนักไซแนปส์เชื่อมระหว่าง Input Layer กับ Hidden Layer (ตัวคูณปรับความแรงสัญญาณ)</td>
                        <td className="py-2 px-2.5 font-mono">w11={weights.w11.toFixed(3)}, w21={weights.w21.toFixed(3)}</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-2.5 font-bold font-mono text-amber-700 dark:text-amber-400">bh1, bh2, bo</td>
                        <td className="py-2 px-2.5 font-mono">Bias Terms (b)</td>
                        <td className="py-2 px-2.5">ค่าไบแอส ชดเชยจุดตัดแกนเพื่อเลื่อนเส้นแบ่งการตัดสินใจ (เหมือน c ใน y=mx+c)</td>
                        <td className="py-2 px-2.5 font-mono">bh1={weights.bh1.toFixed(3)}, bo={weights.bo.toFixed(3)}</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-2.5 font-bold font-mono text-cyan-700 dark:text-cyan-400">z (zh1, zh2, zo)</td>
                        <td className="py-2 px-2.5 font-mono">Net Input (Weighted Sum)</td>
                        <td className="py-2 px-2.5">ผลรวมเชิงเส้นสุทธิ = ∑(w·x) + b ของแต่ละโหนดก่อนส่งเข้าฟังก์ชันแอกติเวชัน</td>
                        <td className="py-2 px-2.5 font-mono">zo={currentFwd.zo.toFixed(4)}</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-2.5 font-bold font-mono text-indigo-700 dark:text-indigo-400">a (ah1, ah2)</td>
                        <td className="py-2 px-2.5 font-mono">Activation Output</td>
                        <td className="py-2 px-2.5">ค่าสัญญาณส่งต่อของ Hidden Node หลังผ่าน Sigmoid: a = 1 / (1 + e^-z) บีบค่าให้อยู่ในช่วง (0, 1)</td>
                        <td className="py-2 px-2.5 font-mono">ah1={currentFwd.ah1.toFixed(4)}, ah2={currentFwd.ah2.toFixed(4)}</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-2.5 font-bold font-mono text-rose-700 dark:text-rose-400">ŷ (y-hat / ao)</td>
                        <td className="py-2 px-2.5 font-mono">Predicted Output</td>
                        <td className="py-2 px-2.5">ค่าผลลัพธ์ที่โครงข่ายประสาทเทียมทำนายออกมาในรอบปัจจุบัน</td>
                        <td className="py-2 px-2.5 font-mono font-bold text-rose-600 dark:text-rose-400">ŷ={currentFwd.yHat.toFixed(4)}</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-2.5 font-bold font-mono text-emerald-700 dark:text-emerald-400">tk (Target)</td>
                        <td className="py-2 px-2.5 font-mono">Ground Truth Target</td>
                        <td className="py-2 px-2.5">ค่าคำตอบที่ถูกต้องตามเป้าหมาย (Ground Truth) ที่ต้องการให้โมเดลตอบ</td>
                        <td className="py-2 px-2.5 font-mono font-bold text-emerald-600 dark:text-emerald-400">tk={target}</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-2.5 font-bold font-mono text-amber-700 dark:text-amber-400">Loss E</td>
                        <td className="py-2 px-2.5 font-mono">Half Squared Error</td>
                        <td className="py-2 px-2.5">ฟังก์ชันวัดความผิดพลาด: E = ½(tk - ŷ)² ยิ่งโมเดลฉลาด Loss ยิ่งลดลงเข้าใกล้ 0</td>
                        <td className="py-2 px-2.5 font-mono font-bold text-amber-600 dark:text-amber-400">E={currentFwd.loss.toFixed(6)}</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-2.5 font-bold font-mono text-purple-700 dark:text-purple-400">η (Eta)</td>
                        <td className="py-2 px-2.5 font-mono">Learning Rate</td>
                        <td className="py-2 px-2.5">อัตราการเรียนรู้ ควบคุมขนาดก้าว (Step Size) ในการปรับค่าน้ำหนัก</td>
                        <td className="py-2 px-2.5 font-mono font-bold">η={learningRate}</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-2.5 font-bold font-mono text-red-700 dark:text-red-400">δo (Delta Output)</td>
                        <td className="py-2 px-2.5 font-mono">Output Error Signal</td>
                        <td className="py-2 px-2.5">สัญญาณ Error ที่โหนดเอาต์พุต: δo = (tk - ŷ) · ŷ · (1 - ŷ)</td>
                        <td className="py-2 px-2.5 font-mono font-bold">δo={currentDerivs.deltas.delta_o.toFixed(5)}</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-2.5 font-bold font-mono text-purple-700 dark:text-purple-400">δh1, δh2</td>
                        <td className="py-2 px-2.5 font-mono">Hidden Error Signals</td>
                        <td className="py-2 px-2.5">สัญญาณ Error ที่โหนดซ่อน: δh = ah(1 - ah) · (δo · wh_o) รับแรงสะท้อนกลับจากเอาต์พุต</td>
                        <td className="py-2 px-2.5 font-mono">δh1={currentDerivs.deltas.delta_h1.toFixed(5)}</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-2.5 font-bold font-mono text-emerald-700 dark:text-emerald-400">Δw (Delta Weight)</td>
                        <td className="py-2 px-2.5 font-mono">Weight Adjustment</td>
                        <td className="py-2 px-2.5">ขนาดค่าน้ำหนักที่จะต้องนำไปบวกเพิ่มให้กับน้ำหนักเดิม: w_new = w_old + Δw</td>
                        <td className="py-2 px-2.5 font-mono font-bold">Δw = η · δ · input</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#27272f] pb-3">
              <h4 className="font-heading text-sm text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-500" />
                <span>การแสดงวิธีคำนวณแบบละเอียดทีละ Node (Step-by-Step Node Breakdown)</span>
              </h4>
              <div className="flex items-center gap-1 font-mono text-xs">
                <button
                  onClick={() => setSelectedNode('output')}
                  className={`px-2.5 py-1 rounded transition ${selectedNode === 'output' ? 'bg-red-500 text-white font-bold' : 'bg-[#17171c] text-gray-400'}`}
                >
                  Output Node o1
                </button>
                <button
                  onClick={() => setSelectedNode('h1')}
                  className={`px-2.5 py-1 rounded transition ${selectedNode === 'h1' ? 'bg-purple-600 text-white font-bold' : 'bg-[#17171c] text-gray-400'}`}
                >
                  Hidden Node h1
                </button>
                <button
                  onClick={() => setSelectedNode('h2')}
                  className={`px-2.5 py-1 rounded transition ${selectedNode === 'h2' ? 'bg-purple-600 text-white font-bold' : 'bg-[#17171c] text-gray-400'}`}
                >
                  Hidden Node h2
                </button>
              </div>
            </div>

            {/* DETAIL: OUTPUT NODE O1 */}
            {selectedNode === 'output' && (
              <div className="space-y-4 font-mono text-xs">
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-200">
                  <strong>โหนดเอาต์พุต (Output Node o1):</strong> รับสัญญาณจาก h1 และ h2 ทำการรวมสัญญาณ (Net Input), ส่งผ่านฟังก์ชัน Sigmoid และคำนวณสัญญาณความคลาดเคลื่อน <MathText>{"$\\delta_o$"}</MathText> เพื่อปรับค่าน้ำหนัก <MathText>{"$w_{h1,o}, w_{h2,o}, b_o$"}</MathText>
                </div>

                {/* Step 1: Forward Net input */}
                <div className="bg-[#17171c] p-4 rounded-lg border border-[#27272f] space-y-2">
                  <span className="text-gray-400 font-bold block">1. Forward Pass: คำนวณผลรวมสุทธิ (Net Input zo)</span>
                  <MathText>
                    {"$$z_o = (w_{h1\\_o} \\cdot a_{h1}) + (w_{h2\\_o} \\cdot a_{h2}) + b_o$$"}
                  </MathText>
                  <p className="text-gray-300">
                    แทนค่า: <MathText>{`$$z_o = (${weights.wh1_o.toFixed(4)} \\times ${currentFwd.ah1.toFixed(4)}) + (${weights.wh2_o.toFixed(4)} \\times ${currentFwd.ah2.toFixed(4)}) + ${weights.bo.toFixed(4)}$$`}</MathText>
                  </p>
                  <p className="text-cyan-400 font-bold">
                    &rarr; zo = {currentFwd.zo.toFixed(6)}
                  </p>
                </div>

                {/* Step 2: Forward Sigmoid Activation */}
                <div className="bg-[#17171c] p-4 rounded-lg border border-[#27272f] space-y-2">
                  <span className="text-gray-400 font-bold block">2. Forward Pass: คำนวณเอาต์พุตด้วย Sigmoid</span>
                  <MathText>
                    {"$$\\hat{y} = \\frac{1}{1 + e^{-z_o}}$$"}
                  </MathText>
                  <p className="text-gray-300">
                    แทนค่า: <MathText>{`$$\\hat{y} = \\frac{1}{1 + e^{-(${currentFwd.zo.toFixed(4)})}} = ${currentFwd.yHat.toFixed(6)}$$`}</MathText>
                  </p>
                  <p className="text-purple-300 font-bold">
                    &rarr; ค่าเอาต์พุตที่ทำนายได้ ŷ = {currentFwd.yHat.toFixed(6)} (Target = {target})
                  </p>
                </div>

                {/* Step 3: Backward Error Signal delta_o */}
                <div className="bg-[#17171c] p-4 rounded-lg border border-[#27272f] space-y-2">
                  <span className="text-gray-400 font-bold block">3. Backward Pass: คำนวณ Error Signal (δo) ตามสไลด์บทที่ 14</span>
                  <MathText>
                    {"$$\\delta_o = (t_k - \\hat{y}) \\cdot \\hat{y} \\cdot (1 - \\hat{y})$$"}
                  </MathText>
                  <p className="text-gray-300">
                    แทนค่า: <MathText>{`$$\\delta_o = (${target} - ${currentFwd.yHat.toFixed(4)}) \\times ${currentFwd.yHat.toFixed(4)} \\times (1 - ${currentFwd.yHat.toFixed(4)}) = ${currentDerivs.deltas.delta_o.toFixed(6)}$$`}</MathText>
                  </p>
                  <p className="text-amber-400 font-bold">
                    &rarr; สัญญาณความคลาดเคลื่อน δo = {currentDerivs.deltas.delta_o.toFixed(6)}
                  </p>
                </div>

                {/* Step 4: Weight Updates for Output Layer */}
                <div className="bg-[#17171c] p-4 rounded-lg border border-[#27272f] space-y-2">
                  <span className="text-gray-400 font-bold block">4. กฎการอัปเดตค่าน้ำหนักชั้นเอาต์พุต (Weight Updates)</span>
                  <MathText>
                    {"$$\\Delta w_{h1\\_o} = \\eta \\cdot \\delta_o \\cdot a_{h1}$$"}
                  </MathText>
                  <p className="text-gray-300">
                    = {learningRate} &times; {currentDerivs.deltas.delta_o.toFixed(5)} &times; {currentFwd.ah1.toFixed(5)} = <strong className="text-emerald-400">+{currentDerivs.changes.dW_h1_o.toFixed(6)}</strong>
                  </p>
                  <p className="text-gray-200">
                    ค่าน้ำหนักใหม่: <MathText>{`$$w_{h1\\_o}^{new} = ${weights.wh1_o.toFixed(5)} + (${currentDerivs.changes.dW_h1_o.toFixed(5)}) = ${currentDerivs.newW.wh1_o.toFixed(5)}$$`}</MathText>
                  </p>
                </div>
              </div>
            )}

            {/* DETAIL: HIDDEN NODE H1 */}
            {selectedNode === 'h1' && (
              <div className="space-y-4 font-mono text-xs">
                <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg text-purple-200">
                  <strong>โหนดชั้นซ่อน 1 (Hidden Node h1):</strong> รับสัญญาณจากอินพุต x1, x2 คำนวณ Net Input zh1 และ Activation ah1 จากนั้นรับ Error Signal ย้อนกลับมาจากชั้นเอาต์พุตเพื่อปรับ <MathText>{"$w_{11}, w_{21}, b_{h1}$"}</MathText>
                </div>

                <div className="bg-[#17171c] p-4 rounded-lg border border-[#27272f] space-y-2">
                  <span className="text-gray-400 font-bold block">1. Forward Pass: Net Input (zh1) & Activation (ah1)</span>
                  <MathText>
                    {"$$z_{h1} = (w_{11} \\cdot x_1) + (w_{21} \\cdot x_2) + b_{h1}$$"}
                  </MathText>
                  <p className="text-gray-300">
                    แทนค่า: <MathText>{`$$z_{h1} = (${weights.w11.toFixed(4)} \\times ${inputs.x1}) + (${weights.w21.toFixed(4)} \\times ${inputs.x2}) + ${weights.bh1.toFixed(4)} = ${currentFwd.zh1.toFixed(6)}$$`}</MathText>
                  </p>
                  <p className="text-cyan-400 font-bold">
                    Sigmoid: ah1 = 1 / (1 + e^-{currentFwd.zh1.toFixed(4)}) = {currentFwd.ah1.toFixed(6)}
                  </p>
                </div>

                <div className="bg-[#17171c] p-4 rounded-lg border border-[#27272f] space-y-2">
                  <span className="text-gray-400 font-bold block">2. Backward Pass: คำนวณ Error Signal (δh1) สำหรับ Hidden Node</span>
                  <MathText>
                    {"$$\\delta_{h1} = a_{h1} \\cdot (1 - a_{h1}) \\cdot (\\delta_o \\cdot w_{h1\\_o})$$"}
                  </MathText>
                  <p className="text-gray-300">
                    = {currentFwd.ah1.toFixed(4)} &times; (1 - {currentFwd.ah1.toFixed(4)}) &times; ({currentDerivs.deltas.delta_o.toFixed(5)} &times; {weights.wh1_o.toFixed(4)})
                  </p>
                  <p className="text-amber-400 font-bold">
                    &rarr; δh1 = {currentDerivs.deltas.delta_h1.toFixed(6)}
                  </p>
                </div>

                <div className="bg-[#17171c] p-4 rounded-lg border border-[#27272f] space-y-2">
                  <span className="text-gray-400 font-bold block">3. การปรับค่าน้ำหนัก w11 และ w21</span>
                  <p className="text-gray-300">
                    &Delta;w11 = &eta; &times; &delta;h1 &times; x1 = {learningRate} &times; {currentDerivs.deltas.delta_h1.toFixed(5)} &times; {inputs.x1} = <strong className="text-emerald-400">+{currentDerivs.changes.dW_11.toFixed(6)}</strong>
                  </p>
                  <p className="text-gray-200">
                    w11(new) = {weights.w11.toFixed(5)} + ({currentDerivs.changes.dW_11.toFixed(5)}) = <strong className="text-white">{currentDerivs.newW.w11.toFixed(5)}</strong>
                  </p>
                  <p className="text-gray-300 mt-2">
                    &Delta;w21 = &eta; &times; &delta;h1 &times; x2 = {learningRate} &times; {currentDerivs.deltas.delta_h1.toFixed(5)} &times; {inputs.x2} = <strong className="text-emerald-400">+{currentDerivs.changes.dW_21.toFixed(6)}</strong>
                  </p>
                  <p className="text-gray-200">
                    w21(new) = {weights.w21.toFixed(5)} + ({currentDerivs.changes.dW_21.toFixed(5)}) = <strong className="text-white">{currentDerivs.newW.w21.toFixed(5)}</strong>
                  </p>
                </div>
              </div>
            )}

            {/* DETAIL: HIDDEN NODE H2 */}
            {selectedNode === 'h2' && (
              <div className="space-y-4 font-mono text-xs">
                <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg text-purple-200">
                  <strong>โหนดชั้นซ่อน 2 (Hidden Node h2):</strong> รับสัญญาณจากอินพุต x1, x2 คำนวณ Net Input zh2 และ Activation ah2 จากนั้นรับ Error Signal ย้อนกลับมาจากชั้นเอาต์พุตเพื่อปรับ <MathText>{"$w_{12}, w_{22}, b_{h2}$"}</MathText>
                </div>

                <div className="bg-[#17171c] p-4 rounded-lg border border-[#27272f] space-y-2">
                  <span className="text-gray-400 font-bold block">1. Forward Pass: Net Input (zh2) & Activation (ah2)</span>
                  <MathText>
                    {"$$z_{h2} = (w_{12} \\cdot x_1) + (w_{22} \\cdot x_2) + b_{h2}$$"}
                  </MathText>
                  <p className="text-gray-300">
                    แทนค่า: <MathText>{`$$z_{h2} = (${weights.w12.toFixed(4)} \\times ${inputs.x1}) + (${weights.w22.toFixed(4)} \\times ${inputs.x2}) + ${weights.bh2.toFixed(4)} = ${currentFwd.zh2.toFixed(6)}$$`}</MathText>
                  </p>
                  <p className="text-cyan-400 font-bold">
                    Sigmoid: ah2 = 1 / (1 + e^-{currentFwd.zh2.toFixed(4)}) = {currentFwd.ah2.toFixed(6)}
                  </p>
                </div>

                <div className="bg-[#17171c] p-4 rounded-lg border border-[#27272f] space-y-2">
                  <span className="text-gray-400 font-bold block">2. Backward Pass: คำนวณ Error Signal (δh2)</span>
                  <MathText>
                    {"$$\\delta_{h2} = a_{h2} \\cdot (1 - a_{h2}) \\cdot (\\delta_o \\cdot w_{h2\\_o})$$"}
                  </MathText>
                  <p className="text-gray-300">
                    = {currentFwd.ah2.toFixed(4)} &times; (1 - {currentFwd.ah2.toFixed(4)}) &times; ({currentDerivs.deltas.delta_o.toFixed(5)} &times; {weights.wh2_o.toFixed(4)})
                  </p>
                  <p className="text-amber-400 font-bold">
                    &rarr; δh2 = {currentDerivs.deltas.delta_h2.toFixed(6)}
                  </p>
                </div>

                <div className="bg-[#17171c] p-4 rounded-lg border border-[#27272f] space-y-2">
                  <span className="text-gray-400 font-bold block">3. การปรับค่าน้ำหนัก w12 และ w22</span>
                  <p className="text-gray-300">
                    &Delta;w12 = &eta; &times; &delta;h2 &times; x1 = {learningRate} &times; {currentDerivs.deltas.delta_h2.toFixed(5)} &times; {inputs.x1} = <strong className="text-emerald-400">+{currentDerivs.changes.dW_12.toFixed(6)}</strong>
                  </p>
                  <p className="text-gray-200">
                    w12(new) = {weights.w12.toFixed(5)} + ({currentDerivs.changes.dW_12.toFixed(5)}) = <strong className="text-white">{currentDerivs.newW.w12.toFixed(5)}</strong>
                  </p>
                  <p className="text-gray-300 mt-2">
                    &Delta;w22 = &eta; &times; &delta;h2 &times; x2 = {learningRate} &times; {currentDerivs.deltas.delta_h2.toFixed(5)} &times; {inputs.x2} = <strong className="text-emerald-400">+{currentDerivs.changes.dW_22.toFixed(6)}</strong>
                  </p>
                  <p className="text-gray-200">
                    w22(new) = {weights.w22.toFixed(5)} + ({currentDerivs.changes.dW_22.toFixed(5)}) = <strong className="text-white">{currentDerivs.newW.w22.toFixed(5)}</strong>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Epoch Training Progress & History Log */}
      <div className="border border-[#27272f] bg-[#121216] p-6 rounded-xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#27272f] pb-3">
          <h3 className="font-heading text-sm text-white uppercase tracking-wider flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-emerald-400" />
            <span>ประวัติการลดลงของค่าความคลาดเคลื่อน (Loss vs Epoch History)</span>
          </h3>
          <span className="badge-mono text-xs text-gray-400">บันทึกล่าสุด {history.length} รายการ</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full font-mono text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-[#27272f] text-gray-500 uppercase text-[10px]">
                <th className="py-2 px-3">Epoch</th>
                <th className="py-2 px-3">Predicted (ŷ)</th>
                <th className="py-2 px-3">Target</th>
                <th className="py-2 px-3">Error (t - ŷ)</th>
                <th className="py-2 px-3">Loss (MSE)</th>
                <th className="py-2 px-3">ความคืบหน้า</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27272f]/40">
              {history.map((h, i) => (
                <tr key={i} className="hover:bg-[#17171c]/60 transition">
                  <td className="py-2 px-3 font-bold text-purple-400">#{h.epoch}</td>
                  <td className="py-2 px-3 text-white font-bold">{h.y.toFixed(5)}</td>
                  <td className="py-2 px-3 text-emerald-400">{target}</td>
                  <td className="py-2 px-3 text-rose-300">{h.error.toFixed(5)}</td>
                  <td className="py-2 px-3 text-amber-300 font-bold">{h.loss.toFixed(6)}</td>
                  <td className="py-2 px-3">
                    <div className="w-24 bg-[#1e1e24] h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-emerald-500 h-full"
                        style={{ width: `${Math.min(100, Math.max(5, (1 - Math.min(1, h.loss)) * 100))}%` }}
                      ></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
