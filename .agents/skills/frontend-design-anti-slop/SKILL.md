---
name: frontend-design-anti-slop
description: "Craft distinctive, intentional visual design and eliminate generic AI slop traits."
---

# Frontend Design & Anti-AI-Slop

## Contract

Apply this skill only when the task matches: Frontend Design & Anti-AI-Slop. Keep the work within the requested scope and do not invent missing facts.

## When to Use

Craft distinctive, intentional visual design and eliminate generic AI slop traits.

## Inputs

- The user goal, acceptance criteria, and constraints.
- The relevant repository files, existing conventions, commands, and test results.
- Any required tool capability, permission, or external dependency.

## Constraints

- Do not guess when a required input, contract, or project convention is unknown.
- Preserve existing behavior outside the requested scope and avoid unnecessary abstraction.
- Never hide failures by weakening validation, tests, or safety checks.
- If a shortcut creates technical debt, record its impact and the condition for revisiting it.

## Procedure

1. Confirm that the task matches this skill and identify the expected outcome.
2. Inspect the relevant files, dependencies, interfaces, and existing checks before changing anything.
3. Apply the guidance below using the smallest maintainable change.
4. Run the most relevant verification commands and inspect the final diff.
5. Report the result, evidence, unresolved risks, and any technical debt.

## Output

- Provide a concise summary of the change or decision.
- Include verification commands and their results.
- State assumptions, limitations, risks, and follow-up work when applicable.

## Verification

- Verify correctness, edge cases, compatibility, security, performance, and operational impact relevant to the task.
- If verification cannot be completed, explain why and do not claim success.

## Example

Input: A task that requires frontend design & anti-ai-slop.
Expected: Apply the procedure and constraints, produce evidence, and respond to the user in natural Thai when the user communicates in Thai.

## Guidance

# Frontend Design & Anti-AI-Slop

ทำหน้าที่เป็น Design Director ผู้เชี่ยวชาญ สร้าง UI/UX ที่โดดเด่น มีเอกลักษณ์เฉพาะตัว (Distinctive Point of View) และขจัด "AI Slop" ทุกรูปแบบ

## 1. ข้อห้ามเด็ดขาด (Strict AI Slop Bans)

หลีกเลี่ยงสไตล์สำเร็จรูปที่ AI มักสร้างโดยอัตโนมัติ:
- ❌ **ห้ามใช้คู่สีคลีเช่ยอดฮิตของ AI:**
  - พื้นหลังสีครีมอุ่น (`#F4F1EA`) + หัวข้อ Serif คมจัด + สีส้มอิฐ/ดินเผา (`#D97757`) โดยไม่มีเหตุผลชัดเจน
  - ธีมมืดพื้นหลังดำสนิทที่แปะ Neon Acid-Green หรือ AI Purple/Pink Gradients
- ❌ **ห้ามใช้การ์ดกล่องมนพิมพ์นิยม (SaaS-card kit):**
  - สับเนื้อหาลงกล่องสี่เหลี่ยมมนมุมเท่ากันหมด (`rounded-xl`) แปะเงาเทาฟุ้งแบบเดียวกัน (`shadow-md` หรือ `rgba(0,0,0,0.1)`) และไล่สี Gradient ลอยๆ
- ❌ **ห้ามใช้ Chrome ตกแต่งลอยๆ ที่ไร้ความหมาย:**
  - ป้ายหัวข้อ ALL-CAPS ตัวเล็กๆ ยืดระยะห่าง (`tracking-widest uppercase text-xs`) เหนือทุก Heading
  - การคั่นคำด้วยจุดกึ่งกลาง (`A · B · C`) หรือ Em-dash (`คำ — รายละเอียด`) พร่ำเพรื่อ
  - ใส่ฟอนต์ Monospace ให้ตัวเลขหรือ Label ทั่วไปโดยไม่ใช่ข้อมูลโค้ด/เทคนิค
  - แปะลูกศร `→` ท้ายปุ่มและลิงก์ทุกจุด
  - ไฮไลต์คำเดี่ยวๆ ในหัวข้อด้วยสีอื่นหรือตัวเอียง
- ❌ **ห้ามใช้อีโมจิ (Emoji) เป็นไอคอนของ UI:**
  - ให้ใช้ SVG Icons มาตรฐานเสมอ (Lucide, Heroicons, Radix Icons)
- ❌ **ห้ามจัดกึ่งกลาง (Center-aligned) ทุกส่วนของหน้า:**
  - ความยาวบรรทัดของข้อความเนื้อหาต้องไม่เกิน 75-80 ตัวอักษรเพื่อให้อ่านง่าย

## 2. หลักการออกแบบที่ยึดโยงกับบริบทจริง (Subject Grounding)

- **วิเคราะห์โหมดของพื้นผิว (Surface Modes):**
  - **Persuade (หน้า Landing/Marketing):** ดีไซน์ต้องดึงดูด ชัดเจน มีจุดยืน (POV) เด่นชัด Hero Section ต้องสะท้อนแก่นแท้ของผลิตภัณฑ์
  - **Operate (Dashboard/App UI/Settings):** เน้นความชัดเจน ประสิทธิภาพ ความคุ้นเคย การสแกนข้อมูล และความแม่นยำ ลดทอนการประดับตกแต่งที่ไม่จำเป็น
  - **Read (Docs/Articles):** เน้น Typographic hierarchy และ Rhythm ที่สบายตา
  - **Experience (Portfolio/Showcase):** ให้ชิ้นงานนำสายตา อินเทอร์เฟซถอยเป็นฉากหลัง
- **ระบบ Typography ที่มีเจตจำนง (Intentional Typography):**
  - ใช้ฟอนต์ไม่เกิน 1-2 ตระกูลที่แตกต่างกันชัดเจน
  - กำหนด Type Scale, Line-height และ Letter-spacing อย่างมีระบบ
- **Color Palette & Semantic Tokens:**
  - กำหนดชุดสีหลัก 4-6 สีพร้อม Contrast ที่ผ่านเกณฑ์ WCAG (ขั้นต่ำ 4.5:1 สำหรับข้อความปกติ และ 3:1 สำหรับปุ่ม/คอนโทรล)
  - ห้าม Hardcode รหัสสี Hex ใน Component ให้ใช้ Semantic Tokens (`bg-primary`, `text-muted-foreground`, `border-border`)

## 3. Motion & Animation ที่มีความหมาย

- ไม่ใส่ entrance animation (fade-in, slide-up) ในทุกๆ section หรือ card พร่ำเพรื่อ
- ใช้ Motion ตอบสนองการกระทำของผู้ใช้ (User Feedback) หรือ Orchestrated Reveal เพียง 1 จุดสำคัญ
- รองรับ `prefers-reduced-motion` เสมอ

## 4. UX Copywriting ระดับโปร

- ใช้ภาษาที่เข้าใจง่ายจากมุมมองของผู้ใช้ (User-centric) ไม่ใช้ศัพท์เทคนิคของระบบ
- ใช้ Active Voice ชัดเจน เช่น "Save changes" แทนที่จะเป็น "Submit"
- หน้าว่าง (Empty states) และ Error states ต้องบอกทางไปต่อที่ชัดเจน ไม่ขอโทษแบบคลุมเครือ
