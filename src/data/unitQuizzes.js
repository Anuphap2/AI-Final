// Unit Practice Quizzes with instant feedback, hints, and explanations
export const unitQuizzes = {
  "unit-1": {
    unitTitle: "Unit 1: Pattern Recognition & Machine Perception",
    questions: [
      {
        id: "u1-q1",
        question: "เวกเตอร์คุณลักษณะ (Feature Vector) จุด P มีพิกัด (3, 4) และจุดกำเนิด O มีพิกัด (0, 0) ระยะห่างยูคลิดระหว่างจุด P กับจุดกำเนิดมีค่าเท่าใด?",
        options: ["7 หน่วย", "5 หน่วย", "12 หน่วย", "25 หน่วย"],
        correctAnswer: 1,
        hint: "ใช้ทฤษฎีบทพีทาโกรัส: d = sqrt(x^2 + y^2)",
        explanation: "d = sqrt(3^2 + 4^2) = sqrt(9 + 16) = sqrt(25) = 5 หน่วย"
      },
      {
        id: "u1-q2",
        question: "หากข้อมูลมีค่า x = 80 จากช่วงข้อมูลเดิมต่ำสุด 20 และสูงสุด 120 เมื่อทำ Min-Max Normalization ให้อยู่ในช่วง [0, 1] จะได้ค่าเท่าใด?",
        options: ["0.50", "0.60", "0.75", "0.80"],
        correctAnswer: 1,
        hint: "สูตร: (x - min) / (max - min)",
        explanation: "x' = (80 - 20) / (120 - 20) = 60 / 100 = 0.60"
      },
      {
        id: "u1-q3",
        question: "การแบ่งกลุ่มลูกค้าตามพฤติกรรมการซื้อโดยไม่มีป้ายกำกับเฉลย (Labels) ล่วงหน้า จัดเป็นการเรียนรู้แบบใด?",
        options: ["Supervised Learning", "Unsupervised Learning", "Reinforcement Learning", "Semi-supervised Learning"],
        correctAnswer: 1,
        hint: "ไม่มีครูผู้สอนหรือเฉลยคำตอบ (No ground truth labels)",
        explanation: "Unsupervised Learning เช่น การทำ Clustering มุ่งค้นหาโครงสร้างและรูปแบบที่ซ่อนอยู่ในข้อมูลโดยไม่ต้องมีป้ายกำกับ"
      }
    ]
  },
  "unit-2": {
    unitTitle: "Unit 2: Robotics & Autonomous Systems",
    questions: [
      {
        id: "u2-q1",
        question: "การหมุน 3 ทิศทางในปริภูมิ 3 มิติ (Orientation) ประกอบด้วยแกนใดบ้าง?",
        options: ["X, Y, Z", "Roll, Pitch, Yaw", "Forward, Backward, Lateral", "Alpha, Beta, Gamma"],
        correctAnswer: 1,
        hint: "ศัพท์การบินและการควบคุมการหมุนรอบแกน",
        explanation: "Roll คือการหมุนรอบแกนตามยาว (แกน X), Pitch คือการเงย-ก้ม (แกน Y), Yaw คือการหันซ้าย-ขวา (แกน Z)"
      },
      {
        id: "u2-q2",
        question: "ในสถาปัตยกรรม Subsumption Architecture เมื่อเลเยอร์ความปลอดภัยตรวจพบสิ่งกีดขวาง จะเกิดอะไรขึ้น?",
        options: [
            "เลเยอร์ระดับต่ำจะส่งข้อความแจ้งเตือนผู้ใช้แล้วหยุดทำงาน",
            "เลเยอร์ระดับล่าง (หลบสิ่งกีดขวาง) จะระงับหรือยับยั้ง (Suppress) เลเยอร์ระดับสูงทันที เพื่อความปลอดภัย",
            "ระบบจะรีบูตใหม่",
            "หุ่นยนต์จะสร้างแผนที่โลก 3 มิติใหม่ทั้งหมด"
        ],
        correctAnswer: 1,
        hint: "พฤติกรรมความปลอดภัยมีความสำคัญสูงสุดใน Reactive Control",
        explanation: "Subsumption ทำงานเป็นชั้นๆ โดยเลเยอร์หลบสิ่งกีดขวางสามารถ Inhibit/Suppress เลเยอร์ระดับสูงกว่าได้ทันทีเพื่อหลบหลีกแบบทันด่วน"
      },
      {
        id: "u2-q3",
        question: "หุ่นยนต์ล้อมีรัศมีล้อ 0.2 เมตร หมุนด้วยความเร็วเชิงมุม 10 rad/s ความเร็วเชิงเส้น (v) มีค่าเท่าใด?",
        options: ["2.0 m/s", "0.5 m/s", "20 m/s", "1.0 m/s"],
        correctAnswer: 0,
        hint: "สูตร: v = r * w",
        explanation: "v = 0.2 * 10 = 2.0 เมตร/วินาที"
      }
    ]
  },
  "unit-3": {
    unitTitle: "Unit 3: Vision Physics & Color Spaces",
    questions: [
      {
        id: "u3-q1",
        question: "ตามนุษย์มีความไวต่อแสงสูงสุด (Peak Sensitivity) ที่ความยาวคลื่นประมาณเท่าใดในเวลากลางวัน?",
        options: ["400 nm (สีม่วง)", "555 nm (สีเขียวตองอ่อน)", "700 nm (สีแดง)", "850 nm (อินฟราเรด)"],
        correctAnswer: 1,
        hint: "อยู่ในย่านแสงสีเขียวแกมเหลือง",
        explanation: "Peak sensitivity ของเซลล์รูปกรวยในดวงตามนุษย์อยู่ที่ประมาณ 555 nm จึงเป็นเหตุผลที่สีเขียวมีน้ำหนักสูงสุดในสูตรความสว่าง"
      },
      {
        id: "u3-q2",
        question: "พิกเซลสีมีค่า RGB = (100, 100, 100) ค่าระดับความสว่างสีเทา (Luminance: Y) มีค่าเท่าใด?",
        options: ["50", "100", "150", "300"],
        correctAnswer: 1,
        hint: "Y = 0.299R + 0.587G + 0.114B โดยที่ 0.299 + 0.587 + 0.114 = 1.0",
        explanation: "Y = 0.299(100) + 0.587(100) + 0.114(100) = 100 * (0.299 + 0.587 + 0.114) = 100 * 1.0 = 100"
      },
      {
        id: "u3-q3",
        question: "ระบบสีใดเกิดจากการผสมของแสงและให้สีขาวเมื่อความเข้มแสงทุกสีสูงสุด?",
        options: ["CMYK", "RGB (Additive Color)", "Pantone", "Grayscale"],
        correctAnswer: 1,
        hint: "ใช้ในจอคอมพิวเตอร์และโทรทัศน์",
        explanation: "Additive Color (RGB) รวมแสงสีแดง เขียว น้ำเงิน ได้แสงขาวบริสุทธิ์"
      }
    ]
  },
  "unit-4": {
    unitTitle: "Unit 4: Digital Image Processing, Sampling & Quantization",
    questions: [
      {
        id: "u4-q1",
        question: "ภาพขนาด 1000 x 1000 พิกเซล ในระบบ Grayscale 8 บิต (1 Byte ต่อพิกเซล) มีขนาดไฟล์กี่ Megabytes (MB)?",
        options: ["1.00 MB", "0.954 MB", "8.00 MB", "0.12 MB"],
        correctAnswer: 1,
        hint: "1,000,000 Bytes / (1024 * 1024)",
        explanation: "1,000,000 / 1,048,576 = 0.95367 MB (ประมาณ 0.954 MB)"
      },
      {
        id: "u4-q2",
        question: "สัญญาณภาพมีความถี่สูงสุด 30 kHz ตามทฤษฎีไนควิสต์ ความถี่สุ่มตัวอย่างต่ำสุดต้องเป็นเท่าใด?",
        options: ["15 kHz", "30 kHz", "60 kHz", "120 kHz"],
        correctAnswer: 2,
        hint: "fs >= 2 * fc",
        explanation: "fs >= 2 * 30 kHz = 60 kHz"
      },
      {
        id: "u4-q3",
        question: "ภาพขนาด 2x2 พิกเซล มีค่า [ [0, 0], [100, 100] ] ค่าเฉลี่ยความสว่าง B มีค่าเท่าใด?",
        options: ["25", "50", "100", "0"],
        correctAnswer: 1,
        hint: "(0 + 0 + 100 + 100) / 4",
        explanation: "B = 200 / 4 = 50"
      }
    ]
  },
  "unit-5": {
    unitTitle: "Unit 5: Artificial Neural Networks & Deep Learning",
    questions: [
      {
        id: "u5-q1",
        question: "นิวรอนมี 2 ขาเข้า: x1=1, x2=2 โดยมีน้ำหนัก w1=0.5, w2=0.5 และ bias b= -0.5 ผลรวมสุทธิ (z) มีค่าเท่าใด?",
        options: ["0.5", "1.0", "1.5", "0.0"],
        correctAnswer: 1,
        hint: "z = w1*x1 + w2*x2 + b",
        explanation: "z = (0.5 * 1) + (0.5 * 2) - 0.5 = 0.5 + 1.0 - 0.5 = 1.0"
      },
      {
        id: "u5-q2",
        question: "ทำไม Single-Layer Perceptron จึงไม่สามารถแยกแยะปัญหา XOR ได้?",
        options: [
          "เพราะ XOR มีจำนวนข้อมูลมากเกินไป",
          "เพราะข้อมูลของ XOR ไม่สามารถแบ่งแยกได้ด้วยเส้นตรงเส้นเดียว (Non-linearly separable)",
          "เพราะ XOR ต้องการเลขทศนิยม",
          "เพราะ Perceptron ไม่มีค่าน้ำหนัก"
        ],
        correctAnswer: 1,
        hint: "Minsky & Papert (1969) Proof",
        explanation: "XOR ต้องใช้เส้นแบ่ง 2 เส้น จึงต้องใช้ Multi-Layer Perceptron (MLP) ที่มี Hidden Layer"
      },
      {
        id: "u5-q3",
        question: "ถ้าค่าเอาต์พุตจากฟังก์ชัน Sigmoid คือ o = 0.5 อนุพันธ์ f'(z) = o * (1 - o) มีค่าเท่าใด?",
        options: ["0.25", "0.50", "0.00", "1.00"],
        correctAnswer: 0,
        hint: "0.5 * (1 - 0.5)",
        explanation: "f'(z) = 0.5 * 0.5 = 0.25 (จุดที่มีความชันสูงสุดของกราฟ Sigmoid)"
      }
    ]
  },
  "unit-6": {
    unitTitle: "Unit 6: Expert Systems & Knowledge Engineering",
    questions: [
      {
        id: "u6-q1",
        question: "การอนุมานแบบเริ่มต้นจากข้อเท็จจริงจริง (Data-driven) แล้วจับคู่กับกฎ IF-THEN เพื่อให้ได้ข้อสรุปใหม่เรียกว่าอะไร?",
        options: ["Backward Chaining", "Forward Chaining", "Depth-First Search", "Genetic Algorithm"],
        correctAnswer: 1,
        hint: "เริ่มต้นจาก Data ไปหา Conclusion",
        explanation: "Forward Chaining เริ่มจากข้อเท็จจริง (Facts) ใน Working Memory แล้วยิงกฎ (Fire rules) เพื่อสร้างข้อสรุปใหม่"
      },
      {
        id: "u6-q2",
        question: "ระบบ MYCIN ถูกพัฒนาขึ้นเพื่อแก้ปัญหาด้านใด?",
        options: ["การเล่นหมากรุกสากล", "การวินิจฉัยโรคติดเชื้อในกระแสเลือดและแนะนำยาปฏิชีวนะ", "การขับรถยนต์ไร้คนขับ", "การแปลภาษาอัตโนมัติ"],
        correctAnswer: 1,
        hint: "พัฒนาที่ Stanford ในยุค 1970s สำหรับการแพทย์",
        explanation: "MYCIN เป็นระบบผู้เชี่ยวชาญทางการแพทย์ที่โด่งดังมากในการวินิจฉัยเชื้อแบคทีเรียและคำนวณขนาดยา"
      },
      {
        id: "u6-q3",
        question: "ส่วนประกอบใดของระบบผู้เชี่ยวชาญที่ทำหน้าที่อธิบายผู้ใช้ว่า 'ได้ข้อสรุปนี้มาได้อย่างไร (How?)'?",
        options: ["Inference Engine", "Explanation Subsystem", "Knowledge Base", "Compiler"],
        correctAnswer: 1,
        hint: "ให้เหตุผลและความโปร่งใสแก่ผู้ใช้",
        explanation: "Explanation Subsystem (ระบบอธิบาย) เป็นหัวใจสำคัญที่สร้างความเชื่อมั่นแก่ผู้ใช้ โดยสามารถแจกแจงกฎและตรรกะที่นำไปสู่ผลลัพธ์ได้"
      }
    ]
  }
};
