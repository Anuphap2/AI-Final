import { test, expect } from '@playwright/test';

test.describe('AI Final Review & Exam Suite - Comprehensive E2E Tests', () => {

  test('1. Overview Page & Global Header', async ({ page }) => {
    await page.goto('/');

    // Check Title & Logo
    await expect(page).toHaveTitle(/AI MASTERY/);
    await expect(page.locator('text=AI MASTERY').first()).toBeVisible();

    // Check all main tabs are present
    const tabs = ['ภาพรวมวิชา', 'ทฤษฎี & สูตร', 'แล็บ Backprop', 'ห้องทดลองสูตร', 'แบบฝึกหัดย่อย', 'ข้อสอบปลายภาค (75 ข้อ)'];
    for (const tab of tabs) {
      await expect(page.locator(`nav button:has-text("${tab}")`)).toBeVisible();
    }

    // Check 6 unit cards in overview
    await expect(page.locator('text=โครงสร้างเนื้อหา 6 หน่วยการเรียนรู้')).toBeVisible();
    await expect(page.locator('text=การรู้จำแบบและการรับรู้ของเครื่องจักร').first()).toBeVisible();
    await expect(page.locator('text=โครงข่ายประสาทเทียมและการเรียนรู้เชิงลึก').first()).toBeVisible();
  });

  test('2. Lessons & KaTeX Mathematical Rendering', async ({ page }) => {
    await page.goto('/');

    // Click on Lessons tab
    await page.click('nav button:has-text("ทฤษฎี & สูตร")');

    // Verify Chapter list and unit reader
    await expect(page.locator('text=สารบัญ 6 บทเรียน AI')).toBeVisible();
    await expect(page.locator('text=Pattern Recognition Fundamentals').first()).toBeVisible();

    // Verify KaTeX math elements are rendered (not raw code)
    const katexElements = page.locator('.katex');
    await expect(katexElements.first()).toBeVisible();
    const count = await katexElements.count();
    expect(count).toBeGreaterThan(5);

    // Switch to Unit 5 (Neural Networks)
    await page.click('button:has-text("Chapter 14")');
    await expect(page.locator('text=Artificial Neural Networks & Deep Learning').first()).toBeVisible();
    await expect(page.locator('text=ฟังก์ชันกระตุ้น (Activation Functions)').first()).toBeVisible();
  });

  test('3. Neural Network Backprop Lab (Epochs & Node Math)', async ({ page }) => {
    await page.goto('/');

    // Click on Backprop Lab tab
    await page.click('nav button:has-text("แล็บ Backprop")');

    // Verify visual diagram nodes exist
    await expect(page.locator('text=Node i1').first()).toBeVisible();
    await expect(page.locator('text=Node i2').first()).toBeVisible();
    await expect(page.locator('text=Node h1').first()).toBeVisible();
    await expect(page.locator('text=Node h2').first()).toBeVisible();
    await expect(page.locator('text=Node o1').first()).toBeVisible();

    // Verify weight lines and badges in SVG architecture diagram
    await expect(page.locator('text=w11:').first()).toBeVisible();
    await expect(page.locator('text=w12:').first()).toBeVisible();
    await expect(page.locator('text=w21:').first()).toBeVisible();
    await expect(page.locator('text=w22:').first()).toBeVisible();
    await expect(page.locator('text=wh1_o:').first()).toBeVisible();
    await expect(page.locator('text=wh2_o:').first()).toBeVisible();
    await expect(page.locator('text=bh1:').first()).toBeVisible();
    await expect(page.locator('text=bh2:').first()).toBeVisible();
    await expect(page.locator('text=bo:').first()).toBeVisible();

    // Verify initial Epoch #0
    await expect(page.locator('text=Epoch #0').first()).toBeVisible();

    // Click "ฝึก 1 Epoch"
    await page.click('button:has-text("ฝึก 1 Epoch")');
    await expect(page.locator('text=Epoch #1').first()).toBeVisible();

    // Click "ฝึก +10 Epochs"
    await page.click('button:has-text("ฝึก +10 Epochs")');
    await expect(page.locator('text=Epoch #11').first()).toBeVisible();

    // Inspect Hidden Node h1 math breakdown
    await page.click('button:has-text("Hidden Node h1")');
    await expect(page.locator('text=Forward Pass: Net Input (zh1)').first()).toBeVisible();
    await expect(page.locator('text=Backward Pass: คำนวณ Error Signal').first()).toBeVisible();

    // Inspect Hidden Node h2
    await page.click('button:has-text("Hidden Node h2")');
    await expect(page.locator('text=Forward Pass: Net Input (zh2)').first()).toBeVisible();

    // Check Loss vs Epoch table
    await expect(page.locator('text=ประวัติการลดลงของค่าความคลาดเคลื่อน')).toBeVisible();
    await expect(page.locator('td:has-text("#11")').first()).toBeVisible();
  });

  test('3.1 Theme Toggle Functionality (Light / Dark mode)', async ({ page }) => {
    await page.goto('/');

    // Check default is light theme
    const html = page.locator('html');
    await expect(html).toHaveClass(/light/);

    // Click theme toggle button to switch to dark
    const themeBtn = page.locator('button:has-text("ธีมสว่าง (Light)"), button:has-text("Light")');
    await expect(themeBtn).toBeVisible();
    await themeBtn.click();

    // Verify dark class applied
    await expect(html).toHaveClass(/dark/);
    await expect(page.locator('text=ธีมมืด (Dark)')).toBeVisible();

    // Toggle back to light mode
    await page.click('button:has-text("ธีมมืด (Dark)")');
    await expect(html).toHaveClass(/light/);
    await expect(page.locator('text=ธีมสว่าง (Light)')).toBeVisible();
  });

  test('3.2 Font Size Adjuster (A / A+ / A++) & Rich Lesson Formula Cards', async ({ page }) => {
    await page.goto('/');

    const html = page.locator('html');

    // Default font size class should be font-size-normal
    await expect(html).toHaveClass(/font-size-normal/);

    // Click font size 'A+'
    const btnLarge = page.locator('button:has-text("A+"):not(:has-text("A++"))');
    await expect(btnLarge).toBeVisible();
    await btnLarge.click();
    await expect(html).toHaveClass(/font-size-large/);

    // Click font size 'A++'
    const btnXLarge = page.locator('button:has-text("A++")');
    await expect(btnXLarge).toBeVisible();
    await btnXLarge.click();
    await expect(html).toHaveClass(/font-size-xlarge/);

    // Click back to normal 'A'
    const btnNormal = page.locator('button:text-is("A")');
    await expect(btnNormal).toBeVisible();
    await btnNormal.click();
    await expect(html).toHaveClass(/font-size-normal/);

    // Navigate to Lessons tab and verify Thai formula translations are present
    await page.click('nav button:has-text("ทฤษฎี & สูตร")');
    await expect(page.locator('text=ถอดรหัสสูตรภาษาไทย').first()).toBeVisible();
    await expect(page.locator('text=ความหมายของตัวแปร').first()).toBeVisible();
  });

  test('4. Interactive Calculators Lab - Step-by-Step KaTeX Proofs for All 5 Formulas', async ({ page }) => {
    await page.goto('/');

    // Click on Calculators Lab tab
    await page.click('nav button:has-text("ห้องทดลองสูตร")');

    // 1) Test File Size Calculator & Step-by-Step Math
    await expect(page.locator('text=พารามิเตอร์ขนาดภาพ')).toBeVisible();
    await page.click('button:has-text("Full HD")');
    await page.click('text=24-bit True Color');
    await expect(page.locator('text=5.93').first()).toBeVisible(); // ~5.93 MB

    // Verify all 4 calculation steps are visible
    await expect(page.locator('text=1. สิ่งที่โจทย์กำหนดให้ (Given Variables):')).toBeVisible();
    await expect(page.locator('text=คำนวณจำนวนพิกเซลทั้งหมด (Total Pixels)')).toBeVisible();
    await expect(page.locator('text=คำนวณขนาดไฟล์ในหน่วยบิต (Size in Bits)')).toBeVisible();
    await expect(page.locator('text=แปลงเป็นหน่วยไบต์ (Size in Bytes โดยนำไปหารด้วย 8)')).toBeVisible();
    await expect(page.locator('text=แปลงเป็นกิโลไบต์ (KB) และเมกะไบต์ (MB)')).toBeVisible();
    await expect(page.locator('text=จุดระวังในข้อสอบ:')).toBeVisible();

    // 2) Test Nyquist Sampling Calculator
    await page.click('button:has-text("Nyquist Sampling")');
    await expect(page.locator('text=พารามิเตอร์สัญญาณ & การสุ่มตัวอย่าง')).toBeVisible();
    await expect(page.locator('text=1. ตัวแปรที่โจทย์กำหนด (Given):')).toBeVisible();
    await expect(page.locator('text=Nyquist Rate').first()).toBeVisible();
    await expect(page.locator('text=ตรวจสอบเงื่อนไขความถี่การสุ่มตัวอย่าง')).toBeVisible();
    await expect(page.locator('text=Sampling Period').first()).toBeVisible();

    // 3) Test Uniform Quantization Calculator
    await page.click('button:has-text("Uniform Quantization")');
    await expect(page.locator('text=ดัชนีระดับขั้นที่แปลงได้')).toBeVisible();
    await expect(page.locator('text=ขั้นตอนการคำนวณตามสูตรสไลด์ 13-4 หน้า 6')).toBeVisible();
    await expect(page.locator('text=ขั้นที่ 1: คำนวณจำนวนระดับควอนไทซ์ทั้งหมด')).toBeVisible();
    await expect(page.locator('text=ขั้นที่ 2: คำนวณอัตราส่วนตำแหน่งของสัญญาณ')).toBeVisible();
    await expect(page.locator('text=ขั้นที่ 3: สเกลค่าเข้าสู่ช่วงดัชนีระดับขั้นเต็ม')).toBeVisible();
    await expect(page.locator('text=ขั้นที่ 4: ปัดเศษเป็นจำนวนเต็ม')).toBeVisible();

    // 4) Test Brightness & Contrast 2x2 Calculator
    await page.click('button:has-text("Brightness & Contrast")');
    await expect(page.locator('text=ภาพจำลองขนาด 2x2 พิกเซล')).toBeVisible();
    await expect(page.locator('text=ขั้นที่ 1: คำนวณค่าเฉลี่ยความสว่าง (Mean Brightness: B)')).toBeVisible();
    await expect(page.locator('text=ขั้นที่ 2: คำนวณผลต่างกำลังสองของแต่ละพิกเซลกับค่าเฉลี่ย')).toBeVisible();
    await expect(page.locator('text=ขั้นที่ 3: คำนวณคอนทราสต์ (Contrast: C) จาก Standard Deviation')).toBeVisible();

    // 5) Test Perceptron & Sigmoid Calculator
    await page.click('button:has-text("Perceptron & Sigmoid")');
    await expect(page.locator('text=พารามิเตอร์นิวรอน (Inputs, Weights, Bias)')).toBeVisible();
    await expect(page.locator('text=ขั้นที่ 1: รวมสัญญาณถ่วงน้ำหนัก (Net Input: z)')).toBeVisible();
    await expect(page.locator('text=ขั้นที่ 2: แปลงค่าผ่านฟังก์ชันกระตุ้น Sigmoid')).toBeVisible();
    await expect(page.locator('text=ขั้นที่ 3: คำนวณอนุพันธ์ของ Sigmoid สำหรับ Backpropagation')).toBeVisible();
  });

  test('5. Unit Practice Quizzes with Instant Feedback', async ({ page }) => {
    await page.goto('/');

    // Click on Unit Quizzes tab
    await page.click('nav button:has-text("แบบฝึกหัดย่อย")');

    // Verify Quiz header
    await expect(page.locator('text=UNIT PRACTICE DRILL')).toBeVisible();
    await expect(page.locator('text=ข้อที่ 1 จาก')).toBeVisible();

    // Click hint button
    await page.click('button:has-text("ขอคำใบ้ (Hint)")');
    await expect(page.locator('text=คำใบ้:').first()).toBeVisible();

    // Answer option B (Option index 1: "5 หน่วย" is correct for u1-q1)
    await page.click('button:has-text("5 หน่วย")');

    // Verify explanation box appears
    await expect(page.locator('text=คำอธิบายเฉลยและวิธีคิดอย่างละเอียด:')).toBeVisible();
    await expect(page.locator('text=ถูก: 1/1')).toBeVisible();
  });

  test('6. Final Examination 75 Questions & Score Analytics', async ({ page }) => {
    await page.goto('/');

    // Click on Final Exam tab
    await page.click('nav button:has-text("ข้อสอบปลายภาค (75 ข้อ)")');

    // Verify Exam header & Timer
    await expect(page.locator('text=COMPREHENSIVE FINAL EXAM')).toBeVisible();
    await expect(page.locator('text=75 ข้อ').first()).toBeVisible();

    // Verify question grid has buttons
    await expect(page.locator('button:has-text("1")').first()).toBeVisible();

    // Answer Question 1
    const firstOption = page.locator('button').filter({ hasText: /Data Acquisition/ }).first();
    await firstOption.click();

    // Flag Question 1
    await page.click('button:has-text("ปักธงทบทวน")');
    await expect(page.locator('text=ปักธงไว้แล้ว')).toBeVisible();

    // Jump to Question 75 in the grid
    await page.locator('div.grid button').filter({ hasText: /^75$/ }).click();
    await expect(page.locator('text=ข้อ 75 จาก 75')).toBeVisible();

    // Click "ส่งข้อสอบ"
    await page.click('button:has-text("ส่งข้อสอบ")');

    // Confirm submit in modal
    await expect(page.locator('text=ยืนยันการส่งข้อสอบ?')).toBeVisible();
    await page.click('button:has-text("ยืนยันส่งข้อสอบทันที")');

    // Verify Score Report Modal appears
    await expect(page.locator('text=รายงานผลการสอบปลายภาค (Final Exam Analytics)')).toBeVisible();
    await expect(page.locator('text=คะแนนวิเคราะห์รายบทเรียน (Topic Mastery):')).toBeVisible();
    await expect(page.locator('text=เฉลยคำตอบพร้อมคำอธิบายละเอียดครบทุกข้อ')).toBeVisible();

    // Test filter "ข้อที่ตอบผิด"
    await page.click('button:has-text("ข้อที่ตอบผิด")');
    await expect(page.locator('text=แสดง').first()).toBeVisible();
  });

  test('6.1 Final Examination UX Improvements (Jump to Unanswered & Keyboard Navigation)', async ({ page }) => {
    await page.goto('/');

    // Navigate to Exam tab
    await page.click('nav button:has-text("ข้อสอบปลายภาค (75 ข้อ)")');

    // Check shortcuts badge is visible
    await expect(page.locator('text=คีย์บอร์ดลัด:')).toBeVisible();

    // Verify currently on Question 1
    await expect(page.locator('text=ข้อ 1 จาก 75')).toBeVisible();

    // Select option using keyboard shortcut '1' (or 'a')
    await page.keyboard.press('1');

    // Navigate to Question 2 using keyboard 'ArrowRight'
    await page.keyboard.press('ArrowRight');
    await expect(page.locator('text=ข้อ 2 จาก 75')).toBeVisible();

    // Answer Question 2 using keyboard '2'
    await page.keyboard.press('2');

    // Flag Question 2 using keyboard 'f'
    await page.keyboard.press('f');
    await expect(page.locator('text=ปักธงไว้แล้ว')).toBeVisible();

    // Jump to Question 10 via grid
    await page.locator('div.grid button').filter({ hasText: /^10$/ }).click();
    await expect(page.locator('text=ข้อ 10 จาก 75')).toBeVisible();

    // Click "ข้อที่ยังไม่ตอบ ⚡" button -> should jump to next unanswered (Question 11)!
    const jumpBtn = page.locator('button:has-text("ข้อที่ยังไม่ตอบ")');
    await expect(jumpBtn).toBeVisible();
    await jumpBtn.click();

    // Confirm it jumped to Question 11
    await expect(page.locator('text=ข้อ 11 จาก 75')).toBeVisible();
  });

});

