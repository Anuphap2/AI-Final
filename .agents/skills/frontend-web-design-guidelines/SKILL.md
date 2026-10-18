---
name: frontend-web-design-guidelines
description: "Review and audit UI for accessibility, focus states, forms, and responsive Web Interface Guidelines."
---

# Web Interface Guidelines

## Contract

Apply this skill only when the task matches: Web Interface Guidelines. Keep the work within the requested scope and do not invent missing facts.

## When to Use

Review and audit UI for accessibility, focus states, forms, and responsive Web Interface Guidelines.

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

Input: A task that requires web interface guidelines.
Expected: Apply the procedure and constraints, produce evidence, and respond to the user in natural Thai when the user communicates in Thai.

## Guidance

# Web Interface Guidelines

แนวทางปฏิบัติและเกณฑ์การตรวจสอบ UI สำหรับเว็บแอปพลิเคชันระดับ Production ตามมาตรฐาน Web Interface Guidelines และ WCAG 2.2

## 1. Accessibility & Semantics
- ปุ่มที่มีเฉพาะไอคอนต้องมี `aria-label` เสมอ
- ฟอร์ม input ทุกช่องต้องมี `<label>` หรือ `aria-label` และกำหนด `autocomplete`, `type` ให้ถูกต้อง
- ใช้ HTML Semantic elements ให้ถูกต้อง (`<button>` สำหรับการกระทำ, `<a>` หรือ `<Link>` สำหรับลิงก์ ห้ามใช้ `<div onClick>`)
- รูปภาพต้องมี `alt` (หรือ `alt=""` ถ้าเป็นภาพตกแต่ง) และไอคอนประดับต้องใส่ `aria-hidden="true"`
- Interactive elements ทุกตัวต้องรองรับการควบคุมด้วยคีย์บอร์ด (Tab, Enter, Space, Escape)
- การอัปเดตแบบ Asynchronous (เช่น Toast notification, Form inline error) ต้องมี `aria-live="polite"`

## 2. Focus States & Touch Targets
- ห้ามใช้ `outline-none` หรือ `outline: none` โดยไม่มี Focus Ring ทดแทนเด็ดขาด
- ใช้ `:focus-visible` เพื่อแสดงวงแหวนโฟกัสเฉพาะเมื่อนำทางด้วยคีย์บอร์ด หลีกเลี่ยง focus ring เมื่อคลิกด้วยเมาส์
- Touch target บนหน้าจอสัมผัสต้องมีขนาดอย่างน้อย 44×44px พร้อมระยะห่างอย่างน้อย 8px

## 3. Layout & Visual Stability
- กำหนด `aspect-ratio` หรือขนาดความกว้าง/สูงให้รูปภาพและสื่อเสมอ เพื่อป้องกัน Cumulative Layout Shift (CLS < 0.1)
- ตรวจสอบการแสดงผลบน Breakpoints สำคัญ: 375px (Mobile), 768px (Tablet), 1024px (Laptop), 1440px (Desktop)
- ห้ามเกิด Horizontal scrollbar โดยไม่ตั้งใจบนหน้าจอขนาดเล็ก
- ส่วนหัวหรือ Overlay แบบ Sticky ต้องไม่บดบัง element ที่กำลังถูกโฟกัส
